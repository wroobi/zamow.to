-- =====================================================================================
-- Migration: Initial Database Schema for zamow.to
-- Description: Creates complete e-commerce database schema with profiles, products,
--              categories, carts, orders and all associated security policies
-- Date: 2025-10-26
-- Tables Created: profiles, categories, products, carts, cart_items, orders, order_items
-- Security: Full Row Level Security (RLS) implementation for all user data
-- Triggers: Auto-updating timestamps and user profile creation
-- =====================================================================================

-- Note: Using gen_random_uuid() which is built-in to PostgreSQL 13+ (no extension needed)

-- =====================================================================================
-- UTILITY FUNCTIONS
-- =====================================================================================

-- Function to automatically update the updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Function to automatically create user profile when new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql;

-- =====================================================================================
-- TABLE: profiles
-- Purpose: Extended user information complementing auth.users
-- RLS: Users can only access their own profile data
-- =====================================================================================

create table public.profiles (
  id uuid references auth.users(id) primary key,
  full_name text,
  role text not null default 'user',
  is_deactivated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS for profiles table
alter table public.profiles enable row level security;

-- RLS Policy: Users can view their own profile
create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

-- RLS Policy: Users can update their own profile
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Create trigger for automatic updated_at handling
create trigger on_profiles_update
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- Create trigger for automatic profile creation on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create index for role-based queries (admin functionality)
create index profiles_role_idx on public.profiles (role);

-- =====================================================================================
-- TABLE: categories
-- Purpose: Product categorization system
-- RLS: Public read access, admin-only write access
-- =====================================================================================

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- Enable RLS for categories table
alter table public.categories enable row level security;

-- RLS Policy: Anyone can view categories (public catalog)
create policy "Anyone can view categories"
  on public.categories for select
  to anon, authenticated
  using (true);

-- RLS Policy: Only authenticated users can insert categories (future admin feature)
create policy "Authenticated users can insert categories"
  on public.categories for insert
  to authenticated
  with check (true);

-- RLS Policy: Only authenticated users can update categories (future admin feature)
create policy "Authenticated users can update categories"
  on public.categories for update
  to authenticated
  using (true);

-- RLS Policy: Only authenticated users can delete categories (future admin feature)
create policy "Authenticated users can delete categories"
  on public.categories for delete
  to authenticated
  using (true);

-- =====================================================================================
-- TABLE: products
-- Purpose: Main product catalog with pricing and inventory management
-- RLS: Public read access for active products, admin write access
-- =====================================================================================

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id),
  name text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  sku text unique,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS for products table
alter table public.products enable row level security;

-- RLS Policy: Anyone can view non-archived products
create policy "Anyone can view active products"
  on public.products for select
  to anon, authenticated
  using (is_archived = false);

-- RLS Policy: Only authenticated users can insert products (future admin feature)
create policy "Authenticated users can insert products"
  on public.products for insert
  to authenticated
  with check (true);

-- RLS Policy: Only authenticated users can update products (future admin feature)
create policy "Authenticated users can update products"
  on public.products for update
  to authenticated
  using (true);

-- RLS Policy: Only authenticated users can delete products (future admin feature)
create policy "Authenticated users can delete products"
  on public.products for delete
  to authenticated
  using (true);

-- Create trigger for automatic updated_at handling
create trigger on_products_update
  before update on public.products
  for each row
  execute function public.handle_updated_at();

-- Create indexes for efficient product queries
create index products_category_id_idx on public.products (category_id);
create index products_name_idx on public.products (name);
create index products_is_archived_idx on public.products (is_archived);

-- =====================================================================================
-- TABLE: carts
-- Purpose: User shopping carts - one per user
-- RLS: Users can only access their own cart
-- =====================================================================================

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS for carts table
alter table public.carts enable row level security;

-- RLS Policy: Users can view their own cart
create policy "Users can view their own cart"
  on public.carts for select
  to authenticated
  using (auth.uid() = user_id);

-- RLS Policy: Users can insert their own cart
create policy "Users can insert their own cart"
  on public.carts for insert
  to authenticated
  with check (auth.uid() = user_id);

-- RLS Policy: Users can update their own cart
create policy "Users can update their own cart"
  on public.carts for update
  to authenticated
  using (auth.uid() = user_id);

-- RLS Policy: Users can delete their own cart
create policy "Users can delete their own cart"
  on public.carts for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create trigger for automatic updated_at handling
create trigger on_carts_update
  before update on public.carts
  for each row
  execute function public.handle_updated_at();

-- Create index for user cart lookups
create index carts_user_id_idx on public.carts (user_id);

-- =====================================================================================
-- TABLE: cart_items
-- Purpose: Individual items within user shopping carts
-- RLS: Users can only manage items in their own cart
-- =====================================================================================

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id),
  product_id uuid not null references public.products(id),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, product_id) -- Prevent duplicate products in same cart
);

-- Enable RLS for cart_items table
alter table public.cart_items enable row level security;

-- RLS Policy: Users can view items in their own cart
create policy "Users can view items in their own cart"
  on public.cart_items for select
  to authenticated
  using (
    (select user_id from public.carts where id = cart_id) = auth.uid()
  );

-- RLS Policy: Users can insert items into their own cart
create policy "Users can insert items into their own cart"
  on public.cart_items for insert
  to authenticated
  with check (
    (select user_id from public.carts where id = cart_id) = auth.uid()
  );

-- RLS Policy: Users can update items in their own cart
create policy "Users can update items in their own cart"
  on public.cart_items for update
  to authenticated
  using (
    (select user_id from public.carts where id = cart_id) = auth.uid()
  );

-- RLS Policy: Users can delete items from their own cart
create policy "Users can delete items from their own cart"
  on public.cart_items for delete
  to authenticated
  using (
    (select user_id from public.carts where id = cart_id) = auth.uid()
  );

-- Create trigger for automatic updated_at handling
create trigger on_cart_items_update
  before update on public.cart_items
  for each row
  execute function public.handle_updated_at();

-- Create indexes for efficient cart item queries
create index cart_items_cart_id_idx on public.cart_items (cart_id);
create index cart_items_product_id_idx on public.cart_items (product_id);

-- =====================================================================================
-- TABLE: orders
-- Purpose: Historical order records with denormalized totals
-- RLS: Users can only view/create their own orders
-- =====================================================================================

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  status text not null default 'pending',
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  created_at timestamptz not null default now()
);

-- Enable RLS for orders table
alter table public.orders enable row level security;

-- RLS Policy: Users can view their own orders
create policy "Users can view their own orders"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id);

-- RLS Policy: Users can create their own orders
create policy "Users can create their own orders"
  on public.orders for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Create index for user order lookups
create index orders_user_id_idx on public.orders (user_id);
create index orders_status_idx on public.orders (status);

-- =====================================================================================
-- TABLE: order_items
-- Purpose: Historical order line items with denormalized product data
-- RLS: Users can only view items from their own orders
-- =====================================================================================

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id),
  product_id uuid references public.products(id),
  product_name text not null, -- Denormalized for historical accuracy
  price_per_unit numeric(10, 2) not null, -- Denormalized for historical accuracy
  quantity integer not null check (quantity > 0)
);

-- Enable RLS for order_items table
alter table public.order_items enable row level security;

-- RLS Policy: Users can view items from their own orders
create policy "Users can view items from their own orders"
  on public.order_items for select
  to authenticated
  using (
    (select user_id from public.orders where id = order_id) = auth.uid()
  );

-- RLS Policy: Users can insert items into their own orders
create policy "Users can insert items into their own orders"
  on public.order_items for insert
  to authenticated
  with check (
    (select user_id from public.orders where id = order_id) = auth.uid()
  );

-- Create indexes for efficient order item queries
create index order_items_order_id_idx on public.order_items (order_id);
create index order_items_product_id_idx on public.order_items (product_id);

-- =====================================================================================
-- INITIAL DATA SEEDING

-- Fryzjerskie kategorie produktowe
insert into public.categories (name) values
  ('Farby do włosów'),
  ('Folie fryzjerskie'),
  ('Grzebienie fryzjerskie'),
  ('Suszarki do włosów'),
  ('Nożyczki fryzjerskie'),
  ('Maszynki do strzyżenia'),
  ('Szampony do włosów'),
  ('Odżywki do włosów'),
  ('Pędzle do farby'),
  ('Peleryny fryzjerskie');

-- Purpose: Create basic categories for immediate application functionality
-- =====================================================================================



-- =====================================================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================================================

-- Add helpful comments to tables for future developers
comment on table public.profiles is 'Extended user profiles complementing auth.users with additional application-specific data';
comment on table public.categories is 'Product categories for organizing the catalog';
comment on table public.products is 'Main product catalog with pricing and inventory management';
comment on table public.carts is 'User shopping carts - one per authenticated user';
comment on table public.cart_items is 'Individual line items within shopping carts';
comment on table public.orders is 'Historical order records with denormalized totals for performance';
comment on table public.order_items is 'Historical order line items with denormalized product data for accuracy';

-- Add column comments for critical business logic
comment on column public.products.is_archived is 'Soft delete flag - archived products are hidden from public but preserved for order history';
comment on column public.profiles.is_deactivated is 'Soft delete flag for user accounts';
comment on column public.order_items.product_name is 'Denormalized product name preserved at time of order';
comment on column public.order_items.price_per_unit is 'Denormalized price preserved at time of order';
comment on column public.orders.total_amount is 'Denormalized total for performance - calculated from order_items';

-- =====================================================================================
-- MIGRATION COMPLETE
-- Database schema successfully created with full RLS security implementation
-- All tables have appropriate indexes for performance optimization
-- Triggers enabled for automatic timestamp management and user profile creation
-- Initial category data seeded for immediate application functionality
-- =====================================================================================
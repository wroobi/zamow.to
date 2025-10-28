# Database Schema for zamow.to

## 1. Tables

### `profiles`

Stores additional, public-facing user information, extending the `auth.users` table.

| Column Name      | Data Type     | Constraints                                | Description                            |
| ---------------- | ------------- | ------------------------------------------ | -------------------------------------- |
| `id`             | `uuid`        | `PRIMARY KEY`, `REFERENCES auth.users(id)` | Foreign key to `auth.users`.           |
| `full_name`      | `text`        |                                            | User's full name.                      |
| `role`           | `text`        | `NOT NULL`, `DEFAULT 'user'`               | User role (e.g., 'user', 'admin').     |
| `is_deactivated` | `boolean`     | `NOT NULL`, `DEFAULT false`                | Flag for soft-deleting a user account. |
| `created_at`     | `timestamptz` | `NOT NULL`, `DEFAULT now()`                | Timestamp of profile creation.         |
| `updated_at`     | `timestamptz` | `NOT NULL`, `DEFAULT now()`                | Timestamp of the last profile update.  |

### `categories`

Stores product categories.

| Column Name  | Data Type     | Constraints                                 | Description                         |
| ------------ | ------------- | ------------------------------------------- | ----------------------------------- |
| `id`         | `uuid`        | `PRIMARY KEY`, `DEFAULT uuid_generate_v4()` | Unique identifier for the category. |
| `name`       | `text`        | `NOT NULL`, `UNIQUE`                        | Name of the category.               |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()`                 | Timestamp of category creation.     |

### `products`

Stores the product catalog.

| Column Name   | Data Type        | Constraints                                 | Description                            |
| ------------- | ---------------- | ------------------------------------------- | -------------------------------------- |
| `id`          | `uuid`           | `PRIMARY KEY`, `DEFAULT uuid_generate_v4()` | Unique identifier for the product.     |
| `category_id` | `uuid`           | `REFERENCES categories(id)`                 | Foreign key to the `categories` table. |
| `name`        | `text`           | `NOT NULL`                                  | Product name.                          |
| `description` | `text`           |                                             | Detailed product description.          |
| `price`       | `numeric(10, 2)` | `NOT NULL`, `CHECK (price >= 0)`            | Product price.                         |
| `sku`         | `text`           | `UNIQUE`                                    | Stock Keeping Unit.                    |
| `is_archived` | `boolean`        | `NOT NULL`, `DEFAULT false`                 | Flag for soft-deleting a product.      |
| `created_at`  | `timestamptz`    | `NOT NULL`, `DEFAULT now()`                 | Timestamp of product creation.         |
| `updated_at`  | `timestamptz`    | `NOT NULL`, `DEFAULT now()`                 | Timestamp of the last product update.  |

### `carts`

Represents a user's shopping cart.

| Column Name  | Data Type     | Constraints                                     | Description                        |
| ------------ | ------------- | ----------------------------------------------- | ---------------------------------- |
| `id`         | `uuid`        | `PRIMARY KEY`, `DEFAULT uuid_generate_v4()`     | Unique identifier for the cart.    |
| `user_id`    | `uuid`        | `NOT NULL`, `UNIQUE`, `REFERENCES profiles(id)` | Foreign key to the user's profile. |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()`                     | Timestamp of cart creation.        |
| `updated_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()`                     | Timestamp of the last cart update. |

### `cart_items`

Represents items within a shopping cart.

| Column Name  | Data Type     | Constraints                                 | Description                              |
| ------------ | ------------- | ------------------------------------------- | ---------------------------------------- |
| `id`         | `uuid`        | `PRIMARY KEY`, `DEFAULT uuid_generate_v4()` | Unique identifier for the cart item.     |
| `cart_id`    | `uuid`        | `NOT NULL`, `REFERENCES carts(id)`          | Foreign key to the `carts` table.        |
| `product_id` | `uuid`        | `NOT NULL`, `REFERENCES products(id)`       | Foreign key to the `products` table.     |
| `quantity`   | `integer`     | `NOT NULL`, `CHECK (quantity > 0)`          | Quantity of the product.                 |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()`                 | Timestamp of item addition to cart.      |
| `updated_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()`                 | Timestamp of the last item update.       |
|              |               | `UNIQUE (cart_id, product_id)`              | Ensures no duplicate products in a cart. |

### `orders`

Stores historical order information.

| Column Name    | Data Type        | Constraints                                 | Description                                   |
| -------------- | ---------------- | ------------------------------------------- | --------------------------------------------- |
| `id`           | `uuid`           | `PRIMARY KEY`, `DEFAULT uuid_generate_v4()` | Unique identifier for the order.              |
| `user_id`      | `uuid`           | `NOT NULL`, `REFERENCES profiles(id)`       | Foreign key to the user who placed the order. |
| `status`       | `text`           | `NOT NULL`, `DEFAULT 'pending'`             | Order status (e.g., pending, completed).      |
| `total_amount` | `numeric(10, 2)` | `NOT NULL`, `CHECK (total_amount >= 0)`     | Denormalized total amount for the order.      |
| `created_at`   | `timestamptz`    | `NOT NULL`, `DEFAULT now()`                 | Timestamp of order placement.                 |

### `order_items`

Stores the specific items of a historical order. Data is denormalized to preserve historical accuracy.

| Column Name      | Data Type        | Constraints                                 | Description                                 |
| ---------------- | ---------------- | ------------------------------------------- | ------------------------------------------- |
| `id`             | `uuid`           | `PRIMARY KEY`, `DEFAULT uuid_generate_v4()` | Unique identifier for the order item.       |
| `order_id`       | `uuid`           | `NOT NULL`, `REFERENCES orders(id)`         | Foreign key to the `orders` table.          |
| `product_id`     | `uuid`           | `REFERENCES products(id)`                   | Foreign key to the original product.        |
| `product_name`   | `text`           | `NOT NULL`                                  | Denormalized product name at time of order. |
| `price_per_unit` | `numeric(10, 2)` | `NOT NULL`                                  | Denormalized price at time of order.        |
| `quantity`       | `integer`        | `NOT NULL`, `CHECK (quantity > 0)`          | Quantity ordered.                           |

## 2. Relationships

- **`profiles` 1-to-1 `auth.users`**: Each user in `auth.users` can have one profile.
- **`carts` 1-to-1 `profiles`**: Each user has exactly one shopping cart.
- **`orders` 1-to-Many `profiles`**: A user can have many orders.
- **`cart_items` Many-to-1 `carts`**: A cart can contain many different items.
- **`cart_items` Many-to-1 `products`**: A product can be in many different carts.
- **`order_items` Many-to-1 `orders`**: An order is composed of many items.
- **`products` Many-to-1 `categories`**: A category can contain many products.

## 3. Indexes

To optimize query performance, especially for RLS checks and common lookups.

- `CREATE INDEX ON profiles (role);`
- `CREATE INDEX ON products (category_id);`
- `CREATE INDEX ON products (name);` -- For text search
- `CREATE INDEX ON carts (user_id);`
- `CREATE INDEX ON cart_items (cart_id);`
- `CREATE INDEX ON cart_items (product_id);`
- `CREATE INDEX ON orders (user_id);`
- `CREATE INDEX ON order_items (order_id);`
- `CREATE INDEX ON order_items (product_id);`

## 4. Row-Level Security (RLS) Policies

RLS must be enabled on all tables containing user-specific data. The `auth.uid()` function will be used to identify the currently authenticated user.

### `profiles`

- **SELECT**: A user can view their own profile.
- **UPDATE**: A user can update their own profile.

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- SELECT Policy
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- UPDATE Policy
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

### `carts` & `cart_items`

- **ALL**: A user can perform any action (SELECT, INSERT, UPDATE, DELETE) only on their own cart and its items.

```sql
-- Enable RLS on carts
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

-- ALL Policy for carts
CREATE POLICY "Users can manage their own cart"
ON carts FOR ALL
USING (auth.uid() = user_id);

-- Enable RLS on cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- ALL Policy for cart_items
CREATE POLICY "Users can manage items in their own cart"
ON cart_items FOR ALL
USING (
  (SELECT user_id FROM carts WHERE id = cart_id) = auth.uid()
);
```

### `orders` & `order_items`

- **SELECT**: A user can only view their own past orders and the items within them.
- **INSERT**: A user can create new orders for themselves.
- **UPDATE/DELETE**: Disallowed for users to maintain historical integrity.

```sql
-- Enable RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- SELECT Policy for orders
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

-- INSERT Policy for orders
CREATE POLICY "Users can create their own orders"
ON orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Enable RLS on order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- SELECT Policy for order_items
CREATE POLICY "Users can view items in their own orders"
ON order_items FOR SELECT
USING (
  (SELECT user_id FROM orders WHERE id = order_id) = auth.uid()
);
```

## 5. Design Notes

- **UUIDs**: `uuid` is used as the primary key for all major tables to align with Supabase practices and facilitate scalability.
- **Denormalization**: `order_items` intentionally stores `product_name` and `price_per_unit`. This ensures that if a product's name or price changes in the `products` table, the historical order record remains accurate. Similarly, `orders.total_amount` is denormalized for efficient retrieval of order summaries.
- **Soft Deletes**: The `is_archived` flag in `products` and `is_deactivated` in `profiles` are used for soft deletes, preserving data integrity and history.
- **Triggers for `updated_at`**: A standard function and trigger should be created to automatically update the `updated_at` column on any row modification to maintain data freshness timestamps.

  ```sql
  CREATE OR REPLACE FUNCTION public.handle_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  -- Example trigger for the 'profiles' table
  CREATE TRIGGER on_profiles_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();
  ```

  This trigger should be applied to `profiles`, `products`, and `carts`.

- **User Profile Creation**: A trigger should be set up on the `auth.users` table to automatically create a corresponding entry in the `public.profiles` table upon new user sign-up.

```sql
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, full_name)
      VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_new_user();
```

````// filepath: .ai/db-plan.md
# Database Schema for zamow.to

## 1. Tables

### `profiles`
Stores additional, public-facing user information, extending the `auth.users` table.

| Column Name       | Data Type                | Constraints                                     | Description                               |
| ----------------- | ------------------------ | ----------------------------------------------- | ----------------------------------------- |
| `id`              | `uuid`                   | `PRIMARY KEY`, `REFERENCES auth.users(id)`      | Foreign key to `auth.users`.              |
| `full_name`       | `text`                   |                                                 | User's full name.                         |
| `role`            | `text`                   | `NOT NULL`, `DEFAULT 'user'`                    | User role (e.g., 'user', 'admin').        |
| `is_deactivated`  | `boolean`                | `NOT NULL`, `DEFAULT false`                     | Flag for soft-deleting a user account.    |
| `created_at`      | `timestamptz`            | `NOT NULL`, `DEFAULT now()`                     | Timestamp of profile creation.            |
| `updated_at`      | `timestamptz`            | `NOT NULL`, `DEFAULT now()`                     | Timestamp of the last profile update.     |

### `categories`
Stores product categories.

| Column Name       | Data Type                | Constraints                 | Description                               |
| ----------------- | ------------------------ | --------------------------- | ----------------------------------------- |
| `id`              | `uuid`                   | `PRIMARY KEY`, `DEFAULT uuid_generate_v4()` | Unique identifier for the category.       |
| `name`            | `text`                   | `NOT NULL`, `UNIQUE`        | Name of the category.                     |
| `created_at`      | `timestamptz`            | `NOT NULL`, `DEFAULT now()` | Timestamp of category creation.           |

### `products`
Stores the product catalog.

| Column Name       | Data Type                | Constraints                                     | Description                               |
| ----------------- | ------------------------ | ----------------------------------------------- | ----------------------------------------- |
| `id`              | `uuid`                   | `PRIMARY KEY`, `DEFAULT uuid_generate_v4()` | Unique identifier for the product.        |
| `category_id`     | `uuid`                   | `REFERENCES categories(id)`                     | Foreign key to the `categories` table.    |
| `name`            | `text`                   | `NOT NULL`                                      | Product name.                             |
| `description`     | `text`                   |                                                 | Detailed product description.             |
| `price`           | `numeric(10, 2)`         | `NOT NULL`, `CHECK (price >= 0)`                | Product price.                            |
| `sku`             | `text`                   | `UNIQUE`                                        | Stock Keeping Unit.                       |
| `is_archived`     | `boolean`                | `NOT NULL`, `DEFAULT false`                     | Flag for soft-deleting a product.         |
| `created_at`      | `timestamptz`            | `NOT NULL`, `DEFAULT now()`                     | Timestamp of product creation.            |
| `updated_at`      | `timestamptz`            | `NOT NULL`, `DEFAULT now()`                     | Timestamp of the last product update.     |

### `carts`
Represents a user's shopping cart.

| Column Name       | Data Type                | Constraints                                     | Description                               |
| ----------------- | ------------------------ | ----------------------------------------------- | ----------------------------------------- |
| `id`              | `uuid`                   | `PRIMARY KEY`, `DEFAULT uuid_generate_v4()` | Unique identifier for the cart.           |
| `user_id`         | `uuid`                   | `NOT NULL`, `UNIQUE`, `REFERENCES profiles(id)` | Foreign key to the user's profile.        |
| `created_at`      | `timestamptz`            | `NOT NULL`, `DEFAULT now()`                     | Timestamp of cart creation.               |
| `updated_at`      | `timestamptz`            | `NOT NULL`, `DEFAULT now()`                     | Timestamp of the last cart update.        |

### `cart_items`
Represents items within a shopping cart.

| Column Name       | Data Type                | Constraints                                     | Description                               |
| ----------------- | ------------------------ | ----------------------------------------------- | ----------------------------------------- |
| `id`              | `uuid`                   | `PRIMARY KEY`, `DEFAULT uuid_generate_v4()` | Unique identifier for the cart item.      |
| `cart_id`         | `uuid`                   | `NOT NULL`, `REFERENCES carts(id)`              | Foreign key to the `carts` table.         |
| `product_id`      | `uuid`                   | `NOT NULL`, `REFERENCES products(id)`           | Foreign key to the `products` table.      |
| `quantity`        | `integer`                | `NOT NULL`, `CHECK (quantity > 0)`              | Quantity of the product.                  |
| `created_at`      | `timestamptz`            | `NOT NULL`, `DEFAULT now()`                     | Timestamp of item addition to cart.       |
| `updated_at`      | `timestamptz`            | `NOT NULL`, `DEFAULT now()`                     | Timestamp of the last item update.        |
|                   |                          | `UNIQUE (cart_id, product_id)`                  | Ensures no duplicate products in a cart.  |

### `orders`
Stores historical order information.

| Column Name       | Data Type                | Constraints                                     | Description                               |
| ----------------- | ------------------------ | ----------------------------------------------- | ----------------------------------------- |
| `id`              | `uuid`                   | `PRIMARY KEY`, `DEFAULT uuid_generate_v4()` | Unique identifier for the order.          |
| `user_id`         | `uuid`                   | `NOT NULL`, `REFERENCES profiles(id)`           | Foreign key to the user who placed the order. |
| `status`          | `text`                   | `NOT NULL`, `DEFAULT 'pending'`                 | Order status (e.g., pending, completed).  |
| `total_amount`    | `numeric(10, 2)`         | `NOT NULL`, `CHECK (total_amount >= 0)`         | Denormalized total amount for the order.  |
| `created_at`      | `timestamptz`            | `NOT NULL`, `DEFAULT now()`                     | Timestamp of order placement.             |

### `order_items`
Stores the specific items of a historical order. Data is denormalized to preserve historical accuracy.

| Column Name       | Data Type                | Constraints                                     | Description                               |
| ----------------- | ------------------------ | ----------------------------------------------- | ----------------------------------------- |
| `id`              | `uuid`                   | `PRIMARY KEY`, `DEFAULT uuid_generate_v4()` | Unique identifier for the order item.     |
| `order_id`        | `uuid`                   | `NOT NULL`, `REFERENCES orders(id)`             | Foreign key to the `orders` table.        |
| `product_id`      | `uuid`                   | `REFERENCES products(id)`                       | Foreign key to the original product.      |
| `product_name`    | `text`                   | `NOT NULL`                                      | Denormalized product name at time of order. |
| `price_per_unit`  | `numeric(10, 2)`         | `NOT NULL`                                      | Denormalized price at time of order.      |
| `quantity`        | `integer`                | `NOT NULL`, `CHECK (quantity > 0)`              | Quantity ordered.                         |

## 2. Relationships

-   **`profiles` 1-to-1 `auth.users`**: Each user in `auth.users` can have one profile.
-   **`carts` 1-to-1 `profiles`**: Each user has exactly one shopping cart.
-   **`orders` 1-to-Many `profiles`**: A user can have many orders.
-   **`cart_items` Many-to-1 `carts`**: A cart can contain many different items.
-   **`cart_items` Many-to-1 `products`**: A product can be in many different carts.
-   **`order_items` Many-to-1 `orders`**: An order is composed of many items.
-   **`products` Many-to-1 `categories`**: A category can contain many products.

## 3. Indexes

To optimize query performance, especially for RLS checks and common lookups.

-   `CREATE INDEX ON profiles (role);`
-   `CREATE INDEX ON products (category_id);`
-   `CREATE INDEX ON products (name);` -- For text search
-   `CREATE INDEX ON carts (user_id);`
-   `CREATE INDEX ON cart_items (cart_id);`
-   `CREATE INDEX ON cart_items (product_id);`
-   `CREATE INDEX ON orders (user_id);`
-   `CREATE INDEX ON order_items (order_id);`
-   `CREATE INDEX ON order_items (product_id);`

## 4. Row-Level Security (RLS) Policies

RLS must be enabled on all tables containing user-specific data. The `auth.uid()` function will be used to identify the currently authenticated user.

### `profiles`
-   **SELECT**: A user can view their own profile.
-   **UPDATE**: A user can update their own profile.

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- SELECT Policy
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- UPDATE Policy
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
````

### `carts` & `cart_items`

- **ALL**: A user can perform any action (SELECT, INSERT, UPDATE, DELETE) only on their own cart and its items.

```sql
-- Enable RLS on carts
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

-- ALL Policy for carts
CREATE POLICY "Users can manage their own cart"
ON carts FOR ALL
USING (auth.uid() = user_id);

-- Enable RLS on cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- ALL Policy for cart_items
CREATE POLICY "Users can manage items in their own cart"
ON cart_items FOR ALL
USING (
  (SELECT user_id FROM carts WHERE id = cart_id) = auth.uid()
);
```

### `orders` & `order_items`

- **SELECT**: A user can only view their own past orders and the items within them.
- **INSERT**: A user can create new orders for themselves.
- **UPDATE/DELETE**: Disallowed for users to maintain historical integrity.

```sql
-- Enable RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- SELECT Policy for orders
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

-- INSERT Policy for orders
CREATE POLICY "Users can create their own orders"
ON orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Enable RLS on order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- SELECT Policy for order_items
CREATE POLICY "Users can view items in their own orders"
ON order_items FOR SELECT
USING (
  (SELECT user_id FROM orders WHERE id = order_id) = auth.uid()
);
```

## 5. Design Notes

- **UUIDs**: `uuid` is used as the primary key for all major tables to align with Supabase practices and facilitate scalability.
- **Denormalization**: `order_items` intentionally stores `product_name` and `price_per_unit`. This ensures that if a product's name or price changes in the `products` table, the historical order record remains accurate. Similarly, `orders.total_amount` is denormalized for efficient retrieval of order summaries.
- **Soft Deletes**: The `is_archived` flag in `products` and `is_deactivated` in `profiles` are used for soft deletes, preserving data integrity and history.
- **Triggers for `updated_at`**: A standard function and trigger should be created to automatically update the `updated_at` column on any row modification to maintain data freshness timestamps.

  ```sql
  CREATE OR REPLACE FUNCTION public.handle_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  -- Example trigger for the 'profiles' table
  CREATE TRIGGER on_profiles_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();
  ```

  This trigger should be applied to `profiles`, `products`, and `carts`.

- **User Profile Creation**: A trigger should be set up on the `auth.users` table to automatically create a corresponding entry in the `public.profiles` table upon new user sign-up.

```sql
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, full_name)
      VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_new_user();
```

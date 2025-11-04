import type { Tables, TablesInsert, TablesUpdate } from "./db/database.types";

// --- Entity Types ---
// Re-exporting entity types for easier access throughout the application.
export type Profile = Tables<"profiles">;
export type Product = Tables<"products">;
export type Category = Tables<"categories">;
export type Cart = Tables<"carts">;
export type CartItem = Tables<"cart_items">;
export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;

// --- DTOs (Data Transfer Objects) ---
// Objects sent from the server to the client.

/**
 * Profile data for the currently authenticated user.
 * GET /api/profiles/me
 */
export type ProfileDto = Pick<Profile, "id" | "full_name" | "role">;

/**
 * Represents a product in a list.
 * GET /api/products
 */
export type ProductListItemDto = Pick<Product, "id" | "name" | "description" | "price" | "sku" | "category_id">;

/**
 * Represents a single product with full details.
 * GET /api/products/{id}
 */
export type ProductDetailDto = ProductListItemDto;

/**
 * Represents a product category.
 * GET /api/categories
 */
export type CategoryDto = Pick<Category, "id" | "name">;

/**
 * Represents an item within the shopping cart DTO.
 * It joins cart item data with nested product details.
 */
export type CartItemDto = Pick<CartItem, "id" | "quantity"> & {
  product: Pick<Product, "id" | "name" | "price" | "sku">;
};

/**
 * Represents the user's complete shopping cart.
 * GET /api/cart
 */
export type CartDto = Pick<Cart, "id" | "user_id" | "updated_at"> & {
  items: CartItemDto[];
  total_amount: number;
};

/**
 * Represents a created order confirmation.
 * POST /api/orders
 */
export type OrderConfirmationDto = Pick<Order, "id" | "user_id" | "status" | "total_amount" | "created_at">;

/**
 * Represents an order in a user's order history list.
 * GET /api/orders
 */
export type OrderListItemDto = Pick<Order, "id" | "status" | "total_amount" | "created_at">;

/**
 * Represents a detailed view of a historical order, including its items.
 * GET /api/orders/{id}
 */
export type OrderDetailDto = OrderListItemDto & {
  items: Pick<OrderItem, "id" | "product_name" | "price_per_unit" | "quantity">[];
};

/**
 * Represents a single parsed item from the list parser.
 * POST /api/parser/process
 */
export interface ParsedListItemDto {
  original_text: string;
  status: "matched" | "multiple_matches" | "not_found";
  suggested_product: Pick<Product, "id" | "name"> | null;
  potential_matches: Pick<Product, "id" | "name">[];
}

/**
 * Represents the entire response from the list parser API.
 * POST /api/parser/process
 */
export interface ParsedListDto {
  parsed_items: ParsedListItemDto[];
}

// --- Command Models ---
// Objects sent from the client to the server to perform an action.

/**
 * Command to update the user's profile.
 * PATCH /api/profiles/me
 */
export interface UpdateProfileCommand {
  full_name: string;
}

/**
 * Command to add an item to the cart.
 * POST /api/cart/items
 */
export type AddCartItemCommand = Pick<TablesInsert<"cart_items">, "product_id" | "quantity">;

/**
 * Command to update an item's quantity in the cart.
 * PATCH /api/cart/items/{itemId}
 */
export type UpdateCartItemCommand = Pick<TablesUpdate<"cart_items">, "quantity">;

/**
 * Command to process a raw text-based shopping list.
 * POST /api/parser/process
 */
export interface ProcessListCommand {
  text: string;
}

/**
 * Generic paginated response structure.
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

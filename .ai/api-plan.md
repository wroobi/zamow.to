# REST API Plan

This document outlines the REST API for the `zamow.to` application, designed based on the provided database schema, PRD, and tech stack.

## 1. Resources

The API is built around the following core resources:

- **Auth**: Manages user authentication (delegated to Supabase Auth).
- **Profiles**: Manages user-specific data extending the authentication system. Corresponds to the `profiles` table.
- **Products**: Manages the product catalog. Corresponds to the `products` table.
- **Categories**: Manages product categories. Corresponds to the `categories` table.
- **Cart**: Manages the user's shopping cart. Corresponds to the `carts` and `cart_items` tables.
- **Orders**: Manages historical orders. Corresponds to the `orders` and `order_items` tables.
- **List Parser**: A special resource for handling the core business logic of parsing text-based shopping lists.

## 2. Endpoints

All endpoints are prefixed with `/api`. All endpoints require authentication unless otherwise specified.

### 2.1. Auth

Authentication is handled by Supabase. The frontend client will interact directly with Supabase for registration, login, and password reset. The API endpoints will rely on the JWT provided by Supabase for user identification and RLS.

### 2.2. Profiles

Resource representing the current user's profile.

- **GET `/api/profiles/me`**
  - **Description**: Retrieves the profile of the currently authenticated user.
  - **Request Payload**: None.
  - **Response Payload**:
    ```json
    {
      "id": "uuid",
      "full_name": "string | null",
      "role": "string"
    }
    ```
  - **Success**: `200 OK`
  - **Error**: `401 Unauthorized`, `404 Not Found`

- **PATCH `/api/profiles/me`**
  - **Description**: Updates the profile of the currently authenticated user.
  - **Request Payload**:
    ```json
    {
      "full_name": "string"
    }
    ```
  - **Response Payload**:
    ```json
    {
      "id": "uuid",
      "full_name": "string",
      "role": "string",
      "updated_at": "timestamptz"
    }
    ```
  - **Success**: `200 OK`
  - **Error**: `400 Bad Request`, `401 Unauthorized`, `404 Not Found`

### 2.3. Products

- **GET `/api/products`**
  - **Description**: Retrieves a paginated list of products. Supports filtering and searching.
  - **Query Parameters**:
    - `search` (string): Search term for product name.
    - `category_id` (uuid): Filter by category.
    - `page` (integer, default: 1): Page number for pagination.
    - `limit` (integer, default: 20): Number of items per page.
  - **Response Payload**:
    ```json
    {
      "data": [
        {
          "id": "uuid",
          "name": "string",
          "description": "string | null",
          "price": "number",
          "sku": "string | null",
          "category_id": "uuid | null"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 100
      }
    }
    ```
  - **Success**: `200 OK`
  - **Error**: `400 Bad Request`

- **GET `/api/products/{id}`**
  - **Description**: Retrieves a single product by its ID.
  - **Response Payload**:
    ```json
    {
      "id": "uuid",
      "name": "string",
      "description": "string | null",
      "price": "number",
      "sku": "string | null",
      "category_id": "uuid | null"
    }
    ```
  - **Success**: `200 OK`
  - **Error**: `404 Not Found`

### 2.4. Categories

- **GET `/api/categories`**
  - **Description**: Retrieves a list of all product categories.
  - **Response Payload**:
    ```json
    [
      {
        "id": "uuid",
        "name": "string"
      }
    ]
    ```
  - **Success**: `200 OK`

### 2.5. Cart

- **GET `/api/cart`**
  - **Description**: Retrieves the current user's shopping cart.
  - **Response Payload**:
    ```json
    {
      "id": "uuid",
      "user_id": "uuid",
      "updated_at": "timestamptz",
      "items": [
        {
          "id": "uuid",
          "quantity": "integer",
          "product": {
            "id": "uuid",
            "name": "string",
            "price": "number",
            "sku": "string | null"
          }
        }
      ],
      "total_amount": "number"
    }
    ```
  - **Success**: `200 OK`
  - **Error**: `401 Unauthorized`, `404 Not Found`

- **POST `/api/cart/items`**
  - **Description**: Adds a new item to the cart or updates the quantity if it already exists.
  - **Request Payload**:
    ```json
    {
      "product_id": "uuid",
      "quantity": "integer"
    }
    ```
  - **Response Payload**: The updated cart item.
    ```json
    {
      "id": "uuid",
      "cart_id": "uuid",
      "product_id": "uuid",
      "quantity": "integer",
      "updated_at": "timestamptz"
    }
    ```
  - **Success**: `201 Created` (for new item), `200 OK` (for updated item)
  - **Error**: `400 Bad Request`, `401 Unauthorized`, `404 Not Found` (if product doesn't exist)

- **PATCH `/api/cart/items/{itemId}`**
  - **Description**: Updates the quantity of a specific item in the cart.
  - **Request Payload**:
    ```json
    {
      "quantity": "integer"
    }
    ```
  - **Response Payload**: The updated cart item.
  - **Success**: `200 OK`
  - **Error**: `400 Bad Request`, `401 Unauthorized`, `404 Not Found`

- **DELETE `/api/cart/items/{itemId}`**
  - **Description**: Removes an item from the cart.
  - **Success**: `204 No Content`
  - **Error**: `401 Unauthorized`, `404 Not Found`

### 2.6. List Parser

- **POST `/api/parser/process`**
  - **Description**: Takes a raw text list, uses an AI service to parse it into structured items, and attempts to match them with products in the database.
  - **Request Payload**:
    ```json
    {
      "text": "string"
    }
    ```
  - **Response Payload**:
    ```json
    {
      "parsed_items": [
        {
          "original_text": "string",
          "status": "matched" | "multiple_matches" | "not_found",
          "suggested_product": { "id": "uuid", "name": "string" } | null,
          "potential_matches": [
            { "id": "uuid", "name": "string" }
          ]
        }
      ]
    }
    ```
  - **Success**: `200 OK`
  - **Error**: `400 Bad Request`, `500 Internal Server Error` (if AI service fails)

### 2.7. Orders

- **POST `/api/orders`**
  - **Description**: Creates a new order from the user's current cart. This action will clear the cart.
  - **Request Payload**: None (or could include delivery details in the future).
  - **Response Payload**:
    ```json
    {
      "id": "uuid",
      "user_id": "uuid",
      "status": "pending",
      "total_amount": "number",
      "created_at": "timestamptz"
    }
    ```
  - **Success**: `201 Created`
  - **Error**: `400 Bad Request` (e.g., empty cart), `401 Unauthorized`

- **GET `/api/orders`**
  - **Description**: Retrieves a paginated list of the user's historical orders.
  - **Query Parameters**:
    - `page` (integer, default: 1)
    - `limit` (integer, default: 10)
  - **Response Payload**:
    ```json
    {
      "data": [
        {
          "id": "uuid",
          "status": "string",
          "total_amount": "number",
          "created_at": "timestamptz"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 100
      }
    }
    ```
  - **Success**: `200 OK`
  - **Error**: `401 Unauthorized`

- **GET `/api/orders/{id}`**
  - **Description**: Retrieves the details of a specific historical order.
  - **Response Payload**:
    ```json
    {
      "id": "uuid",
      "status": "string",
      "total_amount": "number",
      "created_at": "timestamptz",
      "items": [
        {
          "id": "uuid",
          "product_name": "string",
          "price_per_unit": "number",
          "quantity": "integer"
        }
      ]
    }
    ```
  - **Success**: `200 OK`
  - **Error**: `401 Unauthorized`, `404 Not Found`

## 3. Authentication and Authorization

- **Authentication**: Handled via Supabase Auth. The client will obtain a JWT upon login/signup and include it in the `Authorization` header for all API requests (e.g., `Authorization: Bearer <SUPABASE_JWT>`). The Astro middleware will validate this token and attach the user's session to the request context.
- **Authorization**: Implemented primarily through PostgreSQL's Row-Level Security (RLS) policies, as defined in the database schema. These policies ensure that users can only access and modify their own data (profiles, carts, orders). The API code will trust the database to enforce these rules.

## 4. Validation and Business Logic

- **Input Validation**: All incoming request payloads and query parameters will be validated using `zod`. This enforces type safety and presence checks before any business logic is executed, as per project guidelines.
- **Business Logic**:
  - **Smart Order Creation**: The `POST /api/parser/process` endpoint encapsulates the core business logic from `FR-02`. It orchestrates the call to the external AI service (OpenRouter) and the subsequent database lookups to match products.
  - **Order Placement**: The `POST /api/orders` endpoint implements the logic from `FR-05`. It will be implemented as a database transaction to:
    1. Read the user's `cart_items`.
    2. Create a new `orders` record.
    3. Copy `cart_items` into `order_items`, denormalizing product data.
    4. Delete the original `cart_items`.
    5. Trigger a confirmation email.
  - **Database Constraints**: Validation rules from the schema (e.g., `CHECK (price >= 0)`) are enforced at the database level, providing a final layer of data integrity. The API will catch and handle any resulting database errors.

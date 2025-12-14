import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "@/db/supabase.client";
import type { CartDto, CartItemDto } from "@/types";

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

  // 1. Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2. Fetch cart with items and product details
  // We use a deep select to get cart -> cart_items -> products
  const { data: cartData, error: fetchError } = await supabase
    .from("carts")
    .select(
      `
      id,
      user_id,
      updated_at,
      items:cart_items (
        id,
        quantity,
        product:products (
          id,
          name,
          price,
          sku
        )
      )
    `
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError) {
    return new Response(JSON.stringify({ error: "Failed to fetch cart", details: fetchError }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let cart = cartData;

  // 3. If no cart exists, create one
  if (!cart) {
    const { data: newCart, error: createError } = await supabase
      .from("carts")
      .insert({ user_id: user.id })
      .select()
      .single();

    if (createError) {
      return new Response(JSON.stringify({ error: "Failed to create cart", details: createError }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // New cart is empty
    cart = { ...newCart, items: [] };
  }

  // 4. Map to DTO and calculate totals
  // The query returns items as an array of objects. We need to ensure types match CartItemDto.
  // Note: Supabase types might be slightly different from DTO if joins are involved, so we map explicitly.

  const items: CartItemDto[] = Array.isArray(cart.items)
    ? cart.items.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          sku: item.product.sku,
        },
      }))
    : [];

  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  const cartDto: CartDto = {
    id: cart.id,
    user_id: cart.user_id,
    updated_at: cart.updated_at,
    items: items,
    total_amount: totalAmount,
  };

  return new Response(JSON.stringify(cartDto), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

import type { APIRoute } from "astro";
import { z } from "zod";
import { createSupabaseServerInstance } from "@/db/supabase.client";

export const prerender = false;

const AddItemSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().min(1),
});

export const POST: APIRoute = async ({ request, cookies }) => {
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

  // 2. Validate body
  let payload;
  try {
    payload = AddItemSchema.parse(await request.json());
  } catch {
    return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
  }

  // 3. Get or Create Cart
  // We need the cart_id to insert the item.
  const { data: initialCart, error: cartError } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  let cart = initialCart;

  if (cartError) {
    return new Response(JSON.stringify({ error: "Database error fetching cart" }), { status: 500 });
  }

  if (!cart) {
    const { data: newCart, error: createError } = await supabase
      .from("carts")
      .insert({ user_id: user.id })
      .select("id")
      .single();

    if (createError) {
      return new Response(JSON.stringify({ error: "Failed to create cart", details: createError }), { status: 500 });
    }
    cart = newCart;
  }

  if (!cart) {
    return new Response(JSON.stringify({ error: "Cart could not be initialized" }), { status: 500 });
  }

  // 4. Check if item exists in cart to update quantity, or insert new
  // We can use upsert if we had a unique constraint on (cart_id, product_id),
  // but let's check first to be safe and handle logic explicitly.

  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cart.id)
    .eq("product_id", payload.product_id)
    .maybeSingle();

  let error;
  if (existingItem) {
    // Update quantity
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: existingItem.quantity + payload.quantity })
      .eq("id", existingItem.id);
    error = updateError;
  } else {
    // Insert new
    const { error: insertError } = await supabase.from("cart_items").insert({
      cart_id: cart.id,
      product_id: payload.product_id,
      quantity: payload.quantity,
    });
    error = insertError;
  }

  if (error) {
    return new Response(JSON.stringify({ error: "Failed to add item to cart", details: error }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: "Item added successfully" }), { status: 200 });
};

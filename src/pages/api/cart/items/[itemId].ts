import type { APIRoute } from "astro";
import { z } from "zod";
import { createSupabaseServerInstance, type SupabaseClient } from "@/db/supabase.client";

export const prerender = false;

const UpdateItemSchema = z.object({
  quantity: z.number().int().min(1),
});

// Helper to get user's cart id
async function getUserCartId(supabase: SupabaseClient, userId: string): Promise<string | null> {
  const { data, error } = await supabase.from("carts").select("id").eq("user_id", userId).maybeSingle();

  if (error || !data) return null;
  return data.id;
}

export const PATCH: APIRoute = async ({ request, cookies, params }) => {
  const { itemId } = params;
  if (!itemId) {
    return new Response(JSON.stringify({ error: "Item ID required" }), { status: 400 });
  }

  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

  // 1. Auth
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  // 2. Validate Body
  let payload;
  try {
    payload = UpdateItemSchema.parse(await request.json());
  } catch {
    return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
  }

  // 3. Get User Cart
  const cartId = await getUserCartId(supabase, user.id);
  if (!cartId) {
    return new Response(JSON.stringify({ error: "Cart not found" }), { status: 404 });
  }

  // 4. Update Item (ensure it belongs to user's cart)
  const { error: updateError } = await supabase
    .from("cart_items")
    .update({ quantity: payload.quantity })
    .eq("id", itemId)
    .eq("cart_id", cartId);

  if (updateError) {
    return new Response(JSON.stringify({ error: "Failed to update item" }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: "Item updated" }), { status: 200 });
};

export const DELETE: APIRoute = async ({ request, cookies, params }) => {
  const { itemId } = params;
  if (!itemId) {
    return new Response(JSON.stringify({ error: "Item ID required" }), { status: 400 });
  }

  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

  // 1. Auth
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  // 2. Get User Cart
  const cartId = await getUserCartId(supabase, user.id);
  if (!cartId) {
    return new Response(JSON.stringify({ error: "Cart not found" }), { status: 404 });
  }

  // 3. Delete Item
  const { error: deleteError } = await supabase.from("cart_items").delete().eq("id", itemId).eq("cart_id", cartId);

  if (deleteError) {
    return new Response(JSON.stringify({ error: "Failed to delete item" }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: "Item deleted" }), { status: 200 });
};

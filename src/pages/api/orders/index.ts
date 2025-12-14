import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "@/db/supabase.client";
import type { OrderConfirmationDto, OrderListItemDto } from "@/types";

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, status, total_amount, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), { status: 500 });
  }

  return new Response(JSON.stringify(orders as OrderListItemDto[]), { status: 200 });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

  // 1. Auth
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  // 2. Get Cart and Items
  const { data: cart, error: cartError } = await supabase
    .from("carts")
    .select(
      `
      id,
      items:cart_items (
        id,
        quantity,
        product:products (
          id,
          name,
          price
        )
      )
    `
    )
    .eq("user_id", user.id)
    .single();

  if (cartError || !cart) {
    return new Response(JSON.stringify({ error: "Cart not found" }), { status: 404 });
  }

  if (!cart.items || cart.items.length === 0) {
    return new Response(JSON.stringify({ error: "Cart is empty" }), { status: 400 });
  }

  // 3. Calculate Total
  // Note: In a real app, verify prices again or use DB functions.
  const totalAmount = cart.items.reduce((sum: number, item: any) => {
    return sum + item.quantity * item.product.price;
  }, 0);

  // 4. Create Order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_amount: totalAmount,
      status: "new",
    })
    .select()
    .single();

  if (orderError) {
    return new Response(JSON.stringify({ error: "Failed to create order" }), { status: 500 });
  }

  // 5. Create Order Items
  const orderItems = cart.items.map((item: any) => ({
    order_id: order.id,
    product_id: item.product.id,
    product_name: item.product.name,
    quantity: item.quantity,
    price_per_unit: item.product.price,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

  if (itemsError) {
    // Rollback order (best effort)
    await supabase.from("orders").delete().eq("id", order.id);
    return new Response(JSON.stringify({ error: "Failed to create order items" }), { status: 500 });
  }

  // 6. Clear Cart
  const { error: clearError } = await supabase.from("cart_items").delete().eq("cart_id", cart.id);

  if (clearError) {
    console.error("Failed to clear cart after order", clearError);
    // Order is created, but cart is not empty. This is a bad state but order is safe.
  }

  // 7. Send Email (Mock)
  console.log(`[MOCK EMAIL] Sending order confirmation to ${user.email} for order ${order.id}`);

  const responseDto: OrderConfirmationDto = {
    id: order.id,
    user_id: order.user_id,
    status: order.status,
    total_amount: order.total_amount,
    created_at: order.created_at,
  };

  return new Response(JSON.stringify(responseDto), { status: 201 });
};

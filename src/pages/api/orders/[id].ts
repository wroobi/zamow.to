import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "@/db/supabase.client";
import type { OrderDetailDto } from "@/types";

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies, params }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "Order ID required" }), { status: 400 });
  }

  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      total_amount,
      created_at,
      items:order_items (
        id,
        product_name,
        quantity,
        price_per_unit
      )
    `
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !order) {
    return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
  }

  return new Response(JSON.stringify(order as OrderDetailDto), { status: 200 });
};

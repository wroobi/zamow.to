export const prerender = false;
import type { APIRoute } from "astro";
import { z } from "zod";
import { createSupabaseServerInstance } from "@/db/supabase.client";

const UpdateSchema = z.object({ password: z.string().min(6), access_token: z.string().optional() });

export const POST: APIRoute = async ({ request, cookies }) => {
  let payload: z.infer<typeof UpdateSchema>;
  try {
    payload = UpdateSchema.parse(await request.json());
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request." }), { status: 400 });
  }

  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

  // If access_token provided, set it as session to authorize update
  if (payload.access_token) {
    await supabase.auth.setSession({ access_token: payload.access_token, refresh_token: "" }).catch(() => null);
  }

  const { error } = await supabase.auth
    .updateUser({ password: payload.password })
    .catch(() => ({ data: null, error: { message: "Update failed." } }));

  if (error) {
    return new Response(JSON.stringify({ error: error.message || "Could not update password." }), { status: 400 });
  }

  return new Response(JSON.stringify({ message: "Password updated." }), { status: 200 });
};

export const prerender = false;
import type { APIRoute } from "astro";
import { z } from "zod";
import { createSupabaseServerInstance } from "@/db/supabase.client";

const ResetSchema = z.object({ email: z.string().email() });

export const POST: APIRoute = async ({ request, cookies }) => {
  let payload: z.infer<typeof ResetSchema>;
  try {
    payload = ResetSchema.parse(await request.json());
  } catch {
    return new Response(JSON.stringify({ error: "Invalid email." }), { status: 400 });
  }

  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

  const { error } = await supabase.auth.resetPasswordForEmail(payload.email, {
    redirectTo: `${import.meta.env.SITE ?? ""}/auth/update-password`,
  });

  // Always return success response to avoid leaking which emails exist
  if (error) {
    return new Response(JSON.stringify({ message: "If the email exists, a reset link was sent." }), { status: 200 });
  }

  return new Response(JSON.stringify({ message: "If the email exists, a reset link was sent." }), { status: 200 });
};

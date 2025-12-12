export const prerender = false;
import type { APIRoute } from "astro";
import { z } from "zod";
import { createSupabaseServerInstance } from "@/db/supabase.client";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  let payload: z.infer<typeof LoginSchema>;
  try {
    payload = LoginSchema.parse(await request.json());
  } catch {
    return new Response(JSON.stringify({ error: "Invalid email or password." }), { status: 400 });
  }

  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (error) {
    return new Response(JSON.stringify({ error: "Invalid credentials." }), { status: 401 });
  }

  return new Response(JSON.stringify({ user: data.user }), { status: 200 });
};

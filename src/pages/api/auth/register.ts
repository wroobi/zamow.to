export const prerender = false;
import type { APIRoute } from "astro";
import { z } from "zod";
import { createSupabaseServerInstance } from "@/db/supabase.client";

const RegisterSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  .strict();

export const POST: APIRoute = async ({ request, cookies }) => {
  let payload: z.infer<typeof RegisterSchema>;
  try {
    payload = RegisterSchema.parse(await request.json());
  } catch {
    return new Response(JSON.stringify({ error: "Invalid registration data." }), { status: 400 });
  }

  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

  // Sign up the user (uses anon or server key; avoids admin API)
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
  });

  if (signUpError) {
    return new Response(JSON.stringify({ error: signUpError.message || "Registration failed." }), { status: 400 });
  }

  // If signUp returned a session/user, return it. Otherwise try to sign in immediately.
  // signUp may not return a session if email confirmation is required.
  if (signUpData.user) {
    // Try to obtain a session by signing in (works if confirmation not required)
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (signInError) {
      // User created but no active session (likely needs email confirm)
      return new Response(
        JSON.stringify({ user: signUpData.user, message: "Registered. Please confirm your email if required." }),
        { status: 201 }
      );
    }

    return new Response(JSON.stringify({ user: signInData.user }), { status: 201 });
  }

  return new Response(JSON.stringify({ message: "Registration initiated." }), { status: 201 });
};

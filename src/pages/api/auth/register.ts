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

  // Always require email confirmation before granting an active session.
  // Return a consistent response telling the user to confirm their email.
  if (signUpData.user) {
    return new Response(
      JSON.stringify({
        user: { id: signUpData.user.id, email: signUpData.user.email },
        message:
          "Konto zostało utworzone. Na podany adres e-mail wysłano wiadomość z linkiem aktywacyjnym. Kliknij link, aby potwierdzić adres e-mail i aktywować konto.",
      }),
      { status: 201 }
    );
  }

  // Fallback generic success message when no user object returned
  return new Response(
    JSON.stringify({
      message:
        "Konto zostało utworzone. Na podany adres e-mail wysłano wiadomość z linkiem aktywacyjnym. Kliknij link, aby potwierdzić adres e-mail i aktywować konto.",
    }),
    { status: 201 }
  );
};

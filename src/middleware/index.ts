import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "@/db/supabase.client";

const PUBLIC_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/reset-password",
  "/auth/update-password",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/reset-password",
  "/api/auth/update-password",
  "/api/auth/logout",
];

export const onRequest = defineMiddleware(async ({ locals, cookies, url, request, redirect }, next) => {
  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });
  locals.supabase = supabase;

  const { data } = await supabase.auth.getUser();
  if (data.user) {
    locals.user = { id: data.user.id, email: data.user.email ?? undefined };
  } else {
    locals.user = undefined;
  }

  // Enforce auth only for non-public paths
  if (!PUBLIC_PATHS.includes(url.pathname) && !locals.user) {
    return redirect("/auth/login");
  }

  return next();
});

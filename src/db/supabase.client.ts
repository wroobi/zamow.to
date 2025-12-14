import type { AstroCookies } from "astro";
import { createServerClient, type CookieOptionsWithName } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const isLocalDev = () => {
  try {
    const host = typeof window === "undefined" ? undefined : window.location.hostname;
    // On server, use a conservative default; Astro doesn't expose host easily here
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
};

export const cookieOptions: CookieOptionsWithName = {
  path: "/",
  secure: !isLocalDev(),
  httpOnly: true,
  sameSite: "lax",
};

function parseCookieHeader(cookieHeader: string): { name: string; value: string }[] {
  if (!cookieHeader) return [];
  return cookieHeader.split(";").map((cookie) => {
    const [name, ...rest] = cookie.trim().split("=");
    return { name, value: rest.join("=") };
  });
}

export const createSupabaseServerInstance = (context: {
  headers: Headers;
  cookies: AstroCookies;
}): SupabaseClient<Database> => {
  // Try multiple sources for environment variables
  const supabaseUrl =
    import.meta.env.SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    (typeof globalThis !== "undefined" && (globalThis as any).SUPABASE_URL);

  const supabaseKey =
    import.meta.env.SUPABASE_KEY ||
    process.env.SUPABASE_KEY ||
    (typeof globalThis !== "undefined" && (globalThis as any).SUPABASE_KEY);

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      `Missing Supabase environment variables:\n` +
        `SUPABASE_URL: ${supabaseUrl ? "✓" : "✗"}\n` +
        `SUPABASE_KEY: ${supabaseKey ? "✓" : "✗"}\n` +
        `Check your .env file and Cloudflare Pages environment variables`
    );
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookieOptions,
    cookies: {
      getAll() {
        return parseCookieHeader(context.headers.get("Cookie") ?? "");
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => context.cookies.set(name, value, options));
      },
    },
  });

  return supabase;
};

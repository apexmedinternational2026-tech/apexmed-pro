import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Database } from "./database.types";
import { requireEnv } from "./env";

// Server Component / Route Handler client: reads the caller's auth cookies
// so RLS evaluates the right role — still only ever anon or authenticated,
// never service_role. Create a fresh instance per request; it must not be
// cached at module scope, since it's bound to this request's cookie jar.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Thrown when called from a Server Component render, which has
            // no response to attach cookies to. Safe to ignore here as
            // long as session refresh also runs in middleware.
          }
        },
      },
    },
  );
}

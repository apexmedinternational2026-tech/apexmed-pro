import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { requireEnv } from "./env";

// Server-side client for PUBLIC, anonymous content reads (programs,
// mentors, blog, site_settings, ...) that must stay static/ISR-eligible.
// Deliberately does NOT touch next/headers cookies() — calling cookies()
// inside a Server Component (as server.ts does) opts the entire route out
// of static generation, which would silently break CLAUDE.md rule 1
// (every public page must be SSG/ISR) for every page that reads content
// through it. This always acts as the anon role, exactly like the browser
// client — there's no user session to read here, since the public site
// has no customer-facing auth; that's what server.ts is for instead.
export function createPublicClient() {
  return createSupabaseClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

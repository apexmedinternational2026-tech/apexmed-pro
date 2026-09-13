"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { requireEnv } from "./env";

// Browser client: safe to import from Client Components. Only ever holds
// the anon key, which is designed to be public — every row it can see or
// change is governed entirely by the RLS policies in supabase/migrations/.
export function createClient() {
  return createBrowserClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  );
}

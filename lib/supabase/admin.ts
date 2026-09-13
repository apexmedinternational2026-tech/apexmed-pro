import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { requireEnv } from "./env";

// Runtime guard, in addition to the `server-only` import above: this
// module holds the Supabase service role key, which bypasses every RLS
// policy in this project — including the ones that make leads and
// contact_messages unreadable to anon/authenticated entirely. If this
// module ever executed in a browser, that key (and every lead's name,
// email, and phone number behind it) would be reachable from devtools.
if (typeof window !== "undefined") {
  throw new Error(
    "lib/supabase/admin.ts was imported into browser code. This module holds the Supabase service role key, which bypasses Row Level Security, and must only ever run on the server.",
  );
}

// Admin client: bypasses RLS entirely. Use only from server-only code —
// Route Handlers, Server Actions, and the write functions in
// lib/supabase/queries/leads.ts and contact.ts. Never forward this client,
// or an unfiltered result from it, to a Client Component.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

import "server-only";
import { createClient } from "../server";
import { DatabaseQueryError } from "../errors";
import type { Tables } from "../database.types";

export type MyLead = Pick<
  Tables<"leads">,
  "id" | "full_name" | "interest_type" | "status" | "created_at" | "message"
>;

export type MyWebinarRegistration = Pick<Tables<"webinar_registrations">, "id" | "created_at"> & {
  webinar: Pick<Tables<"webinars">, "id" | "slug" | "title" | "starts_at"> | null;
};

// Uses the request-scoped (cookie-bound) client, not the admin client —
// authenticated_select_own_leads' `user_id = auth.uid()` RLS policy is
// what actually restricts this to the caller's own rows; there's no
// separate `.eq("user_id", ...)` filter needed here because a forgotten
// filter would still be caught by RLS rather than leaking another
// visitor's leads.
export async function getMyLeads(): Promise<MyLead[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("id, full_name, interest_type, status, created_at, message")
    .order("created_at", { ascending: false });

  if (error) {
    throw new DatabaseQueryError("Failed to load your submissions.", { table: "leads", originalError: error });
  }

  return data;
}

export async function getMyWebinarRegistrations(): Promise<MyWebinarRegistration[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("webinar_registrations")
    .select("id, created_at, webinar:webinars(id, slug, title, starts_at)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new DatabaseQueryError("Failed to load your webinar registrations.", {
      table: "webinar_registrations",
      originalError: error,
    });
  }

  return data;
}

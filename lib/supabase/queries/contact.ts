import "server-only";
import { createAdminClient } from "../admin";
import { DatabaseQueryError } from "../errors";
import { ok, type Result } from "../../result";
import type { Tables } from "../database.types";
import type { ContactInput } from "../../validation/contact";

export type ContactMessage = Tables<"contact_messages">;

// Writes go through the service role client, not the anon INSERT policy on
// `contact_messages` — so this must only ever be called from server-only
// code (a Route Handler or Server Action behind the contact form), never
// from a Client Component. `input` is ContactInput, i.e. the output of
// contactSchema.safeParse() — that schema is the only place this data gets
// validated; this function trusts it's already clean.
export async function createContactMessage(input: ContactInput): Promise<Result<ContactMessage, string>> {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("contact_messages")
    .insert({
      name: input.name,
      email: input.email,
      subject: input.subject || null,
      message: input.message,
    })
    .select("*")
    .single();

  if (error) {
    throw new DatabaseQueryError("Failed to save contact message.", {
      table: "contact_messages",
      originalError: error,
    });
  }

  return ok(data);
}

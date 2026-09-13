import "server-only";
import { createAdminClient } from "../admin";
import { DatabaseQueryError } from "../errors";
import { ok, type Result } from "../../result";
import type { Tables } from "../database.types";
import type { LeadInput } from "../../validation/lead";

export type Lead = Tables<"leads">;

export interface LeadSourceMeta {
  source_page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

// Writes go through the service role client, not the anon INSERT policy on
// `leads` — so this must only ever be called from server-only code (a
// Route Handler or Server Action behind the contact / profile-assessment
// forms), never from a Client Component. `input` is LeadInput, i.e. the
// output of leadSchema.safeParse() — that Zod schema is the only place
// this data gets validated; this function trusts it's already clean.
export async function createLead(
  input: LeadInput,
  meta: LeadSourceMeta = {},
  userId: string | null = null,
): Promise<Result<Lead, string>> {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("leads")
    .insert({
      full_name: input.full_name,
      email: input.email,
      phone: input.phone || null,
      country: input.country,
      current_status: input.current_status,
      interest_type: input.interest_type,
      program_id: input.program_id ?? null,
      message: input.message || null,
      source_page: meta.source_page ?? null,
      utm_source: meta.utm_source ?? null,
      utm_medium: meta.utm_medium ?? null,
      utm_campaign: meta.utm_campaign ?? null,
      // NULL for every anonymous submission — only set when
      // app/api/leads/route.ts sees an active session at write time. This
      // is what "My Account" (getMyLeads) later filters on.
      user_id: userId,
    })
    .select("*")
    .single();

  if (error) {
    throw new DatabaseQueryError("Failed to save lead.", {
      table: "leads",
      originalError: error,
    });
  }

  return ok(data);
}

import "server-only";
import { createAdminClient } from "../admin";
import { DatabaseQueryError } from "../errors";
import { ok, err, type Result } from "../../result";
import type { Tables } from "../database.types";
import type { ApplicationInput } from "../../validation/application";

export type Application = Tables<"applications">;

const DUPLICATE_WINDOW_HOURS = 24;

// Same email + same service within a rolling 24h window — not a DB
// uniqueness constraint, since a rolling time window isn't expressible as
// a plain unique index. Checked before insert, from the API route, so a
// double-submit (double-click, retry-on-slow-network) doesn't create two
// rows for the same person applying to the same thing twice in one sitting.
export async function hasRecentDuplicateApplication(email: string, serviceId: string): Promise<boolean> {
  const admin = createAdminClient();
  const since = new Date(Date.now() - DUPLICATE_WINDOW_HOURS * 60 * 60 * 1000).toISOString();

  const { count, error } = await admin
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .eq("service_id", serviceId)
    .gte("created_at", since);

  if (error) {
    throw new DatabaseQueryError("Failed to check for a duplicate application.", {
      table: "applications",
      originalError: error,
    });
  }

  return (count ?? 0) > 0;
}

/** Used to put an accurate service name in the confirmation/notification emails — re-fetched server-side rather than trusting a client-supplied name. */
export async function getServiceNameById(serviceId: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("services").select("name").eq("id", serviceId).single();
  if (error) return null;
  return data.name;
}

export async function uploadApplicationCv(file: File): Promise<Result<string, string>> {
  const admin = createAdminClient();
  const extension = file.name.split(".").pop() ?? "pdf";
  // Path, not a public URL — the `applications` bucket is private (see the
  // migration); admin/application-detail-drawer.tsx generates a short-lived
  // signed URL from this path on demand instead.
  const path = `cvs/${crypto.randomUUID()}.${extension}`;

  const { error } = await admin.storage.from("applications").upload(path, file, {
    contentType: file.type || "application/octet-stream",
    cacheControl: "3600",
  });

  if (error) return err("Failed to upload the CV file.");
  return ok(path);
}

// Writes go through the service role client, not an anon SELECT/UPDATE
// policy — `applications` only grants anon INSERT (see the migration), so
// this must only ever run from server-only code (app/api/applications/route.ts),
// never a Client Component. `input` is ApplicationInput, i.e. the output of
// applicationSchema.safeParse() — already validated by the time it gets here.
export async function createApplication(input: ApplicationInput, cvUrl: string | null): Promise<Result<Application, string>> {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("applications")
    .insert({
      service_id: input.service_id,
      full_name: input.full_name,
      email: input.email,
      phone: input.phone,
      institution: input.institution || null,
      education_level: input.education_level || null,
      year_of_study: input.year_of_study || null,
      country: input.country || null,
      cv_url: cvUrl,
      motivation: input.motivation || null,
      extra_fields: input.extra_fields ?? {},
    })
    .select("*")
    .single();

  if (error) {
    throw new DatabaseQueryError("Failed to save the application.", {
      table: "applications",
      originalError: error,
    });
  }

  return ok(data);
}

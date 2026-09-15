"use server";

import { requireAdminSession } from "@/lib/supabase/auth";
import { updateApplicationStatusSchema, updateApplicationNotesSchema } from "@/lib/validation/admin/application";
import { updateApplicationStatusAdmin, updateApplicationNotesAdmin, getApplicationCvSignedUrl } from "@/lib/supabase/queries/admin/applications";
import type { Result } from "@/lib/result";

// Same reasoning as lib/actions/admin/leads.ts: applications never affect a
// public, statically-generated route — nothing to revalidatePath() here.

export async function updateApplicationStatusAction(id: string, status: string): Promise<Result<true, string>> {
  await requireAdminSession();

  const parsed = updateApplicationStatusSchema.safeParse({ id, status });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid status." };

  const result = await updateApplicationStatusAdmin(parsed.data.id, parsed.data.status);
  if (!result.ok) return result;
  return { ok: true, value: true };
}

export async function updateApplicationNotesAction(id: string, adminNotes: string): Promise<Result<true, string>> {
  await requireAdminSession();

  const parsed = updateApplicationNotesSchema.safeParse({ id, admin_notes: adminNotes });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid notes." };

  const result = await updateApplicationNotesAdmin(parsed.data.id, parsed.data.admin_notes ?? "");
  if (!result.ok) return result;
  return { ok: true, value: true };
}

export async function getApplicationCvDownloadUrlAction(cvPath: string): Promise<Result<string, string>> {
  await requireAdminSession();
  return getApplicationCvSignedUrl(cvPath);
}

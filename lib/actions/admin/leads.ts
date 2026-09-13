"use server";

import { requireAdminSession } from "@/lib/supabase/auth";
import { updateLeadStatusSchema, updateLeadNotesSchema } from "@/lib/validation/admin/lead";
import { updateLeadStatusAdmin, updateLeadNotesAdmin } from "@/lib/supabase/queries/admin/leads";
import type { Result } from "@/lib/result";

// Leads never affect a public, statically-generated route, so there's
// nothing to revalidatePath() here — unlike programs/blog/mentors, this
// data only ever renders inside the admin panel itself, which reads fresh
// on every request already (no ISR involved).

export async function updateLeadStatusAction(id: string, status: string): Promise<Result<true, string>> {
  await requireAdminSession();

  const parsed = updateLeadStatusSchema.safeParse({ id, status });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid status." };

  const result = await updateLeadStatusAdmin(parsed.data.id, parsed.data.status);
  if (!result.ok) return result;
  return { ok: true, value: true };
}

export async function updateLeadNotesAction(id: string, adminNotes: string): Promise<Result<true, string>> {
  await requireAdminSession();

  const parsed = updateLeadNotesSchema.safeParse({ id, admin_notes: adminNotes });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid notes." };

  const result = await updateLeadNotesAdmin(parsed.data.id, parsed.data.admin_notes ?? "");
  if (!result.ok) return result;
  return { ok: true, value: true };
}

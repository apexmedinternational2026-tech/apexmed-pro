"use server";

import { requireAdminSession } from "@/lib/supabase/auth";
import { chatbotFaqSchema } from "@/lib/validation/admin/chatbot-faq";
import {
  createFaqAdmin,
  updateFaqAdmin,
  deleteFaqAdmin,
  reorderFaqsAdmin,
  markUnansweredReviewedAdmin,
} from "@/lib/supabase/queries/admin/chatbot";
import type { Result } from "@/lib/result";

// The chatbot never renders through a statically-generated public page (the
// widget's own /api/chatbot Route Handler reads fresh on every request) —
// same reasoning as lib/actions/admin/leads.ts for why there's no
// revalidatePath() here. Only the starter-question chips (fetched in
// app/(public)/layout.tsx, which every page shares) are affected by an
// edit, and that follows whatever ISR window the page being viewed already
// has — same as WhatsAppButton's own site_settings fetch.

function parseFaqForm(formData: FormData) {
  return chatbotFaqSchema.safeParse({
    id: formData.get("id") || undefined,
    question: formData.get("question"),
    answer: formData.get("answer"),
    keywords: formData.get("keywords"),
    category: formData.get("category"),
    is_starter: formData.get("is_starter") === "on",
    is_published: formData.get("is_published") === "on",
  });
}

export async function createFaqAction(formData: FormData): Promise<Result<{ id: string }, string>> {
  await requireAdminSession();
  const parsed = parseFaqForm(formData);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid FAQ data." };

  const result = await createFaqAdmin(parsed.data);
  if (!result.ok) return result;
  return { ok: true, value: { id: result.value.id } };
}

export async function updateFaqAction(id: string, formData: FormData): Promise<Result<true, string>> {
  await requireAdminSession();
  const parsed = parseFaqForm(formData);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid FAQ data." };

  const result = await updateFaqAdmin({ ...parsed.data, id });
  if (!result.ok) return result;
  return { ok: true, value: true };
}

export async function deleteFaqAction(id: string): Promise<Result<true, string>> {
  await requireAdminSession();
  return deleteFaqAdmin(id);
}

export async function reorderFaqsAction(orderedIds: string[]): Promise<Result<true, string>> {
  await requireAdminSession();
  return reorderFaqsAdmin(orderedIds);
}

export async function markUnansweredReviewedAction(id: string, reviewed: boolean): Promise<Result<true, string>> {
  await requireAdminSession();
  return markUnansweredReviewedAdmin(id, reviewed);
}

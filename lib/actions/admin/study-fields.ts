"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/supabase/auth";
import { studyFieldCategorySchema, studyFieldSchema, type StudyFieldInput } from "@/lib/validation/admin/study-field";
import { getStudyFieldWordCount, MIN_FIELD_PAGE_WORDS } from "@/lib/content-length";
import {
  createStudyFieldCategoryAdmin,
  createStudyFieldAdmin,
  updateStudyFieldAdmin,
  deleteStudyFieldAdmin,
} from "@/lib/supabase/queries/admin/study-fields";
import type { Result } from "@/lib/result";

// Search engines penalize thin, near-duplicate programmatic pages — this
// is the one place that rule is actually enforced, not just documented.
// Checked only when publishing (is_published: true): a draft can be as
// short as a title while real content gets written, but it can't go live
// under the threshold, and the message says why rather than just failing.
function checkPublishThreshold(input: StudyFieldInput): string | null {
  if (!input.is_published) return null;

  const wordCount = getStudyFieldWordCount(input);
  if (wordCount >= MIN_FIELD_PAGE_WORDS) return null;

  return `This page has ${wordCount} words of content across its sections — below the ${MIN_FIELD_PAGE_WORDS}-word minimum required to publish. Thin, near-duplicate programmatic pages get penalized by search engines. Add more detail to the overview, entry requirements, or career outlook, then try publishing again.`;
}

function revalidateFields(slug?: string) {
  revalidatePath("/masters/fields");
  if (slug) revalidatePath(`/masters/fields/${slug}`);
}

export async function createStudyFieldCategoryAction(formData: FormData): Promise<Result<true, string>> {
  await requireAdminSession();
  const parsed = studyFieldCategorySchema.safeParse({ slug: formData.get("slug"), name: formData.get("name") });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid category." };

  const result = await createStudyFieldCategoryAdmin(parsed.data);
  if (!result.ok) return result;
  revalidateFields();
  return { ok: true, value: true };
}

function parseFieldForm(formData: FormData) {
  return studyFieldSchema.safeParse({
    id: formData.get("id") || undefined,
    category_id: formData.get("category_id"),
    slug: formData.get("slug"),
    name: formData.get("name"),
    overview: formData.get("overview"),
    typical_universities: formData.get("typical_universities"),
    entry_requirements: formData.get("entry_requirements"),
    language_requirements: formData.get("language_requirements"),
    career_outlook: formData.get("career_outlook"),
    is_published: formData.get("is_published") === "on",
    seo_title: formData.get("seo_title"),
    seo_description: formData.get("seo_description"),
    seo_og_image_url: formData.get("seo_og_image_url"),
    canonical_path: formData.get("canonical_path"),
  });
}

export async function createStudyFieldAction(formData: FormData): Promise<Result<true, string>> {
  await requireAdminSession();
  const parsed = parseFieldForm(formData);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid study field." };

  const thresholdError = checkPublishThreshold(parsed.data);
  if (thresholdError) return { ok: false, error: thresholdError };

  const result = await createStudyFieldAdmin(parsed.data);
  if (!result.ok) return result;
  revalidateFields(parsed.data.slug);
  return { ok: true, value: true };
}

export async function updateStudyFieldAction(id: string, formData: FormData): Promise<Result<true, string>> {
  await requireAdminSession();
  const parsed = parseFieldForm(formData);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid study field." };

  const thresholdError = checkPublishThreshold(parsed.data);
  if (thresholdError) return { ok: false, error: thresholdError };

  const result = await updateStudyFieldAdmin(id, parsed.data);
  if (!result.ok) return result;
  revalidateFields(parsed.data.slug);
  return { ok: true, value: true };
}

export async function deleteStudyFieldAction(id: string): Promise<Result<true, string>> {
  await requireAdminSession();
  const result = await deleteStudyFieldAdmin(id);
  if (!result.ok) return result;
  revalidateFields();
  return result;
}

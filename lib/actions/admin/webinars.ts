"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/supabase/auth";
import { webinarSchema } from "@/lib/validation/admin/webinar";
import { createWebinarAdmin, updateWebinarAdmin, deleteWebinarAdmin } from "@/lib/supabase/queries/admin/webinars";
import type { Result } from "@/lib/result";

function parseWebinarForm(formData: FormData) {
  return webinarSchema.safeParse({
    id: formData.get("id") || undefined,
    slug: formData.get("slug"),
    title: formData.get("title"),
    description: formData.get("description"),
    speaker_id: formData.get("speaker_id"),
    starts_at: formData.get("starts_at"),
    duration_minutes: formData.get("duration_minutes") || 60,
    platform: formData.get("platform"),
    join_url: formData.get("join_url"),
    cover_image_url: formData.get("cover_image_url"),
    capacity: formData.get("capacity") || undefined,
    is_published: formData.get("is_published") === "on",
    seo_title: formData.get("seo_title"),
    seo_description: formData.get("seo_description"),
    seo_og_image_url: formData.get("seo_og_image_url"),
    canonical_path: formData.get("canonical_path"),
  });
}

function revalidateWebinars(slug?: string) {
  revalidatePath("/");
  revalidatePath("/webinars");
  if (slug) revalidatePath(`/webinars/${slug}`);
}

export async function createWebinarAction(formData: FormData): Promise<Result<{ id: string }, string>> {
  await requireAdminSession();
  const parsed = parseWebinarForm(formData);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid webinar data." };

  const result = await createWebinarAdmin(parsed.data);
  if (!result.ok) return result;

  revalidateWebinars(parsed.data.slug);
  return { ok: true, value: { id: result.value.id } };
}

export async function updateWebinarAction(id: string, formData: FormData): Promise<Result<true, string>> {
  await requireAdminSession();
  const parsed = parseWebinarForm(formData);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid webinar data." };

  const result = await updateWebinarAdmin(id, parsed.data);
  if (!result.ok) return result;

  revalidateWebinars(parsed.data.slug);
  return { ok: true, value: true };
}

export async function deleteWebinarAction(id: string): Promise<Result<true, string>> {
  await requireAdminSession();
  const result = await deleteWebinarAdmin(id);
  if (!result.ok) return result;
  revalidateWebinars();
  return result;
}

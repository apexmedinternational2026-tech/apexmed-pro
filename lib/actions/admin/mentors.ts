"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/supabase/auth";
import { mentorSchema } from "@/lib/validation/admin/mentor";
import {
  createMentorAdmin,
  updateMentorAdmin,
  deleteMentorAdmin,
  reorderMentorsAdmin,
} from "@/lib/supabase/queries/admin/mentors";
import type { Result } from "@/lib/result";

function parseMentorForm(formData: FormData) {
  return mentorSchema.safeParse({
    id: formData.get("id") || undefined,
    slug: formData.get("slug"),
    full_name: formData.get("full_name"),
    role_title: formData.get("role_title"),
    qualification: formData.get("qualification"),
    institution: formData.get("institution"),
    bio: formData.get("bio"),
    photo_url: formData.get("photo_url"),
    publications_count: formData.get("publications_count") || 0,
    linkedin_url: formData.get("linkedin_url"),
    is_leadership: formData.get("is_leadership") === "on",
    is_published: formData.get("is_published") === "on",
  });
}

function revalidateMentors(slug?: string) {
  revalidatePath("/about");
  revalidatePath("/");
  if (slug) revalidatePath(`/mentors/${slug}`);
}

export async function createMentorAction(formData: FormData): Promise<Result<{ id: string }, string>> {
  await requireAdminSession();
  const parsed = parseMentorForm(formData);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid mentor data." };

  const result = await createMentorAdmin(parsed.data);
  if (!result.ok) return result;

  revalidateMentors(parsed.data.slug);
  return { ok: true, value: { id: result.value.id } };
}

export async function updateMentorAction(id: string, formData: FormData): Promise<Result<true, string>> {
  await requireAdminSession();
  const parsed = parseMentorForm(formData);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid mentor data." };

  const result = await updateMentorAdmin({ ...parsed.data, id });
  if (!result.ok) return result;

  revalidateMentors(parsed.data.slug);
  return { ok: true, value: true };
}

export async function deleteMentorAction(id: string): Promise<Result<true, string>> {
  await requireAdminSession();
  const result = await deleteMentorAdmin(id);
  if (!result.ok) return result;
  revalidateMentors();
  return result;
}

export async function reorderMentorsAction(orderedIds: string[]): Promise<Result<true, string>> {
  await requireAdminSession();
  const result = await reorderMentorsAdmin(orderedIds);
  if (!result.ok) return result;
  revalidateMentors();
  return result;
}

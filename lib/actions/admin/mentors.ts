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
  // /about used to render the mentor grid directly and doesn't anymore —
  // that moved to its own /mentors page (see app/(public)/mentors/page.tsx)
  // when About was split apart, but this function was never updated to
  // follow, so a mentor edit revalidated a page that no longer shows
  // mentor data while leaving the page that actually does serving stale
  // content for up to an hour (its own `revalidate = 3600`). /about still
  // gets it too since it links to /mentors and could reasonably change
  // (a founder's bio, etc.) even without rendering the full grid.
  revalidatePath("/mentors");
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

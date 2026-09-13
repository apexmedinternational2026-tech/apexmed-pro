import "server-only";
import { createAdminClient } from "../../admin";
import { DatabaseQueryError, NotFoundError } from "../../errors";
import { ok, err, type Result } from "../../../result";
import type { Tables } from "../../database.types";
import type { MentorInput } from "@/lib/validation/admin/mentor";

export async function listMentorsAdmin(): Promise<Tables<"mentors">[]> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("mentors").select("*").order("sort_order", { ascending: true });
  if (error) throw new DatabaseQueryError("Failed to load mentors.", { table: "mentors", originalError: error });
  return data;
}

export async function getMentorByIdAdmin(id: string): Promise<Tables<"mentors">> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("mentors").select("*").eq("id", id).maybeSingle();
  if (error) throw new DatabaseQueryError(`Failed to load mentor "${id}".`, { table: "mentors", originalError: error });
  if (!data) throw new NotFoundError(`Mentor "${id}" was not found.`);
  return data;
}

export async function createMentorAdmin(input: MentorInput): Promise<Result<Tables<"mentors">, string>> {
  const admin = createAdminClient();
  const { count } = await admin.from("mentors").select("id", { count: "exact", head: true });

  const { data, error } = await admin
    .from("mentors")
    .insert({
      slug: input.slug,
      full_name: input.full_name,
      role_title: input.role_title || null,
      qualification: input.qualification || null,
      institution: input.institution || null,
      bio: input.bio || null,
      photo_url: input.photo_url || null,
      publications_count: input.publications_count,
      linkedin_url: input.linkedin_url || null,
      is_leadership: input.is_leadership,
      is_published: input.is_published,
      sort_order: count ?? 0,
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") return err("That slug is already in use.");
    return err("Failed to create the mentor.");
  }
  return ok(data);
}

export async function updateMentorAdmin(
  input: MentorInput & { id: string },
): Promise<Result<Tables<"mentors">, string>> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("mentors")
    .update({
      slug: input.slug,
      full_name: input.full_name,
      role_title: input.role_title || null,
      qualification: input.qualification || null,
      institution: input.institution || null,
      bio: input.bio || null,
      photo_url: input.photo_url || null,
      publications_count: input.publications_count,
      linkedin_url: input.linkedin_url || null,
      is_leadership: input.is_leadership,
      is_published: input.is_published,
    })
    .eq("id", input.id)
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") return err("That slug is already in use.");
    return err("Failed to update the mentor.");
  }
  return ok(data);
}

export async function deleteMentorAdmin(id: string): Promise<Result<true, string>> {
  const admin = createAdminClient();
  const { error } = await admin.from("mentors").delete().eq("id", id);
  // 23503 = foreign_key_violation — a mentor referenced as a blog author or
  // webinar speaker can't simply vanish out from under that content.
  if (error)
    return err(
      error.code === "23503"
        ? "This mentor is referenced by other content and can't be deleted."
        : "Failed to delete the mentor.",
    );
  return ok(true);
}

export async function reorderMentorsAdmin(orderedIds: string[]): Promise<Result<true, string>> {
  const admin = createAdminClient();
  const results = await Promise.all(
    orderedIds.map((id, index) => admin.from("mentors").update({ sort_order: index }).eq("id", id)),
  );
  if (results.some((r) => r.error)) return err("Failed to save the new order.");
  return ok(true);
}

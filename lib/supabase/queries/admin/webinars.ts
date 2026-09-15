import "server-only";
import { createAdminClient } from "../../admin";
import { DatabaseQueryError, NotFoundError } from "../../errors";
import { ok, err, type Result } from "../../../result";
import type { Tables, TablesInsert } from "../../database.types";
import type { WebinarInput } from "@/lib/validation/admin/webinar";

export type AdminWebinar = Tables<"webinars"> & { speaker: Pick<Tables<"mentors">, "id" | "full_name"> | null };

export async function listWebinarsAdmin(): Promise<AdminWebinar[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("webinars")
    .select("*, speaker:mentors(id, full_name)")
    .order("starts_at", { ascending: false });

  if (error) throw new DatabaseQueryError("Failed to load webinars.", { table: "webinars", originalError: error });
  return data;
}

export async function getWebinarByIdAdmin(id: string): Promise<Tables<"webinars">> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("webinars").select("*").eq("id", id).maybeSingle();
  if (error)
    throw new DatabaseQueryError(`Failed to load webinar "${id}".`, { table: "webinars", originalError: error });
  if (!data) throw new NotFoundError(`Webinar "${id}" was not found.`);
  return data;
}

function toInsert(input: WebinarInput): Omit<TablesInsert<"webinars">, "id"> {
  return {
    slug: input.slug,
    title: input.title,
    description: input.description || null,
    speaker_id: input.speaker_id || null,
    starts_at: input.starts_at,
    duration_minutes: input.duration_minutes,
    platform: input.platform,
    join_url: input.join_url || null,
    cover_image_url: input.cover_image_url || null,
    capacity: input.capacity ?? null,
    is_published: input.is_published,
    // seo_title/seo_description/seo_og_image_url/canonical_path
    // deliberately omitted — see the identical comment in
    // lib/supabase/queries/admin/blog.ts's toInsert().
  };
}

export async function createWebinarAdmin(input: WebinarInput): Promise<Result<Tables<"webinars">, string>> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("webinars").insert(toInsert(input)).select("*").single();

  if (error) {
    if (error.code === "23505") return err("That slug is already in use.");
    return err("Failed to create the webinar.");
  }
  return ok(data);
}

export async function updateWebinarAdmin(id: string, input: WebinarInput): Promise<Result<Tables<"webinars">, string>> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("webinars").update(toInsert(input)).eq("id", id).select("*").single();

  if (error) {
    if (error.code === "23505") return err("That slug is already in use.");
    return err("Failed to update the webinar.");
  }
  return ok(data);
}

export async function deleteWebinarAdmin(id: string): Promise<Result<true, string>> {
  const admin = createAdminClient();
  const { error } = await admin.from("webinars").delete().eq("id", id);
  if (error) return err("Failed to delete the webinar.");
  return ok(true);
}

export async function getWebinarRegistrantsAdmin(webinarId: string): Promise<Tables<"webinar_registrations">[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("webinar_registrations")
    .select("*")
    .eq("webinar_id", webinarId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new DatabaseQueryError(`Failed to load registrants for webinar "${webinarId}".`, {
      table: "webinar_registrations",
      originalError: error,
    });
  }
  return data;
}

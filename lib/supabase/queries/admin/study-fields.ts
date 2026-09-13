import "server-only";
import { createAdminClient } from "../../admin";
import { DatabaseQueryError, NotFoundError } from "../../errors";
import { ok, err, type Result } from "../../../result";
import type { Tables, TablesInsert } from "../../database.types";
import type { StudyFieldCategoryInput, StudyFieldInput } from "@/lib/validation/admin/study-field";

export type AdminStudyField = Tables<"study_fields"> & {
  category: Pick<Tables<"study_field_categories">, "id" | "name">;
};

export async function listStudyFieldCategoriesAdmin(): Promise<Tables<"study_field_categories">[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("study_field_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error)
    throw new DatabaseQueryError("Failed to load study field categories.", {
      table: "study_field_categories",
      originalError: error,
    });
  return data;
}

export async function listStudyFieldsAdmin(): Promise<AdminStudyField[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("study_fields")
    .select("*, category:study_field_categories(id, name)")
    .order("name", { ascending: true });
  if (error)
    throw new DatabaseQueryError("Failed to load study fields.", { table: "study_fields", originalError: error });
  return data;
}

export async function getStudyFieldByIdAdmin(id: string): Promise<Tables<"study_fields">> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("study_fields").select("*").eq("id", id).maybeSingle();
  if (error)
    throw new DatabaseQueryError(`Failed to load study field "${id}".`, {
      table: "study_fields",
      originalError: error,
    });
  if (!data) throw new NotFoundError(`Study field "${id}" was not found.`);
  return data;
}

export async function createStudyFieldCategoryAdmin(
  input: StudyFieldCategoryInput,
): Promise<Result<Tables<"study_field_categories">, string>> {
  const admin = createAdminClient();
  const { count } = await admin.from("study_field_categories").select("id", { count: "exact", head: true });
  const { data, error } = await admin
    .from("study_field_categories")
    .insert({ slug: input.slug, name: input.name, sort_order: count ?? 0 })
    .select("*")
    .single();
  if (error) return err(error.code === "23505" ? "That slug is already in use." : "Failed to create the category.");
  return ok(data);
}

function toInsert(input: StudyFieldInput): Omit<TablesInsert<"study_fields">, "id"> {
  return {
    category_id: input.category_id,
    slug: input.slug,
    name: input.name,
    overview: input.overview || null,
    typical_universities: input.typical_universities || null,
    entry_requirements: input.entry_requirements || null,
    language_requirements: input.language_requirements || null,
    career_outlook: input.career_outlook || null,
    is_published: input.is_published,
    seo_title: input.seo_title || null,
    seo_description: input.seo_description || null,
    seo_og_image_url: input.seo_og_image_url || null,
    canonical_path: input.canonical_path || null,
  };
}

export async function createStudyFieldAdmin(input: StudyFieldInput): Promise<Result<Tables<"study_fields">, string>> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("study_fields").insert(toInsert(input)).select("*").single();
  if (error) return err(error.code === "23505" ? "That slug is already in use." : "Failed to create the study field.");
  return ok(data);
}

export async function updateStudyFieldAdmin(
  id: string,
  input: StudyFieldInput,
): Promise<Result<Tables<"study_fields">, string>> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("study_fields").update(toInsert(input)).eq("id", id).select("*").single();
  if (error) return err(error.code === "23505" ? "That slug is already in use." : "Failed to update the study field.");
  return ok(data);
}

export async function deleteStudyFieldAdmin(id: string): Promise<Result<true, string>> {
  const admin = createAdminClient();
  const { error } = await admin.from("study_fields").delete().eq("id", id);
  if (error) return err("Failed to delete the study field.");
  return ok(true);
}

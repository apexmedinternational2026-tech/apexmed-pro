import { createPublicClient } from "../public";
import { DatabaseQueryError, NotFoundError } from "../errors";
import type { Tables } from "../database.types";

export type StudyFieldCategory = Tables<"study_field_categories">;

export type StudyFieldSummary = Pick<Tables<"study_fields">, "id" | "slug" | "name" | "overview"> & {
  category: Pick<Tables<"study_field_categories">, "id" | "slug" | "name">;
};

export type StudyFieldDetail = Tables<"study_fields"> & {
  category: Tables<"study_field_categories">;
};

export async function getStudyFieldCategories(): Promise<StudyFieldCategory[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("study_field_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new DatabaseQueryError("Failed to load study field categories.", {
      table: "study_field_categories",
      originalError: error,
    });
  }

  return data;
}

interface RawStudyFieldSummary extends Pick<Tables<"study_fields">, "id" | "slug" | "name" | "overview"> {
  category: Pick<Tables<"study_field_categories">, "id" | "slug" | "name">;
}

export async function getPublishedStudyFields(): Promise<StudyFieldSummary[]> {
  const supabase = createPublicClient();

  // No .eq("is_published", true): anon_select_published_study_fields
  // already enforces it via RLS.
  const { data, error } = await supabase
    .from("study_fields")
    .select<string, RawStudyFieldSummary>(
      `
      id, slug, name, overview,
      category:study_field_categories(id, slug, name)
      `,
    )
    .order("name", { ascending: true });

  if (error) {
    throw new DatabaseQueryError("Failed to load study fields.", {
      table: "study_fields",
      originalError: error,
    });
  }

  return data;
}

export async function getStudyFieldSlugs(): Promise<{ slug: string }[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("study_fields").select("slug");

  if (error) {
    throw new DatabaseQueryError("Failed to load study field slugs.", {
      table: "study_fields",
      originalError: error,
    });
  }

  return data;
}

interface RawStudyFieldDetail extends Tables<"study_fields"> {
  category: Tables<"study_field_categories">;
}

export type RelatedStudyField = Pick<Tables<"study_fields">, "id" | "slug" | "name" | "overview">;

/** A few other published fields in the same category — the "related fields" section on a field's own page. */
export async function getRelatedStudyFields(
  categoryId: string,
  excludeFieldId: string,
  limit = 3,
): Promise<RelatedStudyField[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("study_fields")
    .select("id, slug, name, overview")
    .eq("category_id", categoryId)
    .neq("id", excludeFieldId)
    .order("name", { ascending: true })
    .limit(limit);

  if (error) {
    throw new DatabaseQueryError("Failed to load related study fields.", {
      table: "study_fields",
      originalError: error,
    });
  }

  return data;
}

export async function getStudyFieldBySlug(slug: string): Promise<StudyFieldDetail> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("study_fields")
    .select<string, RawStudyFieldDetail>(
      `
      *,
      category:study_field_categories(*)
      `,
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new DatabaseQueryError(`Failed to load study field "${slug}".`, {
      table: "study_fields",
      originalError: error,
    });
  }

  if (!data) {
    throw new NotFoundError(`Study field "${slug}" was not found or is not published.`);
  }

  return data;
}

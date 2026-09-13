import { createPublicClient } from "../public";
import { DatabaseQueryError, NotFoundError } from "../errors";
import type { Tables } from "../database.types";

export type Mentor = Tables<"mentors">;

export async function getPublishedMentors(): Promise<Mentor[]> {
  const supabase = createPublicClient();

  // No .eq("is_published", true): anon_select_published_mentors already
  // enforces it via RLS.
  const { data, error } = await supabase.from("mentors").select("*").order("sort_order", { ascending: true });

  if (error) {
    throw new DatabaseQueryError("Failed to load mentors.", {
      table: "mentors",
      originalError: error,
    });
  }

  return data;
}

export async function getMentorSlugs(): Promise<{ slug: string }[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("mentors").select("slug");

  if (error) {
    throw new DatabaseQueryError("Failed to load mentor slugs.", {
      table: "mentors",
      originalError: error,
    });
  }

  return data;
}

export async function getMentorBySlug(slug: string): Promise<Mentor> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("mentors").select("*").eq("slug", slug).maybeSingle();

  if (error) {
    throw new DatabaseQueryError(`Failed to load mentor "${slug}".`, {
      table: "mentors",
      originalError: error,
    });
  }

  if (!data) {
    throw new NotFoundError(`Mentor "${slug}" was not found or is not published.`);
  }

  return data;
}

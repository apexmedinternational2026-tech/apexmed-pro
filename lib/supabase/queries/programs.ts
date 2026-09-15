import { createPublicClient } from "../public";
import { DatabaseQueryError, NotFoundError } from "../errors";
import type { Tables } from "../database.types";

export type ProgramFamily = Tables<"program_families">;

export type ProgramSummary = Pick<
  Tables<"programs">,
  | "id"
  | "slug"
  | "name"
  | "headline"
  | "summary"
  | "duration_label"
  | "hero_image_url"
  | "accent_token"
  | "sort_order"
  | "family_id"
>;

export type ProgramModuleItem = Pick<Tables<"program_module_items">, "id" | "label" | "sort_order">;

export type ProgramModule = Pick<
  Tables<"program_modules">,
  "id" | "title" | "description" | "icon_key" | "sort_order"
> & {
  items: ProgramModuleItem[];
};

export type ProgramAudience = Pick<Tables<"program_audiences">, "id" | "label" | "sort_order">;

export type ProgramJourneyStep = Pick<
  Tables<"program_journey_steps">,
  "id" | "step_label" | "description" | "sort_order"
>;

export type ProgramDetail = Tables<"programs"> & {
  family: ProgramFamily;
  disclaimerBody: string;
  modules: ProgramModule[];
  audiences: ProgramAudience[];
  journeySteps: ProgramJourneyStep[];
};

export async function getProgramFamilies(): Promise<ProgramFamily[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("program_families").select("*").order("sort_order", { ascending: true });

  if (error) {
    throw new DatabaseQueryError("Failed to load program families.", {
      table: "program_families",
      originalError: error,
    });
  }

  return data;
}

// International Licensing (USMLE/PLAB/MRCP/AMC) gets its own hub and
// pathway pages under /international-exams with a purpose-built layout —
// it does not belong in the generic "Seven Cards" grid this function feeds
// (components/home/program-grid.tsx, app/(public)/programs/page.tsx),
// whose copy and design assume exactly the original two families. Excluded
// by default rather than requiring every caller to remember to filter it
// out; a caller that genuinely wants every published program regardless of
// family can pass an empty array.
const DEFAULT_EXCLUDED_FAMILY_SLUGS = ["international-licensing"];

export async function getPublishedPrograms(
  excludeFamilySlugs: string[] = DEFAULT_EXCLUDED_FAMILY_SLUGS,
): Promise<ProgramSummary[]> {
  const supabase = createPublicClient();

  // No .eq("is_published", true) here: the anon_select_published_programs
  // RLS policy already enforces it server-side, so the filter can't be
  // forgotten or bypassed by a caller who forgets to add it.
  const { data, error } = await supabase
    .from("programs")
    .select(
      "id, slug, name, headline, summary, duration_label, hero_image_url, accent_token, sort_order, family_id, family:program_families(slug)",
    )
    .order("sort_order", { ascending: true });

  if (error) {
    throw new DatabaseQueryError("Failed to load published programs.", {
      table: "programs",
      originalError: error,
    });
  }

  return data
    .filter((row) => !excludeFamilySlugs.includes(row.family?.slug ?? ""))
    .map(({ family: _family, ...program }) => program);
}

// Powers /international-exams (its own hub + [slug] pages) — scoped to one
// family, unlike getPublishedPrograms() which deliberately excludes this
// same family from the generic "Seven Cards" grid. Two different pages
// wanting opposite halves of the same split, not a contradiction.
export async function getPublishedProgramsByFamilySlug(familySlug: string): Promise<ProgramSummary[]> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("programs")
    .select(
      "id, slug, name, headline, summary, duration_label, hero_image_url, accent_token, sort_order, family_id, family:program_families!inner(slug)",
    )
    .eq("family.slug", familySlug)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new DatabaseQueryError(`Failed to load published programs for family "${familySlug}".`, {
      table: "programs",
      originalError: error,
    });
  }

  return data.map(({ family: _family, ...program }) => program);
}

export async function getProgramSlugs(): Promise<{ slug: string }[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("programs").select("slug");

  if (error) {
    throw new DatabaseQueryError("Failed to load program slugs.", {
      table: "programs",
      originalError: error,
    });
  }

  return data;
}

// Mirrors exactly what the nested select below asks PostgREST for. Pinned
// explicitly via .select<Query, ResultOne>() rather than relied on for
// automatic inference, since deep multi-level embeds are the one case
// where that inference is least reliable across postgrest-js versions.
interface RawProgramDetail extends Tables<"programs"> {
  family: Tables<"program_families">;
  disclaimer: Pick<Tables<"compliance_disclaimers">, "key" | "body"> | null;
  modules: (Pick<Tables<"program_modules">, "id" | "title" | "description" | "icon_key" | "sort_order"> & {
    items: Pick<Tables<"program_module_items">, "id" | "label" | "sort_order">[];
  })[];
  audiences: Pick<Tables<"program_audiences">, "id" | "label" | "sort_order">[];
  journey_steps: Pick<Tables<"program_journey_steps">, "id" | "step_label" | "description" | "sort_order">[];
}

export async function getProgramBySlug(slug: string): Promise<ProgramDetail> {
  const supabase = createPublicClient();

  // One round trip: PostgREST resolves every relationship declared by the
  // foreign keys in supabase/migrations/, so a program's modules, items,
  // audiences, journey steps, and disclaimer body never turn into N+1
  // separate queries.
  const { data, error } = await supabase
    .from("programs")
    .select<string, RawProgramDetail>(
      `
      *,
      family:program_families(*),
      disclaimer:compliance_disclaimers(key, body),
      modules:program_modules(
        id, title, description, icon_key, sort_order,
        items:program_module_items(id, label, sort_order)
      ),
      audiences:program_audiences(id, label, sort_order),
      journey_steps:program_journey_steps(id, step_label, description, sort_order)
      `,
    )
    .eq("slug", slug)
    // referencedTable addresses the embed by its alias as written in the
    // select above (dot-path for nested embeds), not the underlying table name.
    .order("sort_order", { referencedTable: "modules", ascending: true })
    .order("sort_order", { referencedTable: "modules.items", ascending: true })
    .order("sort_order", { referencedTable: "audiences", ascending: true })
    .order("sort_order", { referencedTable: "journey_steps", ascending: true })
    .maybeSingle();

  if (error) {
    throw new DatabaseQueryError(`Failed to load program "${slug}".`, {
      table: "programs",
      originalError: error,
    });
  }

  if (!data) {
    throw new NotFoundError(`Program "${slug}" was not found or is not published.`);
  }

  if (!data.disclaimer) {
    // Structurally shouldn't happen — disclaimer_key is NOT NULL and FK'd
    // to compliance_disclaimers (see supabase/migrations) — but a program
    // must never render without its legal disclaimer, so a broken join is
    // treated as a hard failure rather than a silently missing field.
    throw new DatabaseQueryError(`Program "${slug}" has no resolvable disclaimer; refusing to return it without one.`, {
      table: "programs",
    });
  }

  const { disclaimer, journey_steps, ...program } = data;

  return {
    ...program,
    disclaimerBody: disclaimer.body,
    journeySteps: journey_steps,
  };
}

import { createPublicClient } from "../public";
import { DatabaseQueryError, NotFoundError } from "../errors";
import type { Tables } from "../database.types";

export type SupportServiceOffering = Pick<
  Tables<"support_service_offerings">,
  "id" | "title" | "description" | "is_free" | "sort_order"
>;

export type SupportServiceDetail = Tables<"support_services"> & {
  offerings: SupportServiceOffering[];
};

interface RawSupportServiceDetail extends Tables<"support_services"> {
  offerings: Pick<Tables<"support_service_offerings">, "id" | "title" | "description" | "is_free" | "sort_order">[];
}

export async function getSupportServiceBySlug(slug: string): Promise<SupportServiceDetail> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("support_services")
    .select<string, RawSupportServiceDetail>(
      `*, offerings:support_service_offerings(id, title, description, is_free, sort_order)`,
    )
    .eq("slug", slug)
    .order("sort_order", { referencedTable: "offerings", ascending: true })
    .maybeSingle();

  if (error) {
    throw new DatabaseQueryError(`Failed to load support service "${slug}".`, {
      table: "support_services",
      originalError: error,
    });
  }

  if (!data) {
    throw new NotFoundError(`Support service "${slug}" was not found or is not published.`);
  }

  return data;
}

export type CrisisResource = Pick<
  Tables<"crisis_resources">,
  "id" | "country" | "organisation" | "phone" | "hours" | "notes"
>;

/**
 * Server-rendered only — this must appear in the raw HTML source, never
 * behind a client-side fetch, an accordion, or a scroll reveal (PART 5's
 * explicit requirement: the emergency block is not optional UI, it's the
 * one thing on this page that must always be there).
 */
export async function getActiveCrisisResources(): Promise<CrisisResource[]> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("crisis_resources")
    .select("id, country, organisation, phone, hours, notes")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new DatabaseQueryError("Failed to load crisis resources.", {
      table: "crisis_resources",
      originalError: error,
    });
  }

  return data;
}

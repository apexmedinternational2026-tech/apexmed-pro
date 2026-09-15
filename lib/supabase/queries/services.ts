import { createPublicClient } from "../public";
import { DatabaseQueryError, NotFoundError } from "../errors";
import type { Tables } from "../database.types";

export type ServiceSummary = Pick<
  Tables<"services">,
  "id" | "slug" | "name" | "short_name" | "tagline" | "summary" | "icon_key" | "accent_token" | "sort_order"
>;

export interface ServiceItemSummary {
  id: string;
  slug: string;
  name: string;
  summary: string | null;
  icon_key: string | null;
  sort_order: number;
  /** Resolved final link — external_href as-is, or the item's own /services/[service]/[item] detail page. */
  href: string;
}

export type ServiceDetail = Tables<"services"> & {
  disclaimerBody: string | null;
  items: ServiceItemSummary[];
};

export async function getPublishedServices(): Promise<ServiceSummary[]> {
  const supabase = createPublicClient();

  // No .eq("is_published", true) — anon_select_published_services already
  // enforces it server-side (same reasoning as getPublishedPrograms()).
  const { data, error } = await supabase
    .from("services")
    .select("id, slug, name, short_name, tagline, summary, icon_key, accent_token, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new DatabaseQueryError("Failed to load published services.", { table: "services", originalError: error });
  }

  return data;
}

interface RawServiceDetail extends Tables<"services"> {
  disclaimer: Pick<Tables<"compliance_disclaimers">, "body"> | null;
  items: Pick<Tables<"service_items">, "id" | "slug" | "name" | "summary" | "icon_key" | "external_href" | "sort_order">[];
}

export async function getServiceBySlug(slug: string): Promise<ServiceDetail> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("services")
    .select<string, RawServiceDetail>(
      `
      *,
      disclaimer:compliance_disclaimers(body),
      items:service_items(id, slug, name, summary, icon_key, external_href, sort_order)
      `,
    )
    .eq("slug", slug)
    .order("sort_order", { referencedTable: "items", ascending: true })
    .maybeSingle();

  if (error) {
    throw new DatabaseQueryError(`Failed to load service "${slug}".`, { table: "services", originalError: error });
  }

  if (!data) {
    throw new NotFoundError(`Service "${slug}" was not found or is not published.`);
  }

  const { disclaimer, items, ...service } = data;

  return {
    ...service,
    disclaimerBody: disclaimer?.body ?? null,
    // service_items RLS already restricts this embed to published items of
    // a published parent — no is_published filter needed here, same as
    // every other nested-select query in this codebase.
    items: items.map((item) => ({
      ...item,
      href: item.external_href ?? `/services/${slug}/${item.slug}`,
    })),
  };
}

export async function getServiceSlugs(): Promise<{ slug: string }[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("services").select("slug");

  if (error) {
    throw new DatabaseQueryError("Failed to load service slugs.", { table: "services", originalError: error });
  }

  return data;
}

/** Only items without an external_href get their own detail route — an
 * external item's "detail page" is wherever external_href already points. */
export async function getServiceItemSlugs(): Promise<{ serviceSlug: string; itemSlug: string }[]> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("service_items")
    .select("slug, service:services!inner(slug)")
    .is("external_href", null);

  if (error) {
    throw new DatabaseQueryError("Failed to load service item slugs.", {
      table: "service_items",
      originalError: error,
    });
  }

  return data.map((row) => ({ serviceSlug: row.service.slug, itemSlug: row.slug }));
}

export interface ServiceItemDetail {
  id: string;
  slug: string;
  name: string;
  summary: string | null;
  /** Set only when this item links to a program — the detail page hands off
   * to getProgramBySlug(linkedProgramSlug) and reuses that rendering
   * entirely, rather than a third copy of program-detail markup. */
  linkedProgramSlug: string | null;
  service: {
    slug: string;
    name: string;
    accent_token: string;
    disclaimerBody: string | null;
  };
}

/**
 * Powers /services/[slug]/[item-slug] — resolves a sub-item plus enough of
 * its parent service (name, accent, disclaimer) to render standalone
 * content for an item with no linked program (e.g. "Medical Writing &
 * Publication", which has no Card of its own to defer to).
 */
export async function getServiceItemDetail(serviceSlug: string, itemSlug: string): Promise<ServiceItemDetail> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("service_items")
    .select(
      `
      id, slug, name, summary,
      program:programs(slug),
      service:services!inner(slug, name, accent_token, disclaimer:compliance_disclaimers(body))
      `,
    )
    .eq("slug", itemSlug)
    .eq("service.slug", serviceSlug)
    .maybeSingle();

  if (error) {
    throw new DatabaseQueryError(`Failed to load service item "${serviceSlug}/${itemSlug}".`, {
      table: "service_items",
      originalError: error,
    });
  }

  if (!data) {
    throw new NotFoundError(`Service item "${serviceSlug}/${itemSlug}" was not found or is not published.`);
  }

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    summary: data.summary,
    linkedProgramSlug: data.program?.slug ?? null,
    service: {
      slug: data.service.slug,
      name: data.service.name,
      accent_token: data.service.accent_token,
      disclaimerBody: data.service.disclaimer?.body ?? null,
    },
  };
}

import { createPublicClient } from "../public";
import { DatabaseQueryError, NotFoundError } from "../errors";
import type { Tables } from "../database.types";

export type InitiativeSectionItem = Pick<Tables<"initiative_section_items">, "id" | "label" | "sort_order">;

export type InitiativeSection = Pick<
  Tables<"initiative_sections">,
  "id" | "title" | "description" | "icon_key" | "sort_order"
> & {
  items: InitiativeSectionItem[];
};

export type InitiativeDetail = Tables<"initiatives"> & {
  sections: InitiativeSection[];
};

interface RawInitiativeDetail extends Tables<"initiatives"> {
  sections: (Pick<Tables<"initiative_sections">, "id" | "title" | "description" | "icon_key" | "sort_order"> & {
    items: Pick<Tables<"initiative_section_items">, "id" | "label" | "sort_order">[];
  })[];
}

export async function getInitiativeBySlug(slug: string): Promise<InitiativeDetail> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("initiatives")
    .select<string, RawInitiativeDetail>(
      `
      *,
      sections:initiative_sections(
        id, title, description, icon_key, sort_order,
        items:initiative_section_items(id, label, sort_order)
      )
      `,
    )
    .eq("slug", slug)
    .order("sort_order", { referencedTable: "sections", ascending: true })
    .order("sort_order", { referencedTable: "sections.items", ascending: true })
    .maybeSingle();

  if (error) {
    throw new DatabaseQueryError(`Failed to load initiative "${slug}".`, {
      table: "initiatives",
      originalError: error,
    });
  }

  if (!data) {
    throw new NotFoundError(`Initiative "${slug}" was not found or is not published.`);
  }

  return data;
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * The exact id-generation rule shared between the TOC sidebar (which
 * builds its link list from the raw MDX source, before compilation) and
 * the custom h2/h3 components in components/blog/mdx-components.tsx
 * (which slugify their own rendered children at render time). Using one
 * function in both places is what guarantees a TOC link's #hash actually
 * matches the heading it points to — anything more clever (a real
 * rehype-slug pipeline generating one set of ids and a hand-rolled TOC
 * extractor generating another) risks the two silently drifting apart.
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Reads TOC entries straight from the raw MDX text via a line-based regex
 * rather than from the compiled output — cheap, and correct for the plain
 * "## Heading" / "### Heading" lines editors actually write. It
 * deliberately doesn't try to parse headings written as JSX.
 */
export function extractToc(source: string): TocItem[] {
  const items: TocItem[] = [];

  for (const line of source.split("\n")) {
    const match = /^(#{2,3})\s+(.+)/.exec(line);
    if (!match) continue;

    const level = (match[1] ?? "").length as 2 | 3;
    const text = (match[2] ?? "").trim();
    items.push({ id: slugifyHeading(text), text, level });
  }

  return items;
}

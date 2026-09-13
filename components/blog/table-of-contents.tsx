import type { TocItem } from "@/lib/toc";
import { cn } from "@/lib/cn";

/**
 * Plain anchor links, no scroll-spy JS — matches this codebase's
 * progressive-enhancement default (see pagination.tsx), and the sticky
 * positioning alone gets most of the real usability benefit of a TOC.
 */
export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="sticky top-28 hidden max-h-[70vh] overflow-y-auto lg:block">
      <p className="text-caption font-semibold uppercase tracking-wide text-slate-500">On this page</p>
      <ul className="mt-3 flex flex-col gap-2 border-l border-navy-800/10 pl-4">
        {items.map((item) => (
          <li key={item.id} className={cn(item.level === 3 && "pl-3")}>
            <a href={`#${item.id}`} className="text-body-sm text-slate-500 transition-colors hover:text-navy-950">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

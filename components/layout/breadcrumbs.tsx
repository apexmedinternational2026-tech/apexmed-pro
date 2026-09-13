import Link from "next/link";
import { cn } from "@/lib/cn";
import { absoluteUrl } from "@/lib/site-url";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /**
   * "light" (default) assumes a white/paper-50 section. "dark" is for use
   * inside a colored/navy hero — e.g. a program page hero themed by its
   * accent_token — where the light-mode slate/ink colors would fail AA.
   */
  tone?: "light" | "dark";
}

/**
 * Renders the visible trail and its BreadcrumbList JSON-LD from the exact
 * same `items` array — there's no second, hand-maintained copy of the
 * trail for search engines that could drift from what's on screen.
 */
export function Breadcrumbs({ items, tone = "light" }: BreadcrumbsProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };

  const isDark = tone === "dark";

  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={cn(
          "flex flex-wrap items-center gap-1.5 text-body-sm",
          isDark ? "text-paper-50/65" : "text-slate-500",
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {index > 0 && (
                <span aria-hidden="true" className={isDark ? "text-paper-50/40" : "text-slate-500/50"}>
                  /
                </span>
              )}
              {isLast ? (
                <span aria-current="page" className={cn("font-medium", isDark ? "text-paper-50" : "text-ink-900")}>
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn("transition-colors", isDark ? "hover:text-paper-50" : "hover:text-ink-900")}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}

import Link from "next/link";
import { cn } from "@/lib/cn";
import { ArrowIcon } from "./icons";

export interface PaginationProps {
  page: number;
  totalPages: number;
  /** Route-relative path, e.g. "/admin/leads". */
  basePath: string;
  /** The current URL's other query params (filters, search) — preserved on every page link, only `page` changes. */
  searchParams: Record<string, string | undefined>;
}

function pageHref(basePath: string, searchParams: Record<string, string | undefined>, page: number): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value) params.set(key, value);
  }
  params.set("page", String(page));
  return `${basePath}?${params.toString()}`;
}

/**
 * Plain <Link>-based pager — works with JavaScript disabled and needs no
 * client component, since a page change is just a normal navigation to a
 * new URL that the Server Component page re-reads via `searchParams`.
 */
export function Pagination({ page, totalPages, basePath, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-4 pt-2">
      <p className="text-body-sm text-slate-500">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <PaginationLink
          href={canPrev ? pageHref(basePath, searchParams, page - 1) : undefined}
          label="Previous page"
          direction="prev"
        />
        <PaginationLink
          href={canNext ? pageHref(basePath, searchParams, page + 1) : undefined}
          label="Next page"
          direction="next"
        />
      </div>
    </nav>
  );
}

function PaginationLink({
  href,
  label,
  direction,
}: {
  href: string | undefined;
  label: string;
  direction: "prev" | "next";
}) {
  const iconClassName = cn("h-4 w-4", direction === "prev" && "rotate-180");

  if (!href) {
    return (
      <span
        aria-disabled="true"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-navy-800/15 text-slate-500/40"
      >
        <ArrowIcon className={iconClassName} />
        <span className="sr-only">{label}</span>
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-navy-800/25 text-ink-900 transition-colors hover:border-navy-950 hover:bg-navy-950/5"
    >
      <ArrowIcon className={iconClassName} />
    </Link>
  );
}

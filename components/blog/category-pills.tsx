import Link from "next/link";
import { cn } from "@/lib/cn";

export interface CategoryPillsProps {
  categories: { slug: string; name: string }[];
  activeSlug?: string;
}

export function CategoryPills({ categories, activeSlug }: CategoryPillsProps) {
  return (
    <nav aria-label="Filter by category" className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        className={cn(
          "rounded-full border px-4 py-1.5 text-body-sm font-medium transition-colors",
          !activeSlug
            ? "border-navy-950 bg-navy-950 text-paper-50"
            : "border-navy-800/25 text-ink-900 hover:border-navy-950",
        )}
      >
        All posts
      </Link>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/blog/category/${category.slug}`}
          className={cn(
            "rounded-full border px-4 py-1.5 text-body-sm font-medium transition-colors",
            activeSlug === category.slug
              ? "border-navy-950 bg-navy-950 text-paper-50"
              : "border-navy-800/25 text-ink-900 hover:border-navy-950",
          )}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}

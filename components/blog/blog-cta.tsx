import Link from "next/link";
import { Button } from "@/components/ui/button";
import { resolveBlogCta } from "@/lib/blog-cta";

/**
 * Rendered once, automatically, at the end of every post — this is what
 * guarantees "a trailing CTA to the relevant program" regardless of
 * whether the author also embeds a mid-article <CtaBlock> (cta-block.tsx)
 * inside the MDX body itself.
 */
export function BlogCta({ tagSlugs, categorySlug }: { tagSlugs: string[]; categorySlug: string | null }) {
  const cta = resolveBlogCta(tagSlugs, categorySlug);

  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl bg-navy-950 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-display text-display-sm text-paper-50">{cta.title}</p>
        <p className="mt-1 max-w-lg text-body-sm text-paper-50/75">{cta.description}</p>
      </div>
      <Button asChild variant="gold" size="md" className="w-full sm:w-auto">
        <Link href={cta.href}>{cta.label}</Link>
      </Button>
    </div>
  );
}

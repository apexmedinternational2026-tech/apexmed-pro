import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * MDX shortcode: <CtaBlock title="..." description="..." href="/contact" label="..." /> —
 * for a mid-article call to action. Distinct from <BlogCta> (blog-cta.tsx),
 * which the post page template renders once automatically at the end of
 * every post regardless of whether the author embeds one of these too.
 */
export function CtaBlock({
  title,
  description,
  href,
  label,
}: {
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <div className="not-prose flex flex-col items-start gap-4 rounded-2xl bg-navy-950 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-display text-display-sm text-paper-50">{title}</p>
        <p className="mt-1 text-body-sm text-paper-50/75">{description}</p>
      </div>
      <Button asChild variant="gold" size="md" className="w-full sm:w-auto">
        <Link href={href}>{label}</Link>
      </Button>
    </div>
  );
}

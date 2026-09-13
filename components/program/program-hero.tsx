import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/layout/breadcrumbs";
import { PROFILE_ASSESSMENT_HREF } from "@/lib/navigation";

export interface ProgramHeroProps {
  name: string;
  headline: string;
  summary: string;
  durationLabel: string | null;
  breadcrumbItems: BreadcrumbItem[];
}

/**
 * Background/text colors come entirely from the --accent-surface/
 * --accent-foreground custom properties set by the page's outer
 * accentStyle() wrapper — this component doesn't need to know which
 * AccentToken it is, only that those two vars exist and are AA-safe
 * together (verified in lib/accent.test.ts).
 */
export function ProgramHero({ name, headline, summary, durationLabel, breadcrumbItems }: ProgramHeroProps) {
  return (
    <section
      className="gold-foil-noise relative overflow-hidden pb-16 pt-32"
      style={{ backgroundColor: "var(--accent-surface)", color: "var(--accent-foreground)" }}
    >
      <Container className="relative z-10 flex flex-col gap-6">
        <Breadcrumbs items={breadcrumbItems} tone="dark" />
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-current/30 px-3 py-1 text-caption font-semibold uppercase tracking-wide">
            {name}
          </span>
          <h1 className="mt-4 font-display text-display-xl">{headline}</h1>
          <p className="mt-4 text-body-lg" style={{ opacity: 0.85 }}>
            {summary}
          </p>
          {durationLabel && (
            <p className="mt-3 text-body-sm font-medium uppercase tracking-wide" style={{ opacity: 0.7 }}>
              {durationLabel}
            </p>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild variant="gold" size="lg">
              <Link href={PROFILE_ASSESSMENT_HREF}>Book a Free Profile Assessment</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

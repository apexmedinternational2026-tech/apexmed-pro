import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProgramBySlug, getProgramSlugs } from "@/lib/supabase/queries/programs";
import { NotFoundError } from "@/lib/supabase/errors";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ProgramHero } from "@/components/program/program-hero";
import { ModuleList } from "@/components/program/module-list";
import { AudienceGrid } from "@/components/program/audience-grid";
import { JourneyPath } from "@/components/program/journey-path";
import { ComplianceNote } from "@/components/program/compliance-note";
import { CourseJsonLd } from "@/components/program/course-jsonld";
import { accentStyle, resolveAccentToken } from "@/lib/accent";
import { absoluteUrl } from "@/lib/site-url";

// Program content is admin-curated, not real-time — ISR keeps every
// program page static/fast (CLAUDE.md rule 1) while still picking up
// content edits within the hour, without a full redeploy.
export const revalidate = 3600;

interface ProgramPageParams {
  slug: string;
}

export async function generateStaticParams(): Promise<ProgramPageParams[]> {
  const slugs = await getProgramSlugs();
  return slugs.map((row) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }: { params: Promise<ProgramPageParams> }): Promise<Metadata> {
  const { slug } = await params;

  let program;
  try {
    program = await getProgramBySlug(slug);
  } catch {
    // Let the page component itself decide between notFound() and
    // rethrowing — generateMetadata just needs to degrade quietly here.
    return {};
  }

  const title = program.seo_title ?? program.name;
  const description = program.seo_description ?? program.summary;
  const canonicalPath = program.canonical_path ?? `/programs/${program.slug}`;
  const ogImage = program.seo_og_image_url ?? program.hero_image_url ?? undefined;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(canonicalPath),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonicalPath),
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function ProgramPage({ params }: { params: Promise<ProgramPageParams> }) {
  const { slug } = await params;

  let program;
  try {
    program = await getProgramBySlug(slug);
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  const accent = resolveAccentToken(program.accent_token);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Programs", href: "/programs" },
    { label: program.name, href: `/programs/${program.slug}` },
  ];

  return (
    <div style={accentStyle(accent)}>
      <CourseJsonLd name={program.name} description={program.summary} slug={program.slug} />

      <ProgramHero
        name={program.name}
        headline={program.headline}
        summary={program.summary}
        durationLabel={program.duration_label}
        breadcrumbItems={breadcrumbItems}
      />

      <Section theme="light" padding="lg">
        <Container className="flex flex-col gap-4">
          <p className="text-eyebrow uppercase" style={{ color: "var(--accent-text)" }}>
            What&apos;s Included
          </p>
          <h2 className="font-display text-display-lg text-ink-900">Modules</h2>
        </Container>
        <Container className="mt-10">
          <ModuleList modules={program.modules} accent={accent} />
        </Container>
      </Section>

      <Section theme="white" padding="md">
        <Container className="flex flex-col gap-4">
          <p className="text-eyebrow uppercase" style={{ color: "var(--accent-text)" }}>
            Who This Is For
          </p>
          <h2 className="font-display text-display-md text-ink-900">Is this Card right for you?</h2>
        </Container>
        <Container className="mt-8">
          <AudienceGrid audiences={program.audiences} />
        </Container>
      </Section>

      <Section theme="light" padding="lg">
        <Container className="flex flex-col gap-4">
          <p className="text-eyebrow uppercase" style={{ color: "var(--accent-text)" }}>
            Your Journey
          </p>
          <h2 className="font-display text-display-md text-ink-900">From enrollment to outcome.</h2>
        </Container>
        <Container className="mt-10">
          <JourneyPath steps={program.journeySteps} />
        </Container>
      </Section>

      <Section theme="white" padding="sm">
        <Container>
          <ComplianceNote body={program.disclaimerBody} />
        </Container>
      </Section>
    </div>
  );
}

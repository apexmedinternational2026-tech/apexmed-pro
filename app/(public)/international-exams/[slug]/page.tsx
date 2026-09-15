import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProgramBySlug, getPublishedProgramsByFamilySlug } from "@/lib/supabase/queries/programs";
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

const FAMILY_SLUG = "international-licensing";

// Same ISR window as every other content-driven public page (CLAUDE.md rule 1).
export const revalidate = 3600;

interface PathwayPageParams {
  slug: string;
}

export async function generateStaticParams(): Promise<PathwayPageParams[]> {
  const programs = await getPublishedProgramsByFamilySlug(FAMILY_SLUG);
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({ params }: { params: Promise<PathwayPageParams> }): Promise<Metadata> {
  const { slug } = await params;

  let program;
  try {
    program = await getProgramBySlug(slug);
  } catch {
    return {};
  }

  const title = program.seo_title ?? `${program.name} — ApexMed International`;
  const description = program.seo_description ?? program.summary;
  const canonicalPath = program.canonical_path ?? `/international-exams/${program.slug}`;
  const ogImage = program.seo_og_image_url ?? program.hero_image_url ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(canonicalPath) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonicalPath),
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function InternationalExamPathwayPage({ params }: { params: Promise<PathwayPageParams> }) {
  const { slug } = await params;

  let program;
  try {
    program = await getProgramBySlug(slug);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  // A program outside this family shouldn't be reachable through this
  // route just because getProgramBySlug() (deliberately family-agnostic,
  // shared with /programs/[slug]) happened to resolve the slug — this is
  // the one guard specific to being *this* route.
  if (program.family.slug !== FAMILY_SLUG) notFound();

  const accent = resolveAccentToken(program.accent_token);
  const canonicalPath = program.canonical_path ?? `/international-exams/${program.slug}`;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "International Exams", href: "/international-exams" },
    { label: program.name, href: canonicalPath },
  ];

  return (
    <div style={accentStyle(accent)}>
      <CourseJsonLd name={program.name} description={program.summary} slug={program.slug} path={canonicalPath} />

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

      {program.audiences.length > 0 && (
        <Section theme="white" padding="md">
          <Container className="flex flex-col gap-4">
            <p className="text-eyebrow uppercase" style={{ color: "var(--accent-text)" }}>
              Who This Is For
            </p>
            <h2 className="font-display text-display-md text-ink-900">Is this pathway right for you?</h2>
          </Container>
          <Container className="mt-8">
            <AudienceGrid audiences={program.audiences} />
          </Container>
        </Section>
      )}

      {program.journeySteps.length > 0 && (
        <Section theme="light" padding="lg">
          <Container className="flex flex-col gap-4">
            <p className="text-eyebrow uppercase" style={{ color: "var(--accent-text)" }}>
              Your Journey
            </p>
            <h2 className="font-display text-display-md text-ink-900">From preparation to registration.</h2>
          </Container>
          <Container className="mt-10">
            <JourneyPath steps={program.journeySteps} />
          </Container>
        </Section>
      )}

      <Section theme="white" padding="sm">
        <Container>
          <ComplianceNote body={program.disclaimerBody} />
        </Container>
      </Section>
    </div>
  );
}

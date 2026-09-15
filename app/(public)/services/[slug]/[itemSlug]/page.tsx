import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceItemDetail, getServiceItemSlugs } from "@/lib/supabase/queries/services";
import { getProgramBySlug } from "@/lib/supabase/queries/programs";
import { NotFoundError } from "@/lib/supabase/errors";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProgramHero } from "@/components/program/program-hero";
import { ModuleList } from "@/components/program/module-list";
import { AudienceGrid } from "@/components/program/audience-grid";
import { JourneyPath } from "@/components/program/journey-path";
import { ComplianceNote } from "@/components/program/compliance-note";
import { CourseJsonLd } from "@/components/program/course-jsonld";
import { WhatsAppContactButton } from "@/components/ui/whatsapp-contact-button";
import { accentStyle, resolveAccentToken } from "@/lib/accent";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

interface ItemPageParams {
  slug: string;
  itemSlug: string;
}

export async function generateStaticParams(): Promise<ItemPageParams[]> {
  const items = await getServiceItemSlugs();
  return items.map(({ serviceSlug, itemSlug }) => ({ slug: serviceSlug, itemSlug }));
}

export async function generateMetadata({ params }: { params: Promise<ItemPageParams> }): Promise<Metadata> {
  const { slug, itemSlug } = await params;

  let item;
  try {
    item = await getServiceItemDetail(slug, itemSlug);
  } catch {
    return {};
  }

  const canonicalPath = `/services/${slug}/${itemSlug}`;
  return {
    title: `${item.name} — ${item.service.name} — ApexMed International`,
    description: item.summary ?? undefined,
    alternates: { canonical: absoluteUrl(canonicalPath) },
  };
}

export default async function ServiceItemPage({ params }: { params: Promise<ItemPageParams> }) {
  const { slug, itemSlug } = await params;

  let item;
  try {
    item = await getServiceItemDetail(slug, itemSlug);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: item.service.name, href: `/services/${slug}` },
    { label: item.name, href: `/services/${slug}/${itemSlug}` },
  ];

  // Linked to a program (e.g. Research Services → Original Research
  // Training → the ApexMed Research Card): reuse the exact same
  // module/audience/journey rendering as /programs/[slug] and
  // /international-exams/[slug] rather than a third copy of it.
  if (item.linkedProgramSlug) {
    const program = await getProgramBySlug(item.linkedProgramSlug);
    const accent = resolveAccentToken(program.accent_token);
    const canonicalPath = `/services/${slug}/${itemSlug}`;

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
              <h2 className="font-display text-display-md text-ink-900">Is this right for you?</h2>
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
              <h2 className="font-display text-display-md text-ink-900">From enrollment to outcome.</h2>
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

  // Stands alone (no linked program/course/study-field yet) — render the
  // item's own text, themed by its parent service's accent.
  const accent = resolveAccentToken(item.service.accent_token);

  return (
    <div style={accentStyle(accent)}>
      <section
        className="gold-foil-noise relative overflow-hidden pb-16 pt-32"
        style={{ backgroundColor: "var(--accent-surface)", color: "var(--accent-foreground)" }}
      >
        <Container className="relative z-10 flex flex-col gap-6">
          <Breadcrumbs items={breadcrumbItems} tone="dark" />
          <div className="max-w-2xl">
            <h1 className="font-display text-display-xl">{item.name}</h1>
            {item.summary && (
              <p className="mt-4 text-body-lg" style={{ opacity: 0.85 }}>
                {item.summary}
              </p>
            )}
            <div className="mt-7 flex flex-wrap gap-3">
              <WhatsAppContactButton />
            </div>
          </div>
        </Container>
      </section>

      {item.service.disclaimerBody && (
        <Section theme="white" padding="sm">
          <Container>
            <ComplianceNote body={item.service.disclaimerBody} />
          </Container>
        </Section>
      )}
    </div>
  );
}

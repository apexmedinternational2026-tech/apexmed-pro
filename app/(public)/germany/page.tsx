import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { ProfileAssessmentButton } from "@/components/ui/profile-assessment-button";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { GermanyPathway } from "@/components/germany/pathway";
import { ComplianceNote } from "@/components/program/compliance-note";
import { GERMANY_PATHWAY } from "@/lib/germany-pathway";
import { getComplianceDisclaimer } from "@/lib/supabase/queries/compliance-disclaimers";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "The German Medical Licensing Pathway — ApexMed International",
  description:
    "From German A1 to Facharzt: the complete medical licensing pathway to Germany, stage by stage — language training, FSP, KP, Approbation, and specialist training.",
  alternates: { canonical: absoluteUrl("/germany") },
};

const BREADCRUMB_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Germany", href: "/germany" },
];

export default async function GermanyHubPage() {
  const disclaimer = await getComplianceDisclaimer("germany_licensing");

  const pathwayJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: GERMANY_PATHWAY.map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.label,
      ...(step.href ? { url: absoluteUrl(step.href) } : {}),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pathwayJsonLd) }} />

      <Section theme="navy" padding="lg" noise className="pt-32">
        <Container className="flex flex-col gap-4">
          <Breadcrumbs items={BREADCRUMB_ITEMS} tone="dark" />
          <p className="text-eyebrow uppercase text-gold-400">Germany Pathway</p>
          <h1 className="max-w-2xl font-display text-display-xl text-paper-50">
            From German A1 to Facharzt — one connected pathway.
          </h1>
          <p className="max-w-xl text-body-lg text-paper-50/80">
            Every stage of becoming a practicing doctor in Germany, in order — with mentor-led language training, exam
            preparation, and licensing guidance at each step.
          </p>
        </Container>
      </Section>

      <Section theme="navy" padding="lg">
        <Container className="overflow-x-auto pb-4">
          <GermanyPathway steps={GERMANY_PATHWAY} />
          <p className="mt-6 max-w-2xl text-caption text-paper-50/50">
            Actual duration varies with starting level, study schedule, course intensity and progress.
          </p>
        </Container>
      </Section>

      <Section theme="light" padding="md">
        <Container className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h2 className="font-display text-display-sm text-ink-900">Language &amp; Research</h2>
            <p className="mt-2 text-body-sm text-slate-500">
              A1 through B2 and Medical German are covered by the Blue, Green, and Gold Cards, each paired with research
              mentorship.
            </p>
            <Link
              href="/programs?family=german-dream"
              className="mt-3 inline-block text-body-sm font-medium text-navy-950 hover:underline"
            >
              Explore German Dream Cards →
            </Link>
          </div>
          <div>
            <h2 className="font-display text-display-sm text-ink-900">FSP, KP &amp; Approbation</h2>
            <p className="mt-2 text-body-sm text-slate-500">
              Structured exam preparation and document guidance for the three stages that stand between language fluency
              and a full medical license.
            </p>
            <Link
              href="/germany/fsp"
              className="mt-3 inline-block text-body-sm font-medium text-navy-950 hover:underline"
            >
              Start with FSP Preparation →
            </Link>
          </div>
          <div>
            <h2 className="font-display text-display-sm text-ink-900">Facharzt</h2>
            <p className="mt-2 text-body-sm text-slate-500">
              Guidance on choosing a specialty and navigating specialist training once you&apos;re practicing in
              Germany.
            </p>
            <Link
              href="/germany/facharzt"
              className="mt-3 inline-block text-body-sm font-medium text-navy-950 hover:underline"
            >
              Learn about Facharzt →
            </Link>
          </div>
        </Container>
      </Section>

      <Section theme="white" padding="sm">
        <Container className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-display-md text-ink-900">Not sure where to start?</h2>
            <p className="mt-1 text-body-md text-slate-500">
              A free profile assessment maps your current German level to the right stage of this pathway.
            </p>
          </div>
          <ProfileAssessmentButton />
        </Container>
      </Section>

      <Section theme="light" padding="sm">
        <Container>
          <ComplianceNote body={disclaimer} />
        </Container>
      </Section>
    </>
  );
}

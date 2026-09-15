import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedProgramsByFamilySlug } from "@/lib/supabase/queries/programs";
import { getComplianceDisclaimer } from "@/lib/supabase/queries/compliance-disclaimers";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplianceNote } from "@/components/program/compliance-note";
import { absoluteUrl } from "@/lib/site-url";

const FAMILY_SLUG = "international-licensing";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "International Licensing & Exams — USMLE, PLAB, MRCP, AMC — ApexMed International",
  description:
    "Global medical licensing and international career mentorship for USMLE, PLAB, MRCP and AMC — structured, one-to-one guidance from mentors who have been through each pathway.",
  alternates: { canonical: absoluteUrl("/international-exams") },
};

const BREADCRUMB_ITEMS = [
  { label: "Home", href: "/" },
  { label: "International Exams", href: "/international-exams" },
];

// Country/stage context the brief asks the hub to show per pathway — not
// modeled as its own database column (it's presentation copy specific to
// this one hub layout, not data the [slug] pages or anything else needs),
// so it's kept here next to the one place it's used, keyed by program slug.
const PATHWAY_CONTEXT: Record<string, { country: string; stages: string }> = {
  usmle: { country: "USA", stages: "Step 1 · Step 2 CK · Step 3" },
  plab: { country: "UK", stages: "PLAB 1 · PLAB 2 · GMC Registration · NHS Career" },
  mrcp: { country: "UK", stages: "Part 1 · Part 2 Written · PACES" },
  amc: { country: "Australia", stages: "CAT MCQ · Clinical/Practical · AHPRA Registration" },
};

const GLOBAL_PATHWAYS = [
  { label: "USA", href: "/international-exams/usmle" },
  { label: "UK (PLAB)", href: "/international-exams/plab" },
  { label: "UK (MRCP)", href: "/international-exams/mrcp" },
  { label: "Australia", href: "/international-exams/amc" },
  { label: "Germany", href: "/germany" },
];

export default async function InternationalExamsHubPage() {
  const [programs, disclaimer] = await Promise.all([
    getPublishedProgramsByFamilySlug(FAMILY_SLUG),
    getComplianceDisclaimer("exam_licensing"),
  ]);

  return (
    <>
      <Section theme="navy" padding="lg" noise className="pt-32">
        <Container className="flex flex-col gap-4">
          <Breadcrumbs items={BREADCRUMB_ITEMS} tone="dark" />
          <p className="text-eyebrow uppercase text-gold-400">International Licensing & Exams</p>
          <h1 className="max-w-2xl font-display text-display-xl text-paper-50">
            Global Medical Licensing & International Career Mentorship
          </h1>
          <p className="max-w-xl text-body-lg text-paper-50/80">USMLE · PLAB · MRCP · AMC</p>
        </Container>
      </Section>

      <Section theme="light" padding="lg">
        <Container>
          {programs.length === 0 ? (
            <p className="text-body-md text-slate-500">No pathways published yet — check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {programs.map((program) => {
                const context = PATHWAY_CONTEXT[program.slug];
                return (
                  <Card key={program.id} accent="licensing" className="flex flex-col">
                    <CardHeader>
                      {context && (
                        <p className="text-caption font-semibold uppercase tracking-wide text-[var(--accent-text)]">
                          {context.country}
                        </p>
                      )}
                      <CardTitle>{program.name}</CardTitle>
                      {context && <CardDescription>{context.stages}</CardDescription>}
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-body-sm text-slate-500">{program.summary}</p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href={`/international-exams/${program.slug}`}
                        className="text-body-sm font-medium text-[var(--accent-text)] hover:underline"
                      >
                        View pathway →
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </Container>
      </Section>

      <Section theme="white" padding="md">
        <Container className="flex flex-col gap-6">
          <div>
            <p className="text-eyebrow uppercase text-slate-500">Global Pathways</p>
            <h2 className="mt-2 font-display text-display-md text-ink-900">
              Every destination ApexMed covers, in one place.
            </h2>
          </div>
          <ul className="flex flex-wrap gap-3">
            {GLOBAL_PATHWAYS.map((pathway) => (
              <li key={pathway.label}>
                <Link
                  href={pathway.href}
                  className="inline-flex items-center rounded-full border border-navy-800/15 bg-paper-50 px-4 py-2 text-body-sm font-medium text-ink-900 transition-colors hover:border-navy-800/30 hover:bg-white"
                >
                  {pathway.label}
                </Link>
              </li>
            ))}
          </ul>
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

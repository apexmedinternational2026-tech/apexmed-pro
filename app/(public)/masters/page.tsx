import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { ProfileAssessmentButton } from "@/components/ui/profile-assessment-button";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ComplianceNote } from "@/components/program/compliance-note";
import { MastersJourney } from "@/components/masters/journey";
import { getComplianceDisclaimer } from "@/lib/supabase/queries/compliance-disclaimers";
import {
  MASTERS_JOURNEY,
  WHY_GERMANY_POINTS,
  ELIGIBILITY_POINTS,
  LANGUAGE_REQUIREMENTS,
  REQUIRED_DOCUMENTS,
  SCHOLARSHIP_GUIDANCE,
  WELL_KNOWN_UNIVERSITIES,
  VISA_PREDEPARTURE_POINTS,
  STUDENT_WORK_POINTS,
  RESEARCH_ADVANTAGE_POINTS,
} from "@/lib/masters-content";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "German Master's Admissions — ApexMed International",
  description:
    "The complete path to a German Master's degree: profile assessment, university selection, application preparation, visa, and pre-departure support for doctors and medical students.",
  alternates: { canonical: absoluteUrl("/masters") },
};

const BREADCRUMB_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Master's Admissions", href: "/masters" },
];

export default async function MastersHubPage() {
  const disclaimer = await getComplianceDisclaimer("admissions");

  return (
    <>
      <Section theme="navy" padding="lg" noise className="pt-32">
        <Container className="flex flex-col gap-4">
          <Breadcrumbs items={BREADCRUMB_ITEMS} tone="dark" />
          <p className="text-eyebrow uppercase text-gold-400">Master&apos;s Admissions</p>
          <h1 className="max-w-2xl font-display text-display-xl text-paper-50">
            Your German Master&apos;s degree, one stage at a time.
          </h1>
          <p className="max-w-xl text-body-lg text-paper-50/80">
            From profile assessment to arrival in Germany — structured guidance through every stage of the application,
            admission, and visa process.
          </p>
        </Container>
      </Section>

      <Section theme="light" padding="lg">
        <Container className="flex flex-col gap-4">
          <p className="text-eyebrow uppercase text-gold-500">The Journey</p>
          <h2 className="font-display text-display-lg text-ink-900">Eight stages, start to finish.</h2>
        </Container>
        <Container className="mt-10">
          <MastersJourney stages={MASTERS_JOURNEY} />
        </Container>
      </Section>

      <Section theme="white" padding="lg">
        <Container className="flex flex-col gap-8">
          <div>
            <p className="text-eyebrow uppercase text-gold-500">Why Germany</p>
            <h2 className="mt-2 font-display text-display-md text-ink-900">A strong case for studying here.</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {WHY_GERMANY_POINTS.map((point) => (
              <div key={point.title} className="rounded-xl border border-navy-800/10 bg-paper-50 p-5">
                <h3 className="font-display text-display-sm text-ink-900">{point.title}</h3>
                <p className="mt-1.5 text-body-sm text-slate-500">{point.description}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-body-sm font-medium text-ink-900">
              Well-known universities include {WELL_KNOWN_UNIVERSITIES.join(", ")}.
            </p>
            <p className="mt-1 text-caption text-slate-500">Program availability and requirements vary.</p>
          </div>
          <ComplianceNote body={disclaimer} />
        </Container>
      </Section>

      <Section theme="light" padding="md">
        <Container className="flex flex-col gap-6">
          <div>
            <p className="text-eyebrow uppercase text-gold-500">Eligibility</p>
            <h2 className="mt-2 font-display text-display-md text-ink-900">Do you qualify?</h2>
          </div>
          <ul className="flex flex-col gap-3">
            {ELIGIBILITY_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-body-md text-ink-900">
                <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-navy-950" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <ComplianceNote body={disclaimer} />
        </Container>
      </Section>

      <Section theme="white" padding="md">
        <Container className="flex flex-col gap-6">
          <div>
            <p className="text-eyebrow uppercase text-gold-500">Language Requirements</p>
            <h2 className="mt-2 font-display text-display-md text-ink-900">
              What level of German or English do you need?
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left">
              <thead>
                <tr className="border-b border-navy-800/15">
                  <th
                    scope="col"
                    className="py-3 pr-4 text-caption font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Program Type
                  </th>
                  <th scope="col" className="py-3 text-caption font-semibold uppercase tracking-wide text-slate-500">
                    Typical Requirement
                  </th>
                </tr>
              </thead>
              <tbody>
                {LANGUAGE_REQUIREMENTS.map((row) => (
                  <tr key={row.program} className="border-b border-navy-800/10">
                    <td className="py-3 pr-4 text-body-sm font-medium text-ink-900">{row.program}</td>
                    <td className="py-3 text-body-sm text-slate-500">{row.requirement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ComplianceNote body={disclaimer} />
        </Container>
      </Section>

      <Section theme="light" padding="md">
        <Container className="flex flex-col gap-6">
          <div>
            <p className="text-eyebrow uppercase text-gold-500">Required Documents</p>
            <h2 className="mt-2 font-display text-display-md text-ink-900">What you&apos;ll need to prepare.</h2>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {REQUIRED_DOCUMENTS.map((doc) => (
              <li key={doc} className="flex items-start gap-3 text-body-md text-ink-900">
                <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-navy-950" aria-hidden="true" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
          <ComplianceNote body={disclaimer} />
        </Container>
      </Section>

      <Section theme="white" padding="md">
        <Container className="flex flex-col gap-6">
          <div>
            <p className="text-eyebrow uppercase text-gold-500">Scholarship Guidance</p>
            <h2 className="mt-2 font-display text-display-md text-ink-900">Funding your degree.</h2>
          </div>
          <ul className="flex flex-col gap-3">
            {SCHOLARSHIP_GUIDANCE.map((point) => (
              <li key={point} className="flex items-start gap-3 text-body-md text-ink-900">
                <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-navy-950" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <ComplianceNote body={disclaimer} />
        </Container>
      </Section>

      <Section theme="white" padding="md">
        <Container className="flex flex-col gap-6">
          <div>
            <p className="text-eyebrow uppercase text-gold-500">Visa &amp; Pre-Departure Guidance</p>
            <h2 className="mt-2 font-display text-display-md text-ink-900">Getting from admission to arrival.</h2>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {VISA_PREDEPARTURE_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-body-md text-ink-900">
                <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-navy-950" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section theme="light" padding="md">
        <Container className="flex flex-col gap-6">
          <div>
            <p className="text-eyebrow uppercase text-gold-500">Student Work &amp; Career Orientation</p>
            <h2 className="mt-2 font-display text-display-md text-ink-900">Working alongside your studies.</h2>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {STUDENT_WORK_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-body-md text-ink-900">
                <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-navy-950" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="text-caption text-slate-500">
            Rules, working limits, taxes, income and availability depend on current German regulations and
            individual circumstances.
          </p>
        </Container>
      </Section>

      <Section theme="white" padding="md">
        <Container className="flex flex-col gap-6">
          <div>
            <p className="text-eyebrow uppercase text-gold-500">Research Advantage</p>
            <h2 className="mt-2 font-display text-display-md text-ink-900">
              A research profile strengthens a Master&apos;s application.
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {RESEARCH_ADVANTAGE_POINTS.map((point) => (
              <span key={point} className="rounded-full bg-navy-950/5 px-3 py-1.5 text-body-sm text-ink-900">
                {point}
              </span>
            ))}
          </div>
          <Link
            href="/research"
            className="w-fit font-medium text-navy-900 underline decoration-navy-900/30 underline-offset-2 hover:decoration-navy-900"
          >
            Explore Research Programs →
          </Link>
        </Container>
      </Section>

      <Section theme="light" padding="sm">
        <Container className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-display-md text-ink-900">Ready to see your options?</h2>
            <p className="mt-1 text-body-md text-slate-500">Start with a free profile assessment — no obligation.</p>
          </div>
          <Button asChild variant="gold" size="lg">
            <Link href={PROFILE_ASSESSMENT_HREF}>Book a Free Profile Assessment</Link>
          </Button>
        </Container>
      </Section>
    </>
  );
}

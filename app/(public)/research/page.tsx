import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { ComplianceNote } from "@/components/program/compliance-note";
import { getComplianceDisclaimer } from "@/lib/supabase/queries/compliance-disclaimers";
import { RESEARCH_COURSES } from "@/lib/research-content";
import { absoluteUrl } from "@/lib/site-url";
import { PROFILE_ASSESSMENT_HREF } from "@/lib/navigation";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Research & Academic Programs — ApexMed International",
  description:
    "Practical, project-based research training for medical students, doctors, trainees and healthcare professionals — from fundamentals to manuscript submission.",
  alternates: { canonical: absoluteUrl("/research") },
};

const BREADCRUMB_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Research", href: "/research" },
];

export default async function ResearchProgramsPage() {
  const disclaimer = await getComplianceDisclaimer("publication");

  return (
    <>
      <Section theme="navy" padding="lg" noise className="pt-32">
        <Container className="flex flex-col gap-4">
          <Breadcrumbs items={BREADCRUMB_ITEMS} tone="dark" />
          <p className="text-eyebrow uppercase text-gold-400">Research & Academic Programs</p>
          <h1 className="max-w-2xl font-display text-display-xl text-paper-50">
            Practical, project-based research training.
          </h1>
          <p className="max-w-xl text-body-lg text-paper-50/80">
            For medical students, doctors, trainees and healthcare professionals — from fundamentals to manuscript
            submission.
          </p>
        </Container>
      </Section>

      <Section theme="light" padding="lg">
        <Container className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {RESEARCH_COURSES.map((course) => (
              <div key={course.title} className="flex flex-col gap-3 rounded-2xl border border-navy-800/10 bg-white p-6">
                <div>
                  <h2 className="font-display text-display-sm text-ink-900">{course.title}</h2>
                  <p className="mt-1 text-body-sm font-medium text-gold-500">{course.duration}</p>
                </div>
                <ul className="flex flex-wrap gap-1.5">
                  {course.topics.map((topic) => (
                    <li
                      key={topic}
                      className="rounded-full bg-navy-950/5 px-2.5 py-1 text-caption text-slate-500"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col items-start gap-4 rounded-2xl border border-navy-800/15 bg-paper-50 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-display-sm text-ink-900">
                Want this training bundled into a structured Card?
              </h2>
              <p className="mt-1 text-body-sm text-slate-500">
                The ApexMed Research Card, Meta-Analysis Card, and CDC Specialist Card package this exact training
                with mentorship, a real project, and publication guidance.
              </p>
            </div>
            <Button asChild variant="gold" size="lg" className="w-full sm:w-auto">
              <Link href={PROFILE_ASSESSMENT_HREF}>Book a Free Profile Assessment</Link>
            </Button>
          </div>

          <ComplianceNote body={disclaimer} />
        </Container>
      </Section>
    </>
  );
}

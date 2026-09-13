import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/lib/site-url";
import { PROFILE_ASSESSMENT_HREF } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "All ApexMed Services",
  description:
    "Every ApexMed International service in one place — research and publication training, the Germany pathway, international exam mentorship, and more.",
  alternates: { canonical: absoluteUrl("/services") },
};

const BREADCRUMB_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
];

const SERVICE_GROUPS = [
  {
    title: "Research & Publication",
    services: [
      "Original Research Training",
      "Meta-analysis Complete Course",
      "CDC WONDER Research Course",
      "Letters to the Editor",
      "Narrative Reviews",
      "Clinical Audits",
      "Case Reports",
      "Synopsis Writing for CPSP/FCPS",
      "Research Writing & Publication Support",
      "FCPS Trainee Research Support",
      "PMDC Publication Guidance",
    ],
  },
  {
    title: "Germany Pathway",
    services: [
      "German Language A1–B2",
      "Medical German",
      "FSP / KP / Approbation Guidance",
      "Residency and Facharzt Pathway Guidance",
      "Germany Master's Admissions",
    ],
  },
  {
    title: "International Exam Mentorship",
    services: ["USMLE Mentorship", "PLAB Mentorship", "MRCP Mentorship", "AMC Mentorship"],
  },
  {
    title: "Additional Programs",
    services: ["Psychological Support Webinars and Counseling", "Climate Change Program"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Section theme="navy" padding="lg" noise className="pt-32">
        <Container className="flex flex-col gap-4">
          <Breadcrumbs items={BREADCRUMB_ITEMS} tone="dark" />
          <p className="text-eyebrow uppercase text-gold-400">Our Services</p>
          <h1 className="max-w-2xl font-display text-display-xl text-paper-50">All ApexMed Services</h1>
        </Container>
      </Section>

      <Section theme="light" padding="lg">
        <Container className="flex flex-col gap-10">
          {SERVICE_GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="font-display text-display-md text-ink-900">{group.title}</h2>
              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {group.services.map((service) => (
                  <li key={service} className="flex items-start gap-2 text-body-md text-ink-900">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-gold-500" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col items-start gap-4 rounded-2xl border border-navy-800/15 bg-paper-50 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-display-sm text-ink-900">Not sure which service is right for you?</h2>
              <p className="mt-1 text-body-sm text-slate-500">A free profile assessment maps the right next step.</p>
            </div>
            <Button asChild variant="gold" size="lg" className="w-full sm:w-auto">
              <Link href={PROFILE_ASSESSMENT_HREF}>Book a Free Profile Assessment</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}

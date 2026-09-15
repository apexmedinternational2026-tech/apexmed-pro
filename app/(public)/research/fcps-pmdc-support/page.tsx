import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { WhatsAppContactButton } from "@/components/ui/whatsapp-contact-button";
import { ComplianceNote } from "@/components/program/compliance-note";
import { getComplianceDisclaimer } from "@/lib/supabase/queries/compliance-disclaimers";
import { FCPS_PMDC_CONTENT } from "@/lib/research-content";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "FCPS & PMDC Research Support — ApexMed International",
  description:
    "Research and publication support for FCPS trainees, residents, and PMDC-registered doctors — from research idea to journal submission.",
  alternates: { canonical: absoluteUrl("/research/fcps-pmdc-support") },
};

const BREADCRUMB_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Research", href: "/research" },
  { label: "FCPS/PMDC Support", href: "/research/fcps-pmdc-support" },
];

export default async function FcpsPmdcSupportPage() {
  const disclaimer = await getComplianceDisclaimer("publication");

  return (
    <>
      <Section theme="navy" padding="lg" noise className="pt-32">
        <Container className="flex flex-col gap-4">
          <Breadcrumbs items={BREADCRUMB_ITEMS} tone="dark" />
          <p className="text-eyebrow uppercase text-gold-400">FCPS & PMDC Research Support</p>
          <h1 className="max-w-2xl font-display text-display-xl text-paper-50">
            Research and publication support for FCPS and PMDC doctors.
          </h1>
          <p className="max-w-xl text-body-lg text-paper-50/80">{FCPS_PMDC_CONTENT.intro}</p>
        </Container>
      </Section>

      <Section theme="light" padding="lg">
        <Container className="flex max-w-3xl flex-col gap-10">
          <div>
            <h2 className="font-display text-display-md text-ink-900">What we support</h2>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {FCPS_PMDC_CONTENT.supports.map((item) => (
                <li key={item} className="flex items-start gap-2 text-body-md text-ink-900">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-gold-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-display-md text-ink-900">Specialties covered</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {FCPS_PMDC_CONTENT.specialties.map((specialty) => (
                <span key={specialty} className="rounded-full bg-navy-950/5 px-3 py-1.5 text-body-sm text-ink-900">
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-display-md text-ink-900">Publication support pathway</h2>
            <ol className="mt-4 flex flex-col gap-3">
              {FCPS_PMDC_CONTENT.pathway.map((step, index) => (
                <li key={step} className="flex items-center gap-3 text-body-md text-ink-900">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-navy-950 text-caption font-semibold text-gold-400">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col items-start gap-4 rounded-2xl border border-navy-800/15 bg-paper-50 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-display-sm text-ink-900">Ready to start your FCPS research?</h2>
              <p className="mt-1 text-body-sm text-slate-500">A mentor will map this pathway to your specialty and stage.</p>
            </div>
            <WhatsAppContactButton className="w-full sm:w-auto" />
          </div>

          <ComplianceNote body={disclaimer} />
        </Container>
      </Section>
    </>
  );
}

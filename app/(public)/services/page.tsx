import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedServices } from "@/lib/supabase/queries/services";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ServiceIcon } from "@/components/ui/service-icon";
import { accentStyle, resolveAccentToken } from "@/lib/accent";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Services — Medical Research, Licensing & Support — ApexMed International",
  description:
    "Every ApexMed service in one place: research mentorship, German and international medical licensing pathways, Master's admissions, AI training, and mental health support.",
  alternates: { canonical: absoluteUrl("/services") },
};

const BREADCRUMB_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
];

export default async function ServicesIndexPage() {
  const services = await getPublishedServices();

  return (
    <>
      <Section theme="navy" padding="lg" noise className="pt-32">
        <Container className="flex flex-col gap-4">
          <Breadcrumbs items={BREADCRUMB_ITEMS} tone="dark" />
          <p className="text-eyebrow uppercase text-gold-400">What We Do</p>
          <h1 className="max-w-2xl font-display text-display-xl text-paper-50">Our Services</h1>
          <p className="max-w-xl text-body-lg text-paper-50/80">
            Research mentorship, German and international medical licensing pathways, Master&apos;s admissions
            guidance, and support beyond the exam room — every service ApexMed offers, in one place.
          </p>
        </Container>
      </Section>

      <Section theme="light" padding="lg">
        <Container className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {services.map((service) => {
            const accent = resolveAccentToken(service.accent_token);
            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                style={accentStyle(accent)}
                className="group flex flex-col gap-3 rounded-2xl border border-navy-800/10 bg-white p-7 transition-colors hover:border-[var(--accent)]/40"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "var(--accent-surface)", color: "var(--accent-foreground)" }}
                  aria-hidden="true"
                >
                  <ServiceIcon iconKey={service.icon_key} className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="font-display text-display-sm text-ink-900">{service.name}</h2>
                  {service.tagline && <p className="mt-1 text-body-sm font-medium text-slate-500">{service.tagline}</p>}
                  {service.summary && <p className="mt-2 text-body-sm text-slate-500">{service.summary}</p>}
                </div>
                <span
                  className="mt-auto text-body-sm font-medium transition-transform group-hover:translate-x-1"
                  style={{ color: "var(--accent-text)" }}
                >
                  Explore →
                </span>
              </Link>
            );
          })}
        </Container>
      </Section>
    </>
  );
}

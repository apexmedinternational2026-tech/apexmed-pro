import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug, getServiceSlugs, getPublishedServices } from "@/lib/supabase/queries/services";
import { NotFoundError } from "@/lib/supabase/errors";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ServiceIcon } from "@/components/ui/service-icon";
import { ProfileAssessmentButton } from "@/components/ui/profile-assessment-button";
import { ComplianceNote } from "@/components/program/compliance-note";
import { accentStyle, resolveAccentToken } from "@/lib/accent";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

interface ServicePageParams {
  slug: string;
}

export async function generateStaticParams(): Promise<ServicePageParams[]> {
  const slugs = await getServiceSlugs();
  return slugs.map((row) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }: { params: Promise<ServicePageParams> }): Promise<Metadata> {
  const { slug } = await params;

  let service;
  try {
    service = await getServiceBySlug(slug);
  } catch {
    return {};
  }

  const title = service.meta_title ?? `${service.name} — ApexMed International`;
  const description = service.meta_description ?? service.summary ?? service.tagline ?? undefined;
  const canonicalPath = service.canonical_url ?? `/services/${service.slug}`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(canonicalPath) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonicalPath),
      images: service.og_image_url ? [{ url: service.og_image_url }] : undefined,
    },
  };
}

export default async function ServiceHubPage({ params }: { params: Promise<ServicePageParams> }) {
  const { slug } = await params;

  let service;
  try {
    service = await getServiceBySlug(slug);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  // Fetched regardless of whether the "Other Services" strip is reached,
  // since it's cheap (id/slug/name only) and every service page needs it —
  // simpler than threading a "skip this one" param through.
  const allServices = await getPublishedServices();
  const otherServices = allServices.filter((s) => s.slug !== slug);

  const accent = resolveAccentToken(service.accent_token);
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: service.name, href: `/services/${service.slug}` },
  ];

  return (
    <div style={accentStyle(accent)}>
      <section
        className="gold-foil-noise relative overflow-hidden pb-16 pt-32"
        style={{ backgroundColor: "var(--accent-surface)", color: "var(--accent-foreground)" }}
      >
        <Container className="relative z-10 flex flex-col gap-6">
          <Breadcrumbs items={breadcrumbItems} tone="dark" />
          <div className="flex items-center gap-4">
            <span
              className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl border border-current/30"
              aria-hidden="true"
            >
              <ServiceIcon iconKey={service.icon_key} className="h-7 w-7" />
            </span>
            <div className="max-w-2xl">
              <h1 className="font-display text-display-xl">{service.name}</h1>
              {service.tagline && (
                <p className="mt-1 text-body-lg" style={{ opacity: 0.85 }}>
                  {service.tagline}
                </p>
              )}
            </div>
          </div>
          {service.description && (
            <p className="max-w-2xl text-body-md" style={{ opacity: 0.85 }}>
              {service.description}
            </p>
          )}
          <div className="mt-1 flex flex-wrap gap-3">
            <ProfileAssessmentButton />
          </div>
        </Container>
      </section>

      {service.items.length > 0 && (
        <Section theme="light" padding="lg">
          <Container className="flex flex-col gap-4">
            <p className="text-eyebrow uppercase" style={{ color: "var(--accent-text)" }}>
              Explore {service.short_name ?? service.name}
            </p>
            <h2 className="font-display text-display-lg text-ink-900">What&apos;s included</h2>
          </Container>
          <Container className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.items.map((item) => {
              const isExternal = item.href.startsWith("http");
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  className="group flex flex-col gap-3 rounded-2xl border border-navy-800/10 bg-white p-6 transition-colors hover:border-[var(--accent)]/40"
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "var(--accent-surface)", color: "var(--accent-foreground)" }}
                    aria-hidden="true"
                  >
                    <ServiceIcon iconKey={item.icon_key ?? service.icon_key} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-display-sm text-ink-900">{item.name}</h3>
                    {item.summary && <p className="mt-1.5 text-body-sm text-slate-500">{item.summary}</p>}
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
      )}

      {service.disclaimerBody && (
        <Section theme="white" padding="sm">
          <Container>
            <ComplianceNote body={service.disclaimerBody} />
          </Container>
        </Section>
      )}

      {otherServices.length > 0 && (
        <Section theme="light" padding="sm" className="border-t border-navy-800/10 bg-paper-50/60">
          <Container className="flex flex-wrap items-center gap-x-2 gap-y-3">
            <span className="text-caption font-semibold uppercase tracking-wide text-slate-400">
              Other services:
            </span>
            {otherServices.map((other, index) => (
              <span key={other.id} className="text-caption text-slate-400">
                <Link href={`/services/${other.slug}`} className="text-slate-500 underline-offset-2 hover:underline">
                  {other.short_name ?? other.name}
                </Link>
                {index < otherServices.length - 1 && <span className="ml-2">·</span>}
              </span>
            ))}
          </Container>
        </Section>
      )}
    </div>
  );
}

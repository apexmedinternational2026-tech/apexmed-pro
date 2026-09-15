import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug, getServiceSlugs, getPublishedServices } from "@/lib/supabase/queries/services";
import { getCourseBySlug } from "@/lib/supabase/queries/courses";
import { getInitiativeBySlug } from "@/lib/supabase/queries/initiatives";
import { getSupportServiceBySlug, getActiveCrisisResources } from "@/lib/supabase/queries/support-services";
import { getSiteSettings } from "@/lib/supabase/queries/site-settings";
import { getMentorBySlug } from "@/lib/supabase/queries/mentors";
import { NotFoundError } from "@/lib/supabase/errors";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ServiceIcon } from "@/components/ui/service-icon";
import { ProfileAssessmentButton } from "@/components/ui/profile-assessment-button";
import { ComplianceNote } from "@/components/program/compliance-note";
import { CourseJsonLd } from "@/components/program/course-jsonld";
import { CourseCurriculum } from "@/components/services/course-curriculum";
import { InitiativeSections } from "@/components/services/initiative-sections";
import { EmergencyBlock } from "@/components/services/emergency-block";
import { SupportOfferings } from "@/components/services/support-offerings";
import { MentorCard } from "@/components/mentors/mentor-card";
import { accentStyle, resolveAccentToken } from "@/lib/accent";
import { absoluteUrl } from "@/lib/site-url";
import type { Json } from "@/lib/supabase/database.types";

// The one service with real content but no lead-capture form anywhere on
// its page — a "counselling enquiry" row in a leads table the whole team
// can browse is a privacy problem (PART 5's explicit reasoning). Contact
// is WhatsApp/email only.
const NO_LEAD_FORM_SLUGS = ["mental-health"];

function asString(value: Json | undefined): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

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

  // PART 4 of the brief: a service with no sub-items renders its own
  // linked content directly instead of a click-through grid (AI
  // Healthcare's course, Green Earth's initiative, Mental Health's
  // support service — each row's slug matches its parent service's slug
  // by convention, see 20260919100001's own comment). .catch(() => null)
  // rather than letting NotFoundError propagate: most services genuinely
  // have neither items nor a linked course/initiative, and that's a
  // normal, valid state (a hero-only page), not an error.
  const course = service.items.length === 0 ? await getCourseBySlug(slug).catch(() => null) : null;
  const initiative = service.items.length === 0 && !course ? await getInitiativeBySlug(slug).catch(() => null) : null;
  const supportService =
    service.items.length === 0 && !course && !initiative ? await getSupportServiceBySlug(slug).catch(() => null) : null;

  // Mental Health only: the emergency block, WhatsApp/email contact
  // details, and the two real, already-published psychiatrist mentors —
  // fetched only when actually needed, not on every service page.
  const [crisisResources, siteSettings, counsellingTeam] = supportService
    ? await Promise.all([
        getActiveCrisisResources(),
        getSiteSettings(),
        Promise.all(
          ["dr-alia", "dr-waheed-alam"].map((mentorSlug) => getMentorBySlug(mentorSlug).catch(() => null)),
        ),
      ])
    : ([[], {}, []] as [Awaited<ReturnType<typeof getActiveCrisisResources>>, Awaited<ReturnType<typeof getSiteSettings>>, (Awaited<ReturnType<typeof getMentorBySlug>> | null)[]]);

  const whatsappNumber = asString(siteSettings.contact_whatsapp_number);
  const contactEmail = asString(siteSettings.contact_email);

  const accent = resolveAccentToken(service.accent_token);
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: service.name, href: `/services/${service.slug}` },
  ];

  const canonicalPath = service.canonical_url ?? `/services/${service.slug}`;

  return (
    <div style={accentStyle(accent)}>
      {course && <CourseJsonLd name={course.title} description={course.tagline ?? course.description ?? ""} slug={course.slug} path={canonicalPath} />}

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
          {!NO_LEAD_FORM_SLUGS.includes(slug) && (
            <div className="mt-1 flex flex-wrap gap-3">
              <ProfileAssessmentButton />
            </div>
          )}
        </Container>
      </section>

      {supportService && (
        <Section theme="white" padding="md">
          <Container className="max-w-3xl">
            <EmergencyBlock resources={crisisResources} />
          </Container>
        </Section>
      )}

      {course && (
        <Section theme="light" padding="lg">
          <Container className="flex flex-col gap-4">
            {(course.format_label || course.certification_label) && (
              <div className="flex flex-wrap gap-4 text-body-sm text-slate-500">
                {course.format_label && <span>{course.format_label}</span>}
                {course.format_label && course.certification_label && <span aria-hidden="true">·</span>}
                {course.certification_label && <span>{course.certification_label}</span>}
              </div>
            )}
            <p className="text-eyebrow uppercase" style={{ color: "var(--accent-text)" }}>
              Curriculum
            </p>
            <h2 className="font-display text-display-lg text-ink-900">
              {course.modules.length} modules, taught step by step.
            </h2>
          </Container>
          <Container className="mt-8 max-w-3xl">
            <CourseCurriculum modules={course.modules} />
          </Container>
        </Section>
      )}

      {initiative && (
        <Section theme="light" padding="lg">
          <Container className="max-w-3xl">
            <InitiativeSections sections={initiative.sections} />
          </Container>
        </Section>
      )}

      {supportService && (
        <>
          <Section theme="light" padding="lg">
            <Container className="flex flex-col gap-4">
              <p className="text-eyebrow uppercase" style={{ color: "var(--accent-text)" }}>
                Services Offered
              </p>
              <h2 className="font-display text-display-lg text-ink-900">How ApexMed can help</h2>
            </Container>
            <Container className="mt-8 max-w-3xl">
              <SupportOfferings offerings={supportService.offerings} />
            </Container>
          </Section>

          {counsellingTeam.some(Boolean) && (
            <Section theme="white" padding="lg">
              <Container className="flex flex-col gap-4">
                <p className="text-eyebrow uppercase" style={{ color: "var(--accent-text)" }}>
                  Our Counselling Team
                </p>
              </Container>
              <Container className="mt-8 flex flex-wrap gap-5">
                {counsellingTeam
                  .filter((mentor): mentor is NonNullable<typeof mentor> => mentor !== null)
                  .map((mentor) => (
                    <MentorCard key={mentor.id} mentor={mentor} />
                  ))}
              </Container>
            </Section>
          )}

          <Section theme="light" padding="lg">
            <Container className="max-w-2xl">
              <p className="text-eyebrow uppercase" style={{ color: "var(--accent-text)" }}>
                How to Access Support
              </p>
              <h2 className="mt-2 font-display text-display-lg text-ink-900">Contact us directly</h2>
              <p className="mt-4 text-body-md text-slate-500">
                Attend a free webinar, or reach out directly — a simple &ldquo;I need help&rdquo; is enough. No
                lead form, no sign-up: just a message.
              </p>
              <div className="mt-6 flex flex-col gap-2">
                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-body-md font-medium underline-offset-2 hover:underline"
                    style={{ color: "var(--accent-text)" }}
                  >
                    WhatsApp: {whatsappNumber}
                  </a>
                )}
                {contactEmail && (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-body-md font-medium underline-offset-2 hover:underline"
                    style={{ color: "var(--accent-text)" }}
                  >
                    Email: {contactEmail}
                  </a>
                )}
              </div>
            </Container>
          </Section>
        </>
      )}

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

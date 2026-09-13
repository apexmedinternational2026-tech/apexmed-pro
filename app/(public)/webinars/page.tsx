import type { Metadata } from "next";
import { getUpcomingPublishedWebinars } from "@/lib/supabase/queries/webinars";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { WebinarRegistrationForm } from "@/components/webinars/webinar-registration-form";
import { absoluteUrl } from "@/lib/site-url";

// Not a longer ISR window despite being content-driven like the other
// index pages: webinars are date-specific, and a stale "upcoming" list
// that still shows an already-passed session is a worse failure mode
// here than the extra Supabase reads from checking more often.
export const revalidate = 900;

export const metadata: Metadata = {
  title: "Webinars — ApexMed International",
  description:
    "Free live sessions on the German medical licensing pathway, research methodology, and Master's admissions — hosted by ApexMed's mentors.",
  alternates: { canonical: absoluteUrl("/webinars") },
};

const BREADCRUMB_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Webinars", href: "/webinars" },
];

function formatWebinarDate(startsAt: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(startsAt));
}

export default async function WebinarsIndexPage() {
  const webinars = await getUpcomingPublishedWebinars();

  return (
    <>
      <Section theme="navy" padding="lg" noise className="pt-32">
        <Container className="flex flex-col gap-4">
          <Breadcrumbs items={BREADCRUMB_ITEMS} tone="dark" />
          <p className="text-eyebrow uppercase text-gold-400">Webinars</p>
          <h1 className="max-w-2xl font-display text-display-xl text-paper-50">Free live sessions, hosted by mentors.</h1>
          <p className="max-w-xl text-body-lg text-paper-50/80">
            Ask questions live about the German pathway, research methodology, or Master&apos;s admissions —
            reserve a seat below.
          </p>
        </Container>
      </Section>

      <Section theme="light" padding="lg">
        <Container className="flex flex-col gap-8">
          {webinars.length === 0 ? (
            <p className="text-body-md text-slate-500">No upcoming webinars scheduled right now — check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {webinars.map((webinar) => (
                <div key={webinar.id} className="flex flex-col gap-5 rounded-2xl border border-navy-800/15 bg-paper-50 p-6">
                  <div>
                    <h2 className="font-display text-display-sm text-ink-900">{webinar.title}</h2>
                    <p className="mt-1 text-body-sm font-medium text-gold-500">{formatWebinarDate(webinar.starts_at)}</p>
                    {webinar.description && <p className="mt-3 text-body-sm text-slate-500">{webinar.description}</p>}
                  </div>
                  <WebinarRegistrationForm webinarId={webinar.id} />
                </div>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}

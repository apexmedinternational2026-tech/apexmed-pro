import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import type { Webinar } from "@/lib/supabase/queries/webinars";

export function UpcomingWebinar({ webinar }: { webinar: Webinar }) {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(webinar.starts_at));

  return (
    <Section theme="white" padding="md">
      <Container>
        <div className="flex flex-col items-start gap-6 rounded-2xl border border-navy-800/15 bg-paper-50 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-eyebrow uppercase text-gold-500">Upcoming Webinar</p>
            <h2 className="mt-2 font-display text-display-md text-ink-900">{webinar.title}</h2>
            <p className="mt-2 text-body-sm text-slate-500">{formatted}</p>
            {webinar.description && <p className="mt-3 max-w-xl text-body-md text-ink-900">{webinar.description}</p>}
          </div>
          <Button asChild variant="gold" size="lg" className="w-full sm:w-auto">
            <Link href="/webinars">Reserve Your Seat</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}

import type { Metadata } from "next";
import { getPublishedPrograms } from "@/lib/supabase/queries/programs";
import { getPublishedServices } from "@/lib/supabase/queries/services";
import { getPublishedMentors, getMentorBySlug } from "@/lib/supabase/queries/mentors";
import { getApprovedTestimonials } from "@/lib/supabase/queries/testimonials";
import { getUpcomingPublishedWebinars } from "@/lib/supabase/queries/webinars";
import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { ServicesGrid } from "@/components/home/services-grid";
import { ProgramGrid } from "@/components/home/program-grid";
import { FounderSection } from "@/components/home/founder-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { UpcomingWebinar } from "@/components/home/upcoming-webinar";
import { FinalCta } from "@/components/home/final-cta";

// Homepage content changes infrequently (programs, mentors, testimonials
// are admin-curated, not real-time data) — ISR keeps it static/fast per
// CLAUDE.md rule 1 while still picking up edits within the hour.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "ApexMed International — Global Medical Excellence, Research & International Pathways",
  description:
    "Research training, publication mentorship, German language and medical licensing pathway guidance, and German Master's admissions support for doctors and medical students.",
};

const FOUNDER_SLUG = "dr-saqib-muhammad";

export default async function HomePage() {
  const [services, programs, mentors, testimonials, webinars, founder] = await Promise.all([
    getPublishedServices(),
    getPublishedPrograms(),
    getPublishedMentors(),
    getApprovedTestimonials(),
    getUpcomingPublishedWebinars(),
    getMentorBySlug(FOUNDER_SLUG).catch(() => null),
  ]);

  // The brief's trust strip is specifically "publications by our founder",
  // not a sum across every mentor — founder?.publications_count already
  // reflects that mentor's own row (30, per supabase/seed.sql).
  const founderPublicationCount = founder?.publications_count ?? 0;
  const nextWebinar = webinars[0] ?? null;

  return (
    <>
      <Hero />
      <TrustStrip mentorCount={mentors.length} publicationCount={founderPublicationCount} programCount={programs.length} />
      <ServicesGrid services={services} />
      <ProgramGrid programs={programs} />
      {founder && <FounderSection founder={founder} />}
      <HowItWorks />
      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
      {nextWebinar && <UpcomingWebinar webinar={nextWebinar} />}
      <FinalCta />
    </>
  );
}

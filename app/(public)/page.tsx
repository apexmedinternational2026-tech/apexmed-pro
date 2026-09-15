import type { Metadata } from "next";
import { getPublishedPrograms } from "@/lib/supabase/queries/programs";
import { getPublishedServices, getServiceBySlug } from "@/lib/supabase/queries/services";
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

// Both leadership figures — Founder & Research Lead, Organizer — shown on
// the homepage now (previously just one), in this order.
const LEADER_SLUGS = ["dr-nadir-akhtar", "dr-saqib-muhammad"];

export default async function HomePage() {
  const [services, programs, mentors, testimonials, webinars, leaderResults, researchService] = await Promise.all([
    getPublishedServices(),
    getPublishedPrograms(),
    getPublishedMentors(),
    getApprovedTestimonials(),
    getUpcomingPublishedWebinars(),
    Promise.all(LEADER_SLUGS.map((slug) => getMentorBySlug(slug).catch(() => null))),
    // Fetched just to surface the FCPS item as its own card on the
    // homepage grid, alongside the Research service card — everything
    // else about ServicesGrid stays service-level (SERVICES_MEGA_MENU),
    // this is the one deliberate exception (client's explicit ask).
    getServiceBySlug("research").catch(() => null),
  ]);
  const leaders = leaderResults.filter((leader) => leader !== null);
  const fcpsItem = researchService?.items.find((item) => item.slug === "fcps-research-publication") ?? null;

  // The brief's trust strip is specifically "publications by our founder",
  // not a sum across every mentor — leaders[0]?.publications_count already
  // reflects the Founder's own row (20, per supabase/seed.sql), not a sum
  // across both leaders.
  const founderPublicationCount = leaders[0]?.publications_count ?? 0;
  const nextWebinar = webinars[0] ?? null;

  return (
    <>
      <Hero />
      <TrustStrip mentorCount={mentors.length} publicationCount={founderPublicationCount} programCount={programs.length} />
      <ServicesGrid services={services} extraResearchItem={fcpsItem} />
      <ProgramGrid programs={programs} />
      {leaders.length > 0 && <FounderSection leaders={leaders} />}
      <HowItWorks />
      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
      {nextWebinar && <UpcomingWebinar webinar={nextWebinar} />}
      <FinalCta />
    </>
  );
}

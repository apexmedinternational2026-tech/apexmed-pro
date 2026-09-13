import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { MentorCard } from "@/components/mentors/mentor-card";
import { getPublishedMentors } from "@/lib/supabase/queries/mentors";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Mentors — ApexMed International",
  description:
    "The mentorship team behind ApexMed International — leadership and faculty guiding doctors and medical students through research, German pathways, and Master's admissions.",
  alternates: { canonical: absoluteUrl("/mentors") },
};

const BREADCRUMB_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Mentors", href: "/mentors" },
];

export default async function MentorsIndexPage() {
  const mentors = await getPublishedMentors();
  const leadership = mentors.filter((mentor) => mentor.is_leadership);
  const faculty = mentors.filter((mentor) => !mentor.is_leadership);

  return (
    <>
      <Section theme="navy" padding="lg" noise className="pt-32">
        <Container className="flex flex-col gap-4">
          <Breadcrumbs items={BREADCRUMB_ITEMS} tone="dark" />
          <p className="text-eyebrow uppercase text-gold-400">Our Mentors</p>
          <h1 className="max-w-2xl font-display text-display-xl text-paper-50">
            Mentors who&apos;ve made this journey themselves.
          </h1>
        </Container>
      </Section>

      {leadership.length > 0 && (
        <Section theme="white" padding="lg">
          <Container className="flex flex-col gap-8">
            <p className="text-eyebrow uppercase text-gold-500">Leadership</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {leadership.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} size="lg" />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {faculty.length > 0 && (
        <Section theme="light" padding="lg">
          <Container className="flex flex-col gap-8">
            <p className="text-eyebrow uppercase text-gold-500">Faculty</p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {faculty.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} size="sm" />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}

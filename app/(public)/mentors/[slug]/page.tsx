import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Reveal } from "@/components/ui/reveal";
import { getMentorBySlug, getMentorSlugs } from "@/lib/supabase/queries/mentors";
import { NotFoundError } from "@/lib/supabase/errors";
import { getInitials } from "@/lib/text";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

interface MentorPageParams {
  slug: string;
}

export async function generateStaticParams(): Promise<MentorPageParams[]> {
  const slugs = await getMentorSlugs();
  return slugs.map((row) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }: { params: Promise<MentorPageParams> }): Promise<Metadata> {
  const { slug } = await params;

  let mentor;
  try {
    mentor = await getMentorBySlug(slug);
  } catch {
    return {};
  }

  const title = `${mentor.full_name} — ApexMed International`;
  const description = mentor.bio ?? `${mentor.full_name}, ${mentor.role_title ?? "mentor"} at ApexMed International.`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/mentors/${mentor.slug}`) },
    openGraph: {
      title,
      description,
      images: mentor.photo_url ? [{ url: mentor.photo_url }] : undefined,
    },
  };
}

export default async function MentorPage({ params }: { params: Promise<MentorPageParams> }) {
  const { slug } = await params;

  let mentor;
  try {
    mentor = await getMentorBySlug(slug);
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: mentor.full_name, href: `/mentors/${mentor.slug}` },
  ];

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: mentor.full_name,
    jobTitle: mentor.role_title ?? undefined,
    description: mentor.bio ?? undefined,
    image: mentor.photo_url ?? undefined,
    url: absoluteUrl(`/mentors/${mentor.slug}`),
    worksFor: {
      "@type": "Organization",
      name: "ApexMed International",
    },
    ...(mentor.institution ? { alumniOf: mentor.institution } : {}),
    ...(mentor.linkedin_url ? { sameAs: [mentor.linkedin_url] } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />

      <Section theme="navy" padding="lg" noise className="pt-32">
        <Container className="flex flex-col gap-6">
          <Breadcrumbs items={breadcrumbItems} tone="dark" />
        </Container>
      </Section>

      <Section theme="white" padding="lg" className="-mt-24">
        <Container className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
          <Reveal>
            {mentor.photo_url ? (
              <Image
                src={mentor.photo_url}
                alt={mentor.full_name}
                width={280}
                height={280}
                className="aspect-square w-full rounded-2xl object-cover shadow-xl"
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-navy-950 shadow-xl">
                <span className="font-display text-display-xl text-gold-400">{getInitials(mentor.full_name)}</span>
              </div>
            )}
          </Reveal>

          <div className="pt-4">
            {mentor.is_leadership && <Badge variant="gold">Leadership</Badge>}
            <h1 className="mt-4 font-display text-display-xl text-ink-900">{mentor.full_name}</h1>
            {mentor.role_title && <p className="mt-2 text-body-lg font-medium text-slate-500">{mentor.role_title}</p>}
            {mentor.qualification && <p className="mt-1 text-body-sm text-slate-500">{mentor.qualification}</p>}
            {mentor.institution && <p className="text-body-sm text-slate-500">{mentor.institution}</p>}

            {mentor.bio && <p className="mt-6 max-w-2xl text-body-lg text-ink-900">{mentor.bio}</p>}

            <div className="mt-6 flex flex-wrap items-center gap-4">
              {mentor.publications_count > 0 && (
                <span className="text-body-sm font-medium uppercase tracking-wide text-gold-500">
                  {mentor.publications_count}+ Publications
                </span>
              )}
              {mentor.linkedin_url && (
                <a
                  href={mentor.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-body-sm font-medium text-navy-950 hover:underline"
                >
                  LinkedIn →
                </a>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

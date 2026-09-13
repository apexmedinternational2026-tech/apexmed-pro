import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStudyFieldBySlug, getStudyFieldSlugs, getRelatedStudyFields } from "@/lib/supabase/queries/study-fields";
import { getComplianceDisclaimer } from "@/lib/supabase/queries/compliance-disclaimers";
import { NotFoundError } from "@/lib/supabase/errors";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ProfileAssessmentButton } from "@/components/ui/profile-assessment-button";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ComplianceNote } from "@/components/program/compliance-note";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

interface FieldPageParams {
  slug: string;
}

export async function generateStaticParams(): Promise<FieldPageParams[]> {
  const slugs = await getStudyFieldSlugs();
  return slugs.map((row) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }: { params: Promise<FieldPageParams> }): Promise<Metadata> {
  const { slug } = await params;

  let field;
  try {
    field = await getStudyFieldBySlug(slug);
  } catch {
    return {};
  }

  const title = field.seo_title ?? `${field.name} in Germany`;
  const description =
    field.seo_description ??
    field.overview ??
    `${field.name}: German universities, entry requirements, and career outlook.`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(field.canonical_path ?? `/masters/fields/${field.slug}`) },
  };
}

type ContentSectionKey = "typical_universities" | "entry_requirements" | "language_requirements" | "career_outlook";

const SECTIONS: { key: ContentSectionKey; heading: string }[] = [
  { key: "typical_universities", heading: "Typical German Universities" },
  { key: "entry_requirements", heading: "Entry Requirements" },
  { key: "language_requirements", heading: "Language Requirements" },
  { key: "career_outlook", heading: "Career Outlook" },
];

export default async function StudyFieldPage({ params }: { params: Promise<FieldPageParams> }) {
  const { slug } = await params;

  let field;
  try {
    field = await getStudyFieldBySlug(slug);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const [relatedFields, disclaimer] = await Promise.all([
    getRelatedStudyFields(field.category_id, field.id),
    getComplianceDisclaimer("admissions"),
  ]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Master's Admissions", href: "/masters" },
    { label: "Fields of Study", href: "/masters/fields" },
    { label: field.name, href: `/masters/fields/${field.slug}` },
  ];

  return (
    <>
      <Section theme="navy" padding="lg" noise className="pt-32">
        <Container className="flex flex-col gap-4">
          <Breadcrumbs items={breadcrumbItems} tone="dark" />
          <p className="text-eyebrow uppercase text-gold-400">{field.category.name}</p>
          <h1 className="max-w-2xl font-display text-display-xl text-paper-50">{field.name} in Germany</h1>
          {field.overview && <p className="max-w-2xl text-body-lg text-paper-50/80">{field.overview}</p>}
        </Container>
      </Section>

      <Section theme="light" padding="lg">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex max-w-none flex-col gap-10">
            {SECTIONS.filter((section) => field[section.key]).map((section) => (
              <div key={section.key}>
                <h2 className="font-display text-display-sm text-ink-900">{section.heading}</h2>
                <p className="mt-3 whitespace-pre-line text-body-md text-ink-900">{field[section.key]}</p>
              </div>
            ))}
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-2xl border border-navy-800/10 bg-white p-6">
              <h2 className="font-display text-display-sm text-ink-900">See your options</h2>
              <p className="mt-2 text-body-sm text-slate-500">
                A free profile assessment maps your background to a realistic shortlist of programs and universities.
              </p>
              <ProfileAssessmentButton size="md" className="mt-4 w-full" />
              <Button asChild variant="secondary" size="md" className="mt-2 w-full">
                <Link href="/programs/master-card">Explore the Master Card</Link>
              </Button>
            </div>

            {relatedFields.length > 0 && (
              <div className="rounded-2xl border border-navy-800/10 bg-white p-6">
                <h2 className="font-display text-display-sm text-ink-900">Related fields</h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {relatedFields.map((related) => (
                    <li key={related.slug}>
                      <Link
                        href={`/masters/fields/${related.slug}`}
                        className="text-body-sm font-medium text-navy-950 hover:underline"
                      >
                        {related.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </Container>
      </Section>

      <Section theme="white" padding="sm">
        <Container>
          <ComplianceNote body={disclaimer} />
        </Container>
      </Section>
    </>
  );
}

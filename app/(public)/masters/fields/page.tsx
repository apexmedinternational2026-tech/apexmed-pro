import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getStudyFieldCategories, getPublishedStudyFields } from "@/lib/supabase/queries/study-fields";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Fields of Study — ApexMed International",
  description:
    "Browse German Master's study fields by category — overview, typical universities, and entry requirements for each.",
  alternates: { canonical: absoluteUrl("/masters/fields") },
};

const BREADCRUMB_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Master's Admissions", href: "/masters" },
  { label: "Fields of Study", href: "/masters/fields" },
];

export default async function MastersFieldsPage() {
  const [categories, fields] = await Promise.all([getStudyFieldCategories(), getPublishedStudyFields()]);

  const fieldsByCategory = new Map<string, typeof fields>();
  for (const field of fields) {
    const existing = fieldsByCategory.get(field.category.id) ?? [];
    existing.push(field);
    fieldsByCategory.set(field.category.id, existing);
  }

  return (
    <>
      <Section theme="navy" padding="lg" noise className="pt-32">
        <Container className="flex flex-col gap-4">
          <Breadcrumbs items={BREADCRUMB_ITEMS} tone="dark" />
          <p className="text-eyebrow uppercase text-gold-400">Master&apos;s Admissions</p>
          <h1 className="max-w-2xl font-display text-display-xl text-paper-50">Fields of Study</h1>
          <p className="max-w-xl text-body-lg text-paper-50/80">
            Browse German Master&apos;s programs by field — grouped the way universities actually categorize them.
          </p>
        </Container>
      </Section>

      <Section theme="light" padding="lg">
        <Container className="flex flex-col gap-14">
          {categories.length === 0 && <p className="text-body-md text-slate-500">No study fields are published yet.</p>}
          {categories.map((category) => {
            const items = fieldsByCategory.get(category.id) ?? [];
            if (items.length === 0) return null;

            return (
              <div key={category.id}>
                <h2 className="font-display text-display-md text-ink-900">{category.name}</h2>
                <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((field) => (
                    <li key={field.id}>
                      <Link
                        href={`/masters/fields/${field.slug}`}
                        className="block rounded-xl border border-navy-800/10 bg-white p-5 transition-colors hover:border-gold-500/40"
                      >
                        <span className="font-display text-display-sm text-ink-900">{field.name}</span>
                        {field.overview && <p className="mt-1.5 text-body-sm text-slate-500">{field.overview}</p>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </Container>
      </Section>
    </>
  );
}

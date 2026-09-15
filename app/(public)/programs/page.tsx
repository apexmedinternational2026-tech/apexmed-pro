import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPrograms, getProgramFamilies } from "@/lib/supabase/queries/programs";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveAccentToken } from "@/lib/accent";
import { resolveCardHref } from "@/lib/program-service-map";
import { absoluteUrl } from "@/lib/site-url";

// Programs are admin-curated, not real-time — same ISR window as every
// other content-driven public page (see CLAUDE.md rule 1).
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All Programs — ApexMed International",
  description:
    "Research training, publication mentorship, German language and medical licensing pathway guidance, and German Master's admissions support — every ApexMed Card in one place.",
  alternates: { canonical: absoluteUrl("/programs") },
};

const BREADCRUMB_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
];

export default async function ProgramsIndexPage() {
  const [programs, families] = await Promise.all([getPublishedPrograms(), getProgramFamilies()]);
  const familyById = new Map(families.map((family) => [family.id, family]));

  return (
    <>
      <Section theme="navy" padding="lg" noise className="pt-32">
        <Container className="flex flex-col gap-4">
          <Breadcrumbs items={BREADCRUMB_ITEMS} tone="dark" />
          <p className="text-eyebrow uppercase text-gold-400">All Programs</p>
          <h1 className="max-w-2xl font-display text-display-xl text-paper-50">
            Seven Cards, one clear next step.
          </h1>
          <p className="max-w-xl text-body-lg text-paper-50/80">
            Every research, German pathway, and Master&apos;s admissions Card ApexMed offers — pick the one that
            matches where you are today.
          </p>
        </Container>
      </Section>

      <Section theme="light" padding="lg">
        <Container>
          {programs.length === 0 ? (
            <p className="text-body-md text-slate-500">No programs published yet — check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => {
                const accent = resolveAccentToken(program.accent_token);
                const family = program.family_id ? familyById.get(program.family_id) : undefined;

                return (
                  <Card key={program.id} accent={accent} className="flex flex-col">
                    <CardHeader>
                      {family && <p className="text-caption uppercase text-slate-500">{family.name}</p>}
                      <CardTitle>{program.name}</CardTitle>
                      {program.duration_label && <CardDescription>{program.duration_label}</CardDescription>}
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-body-sm text-slate-500">{program.summary}</p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href={resolveCardHref(program.slug)}
                        className="text-body-sm font-medium text-[var(--accent-text)] hover:underline"
                      >
                        View program →
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { resolveAccentToken } from "@/lib/accent";
import { resolveCardHref } from "@/lib/program-service-map";
import type { ProgramSummary } from "@/lib/supabase/queries/programs";

export function ProgramGrid({ programs }: { programs: ProgramSummary[] }) {
  return (
    <Section theme="light" padding="md">
      <Container>
        <div className="max-w-2xl">
          <p className="text-eyebrow uppercase text-gold-500">Membership Cards</p>
          <h2 className="mt-3 font-display text-display-lg text-ink-900">Seven Cards, one clear next step.</h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => {
            const accent = resolveAccentToken(program.accent_token);
            const href = resolveCardHref(program.slug);
            return (
              <Card key={program.id} accent={accent} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{program.name}</CardTitle>
                  {program.duration_label && <CardDescription>{program.duration_label}</CardDescription>}
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-body-sm text-slate-500">{program.summary}</p>
                </CardContent>
                <CardFooter>
                  {/* --accent-text, not --accent: this is body-sized link
                      text, and the vivid --accent hue fails AA for blue
                      specifically (see lib/accent.ts). */}
                  <Link href={href} className="text-body-sm font-medium text-[var(--accent-text)] hover:underline">
                    View program →
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

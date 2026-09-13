import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { ACCENT_TOKENS, type AccentToken } from "@/lib/accent";
import type { ProgramFamily } from "@/lib/supabase/queries/programs";

const GERMAN_DREAM_ACCENTS: AccentToken[] = ["blue", "green", "gold", "master"];

/**
 * Two large, deliberately mismatched panels rather than symmetric cards:
 * Research gets its one accent (gold on navy, per the brief); German Dream
 * has no single accent — it's four sub-brands — so it gets a light panel
 * with a row of swatches instead of pretending to have one color.
 */
export function FamilySplit({ families }: { families: ProgramFamily[] }) {
  const research = families.find((family) => family.slug === "research");
  const germanDream = families.find((family) => family.slug === "german-dream");

  return (
    <Section theme="light" padding="lg">
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Link
            href="/programs?family=research"
            className="group flex flex-col justify-between gap-10 rounded-2xl bg-navy-950 p-10 text-paper-50 transition-transform duration-200 hover:-translate-y-1"
          >
            <div>
              <p className="text-eyebrow uppercase text-gold-400">Research Family</p>
              <h3 className="mt-3 font-display text-display-lg text-paper-50">
                {research?.name ?? "Research & Publication Family"}
              </h3>
              <p className="mt-3 max-w-sm text-body-md text-paper-50/75">
                {research?.tagline ?? "Structured mentorship from research idea to published paper."}
              </p>
            </div>
            <span className="text-body-sm font-medium text-gold-400 transition-colors group-hover:text-gold-300">
              Explore Research Cards →
            </span>
          </Link>

          <Link
            href="/programs?family=german-dream"
            className="group flex flex-col justify-between gap-10 rounded-2xl border border-navy-800/15 bg-white p-10 transition-transform duration-200 hover:-translate-y-1"
          >
            <div>
              <p className="text-eyebrow uppercase text-slate-500">German Dream Family</p>
              <h3 className="mt-3 font-display text-display-lg text-ink-900">
                {germanDream?.name ?? "German Dream Family"}
              </h3>
              <p className="mt-3 max-w-sm text-body-md text-slate-500">
                {germanDream?.tagline ?? "Language, licensing, and admissions pathways into Germany."}
              </p>
              <div className="mt-5 flex gap-2">
                {GERMAN_DREAM_ACCENTS.map((accent) => (
                  <span
                    key={accent}
                    aria-hidden="true"
                    className="h-2.5 w-8 rounded-full"
                    style={{ backgroundColor: ACCENT_TOKENS[accent].accent }}
                  />
                ))}
              </div>
            </div>
            <span className="text-body-sm font-medium text-navy-950 transition-colors group-hover:text-gold-500">
              Explore German Dream Cards →
            </span>
          </Link>
        </div>
      </Container>
    </Section>
  );
}

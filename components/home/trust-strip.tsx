import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";

export interface TrustStripProps {
  mentorCount: number;
  /** The founder's own PubMed-indexed publication count specifically —
   *  not a sum across every mentor. See app/(public)/page.tsx. */
  publicationCount: number;
  programCount: number;
}

/**
 * Real counts pulled from the database by the caller (see
 * app/(public)/page.tsx) — specific numbers, not "hundreds of" copy that
 * has to be manually updated and eventually goes stale or gets questioned.
 */
export function TrustStrip({ mentorCount, publicationCount, programCount }: TrustStripProps) {
  const stats = [
    { value: `${publicationCount}+`, label: "PubMed-Indexed Publications by Our Founder" },
    { value: mentorCount, label: "Mentors Across Research, Clinical Practice & German Pathways" },
    { value: programCount, label: "Structured Programs" },
  ];

  return (
    <Section theme="white" padding="sm">
      <Container>
        <dl className="grid grid-cols-1 divide-y divide-navy-800/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 px-4 py-6 text-center sm:py-0">
              <dt className="order-2 max-w-[16ch] text-body-sm font-medium uppercase tracking-wide text-slate-500">
                {stat.label}
              </dt>
              <dd className="order-1 font-display text-display-lg text-navy-950">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}

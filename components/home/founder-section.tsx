import Image from "next/image";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { getInitials } from "@/lib/text";
import { isSupabaseStorageUrl } from "@/lib/supabase-storage-url";
import type { Mentor } from "@/lib/supabase/queries/mentors";

/**
 * True two-column layout — Founder left, Organizer right, equal card
 * width/image size, both cards the same height regardless of bio length.
 * Replaces the earlier "two asymmetric rows stacked vertically" version,
 * which read as unbalanced (each person's photo/text pairing was sized
 * and positioned differently from the other's).
 *
 * Equal height comes from the grid itself (`items-stretch` is the default
 * alignment for CSS Grid, not something applied manually) plus each
 * `<article>` being `flex flex-col h-full` — the bio just occupies
 * whatever space is left in an already-equal-height card, never the other
 * way around. No fixed pixel heights, no absolute positioning.
 */
export function FounderSection({ leaders }: { leaders: Mentor[] }) {
  return (
    <Section theme="white" padding="lg">
      <Container>
        <div className="max-w-2xl">
          <p className="text-eyebrow uppercase text-gold-500">Leadership</p>
          <h2 className="mt-3 font-display text-display-lg text-ink-900">Founder &amp; Organizer</h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {leaders.map((leader) => (
            <article
              key={leader.id}
              className="flex h-full flex-col rounded-2xl border border-navy-800/10 bg-paper-50 p-6 sm:p-8"
            >
              <Reveal className="w-full">
                {isSupabaseStorageUrl(leader.photo_url) ? (
                  // next.config.mjs derives remotePatterns from
                  // NEXT_PUBLIC_SUPABASE_URL automatically — Supabase
                  // Storage URLs render here with no extra allowlist
                  // config needed. overflow-hidden clips the hover zoom to
                  // the rounded corners instead of the image spilling
                  // past them. Fixed 4:5 aspect ratio + object-cover on
                  // every card, so a taller or wider source photo never
                  // stretches or squashes — and both portraits render at
                  // the exact same size regardless of their own source
                  // dimensions.
                  <div className="aspect-[4/5] w-full overflow-hidden rounded-xl shadow-sm">
                    <Image
                      src={leader.photo_url}
                      alt={leader.full_name}
                      width={480}
                      height={600}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[4/5] w-full items-center justify-center rounded-xl bg-navy-950 shadow-sm">
                    <span className="font-display text-display-2xl text-gold-400">{getInitials(leader.full_name)}</span>
                  </div>
                )}
              </Reveal>

              <div className="mt-6 flex flex-1 flex-col">
                <Badge variant="gold" className="w-fit">
                  {leader.role_title ?? "Founder"}
                </Badge>
                {/* h3, not h2 — nested under this section's own "Founder &
                    Organizer" h2 above, not a second, competing top-level
                    heading for the section. */}
                <h3 className="mt-4 font-display text-display-md text-ink-900">{leader.full_name}</h3>
                {(leader.qualification || leader.institution) && (
                  <p className="mt-1 text-body-sm font-medium text-slate-500">
                    {[leader.qualification, leader.institution].filter(Boolean).join(" — ")}
                  </p>
                )}
                {leader.bio && <p className="mt-4 text-body-md text-ink-900">{leader.bio}</p>}
                {leader.publications_count > 0 && (
                  <p className="mt-4 text-body-sm font-medium uppercase tracking-wide text-gold-500">
                    {leader.publications_count}+ PubMed-indexed publications
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

import Image from "next/image";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/text";
import type { Mentor } from "@/lib/supabase/queries/mentors";

/**
 * Asymmetric on purpose: an oversized photo column with an offset gold
 * wash behind it, paired with a text column that starts lower (lg:pt-8)
 * rather than vertically centering the two into a mirrored, symmetric pair.
 */
export function FounderSection({ founder }: { founder: Mentor }) {
  return (
    <Section theme="white" padding="lg">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-16">
          <div className="relative mx-auto w-full max-w-sm lg:mx-0">
            <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gold-500/10" aria-hidden="true" />
            {founder.photo_url ? (
              // next.config.mjs derives remotePatterns from
              // NEXT_PUBLIC_SUPABASE_URL automatically — no seeded mentor
              // has a photo yet, so this path is untested against a live
              // image today.
              <Image
                src={founder.photo_url}
                alt={founder.full_name}
                width={480}
                height={560}
                className="aspect-[6/7] w-full rounded-[1.75rem] object-cover"
              />
            ) : (
              <div className="flex aspect-[6/7] w-full items-center justify-center rounded-[1.75rem] bg-navy-950">
                <span className="font-display text-display-2xl text-gold-400">{getInitials(founder.full_name)}</span>
              </div>
            )}
          </div>

          <div className="lg:pt-8">
            <Badge variant="gold">{founder.role_title ?? "Founder"}</Badge>
            <h2 className="mt-4 font-display text-display-xl text-ink-900">{founder.full_name}</h2>
            {founder.qualification && (
              <p className="mt-2 text-body-md font-medium text-slate-500">{founder.qualification}</p>
            )}
            {founder.institution && <p className="text-body-sm text-slate-500">{founder.institution}</p>}
            {founder.bio && <p className="mt-5 max-w-xl text-body-lg text-ink-900">{founder.bio}</p>}
            {founder.publications_count > 0 && (
              <p className="mt-5 text-body-sm font-medium uppercase tracking-wide text-gold-500">
                {founder.publications_count}+ PubMed-indexed publications
              </p>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

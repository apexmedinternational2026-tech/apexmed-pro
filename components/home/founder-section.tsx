import Image from "next/image";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { getInitials } from "@/lib/text";
import { isSupabaseStorageUrl } from "@/lib/supabase-storage-url";
import type { Mentor } from "@/lib/supabase/queries/mentors";

/**
 * Both leaders (Founder & Research Lead, Organizer) get equal billing here
 * — this used to show one founder alone; expanded to a leadership pair
 * per explicit request ("add pic of Dr Saqib" — he has a real photo but
 * wasn't appearing anywhere on the homepage, only on /mentors). Each row
 * keeps the original asymmetric photo/text treatment; alternating the
 * photo side (left/right) between rows is what keeps two back-to-back
 * copies of the same layout from reading as a template repeated twice.
 */
export function FounderSection({ leaders }: { leaders: Mentor[] }) {
  return (
    <Section theme="white" padding="lg">
      <Container className="flex flex-col gap-16">
        {leaders.map((leader, index) => (
          <div
            key={leader.id}
            className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-16"
          >
            <Reveal
              className={
                index % 2 === 1
                  ? "relative mx-auto w-full max-w-sm lg:order-2 lg:mx-0"
                  : "relative mx-auto w-full max-w-sm lg:mx-0"
              }
            >
              <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gold-500/10" aria-hidden="true" />
              {isSupabaseStorageUrl(leader.photo_url) ? (
                // next.config.mjs derives remotePatterns from
                // NEXT_PUBLIC_SUPABASE_URL automatically — Supabase Storage
                // URLs render here with no extra allowlist config needed.
                // overflow-hidden on the wrapper clips the hover zoom to the
                // rounded corners instead of the image spilling past them.
                <div className="aspect-[6/7] w-full overflow-hidden rounded-[1.75rem]">
                  <Image
                    src={leader.photo_url}
                    alt={leader.full_name}
                    width={480}
                    height={560}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex aspect-[6/7] w-full items-center justify-center rounded-[1.75rem] bg-navy-950">
                  <span className="font-display text-display-2xl text-gold-400">{getInitials(leader.full_name)}</span>
                </div>
              )}
            </Reveal>

            <div className="lg:pt-8">
              <Badge variant="gold">{leader.role_title ?? "Founder"}</Badge>
              <h2 className="mt-4 font-display text-display-xl text-ink-900">{leader.full_name}</h2>
              {leader.qualification && (
                <p className="mt-2 text-body-md font-medium text-slate-500">{leader.qualification}</p>
              )}
              {leader.institution && <p className="text-body-sm text-slate-500">{leader.institution}</p>}
              {leader.bio && <p className="mt-5 max-w-xl text-body-lg text-ink-900">{leader.bio}</p>}
              {leader.publications_count > 0 && (
                <p className="mt-5 text-body-sm font-medium uppercase tracking-wide text-gold-500">
                  {leader.publications_count}+ PubMed-indexed publications
                </p>
              )}
            </div>
          </div>
        ))}
      </Container>
    </Section>
  );
}

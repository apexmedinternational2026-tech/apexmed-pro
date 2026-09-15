import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ServiceIcon } from "@/components/ui/service-icon";
import { ArrowIcon } from "@/components/ui/icons";
import { accentStyle, resolveAccentToken } from "@/lib/accent";
import { SERVICES_MEGA_MENU } from "@/lib/navigation";
import type { ServiceSummary } from "@/lib/supabase/queries/services";

/**
 * The homepage's Services centrepiece (client's "Architecture Change"
 * brief, PART 3) — placed right after the trust strip, per explicit
 * request. Grouped into the same 3 headings as the navbar's Services
 * mega-menu ("Research card in Research section, Germany card in Germany
 * section..."), each group's own cards flowing in a horizontal wrapping
 * row rather than one uniform 3x3 grid of identical cards or a single
 * tall stacked column — the brief specifically warns a nine-identical-card
 * grid "reads as AI-generated"; grouped horizontal rows is the compact
 * version of that same "not a toy" instruction.
 */
export function ServicesGrid({ services }: { services: ServiceSummary[] }) {
  const byServiceSlug = new Map(services.map((service) => [service.slug, service]));

  return (
    <Section theme="light" padding="lg">
      <Container className="max-w-2xl">
        <p className="text-eyebrow uppercase text-gold-500">What We Do</p>
        <h2 className="mt-3 font-display text-display-lg text-ink-900">Our Services</h2>
        <p className="mt-3 text-body-lg text-slate-500">
          Research mentorship, German and international medical licensing pathways, Master&apos;s admissions
          guidance, and support beyond the exam room.
        </p>
      </Container>

      <Container className="mt-12 flex flex-col gap-10">
        {SERVICES_MEGA_MENU.map((group, groupIndex) => (
          <Reveal key={group.heading} threshold={0.1}>
            <h3 className="text-caption font-semibold uppercase tracking-wide text-slate-400">{group.heading}</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => {
                const service = byServiceSlug.get(item.slug);
                if (!service) return null;
                const accent = resolveAccentToken(service.accent_token);

                return (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    style={accentStyle(accent)}
                    className={groupPrimaryCardClass(groupIndex)}
                  >
                    <span
                      className="flex h-10 w-10 flex-none items-center justify-center rounded-xl"
                      style={{ backgroundColor: "var(--accent-surface)", color: "var(--accent-foreground)" }}
                      aria-hidden="true"
                    >
                      <ServiceIcon iconKey={service.icon_key} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-display-sm text-ink-900">
                        {service.short_name ?? service.name}
                      </span>
                      {service.summary && (
                        <span className="mt-1 block text-body-sm text-slate-500">{service.summary}</span>
                      )}
                    </span>
                    <ArrowIcon
                      aria-hidden="true"
                      className="mt-1 h-4 w-4 flex-none self-start text-slate-400 transition-transform group-hover:translate-x-0.5"
                      style={{ color: "var(--accent-text)" }}
                    />
                  </Link>
                );
              })}
            </div>
          </Reveal>
        ))}
      </Container>
    </Section>
  );
}

// Research & Publication (group 0) is the core business and has just the
// one card — sized up so it doesn't look like an afterthought next to the
// two denser groups. Everything else uses the compact treatment. The left
// border (not a filled background) is the accent — the brief's own
// instruction: nine full-colour cards would "look like a toy".
function groupPrimaryCardClass(groupIndex: number): string {
  const base =
    "group flex items-start gap-4 rounded-xl border border-navy-800/10 border-l-4 border-l-[var(--accent)] bg-white transition-colors hover:border-navy-800/20 hover:border-l-[var(--accent)]";
  return groupIndex === 0 ? `${base} p-6` : `${base} p-4`;
}

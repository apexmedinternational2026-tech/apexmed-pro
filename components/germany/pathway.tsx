import Link from "next/link";
import { cn } from "@/lib/cn";
import { ArrowIcon } from "@/components/ui/icons";
import type { GermanyPathwayStep } from "@/lib/germany-pathway";

/**
 * A connected, flowing sequence — stages linked by arrow connectors, with
 * duration labels — not a symmetric grid of ten identical boxes. Stages
 * with a detail page get a gold-bordered, clickable treatment; the rest
 * render as plain (still legible) stops along the same path.
 */
export function GermanyPathway({ steps }: { steps: GermanyPathwayStep[] }) {
  return (
    <div
      className="flex flex-wrap items-stretch gap-x-1 gap-y-8"
      aria-label={`Medical licensing pathway, ${steps.length} stages from German A1 to Facharzt`}
    >
      {steps.map((step, index) => {
        const card = (
          <div
            className={cn(
              "flex h-full w-44 flex-col gap-1.5 rounded-xl border p-4 transition-colors",
              step.href ? "border-gold-500/40 bg-navy-950 hover:border-gold-400" : "border-navy-800/30 bg-navy-950/50",
            )}
          >
            <span className="font-display text-display-sm text-paper-50">{step.label}</span>
            <span className="text-caption font-semibold uppercase tracking-wide text-gold-400">{step.duration}</span>
            <span className="text-caption text-paper-50/60">{step.description}</span>
          </div>
        );

        return (
          <div key={step.code} className="flex items-center gap-1">
            {step.href ? (
              <Link href={step.href} className="h-full rounded-xl focus-visible:outline-offset-4">
                {card}
              </Link>
            ) : (
              card
            )}
            {index < steps.length - 1 && (
              <ArrowIcon aria-hidden="true" className="h-4 w-4 flex-none text-gold-500/40" />
            )}
          </div>
        );
      })}
    </div>
  );
}

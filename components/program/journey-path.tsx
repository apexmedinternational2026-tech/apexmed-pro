import type { ProgramJourneyStep } from "@/lib/supabase/queries/programs";

/**
 * A horizontal-flowing sequence (wrapping into rows on narrow screens),
 * deliberately different from the homepage's vertical How It Works path —
 * the brief asks for heading sizes and section rhythm to vary
 * deliberately across the site, and the same applies to a repeated
 * "journey" pattern showing up on every program page.
 */
export function JourneyPath({ steps }: { steps: ProgramJourneyStep[] }) {
  return (
    <ol className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, index) => (
        <li key={step.id} className="flex flex-col gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full font-display text-body-sm font-semibold"
            style={{ backgroundColor: "var(--accent-surface)", color: "var(--accent-foreground)" }}
          >
            {index + 1}
          </span>
          <h3 className="mt-1 font-display text-display-sm text-ink-900">{step.step_label}</h3>
          {step.description && <p className="text-body-sm text-slate-500">{step.description}</p>}
        </li>
      ))}
    </ol>
  );
}

import type { MastersJourneyStage } from "@/lib/masters-content";

/**
 * A numbered grid path, deliberately different from both the homepage's
 * vertical How It Works line and Germany's horizontal arrow-connected
 * pathway — the same "numbered sequence" idea shouldn't render identically
 * on every page that needs one.
 */
export function MastersJourney({ stages }: { stages: MastersJourneyStage[] }) {
  return (
    <ol className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {stages.map((stage, index) => (
        <li key={stage.label} className="flex flex-col gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-950 font-display text-body-sm font-semibold text-gold-400">
            {index + 1}
          </span>
          <h3 className="mt-1 font-display text-display-sm text-ink-900">{stage.label}</h3>
          <p className="text-body-sm text-slate-500">{stage.description}</p>
        </li>
      ))}
    </ol>
  );
}

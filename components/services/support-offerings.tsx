import type { SupportServiceOffering } from "@/lib/supabase/queries/support-services";

export function SupportOfferings({ offerings }: { offerings: SupportServiceOffering[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {offerings.map((offering) => (
        <div key={offering.id} className="rounded-xl border border-navy-800/10 bg-white p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-display-sm text-ink-900">{offering.title}</h3>
            {offering.is_free && (
              <span
                className="flex-none rounded-full px-2.5 py-0.5 text-caption font-semibold uppercase tracking-wide"
                style={{ backgroundColor: "var(--accent-surface)", color: "var(--accent-foreground)" }}
              >
                Free
              </span>
            )}
          </div>
          {offering.description && <p className="mt-2 text-body-sm text-slate-500">{offering.description}</p>}
        </div>
      ))}
    </div>
  );
}

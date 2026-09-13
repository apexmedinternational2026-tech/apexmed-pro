import type { ProgramAudience } from "@/lib/supabase/queries/programs";

export function AudienceGrid({ audiences }: { audiences: ProgramAudience[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {audiences.map((audience) => (
        <div key={audience.id} className="flex items-start gap-3 rounded-xl border border-navy-800/10 bg-paper-50 p-5">
          <span
            className="mt-2 h-2 w-2 flex-none rounded-full"
            style={{ backgroundColor: "var(--accent-surface)" }}
            aria-hidden="true"
          />
          <p className="text-body-md text-ink-900">{audience.label}</p>
        </div>
      ))}
    </div>
  );
}

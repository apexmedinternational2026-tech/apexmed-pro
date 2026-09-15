import type { CrisisResource } from "@/lib/supabase/queries/support-services";

/**
 * Server Component, rendered directly into the page's HTML — never behind
 * an accordion, a tab, client-side fetch, or a scroll reveal. Someone
 * reading this in a crisis should never have to wait on JavaScript, a
 * click, or an animation to see it (PART 5's explicit requirement).
 * Deliberately plain — bordered, not a bright alert color, no urgency
 * styling. This page is read by people who may be struggling; it should
 * feel calm, not sold to (PART 5's own tone instruction, applied here too).
 */
export function EmergencyBlock({ resources }: { resources: CrisisResource[] }) {
  return (
    <div role="note" aria-label="Emergency information" className="border-2 border-error/30 bg-error/5 p-6 sm:p-8">
      <p className="text-body-lg font-semibold text-ink-900">
        If you are in immediate danger or thinking of harming yourself, please contact emergency services or go to
        your nearest emergency department now.
      </p>

      {resources.length > 0 && (
        <dl className="mt-5 flex flex-col gap-3">
          {resources.map((resource) => (
            <div key={resource.id} className="flex flex-col gap-0.5">
              <dt className="text-body-sm font-semibold text-ink-900">
                {resource.country} — {resource.organisation}
                {resource.hours && <span className="font-normal text-slate-500"> · {resource.hours}</span>}
              </dt>
              <dd className="text-body-md font-medium text-ink-900">{resource.phone}</dd>
              {resource.notes && <dd className="text-body-sm text-slate-500">{resource.notes}</dd>}
            </div>
          ))}
        </dl>
      )}

      <p className="mt-5 text-body-sm text-slate-500">
        ApexMed&apos;s counselling service is not an emergency service and cannot respond to crises.
      </p>
    </div>
  );
}

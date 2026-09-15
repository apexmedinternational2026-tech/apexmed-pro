import { ServiceIcon } from "@/components/ui/service-icon";
import type { InitiativeSection } from "@/lib/supabase/queries/initiatives";

/** Server Component — Green Earth's sections have no interactivity, unlike
 * the AI course's accordion, so this doesn't need "use client" at all. */
export function InitiativeSections({ sections }: { sections: InitiativeSection[] }) {
  return (
    <div className="flex flex-col gap-10">
      {sections.map((section) => (
        <div key={section.id}>
          <div className="flex items-center gap-3">
            {section.icon_key && (
              <span
                className="flex h-9 w-9 flex-none items-center justify-center rounded-lg"
                style={{ backgroundColor: "var(--accent-surface)", color: "var(--accent-foreground)" }}
                aria-hidden="true"
              >
                <ServiceIcon iconKey={section.icon_key} className="h-4.5 w-4.5" />
              </span>
            )}
            <h3 className="font-display text-display-sm text-ink-900">{section.title}</h3>
          </div>
          {section.description && <p className="mt-2 max-w-2xl text-body-sm text-slate-500">{section.description}</p>}
          {section.items.length > 0 && (
            <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {section.items.map((item) => (
                <li key={item.id} className="flex items-start gap-2.5 text-body-sm text-ink-900">
                  <span
                    className="mt-2 h-1.5 w-1.5 flex-none rounded-full"
                    style={{ backgroundColor: "var(--accent-surface)" }}
                    aria-hidden="true"
                  />
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

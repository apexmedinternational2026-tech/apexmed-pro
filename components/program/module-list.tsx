import { IconList } from "@/components/ui/icon-list";
import type { ProgramModule } from "@/lib/supabase/queries/programs";
import type { AccentToken } from "@/lib/accent";

export interface ModuleListProps {
  modules: ProgramModule[];
  accent: AccentToken;
}

/**
 * Bold numbered blocks rather than a plain list — closer to how the
 * printed program banners lay modules out as sequential, numbered panels.
 * The number badge uses --accent-surface/--accent-foreground (not the raw
 * --accent hue as text) because that's the one pairing verified AA-safe
 * for every family, including research and gold, whose vivid hue is too
 * light to read as text on this card's white background.
 */
export function ModuleList({ modules, accent }: ModuleListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {modules.map((module, index) => (
        <div key={module.id} className="rounded-2xl border border-navy-800/10 bg-white p-7">
          <div className="flex items-start gap-4">
            <span
              className="flex h-14 w-14 flex-none items-center justify-center rounded-xl font-display text-display-sm font-bold"
              style={{ backgroundColor: "var(--accent-surface)", color: "var(--accent-foreground)" }}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="pt-1">
              <h3 className="font-display text-display-sm text-ink-900">{module.title}</h3>
              {module.description && <p className="mt-1 text-body-sm text-slate-500">{module.description}</p>}
            </div>
          </div>
          <IconList accent={accent} items={module.items.map((item) => item.label)} className="mt-5" />
        </div>
      ))}
    </div>
  );
}

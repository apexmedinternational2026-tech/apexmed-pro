import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CalloutType = "info" | "warning" | "tip";

const STYLES: Record<CalloutType, { border: string; bg: string; label: string }> = {
  info: { border: "border-l-product-blue", bg: "bg-product-blue/5", label: "Note" },
  warning: { border: "border-l-error", bg: "bg-error/5", label: "Watch out" },
  tip: { border: "border-l-gold-500", bg: "bg-gold-500/10", label: "Mentor tip" },
};

/** MDX shortcode: <Callout type="tip">...</Callout> — one of the four required custom components. */
export function Callout({ type = "info", children }: { type?: CalloutType; children: ReactNode }) {
  const style = STYLES[type];

  return (
    <div className={cn("rounded-r-lg border-l-4 p-4", style.border, style.bg)}>
      <p className="text-caption font-semibold uppercase tracking-wide text-slate-500">{style.label}</p>
      <div className="mt-1.5 text-body-md text-ink-900 [&>p]:m-0">{children}</div>
    </div>
  );
}

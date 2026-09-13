import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { accentStyle, type AccentToken } from "@/lib/accent";

const badgeVariants = cva(
  "inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-caption font-body uppercase",
  {
    variants: {
      variant: {
        neutral: "border-navy-800/25 bg-navy-950/5 text-navy-950",
        gold: "border-gold-500/40 bg-gold-500/15 text-navy-950",
        // Colors come from the --accent CSS vars set by the `accent` prop
        // (see lib/accent.ts) rather than a per-family class here — that's
        // what lets one Badge implementation serve five product families.
        accent:
          "border-[color-mix(in_srgb,var(--accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent-text)]",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  accent?: AccentToken;
}

export function Badge({ className, variant, accent, style, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant: accent ? "accent" : variant }), className)}
      style={accent ? { ...accentStyle(accent), ...style } : style}
      {...props}
    />
  );
}

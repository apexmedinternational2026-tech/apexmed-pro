import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const sectionVariants = cva("w-full", {
  variants: {
    theme: {
      light: "bg-paper-50 text-ink-900",
      white: "bg-white text-ink-900",
      navy: "bg-navy-950 text-paper-50",
    },
    // Four distinct rhythm steps, not one padding reused everywhere — a
    // page should mix these deliberately. See --spacing-section-* in
    // app/globals.css.
    padding: {
      sm: "py-section-sm",
      md: "py-section-md",
      lg: "py-section-lg",
      xl: "py-section-xl",
    },
  },
  defaultVariants: {
    theme: "light",
    padding: "md",
  },
});

export interface SectionProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof sectionVariants> {
  as?: "section" | "div" | "header" | "footer";
  /** Adds the gold-foil grain overlay (app/globals.css) — intended for `theme="navy"` only. */
  noise?: boolean;
}

export function Section({ className, theme, padding, noise = false, as: Tag = "section", ...props }: SectionProps) {
  return <Tag className={cn(sectionVariants({ theme, padding }), noise && "gold-foil-noise", className)} {...props} />;
}

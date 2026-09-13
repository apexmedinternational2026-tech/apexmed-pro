import * as React from "react";
import { cn } from "@/lib/cn";
import { accentStyle, type AccentToken } from "@/lib/accent";
import { CheckIcon } from "./icons";

export interface IconListProps extends React.HTMLAttributes<HTMLUListElement> {
  items: React.ReactNode[];
  accent?: AccentToken;
}

/**
 * The checkmark list used throughout program pages (module items,
 * audience lists, "what's included"). Centralized here so every instance
 * shares the same marker, spacing, and accent behavior instead of each
 * page hand-rolling its own `<ul>` + inline check icon.
 */
export function IconList({ items, accent, className, style, ...props }: IconListProps) {
  return (
    <ul
      className={cn("flex flex-col gap-3", className)}
      style={accent ? { ...accentStyle(accent), ...style } : style}
      {...props}
    >
      {items.map((item, index) => (
        // Items are static, editor-authored copy for a given render — index
        // is a stable and appropriate key here, not a substitute for a
        // real id from dynamic/reorderable data.
        <li key={index} className="flex items-start gap-3 text-body-md text-ink-900">
          {/* Solid surface+foreground, not a light tint of the vivid accent
              plus the vivid accent as the icon color: for research and gold,
              the vivid hue is light-toned and nearly invisible against a
              near-white tint (~1.8:1) — surface+foreground is the one pair
              verified AA-safe for every family (lib/accent.test.ts). */}
          <span
            className={cn(
              "mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full",
              !accent && "bg-navy-950",
            )}
            style={accent ? { backgroundColor: "var(--accent-surface)" } : undefined}
          >
            <CheckIcon
              aria-hidden="true"
              className={cn("h-3 w-3", !accent && "text-gold-500")}
              style={accent ? { color: "var(--accent-foreground)" } : undefined}
            />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Tailwind v4's @theme block (app/globals.css) defines custom color names
// (navy-950, gold-500, product-blue, ...) and custom font-size names
// (display-2xl, body-md, ...) that stock tailwind-merge doesn't know
// about. Without this extension, its naive `text-*` matcher treats a
// font-size utility (text-display-sm) and a color utility (text-paper-50)
// as the SAME conflicting group and silently drops one — verified:
// `twMerge("text-display-sm text-ink-900", "text-paper-50")` returns just
// `text-paper-50`, losing the size/line-height/tracking entirely. Teaching
// it our real token names fixes that.
const CUSTOM_COLORS = [
  "navy-950",
  "navy-900",
  "navy-800",
  "gold-500",
  "gold-400",
  "gold-300",
  "ink-900",
  "slate-500",
  "paper-50",
  "product-research",
  "product-blue",
  "product-blue-ink",
  "product-green",
  "product-green-highlight",
  "product-gold",
  "product-gold-bg",
  "product-master",
  "error",
];

const CUSTOM_FONT_SIZES = [
  "display-2xl",
  "display-xl",
  "display-lg",
  "display-md",
  "display-sm",
  "eyebrow",
  "body-lg",
  "body-md",
  "body-sm",
  "caption",
];

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: CUSTOM_FONT_SIZES }],
      "text-color": [{ text: CUSTOM_COLORS }],
      "bg-color": [{ bg: CUSTOM_COLORS }],
      "border-color": [{ border: CUSTOM_COLORS }],
    },
  },
});

// Combines conditional class logic (clsx) with Tailwind conflict
// resolution (twMerge), so a caller can override e.g. `p-4` from a parent
// with `p-6` without both classes fighting in the final class string.
export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

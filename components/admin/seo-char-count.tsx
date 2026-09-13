import { cn } from "@/lib/cn";

export interface SeoCharCountProps {
  value: string;
  min: number;
  max: number;
}

/**
 * Live character count against the target range, shown under every
 * SEO title/description field in the CMS — the same 50-60 / 140-160
 * targets the public site's own metadata helper warns about in dev, made
 * visible here to whoever is actually typing the copy.
 */
export function SeoCharCount({ value, min, max }: SeoCharCountProps) {
  const length = value.length;
  const inRange = length >= min && length <= max;

  return (
    <p className={cn("text-caption", inRange ? "text-slate-500" : "text-error")}>
      {length} characters (target {min}–{max})
    </p>
  );
}

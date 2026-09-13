import { cn } from "@/lib/cn";
import { MIN_FIELD_PAGE_WORDS } from "@/lib/content-length";

/**
 * Surfaces the same publish threshold the Server Action enforces
 * (lib/actions/admin/study-fields.ts) live while editing, so an editor
 * sees the gap before hitting "publish" and getting rejected, not instead
 * of that check.
 */
export function WordCountIndicator({ wordCount }: { wordCount: number }) {
  const meetsThreshold = wordCount >= MIN_FIELD_PAGE_WORDS;

  return (
    <p className={cn("text-caption", meetsThreshold ? "text-slate-500" : "text-error")}>
      {wordCount} words across all sections (minimum {MIN_FIELD_PAGE_WORDS} to publish)
      {!meetsThreshold && ` — ${MIN_FIELD_PAGE_WORDS - wordCount} more needed`}
    </p>
  );
}

// Enforces the "don't publish thin programmatic pages" rule for
// /masters/fields/[slug]. Search engines penalize thin, near-duplicate
// programmatic content — this is checked in the admin publish action
// (lib/actions/admin/study-fields.ts), not just documented as a policy,
// so a thin page can't ship by accident.
export const MIN_FIELD_PAGE_WORDS = 400;

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export interface StudyFieldContentFields {
  overview?: string | null;
  typical_universities?: string | null;
  entry_requirements?: string | null;
  language_requirements?: string | null;
  career_outlook?: string | null;
}

/** Combined word count across every content section of a study field page — the same sections the public page actually renders. */
export function getStudyFieldWordCount(fields: StudyFieldContentFields): number {
  return [
    fields.overview,
    fields.typical_universities,
    fields.entry_requirements,
    fields.language_requirements,
    fields.career_outlook,
  ]
    .filter((section): section is string => Boolean(section && section.trim()))
    .reduce((total, section) => total + countWords(section), 0);
}

const WORDS_PER_MINUTE = 200;

/** Fallback estimate for a blog post's reading time when reading_minutes isn't set explicitly by an editor. */
export function estimateReadingMinutes(text: string): number {
  return Math.max(1, Math.round(countWords(text) / WORDS_PER_MINUTE));
}

import { cn } from "@/lib/cn";

const FALLBACK_DISCLAIMER =
  "Outcomes such as admission, licensing, visa issuance, employment, residency placement, or publication are not guaranteed and depend on the decisions of the relevant institutions and authorities.";

export interface ComplianceNoteProps {
  /**
   * Required, not optional — a program page component tree that renders a
   * <ComplianceNote> without a body simply won't compile. This is the
   * enforcement mechanism for CLAUDE.md rule 9: it must be structurally
   * impossible to build a program page that forgets its legal disclaimer.
   */
  body: string;
  className?: string;
}

/**
 * Renders a program's compliance disclaimer. `body` should always be
 * non-empty in practice — programs.disclaimer_key is NOT NULL and FK'd to
 * compliance_disclaimers, and getProgramBySlug() already throws if that
 * join fails to resolve. The empty-string branch below exists only as a
 * last line of defense against that invariant somehow being violated
 * (a bad manual query, a future refactor) — it must never be reached, but
 * if it is, this must fail loudly in development rather than quietly
 * rendering nothing, and it must never render zero disclaimer text even
 * in production.
 */
export function ComplianceNote({ body, className }: ComplianceNoteProps) {
  const trimmed = body.trim();
  const isMissing = trimmed.length === 0;

  if (isMissing && process.env.NODE_ENV !== "production") {
    return (
      <div
        role="alert"
        className={cn("rounded-lg border-2 border-error bg-error/10 p-5 text-body-sm text-error", className)}
      >
        <p className="font-semibold">ComplianceNote received an empty disclaimer body.</p>
        <p className="mt-1">
          This is a legal requirement (CLAUDE.md rule 9), not a rendering bug to silently work around. Check the
          program&apos;s disclaimer_key and the matching row in compliance_disclaimers.
        </p>
      </div>
    );
  }

  return (
    <aside
      role="note"
      aria-label="Legal disclaimer"
      className={cn("rounded-lg border border-navy-800/15 bg-navy-950/5 p-5", className)}
    >
      <p className="text-caption font-semibold uppercase tracking-wide text-slate-500">Important information</p>
      <p className="mt-1.5 text-body-sm text-slate-500">{isMissing ? FALLBACK_DISCLAIMER : trimmed}</p>
    </aside>
  );
}

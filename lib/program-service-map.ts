// Where a Membership Card's "View program" link goes now that Services is
// the site's primary presentation layer — "Research Card shift to
// Research, Germany Card shift to Germany" (explicit client request). Cards
// stay their own separate section (client's Q1 answer keeps /programs and
// the homepage's Membership Cards band as-is), but each links into its
// relevant Service instead of standing alone at /programs/[slug]. Shared
// between the homepage ProgramGrid and the /programs catalog so the two
// can't drift onto different mappings.
const PROGRAM_TO_SERVICE_SLUG: Record<string, string> = {
  "apexmed-research-card": "research",
  "master-meta-analysis-card": "research",
  "cdc-specialist-card": "research",
  "blue-card": "german-medical",
  "green-card": "german-medical",
  "gold-card": "german-medical",
  "master-card": "germany-masters",
};

/** Falls back to /programs/[slug] for any Card not yet mapped above, so a
 * new Card never links nowhere. */
export function resolveCardHref(programSlug: string): string {
  const serviceSlug = PROGRAM_TO_SERVICE_SLUG[programSlug];
  return serviceSlug ? `/services/${serviceSlug}` : `/programs/${programSlug}`;
}

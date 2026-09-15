// Shared label maps for application data — used by the public application
// form AND the admin applications views, so the two can never drift into
// showing different labels for the same underlying enum value. Mirrors the
// same pattern as lib/leads.ts.

export const EDUCATION_LEVEL_LABELS: Record<string, string> = {
  medical_student: "Medical Student",
  mbbs: "MBBS",
  bds: "BDS",
  postgraduate: "Postgraduate Doctor",
  other: "Other",
};

export const APPLICATION_STATUS_OPTIONS = ["pending", "under_review", "accepted", "rejected"] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUS_OPTIONS)[number];

// Record<string, ...>, not Record<ApplicationStatus, ...> — same reason as
// LEAD_STATUS_LABELS: a row read back from the generated types carries
// `status` as a plain `string` (a `text ... check (...)` column isn't
// narrowed to a literal union), so callers indexing this map with
// `application.status` need a string-keyed lookup.
export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  under_review: "Under Review",
  accepted: "Accepted",
  rejected: "Rejected",
};

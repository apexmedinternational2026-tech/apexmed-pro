// Shared label maps for lead data — used by the public profile-assessment
// form AND the admin leads views, so the two can never drift into showing
// different labels for the same underlying enum value.

export const CURRENT_STATUS_LABELS: Record<string, string> = {
  medical_student: "Medical Student",
  medical_graduate: "Medical Graduate",
  doctor: "Doctor",
  fcps_trainee: "FCPS Trainee",
  postgraduate_doctor: "Postgraduate Doctor",
  resident: "Resident",
  consultant: "Consultant",
  researcher: "Researcher",
  healthcare_professional: "Healthcare Professional",
  other: "Other",
};

export const INTEREST_TYPE_LABELS: Record<string, string> = {
  apexmed_research_card: "ApexMed Research Card",
  master_meta_analysis_card: "Master Meta-Analysis Card",
  cdc_specialist_card: "CDC Specialist Card",
  blue_card: "Blue Card",
  green_card: "Green Card",
  gold_card: "Gold Card",
  master_card: "Master Card",
  international_exams: "International Licensing & Exams",
  ai_course: "AI for Healthcare Practitioners",
  green_earth: "Green Earth Initiative",
  counselling: "Mental Health Support",
  general_inquiry: "General Inquiry",
};

export const LEAD_STATUS_OPTIONS = ["new", "contacted", "qualified", "converted", "closed"] as const;

export type LeadStatus = (typeof LEAD_STATUS_OPTIONS)[number];

// Keyed as Record<string, ...> rather than Record<LeadStatus, ...>: a row
// read back from the database types `status` as a plain `string` (the
// generated types don't narrow a `text ... check (...)` column to a
// literal union), so callers indexing this map with `lead.status` need a
// string-keyed lookup, not one that only accepts the five known values.
export const LEAD_STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  converted: "Converted",
  closed: "Closed",
};

/** Resolves what to show in "grouped by program" views for a lead that may or may not carry a program_id. */
export function describeLeadInterest(interestType: string | null, programName: string | null): string {
  if (programName) return programName;
  if (interestType) return INTEREST_TYPE_LABELS[interestType] ?? interestType;
  return "General Inquiry";
}

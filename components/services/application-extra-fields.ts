// Per-service extra questions for the application form — jsonb-driven on
// the applications table (extra_fields), not a column per question, since
// the question set differs per service and grows without a migration every
// time one is added. Keep this file's keys in sync with SERVICES_MEGA_MENU
// in lib/navigation.ts if a service slug ever changes.

export type ApplicationExtraFieldType = "text" | "textarea" | "select";

export interface ApplicationExtraField {
  key: string;
  label: string;
  type: ApplicationExtraFieldType;
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

const RESEARCH_FIELDS: ApplicationExtraField[] = [
  {
    key: "research_interest",
    label: "Which service are you most interested in?",
    type: "select",
    required: true,
    options: [
      { value: "original_research", label: "Original Research" },
      { value: "meta_analysis", label: "Meta-Analysis" },
      { value: "cdc_wonder", label: "CDC WONDER Database Research" },
      { value: "medical_writing", label: "Medical Writing / Manuscript Support" },
      { value: "not_sure", label: "Not sure yet — need guidance" },
    ],
  },
  {
    key: "prior_publications",
    label: "Do you have any prior publications or manuscripts in progress?",
    type: "textarea",
    required: false,
    placeholder: "Briefly describe, or leave blank if this is your first.",
  },
];

const GERMAN_PATHWAY_FIELDS: ApplicationExtraField[] = [
  {
    key: "german_level",
    label: "Current German language level",
    type: "select",
    required: true,
    options: [
      { value: "none", label: "None yet" },
      { value: "a1", label: "A1" },
      { value: "a2", label: "A2" },
      { value: "b1", label: "B1" },
      { value: "b2", label: "B2" },
      { value: "c1_plus", label: "C1 or higher" },
    ],
  },
  {
    key: "target_intake",
    label: "Target intake (e.g. Winter 2027)",
    type: "text",
    required: false,
  },
];

const EXAM_PATHWAY_FIELDS: ApplicationExtraField[] = [
  {
    key: "exam_stage",
    label: "Which stage are you preparing for?",
    type: "text",
    required: true,
    placeholder: "e.g. Step 1, PLAB 2, MRCP Part 1, AMC CAT MCQ",
  },
  {
    key: "target_date",
    label: "Target exam date, if known",
    type: "text",
    required: false,
  },
];

const AI_HEALTHCARE_FIELDS: ApplicationExtraField[] = [
  {
    key: "clinical_role",
    label: "Current clinical role",
    type: "text",
    required: true,
    placeholder: "e.g. Final-year MBBS student, House Officer, Consultant",
  },
];

const GREEN_EARTH_FIELDS: ApplicationExtraField[] = [
  {
    key: "involvement_type",
    label: "How would you like to get involved?",
    type: "select",
    required: true,
    options: [
      { value: "volunteer", label: "Volunteer" },
      { value: "partner_organization", label: "Partner Organization" },
      { value: "sponsor", label: "Sponsor / Donor" },
      { value: "other", label: "Other" },
    ],
  },
];

export const APPLICATION_EXTRA_FIELDS: Record<string, ApplicationExtraField[]> = {
  research: RESEARCH_FIELDS,
  "german-medical": GERMAN_PATHWAY_FIELDS,
  "germany-masters": GERMAN_PATHWAY_FIELDS,
  usmle: EXAM_PATHWAY_FIELDS,
  plab: EXAM_PATHWAY_FIELDS,
  mrcp: EXAM_PATHWAY_FIELDS,
  amc: EXAM_PATHWAY_FIELDS,
  "ai-healthcare": AI_HEALTHCARE_FIELDS,
  "green-earth": GREEN_EARTH_FIELDS,
};

/** mental-health is deliberately absent — that page has no lead/application capture anywhere (see NO_LEAD_FORM_SLUGS in app/(public)/services/[slug]/page.tsx). */
export function getApplicationExtraFields(serviceSlug: string): ApplicationExtraField[] {
  return APPLICATION_EXTRA_FIELDS[serviceSlug] ?? [];
}

/** Whether a CV upload is relevant to this service's application. */
export function shouldShowCvUpload(serviceSlug: string): boolean {
  return serviceSlug !== "green-earth";
}

export interface GermanyPathwayStep {
  code: string;
  label: string;
  duration: string;
  description: string;
  /** Present only for stages that have their own detail page. */
  href?: string;
}

// The full medical licensing pathway, A1 through Facharzt. Only four
// stages have a dedicated detail page today (FSP, KP, Approbation,
// Facharzt) — the rest are covered by the German Dream Cards
// (/programs?family=german-dream) rather than a standalone page.
export const GERMANY_PATHWAY: GermanyPathwayStep[] = [
  {
    code: "A1",
    label: "German A1",
    duration: "~2 months",
    description: "Beginner: alphabet, everyday vocabulary, and basic conversation.",
  },
  {
    code: "A2",
    label: "German A2",
    duration: "~2 months",
    description: "Elementary: past tense, expanded vocabulary, simple written communication.",
  },
  {
    code: "B1",
    label: "German B1",
    duration: "~2–4 months",
    description: "Intermediate: complex sentences; medical-context vocabulary begins.",
  },
  {
    code: "B2",
    label: "German B2",
    duration: "~4–6 months",
    description: "Upper-intermediate: fluency for daily life and the start of clinical language.",
  },
  {
    code: "Medical German",
    label: "Medical German",
    duration: "~8 weeks",
    description: "Fachsprache: patient history-taking, documentation, clinical terms.",
  },
  {
    code: "FSP",
    label: "FSP",
    duration: "~6 weeks prep",
    description: "Fachsprachprüfung — the medical language exam.",
    href: "/germany/fsp",
  },
  {
    code: "KP",
    label: "KP",
    duration: "~8 weeks prep",
    description: "Kenntnisprüfung — the clinical knowledge exam.",
    href: "/germany/kp",
  },
  {
    code: "Approbation",
    label: "Approbation",
    duration: "Application + review",
    description: "The full medical license application to the Bundesland authority.",
    href: "/germany/approbation",
  },
  {
    code: "Hospital Application",
    label: "Hospital Application",
    duration: "Ongoing",
    description: "Applying to hospitals for Assistenzarzt positions across Germany.",
  },
  {
    code: "Facharzt",
    label: "Facharzt",
    duration: "4–6 years",
    description: "Specialist training — the final stage of the medical pathway.",
    href: "/germany/facharzt",
  },
];

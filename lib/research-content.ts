// Static content for /research and /research/fcps-pmdc-support — copy
// taken directly from the client's Phase 1 content brief, not invented
// here. Distinct from lib/germany-content.ts's per-slug detail pages: this
// describes curriculum topics taught across the three research-family
// Cards (see supabase/seed.sql's programs table), not a single purchasable
// program with its own detail route.

export interface ResearchCourse {
  title: string;
  duration: string;
  topics: string[];
}

export const RESEARCH_COURSES: ResearchCourse[] = [
  {
    title: "Complete Research Mastery Course",
    duration: "Approximately 6 weeks",
    topics: [
      "Research methodology and fundamentals",
      "Study designs",
      "Research questions",
      "Literature searching",
      "Data collection and management",
      "Descriptive and inferential statistics",
      "SPSS",
      "Research writing",
      "Manuscript preparation",
      "Journal selection and submission",
      "Peer review",
      "Publication strategy",
      "Practical lectures and real projects",
      "Zotero and Mendeley",
      "Manuscript feedback and publication guidance",
    ],
  },
  {
    title: "Complete CDC WONDER Research Course",
    duration: "Approximately 1 month",
    topics: [
      "CDC WONDER fundamentals",
      "Research questions using public-health datasets",
      "Data access, extraction and cleaning",
      "Statistical analysis",
      "Epidemiological tables and figures",
      "Interpretation of findings",
      "Manuscript writing",
      "Journal selection and publication strategy",
      "Support for suitable PubMed-indexed submissions",
    ],
  },
  {
    title: "Complete Meta-Analysis Training",
    duration: "Approximately 4–6 weeks",
    topics: [
      "Systematic review and meta-analysis",
      "Research question development",
      "Literature searching",
      "Study screening and selection",
      "Inclusion and exclusion criteria",
      "Data extraction",
      "Risk of bias",
      "Effect sizes",
      "Forest and funnel plots",
      "Heterogeneity",
      "Subgroup and sensitivity analysis",
      "R programming",
      "Manuscript preparation",
      "Journal selection and submission",
      "Publication guidance",
    ],
  },
  {
    title: "Medical Research Writing & Publication Course",
    duration: "2–6 weeks depending on module",
    topics: [
      "Scientific and medical writing",
      "Narrative reviews",
      "Letters to the Editor",
      "Case reports",
      "Literature searching",
      "Manuscript structure",
      "Journal selection",
      "Submission process",
      "Reviewer responses",
      "Publication strategy",
    ],
  },
  {
    title: "Letters to the Editor (LTE) Training",
    duration: "Short-format module",
    topics: [
      "What an LTE is",
      "Topic selection",
      "Scientific writing",
      "Structure and formatting",
      "Journal selection",
      "Submission guidance",
    ],
  },
  {
    title: "Narrative Review Training",
    duration: "Short-format module",
    topics: [
      "Literature searching",
      "Organization of evidence",
      "Critical reading",
      "Evidence synthesis",
      "Writing",
      "Publication format",
    ],
  },
  {
    title: "Case Report Training",
    duration: "Short-format module",
    topics: ["Case selection", "Structure", "Clinical and scientific writing", "Ethics", "Journal selection", "Submission guidance"],
  },
  {
    title: "Clinical Audit Training",
    duration: "Approximately 4–6 weeks",
    topics: [
      "Audit topic",
      "Standards and criteria",
      "Design",
      "Data collection",
      "Data analysis",
      "Improvement planning",
      "Reporting",
      "Publication preparation where appropriate",
    ],
  },
  {
    title: "Synopsis Writing — CPSP / FCPS",
    duration: "Short-format module",
    topics: [
      "Research topic",
      "Research question",
      "Synopsis structure",
      "Literature review",
      "Methodology",
      "Sample-size concepts",
      "Data collection",
      "Statistical planning",
      "Technical writing",
      "Formatting",
      "Approval-ready preparation",
    ],
  },
];

export const FCPS_PMDC_CONTENT = {
  intro:
    "ApexMed supports FCPS trainees, medical residents, postgraduate doctors, PMDC-registered doctors, consultants, senior doctors, medical students and healthcare professionals across multiple specialties.",
  supports: [
    "Research idea and question",
    "Study design",
    "Methodology",
    "Data collection",
    "Data analysis",
    "SPSS",
    "Manuscript writing",
    "Journal selection",
    "Submission",
    "Reviewer responses",
    "Publication process",
  ],
  specialties: [
    "Medicine",
    "Surgery",
    "Pediatrics",
    "Cardiology",
    "Neurology",
    "Psychiatry",
    "Radiology",
    "Dermatology",
    "Obstetrics & Gynecology",
    "Orthopedics",
    "ENT",
    "Ophthalmology",
    "Dentistry",
    "Public Health",
    "Allied Health",
    "Other healthcare specialties",
  ],
  pathway: [
    "Research idea",
    "Protocol and study planning",
    "Data collection",
    "Data analysis",
    "Manuscript preparation",
    "Journal selection",
    "Submission",
    "Revision and reviewer response",
    "Publication process",
  ],
};

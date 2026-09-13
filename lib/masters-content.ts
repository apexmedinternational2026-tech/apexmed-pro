export interface MastersJourneyStage {
  label: string;
  description: string;
}

export const MASTERS_JOURNEY: MastersJourneyStage[] = [
  {
    label: "Profile Assessment",
    description: "We review your academic background, German level, and goals to identify realistic program options.",
  },
  {
    label: "University & Program Selection",
    description: "Shortlist universities and Master's programs matched to your field, budget, and language level.",
  },
  {
    label: "Application Preparation",
    description:
      "Statement of purpose, CV formatting, and recommendation letter coordination, built around each program's requirements.",
  },
  {
    label: "Submission",
    description:
      "Applications go through uni-assist or directly to universities, with every document checked against deadlines.",
  },
  {
    label: "Admission",
    description:
      "Track offers and conditional admissions, and respond to any additional requirements universities request.",
  },
  {
    label: "Visa Preparation",
    description:
      "Prepare your student visa application, including financial proof (blocked account) and required documentation.",
  },
  {
    label: "Pre-Departure",
    description:
      "Housing guidance, enrollment logistics, and a pre-departure checklist so nothing is left to the last week.",
  },
  {
    label: "Germany",
    description: "Arrival support and continued mentorship as you settle into your program.",
  },
];

export const WHY_GERMANY_POINTS = [
  {
    title: "Low or No Tuition Fees",
    description:
      "Most public universities charge little to no tuition — typically only a modest semester contribution.",
  },
  {
    title: "Globally Recognized Degrees",
    description: "German Master's degrees are respected internationally across research and industry.",
  },
  {
    title: "Strong Research Culture",
    description: "Access to well-funded labs, research groups, and supervisors active in your field.",
  },
  {
    title: "Post-Study Work Options",
    description: "Graduates can apply for an 18-month residence permit to search for qualifying work.",
  },
];

export const ELIGIBILITY_POINTS = [
  "A relevant Bachelor's degree (or equivalent) recognized by German universities.",
  "Academic transcripts meeting the program's minimum grade requirements.",
  "Language proficiency matching the program's medium of instruction (German or English).",
  "Program-specific prerequisites — some Master's programs require particular undergraduate coursework.",
];

export const LANGUAGE_REQUIREMENTS = [
  { program: "German-taught programs", requirement: "Typically DSH-2, TestDaF 4×4, or equivalent (roughly C1)." },
  {
    program: "English-taught programs",
    requirement: "Typically IELTS 6.5+ or TOEFL iBT 90+, depending on the university.",
  },
  {
    program: "Mixed / research programs",
    requirement: "Varies by department — some accept B2 German plus working English.",
  },
];

export const REQUIRED_DOCUMENTS = [
  "Bachelor's degree certificate and transcript of records (certified translation if not already in German or English)",
  "Language certificate(s) matching the program's medium of instruction",
  "CV in the tabular (Europass-style) format German universities expect",
  "Statement of purpose / motivation letter",
  "Letters of recommendation",
  "Proof of financial resources for the visa application (blocked account or equivalent)",
];

export const SCHOLARSHIP_GUIDANCE = [
  "DAAD scholarships — the largest source of funded places for international students, with country- and field-specific programs.",
  "University-specific scholarships and assistantship positions, often tied to a particular department or research group.",
  "Deadlines for most scholarships fall well before the university application deadline — this is planned for from the Profile Assessment stage, not after admission.",
];

export const WELL_KNOWN_UNIVERSITIES = [
  "TUM (Technical University of Munich)",
  "RWTH Aachen",
  "Heidelberg University",
  "KIT (Karlsruhe Institute of Technology)",
  "University of Freiburg",
  "University of Konstanz",
  "LMU Munich",
];

export const VISA_PREDEPARTURE_POINTS = [
  "Student visa documents",
  "Financial requirements",
  "Blocked account",
  "Health insurance",
  "Travel planning",
  "Embassy interview",
  "Accommodation",
  "Pre-departure checklist",
];

export const STUDENT_WORK_POINTS = [
  "University assistant",
  "Research assistant",
  "Laboratory assistant",
  "Tutoring",
  "Field-related student work",
  "Retail and customer support",
];

export const RESEARCH_ADVANTAGE_POINTS = [
  "Original research",
  "Research methodology",
  "Meta-analysis",
  "CDC WONDER",
  "Medical and scientific writing",
  "Narrative reviews",
  "Letters to the Editor",
  "Data analysis",
  "Publication strategy",
];

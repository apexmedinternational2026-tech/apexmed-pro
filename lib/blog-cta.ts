export interface BlogCtaConfig {
  href: string;
  title: string;
  description: string;
  label: string;
}

const DEFAULT_CTA: BlogCtaConfig = {
  href: "/contact",
  title: "Not sure which pathway fits your goals?",
  description:
    "A free profile assessment maps your background to the right research, German pathway, or admissions Card.",
  label: "Contact Us",
};

// Checked before the category-level mapping, so a specific tag (e.g. a
// post tagged "fsp" filed under the broader "germany-pathway" category)
// can point at a more precisely relevant Card than the category default.
const TAG_CTA: Record<string, BlogCtaConfig> = {
  fsp: {
    href: "/programs/gold-card",
    title: "Ready to start structured FSP preparation?",
    description:
      "The Gold Card pairs FSP and KP preparation with full Approbation pathway guidance and a mentor at every stage.",
    label: "Explore the Gold Card",
  },
  approbation: {
    href: "/programs/gold-card",
    title: "Get guidance through the full Approbation pathway.",
    description:
      "The Gold Card covers FSP, KP, and Approbation document guidance from a mentor who has been through the process.",
    label: "Explore the Gold Card",
  },
  "blocked-account": {
    href: "/programs/master-card",
    title: "Planning your German Master's finances and admissions together?",
    description:
      "The Master Card combines language training, research experience, and admissions guidance for prospective German Master's students.",
    label: "Explore the Master Card",
  },
  "meta-analysis": {
    href: "/programs/master-meta-analysis-card",
    title: "Want hands-on mentorship through your own meta-analysis?",
    description:
      "The Master Meta-Analysis Card is a focused track in systematic review methodology and R-based evidence synthesis.",
    label: "Explore the Meta-Analysis Card",
  },
  "r-programming": {
    href: "/programs/master-meta-analysis-card",
    title: "Want hands-on mentorship through your own meta-analysis?",
    description:
      "The Master Meta-Analysis Card is a focused track in systematic review methodology and R-based evidence synthesis.",
    label: "Explore the Meta-Analysis Card",
  },
  "cdc-wonder": {
    href: "/programs/cdc-specialist-card",
    title: "Ready to turn a CDC WONDER query into a publication?",
    description:
      "The CDC Specialist Card is a focused pathway for original research using the CDC WONDER database, start to submission.",
    label: "Explore the CDC Specialist Card",
  },
  pmdc: {
    href: "/programs/apexmed-research-card",
    title: "Need structured mentorship toward a publication?",
    description:
      "The ApexMed Research Card guides you from topic selection to a submission-ready manuscript with one-on-one mentorship.",
    label: "Explore the Research Card",
  },
  fcps: {
    href: "/programs/apexmed-research-card",
    title: "Working on your FCPS research requirement?",
    description:
      "The ApexMed Research Card guides you from topic selection to a submission-ready manuscript with one-on-one mentorship.",
    label: "Explore the Research Card",
  },
};

const CATEGORY_CTA: Record<string, BlogCtaConfig> = {
  "germany-pathway": {
    href: "/germany",
    title: "See the full German medical licensing pathway.",
    description:
      "From A1 through Facharzt — every stage of becoming a practicing doctor in Germany, with mentor-led guidance at each step.",
    label: "View the Germany Pathway",
  },
  "research-publication": {
    href: "/programs/apexmed-research-card",
    title: "Need structured mentorship toward a publication?",
    description:
      "The ApexMed Research Card guides you from topic selection to a submission-ready manuscript with one-on-one mentorship.",
    label: "Explore the Research Card",
  },
  "masters-admissions": {
    href: "/masters",
    title: "Ready to see your German Master's options?",
    description:
      "Structured guidance through profile assessment, university selection, application preparation, and visa steps.",
    label: "Explore Master's Admissions",
  },
};

/** Resolves the most specific relevant CTA for a post — tag match first, then category, then a generic profile-assessment fallback. */
export function resolveBlogCta(tagSlugs: string[], categorySlug: string | null): BlogCtaConfig {
  for (const tag of tagSlugs) {
    const match = TAG_CTA[tag];
    if (match) return match;
  }

  if (categorySlug && CATEGORY_CTA[categorySlug]) {
    return CATEGORY_CTA[categorySlug];
  }

  return DEFAULT_CTA;
}

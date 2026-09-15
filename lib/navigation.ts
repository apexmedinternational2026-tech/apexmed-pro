// The public site's 6 top-level nav items — a deliberate collapse of the
// full ~14-item content outline (Home / About / Research family + FCPS
// support / Germany pathway topics / Master's admissions / Blog+Webinars+
// Testimonials) down to what fits a header without crowding it. Anything
// with an `items` array renders as a dropdown; anything without renders
// as a plain link.

export interface NavLink {
  label: string;
  href: string;
}

export interface NavItem extends NavLink {
  items?: NavLink[];
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    items: [
      { label: "Our Story", href: "/about" },
      { label: "Our Mentors", href: "/mentors" },
    ],
  },
  {
    label: "Research",
    href: "/programs?family=research",
    items: [
      { label: "Research Programs", href: "/research" },
      { label: "ApexMed Research Card", href: "/programs/apexmed-research-card" },
      { label: "Meta-Analysis Card", href: "/programs/master-meta-analysis-card" },
      { label: "CDC Specialist Card", href: "/programs/cdc-specialist-card" },
      { label: "FCPS/PMDC Support", href: "/research/fcps-pmdc-support" },
      { label: "All Programs", href: "/programs" },
    ],
  },
  {
    label: "Germany",
    href: "/germany",
    items: [
      { label: "Medical Pathway", href: "/germany" },
      { label: "FSP Preparation", href: "/germany/fsp" },
      { label: "KP Guidance", href: "/germany/kp" },
      { label: "Approbation", href: "/germany/approbation" },
      { label: "Facharzt", href: "/germany/facharzt" },
      { label: "German Dream Blue Card", href: "/programs/blue-card" },
      { label: "German Dream Green Card", href: "/programs/green-card" },
      { label: "German Dream Gold Card", href: "/programs/gold-card" },
    ],
  },
  {
    label: "International Exams",
    href: "/international-exams",
    items: [
      { label: "All Pathways", href: "/international-exams" },
      { label: "USMLE (USA)", href: "/international-exams/usmle" },
      { label: "PLAB (UK)", href: "/international-exams/plab" },
      { label: "MRCP (UK)", href: "/international-exams/mrcp" },
      { label: "AMC (Australia)", href: "/international-exams/amc" },
    ],
  },
  {
    label: "Master's",
    href: "/masters",
    items: [
      { label: "Why Germany", href: "/masters" },
      { label: "Fields of Study", href: "/masters/fields" },
      { label: "Application Process", href: "/masters" },
      { label: "German Dream Master Card", href: "/programs/master-card" },
    ],
  },
  // Renamed from "Resources" to "More" per the new-sections build brief's
  // nav restructure — Courses/Green Earth/Mental Health Support join this
  // dropdown once their own pages exist (PARTs 3–5, not yet built).
  {
    label: "More",
    href: "/blog",
    items: [
      { label: "Blog", href: "/blog" },
      { label: "Webinars", href: "/webinars" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "All Services", href: "/services" },
    ],
  },
];

export const PROFILE_ASSESSMENT_HREF = "/contact";

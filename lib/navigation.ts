// PART 5 of the client's "Architecture Change" brief replaces the earlier
// 6-dropdown structure entirely: Services now carries that weight via its
// own mega-menu (SERVICES_MEGA_MENU below), so the top bar collapses to
// Home · About · Services ▾ · Programs · Resources ▾ · [CTA] — About and
// Programs are plain links now (no "▾" on either in the brief's own
// depiction), not dropdowns.

export interface NavLink {
  label: string;
  href: string;
}

export interface NavItem extends NavLink {
  items?: NavLink[];
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  // "Resources", not "More" — the brief's PART 5 names it that explicitly,
  // now that Services (not this) carries the bulk of the site. Mentors
  // moves here from the old About dropdown, per the brief's own list.
  {
    label: "Resources",
    href: "/blog",
    items: [
      { label: "Blog", href: "/blog" },
      { label: "Webinars", href: "/webinars" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Our Mentors", href: "/mentors" },
    ],
  },
];

// The Services mega-menu's 3 groupings — see components/layout/navbar-client.tsx's
// ServicesMegaMenu. Hardcoded rather than fetched from the `services` table:
// this renders on every single page load (it's in the header), and the nav
// grouping/order is editorial structure that changes far less often than
// service content itself — an extra DB round-trip on every page for data
// this static isn't worth it. Keep in sync with supabase/seed.sql's
// services insert (slug, name, icon_key) if a service is renamed or added.
export interface ServicesMegaMenuItem {
  slug: string;
  name: string;
  summary: string;
  iconKey: string;
}

export interface ServicesMegaMenuGroup {
  heading: string;
  items: ServicesMegaMenuItem[];
}

export const SERVICES_MEGA_MENU: ServicesMegaMenuGroup[] = [
  {
    heading: "Research & Publication",
    items: [
      {
        slug: "research",
        name: "Research Services",
        summary: "Original research, meta-analysis, CDC WONDER, and medical writing",
        iconKey: "microscope",
      },
    ],
  },
  {
    heading: "International Pathways",
    items: [
      { slug: "german-medical", name: "German Medical Pathway", summary: "Language, FSP, KP, Approbation", iconKey: "stethoscope" },
      { slug: "germany-masters", name: "Germany Master's Pathway", summary: "Master's admissions guidance", iconKey: "graduation-cap" },
      { slug: "usmle", name: "USMLE Pathway", summary: "Step 1, Step 2 CK, Step 3", iconKey: "flask-conical" },
      { slug: "plab", name: "PLAB Pathway", summary: "PLAB 1, PLAB 2, GMC registration", iconKey: "clipboard-check" },
      { slug: "mrcp", name: "MRCP Pathway", summary: "Part 1, Part 2 Written, PACES", iconKey: "award" },
      { slug: "amc", name: "AMC Pathway", summary: "CAT MCQ, clinical/practical, AHPRA", iconKey: "badge-check" },
    ],
  },
  {
    heading: "Education & Support",
    items: [
      { slug: "ai-healthcare", name: "AI for Healthcare", summary: "A practical AI course for clinicians", iconKey: "brain-circuit" },
      { slug: "mental-health", name: "Mental Health Support", summary: "Non-urgent counselling and peer support", iconKey: "heart-handshake" },
      { slug: "green-earth", name: "Green Earth", summary: "Climate and sustainability initiative", iconKey: "leaf" },
    ],
  },
];

export const PROFILE_ASSESSMENT_HREF = "/contact";

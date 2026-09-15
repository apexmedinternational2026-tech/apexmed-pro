// Central map from a product family to its brand color(s) — the mechanism
// that lets a component take an `accent` prop and theme itself via a CSS
// custom property instead of a chain of conditional class strings like
// `accent === "blue" ? "border-product-blue" : accent === "green" ? ...`.
//
// Each accent exposes four roles, not one color, because the raw brand
// hues don't all behave the same way against WCAG AA (see the contrast
// audit in app/styleguide/page.tsx):
//   - accent:     the vivid brand hue. Safe for borders, icons, large
//                 text (≥18.66px, or ≥14px bold), and non-text UI (3:1) —
//                 always against a WHITE/paper-50 context, never against
//                 this family's own `surface` (see the blue note below).
//   - surface:    the solid-fill background this family is designed to
//                 sit on (its own hue for green/master, or the paired
//                 near-black/navy for gold/research).
//   - foreground: AA-safe (≥4.5:1) text/icon color for content on
//                 `surface`.
//   - text:       AA-safe (≥4.5:1) color for this family's running
//                 text/links specifically on a paper-50/white background —
//                 the context every current text-bearing usage (Badge,
//                 the ProgramGrid "View program" link) actually renders
//                 in. NOT guaranteed safe on navy-950; nothing in this
//                 codebase currently needs that pairing.
//
// blue is the one family where `surface` is NOT its `accent`: contrast is
// symmetric, so if raw product-blue fails AA paired with paper-50 text
// (~4.0:1 either direction — verified in lib/contrast.test.ts), it fails
// exactly as badly as a *background* behind paper-50 text as it does as
// *text* on a paper-50 background. Its `surface` (and `text`) roles both
// use product-blue-ink instead, so anything that actually carries text —
// a hero fill, running copy — is real AA-safe navy-blue, not the vivid
// hue. Never place `accent` (vivid) directly on top of `surface` for this
// family; keep the vivid hue for borders/icons against white/paper-50.
//
// research and gold have the mirror-image problem: their vivid hue
// (gold-500 / amber) is light-toned and fails AA as text on white
// (~2.1:1) just as badly as it succeeds as foreground-on-dark-surface
// (8–9:1). There's no darker "ink" sibling for either in the brand
// palette — gold-on-light and amber-on-light both just read poorly no
// matter how you shade them — so their `text` role falls back to
// navy-950 for light-background contexts instead. The vivid hue is still
// exactly right for borders, icons, and `foreground`-on-`surface`, where
// it's the one actually verified as brand-safe.
export type AccentToken =
  | "research"
  | "blue"
  | "green"
  | "gold"
  | "master"
  | "licensing"
  | "research-service"
  | "usmle"
  | "mrcp"
  | "amc"
  | "mental-health"
  | "ai-healthcare"
  | "green-earth";

export interface AccentRoles {
  accent: string;
  surface: string;
  foreground: string;
  text: string;
}

export const ACCENT_TOKENS: Record<AccentToken, AccentRoles> = {
  research: {
    accent: "var(--color-product-research)",
    surface: "var(--color-navy-950)",
    foreground: "var(--color-product-research)",
    text: "var(--color-navy-950)",
  },
  blue: {
    accent: "var(--color-product-blue)",
    surface: "var(--color-product-blue-ink)",
    foreground: "var(--color-paper-50)",
    text: "var(--color-product-blue-ink)",
  },
  green: {
    accent: "var(--color-product-green)",
    surface: "var(--color-product-green)",
    foreground: "var(--color-paper-50)",
    text: "var(--color-product-green)",
  },
  gold: {
    accent: "var(--color-product-gold)",
    surface: "var(--color-product-gold-bg)",
    foreground: "var(--color-product-gold)",
    text: "var(--color-navy-950)",
  },
  master: {
    accent: "var(--color-product-master)",
    surface: "var(--color-product-master)",
    foreground: "var(--color-paper-50)",
    text: "var(--color-product-master)",
  },
  // Same shape as green/master: the raw hue is AA-safe both as a solid
  // background (white text, 6.47:1) and as text-on-light (6.18:1) — see
  // app/globals.css's own contrast note. It fails badly against navy-950
  // (2.65:1), so this never becomes a research/gold-style navy-surface
  // accent.
  licensing: {
    accent: "var(--color-product-licensing)",
    surface: "var(--color-product-licensing)",
    foreground: "var(--color-paper-50)",
    text: "var(--color-product-licensing)",
  },
  // Services hub accents (see app/globals.css's own note on why these
  // aren't dual-context-verified the way the brief asked — same
  // research/gold vs. blue/green/master/licensing archetype split below).
  "research-service": {
    accent: "var(--color-product-research-service)",
    surface: "var(--color-navy-950)",
    foreground: "var(--color-product-research-service)",
    text: "var(--color-navy-950)",
  },
  usmle: {
    accent: "var(--color-product-usmle)",
    surface: "var(--color-product-usmle)",
    foreground: "var(--color-paper-50)",
    text: "var(--color-product-usmle)",
  },
  mrcp: {
    accent: "var(--color-product-mrcp)",
    surface: "var(--color-product-mrcp)",
    foreground: "var(--color-paper-50)",
    text: "var(--color-product-mrcp)",
  },
  amc: {
    accent: "var(--color-product-amc)",
    surface: "var(--color-product-amc)",
    foreground: "var(--color-paper-50)",
    text: "var(--color-product-amc)",
  },
  "mental-health": {
    accent: "var(--color-product-mental-health)",
    surface: "var(--color-product-mental-health)",
    foreground: "var(--color-paper-50)",
    text: "var(--color-product-mental-health)",
  },
  "ai-healthcare": {
    accent: "var(--color-product-ai-healthcare)",
    surface: "var(--color-product-ai-healthcare)",
    foreground: "var(--color-paper-50)",
    text: "var(--color-product-ai-healthcare)",
  },
  "green-earth": {
    accent: "var(--color-product-green-earth)",
    surface: "var(--color-product-green-earth)",
    foreground: "var(--color-paper-50)",
    text: "var(--color-product-green-earth)",
  },
};

export const ACCENT_LABELS: Record<AccentToken, string> = {
  research: "ApexMed Research family",
  blue: "Blue Card",
  green: "Green Card",
  gold: "Gold Card",
  master: "Master Card",
  licensing: "International Licensing & Exams",
  "research-service": "Research Services",
  usmle: "USMLE Pathway",
  mrcp: "MRCP Pathway",
  amc: "AMC Pathway",
  "mental-health": "Mental Health Support",
  "ai-healthcare": "AI for Medical Healthcare",
  "green-earth": "Climate & Green Earth",
};

// programs.accent_token in the database is free-text seeded copy
// ("navy-gold", "sky-blue", ...), not one of the five AccentToken keys —
// this is the one place that mapping happens, so a program page never has
// to know or care what the seed data's raw string looked like.
const ACCENT_TOKEN_TEXT_MAP: Record<string, AccentToken> = {
  "navy-gold": "research",
  "sky-blue": "blue",
  "deep-green": "green",
  "amber-black": "gold",
  violet: "master",
  "deep-red": "licensing",
};

export function resolveAccentToken(rawAccentToken: string | null | undefined): AccentToken {
  if (!rawAccentToken) return "research";
  // services.accent_token (unlike programs.accent_token) is seeded with the
  // AccentToken key itself ("research-service", "usmle", ...) rather than a
  // separate descriptive string needing translation — checked first so a
  // direct hit never has to round-trip through ACCENT_TOKEN_TEXT_MAP.
  if (rawAccentToken in ACCENT_TOKENS) return rawAccentToken as AccentToken;
  const match = ACCENT_TOKEN_TEXT_MAP[rawAccentToken];
  return match ?? "research";
}

/**
 * Builds the inline style object a component spreads onto its root
 * element so descendant utility classes (e.g. `bg-[var(--accent)]`) can
 * read the accent without any conditional class logic.
 */
export function accentStyle(token: AccentToken): React.CSSProperties {
  const roles = ACCENT_TOKENS[token];
  return {
    "--accent": roles.accent,
    "--accent-surface": roles.surface,
    "--accent-foreground": roles.foreground,
    "--accent-text": roles.text,
  } as React.CSSProperties;
}

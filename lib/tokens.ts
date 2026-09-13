// Canonical hex values for every design token, used only by /styleguide to
// render swatches and run live contrast checks. Components never import
// this file — they consume tokens via Tailwind utility classes or the CSS
// custom properties the @theme block in app/globals.css emits. Keep this
// list in sync with that block by hand; changing a value here has no
// effect on anything except the styleguide's own display.
export const COLOR_TOKENS = {
  "navy-950": "#0A1A3C",
  "navy-900": "#0F2557",
  "navy-800": "#16336F",
  "gold-500": "#D4AF37",
  "gold-400": "#E8C55A",
  "gold-300": "#F2DC8E",
  "ink-900": "#111827",
  "slate-500": "#64748B",
  "paper-50": "#F8FAFC",
  "product-research": "#D4AF37",
  "product-blue": "#1D7DD4",
  "product-blue-ink": "#0F5FA0",
  "product-green": "#0B5D3B",
  "product-green-highlight": "#3DBB4E",
  "product-gold": "#E0A80D",
  "product-gold-bg": "#0B0B0B",
  "product-master": "#6D28D9",
  error: "#B3261E",
  white: "#FFFFFF",
} as const;

export type ColorToken = keyof typeof COLOR_TOKENS;

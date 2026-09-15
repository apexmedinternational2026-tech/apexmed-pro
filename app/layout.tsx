import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Sora, Inter } from "next/font/google";
import { OrganizationJsonLd } from "@/components/layout/organization-jsonld";
import { Analytics } from "@/components/analytics/analytics";
import "./globals.css";

// next/font self-hosts these at build time and generates the @font-face
// rules with a fallback metric match, so there's no external request and
// no layout shift while the real font loads. `preload: true` is already
// next/font's default for a font used in the root layout — set
// explicitly on Sora (not just Inter) since it's the display font behind
// the hero headline on every page, almost always the actual LCP element.
const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-sora",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ApexMed International",
  description:
    "Research training, publication mentorship, German language and medical licensing pathway guidance, and German Master's admissions support for doctors and medical students.",
  // Both undefined (and therefore omitted from the rendered <head>) until
  // real values exist — see docs/RUNBOOK.md for how to get one from each
  // console. Next only renders the meta tag when the value is defined.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  // Explicit rather than relying only on Next's app/icon.png|apple-icon.png
  // file-convention auto-detection — this also surfaces the 16/32px PNGs
  // (public/, not app/, so they aren't auto-picked-up) that some browser
  // UIs and crawlers still look for by exact size. All five files are
  // generated from app/icon.png, the already-transparent, already-square
  // "A" stethoscope monogram (see components/home/founder-section.tsx-era
  // logo work) — a simplified mark, not the full wordmark logo, which is
  // what a favicon needs to stay legible at 16px.
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  // Matches --color-navy-950 (app/globals.css) — the same brand navy
  // app/apple-icon.png and the manifest's icons are composited onto, so a
  // mobile browser's own chrome (address bar, task switcher) reads as one
  // continuous surface with the site rather than a mismatched color.
  themeColor: "#0a1a3c",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Set by middleware.ts on every request (see its buildCsp comment) — the
  // one inline script this app authors itself (Analytics' GA init
  // snippet) needs this passed in explicitly; Next can't auto-nonce a
  // script it didn't generate.
  const nonce = (await headers()).get("x-nonce");

  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body>
        {children}
        {/* Site-wide, regardless of route group — both (public) and (admin) inherit this. */}
        <OrganizationJsonLd />
        <Analytics nonce={nonce} />
      </body>
    </html>
  );
}

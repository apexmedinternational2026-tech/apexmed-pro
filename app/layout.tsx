import type { Metadata } from "next";
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

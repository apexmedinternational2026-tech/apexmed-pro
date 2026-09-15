import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { IconList } from "@/components/ui/icon-list";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/ui/reveal";
import { ACCENT_LABELS, type AccentToken } from "@/lib/accent";
import { COLOR_TOKENS, type ColorToken } from "@/lib/tokens";
import { contrastRatio } from "@/lib/contrast";

// Development tool: not linked from anywhere, marked noindex below, and
// hard-gated behind this env var in production builds so it can never
// accidentally ship as a public route. Set NEXT_PUBLIC_ENABLE_STYLEGUIDE=true
// locally (see .env.example) if you need to view it against a prod build.
const STYLEGUIDE_ENABLED =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ENABLE_STYLEGUIDE === "true";

export const metadata: Metadata = {
  title: "Styleguide (dev only) — ApexMed International",
  robots: {
    index: false,
    follow: false,
  },
};

const ACCENTS: AccentToken[] = [
  "research",
  "blue",
  "green",
  "gold",
  "master",
  "licensing",
  "research-service",
  "usmle",
  "mrcp",
  "amc",
  "mental-health",
  "ai-healthcare",
  "green-earth",
];

const CONTRAST_CHECKS: { label: string; fg: ColorToken; bg: ColorToken; context: string }[] = [
  {
    label: "gold-500 on navy-950",
    fg: "gold-500",
    bg: "navy-950",
    context: "primary accent — the pairing called out in the brief",
  },
  { label: "gold-400 on navy-950", fg: "gold-400", bg: "navy-950", context: "hover state" },
  { label: "ink-900 on paper-50", fg: "ink-900", bg: "paper-50", context: "body text on light" },
  {
    label: "slate-500 on paper-50",
    fg: "slate-500",
    bg: "paper-50",
    context: "secondary text on light — thin margin, keep an eye on this one",
  },
  {
    label: "paper-50 on navy-950",
    fg: "paper-50",
    bg: "navy-950",
    context: "body text on the primary dark background",
  },
  { label: "paper-50 on navy-900", fg: "paper-50", bg: "navy-900", context: "body text on raised dark surfaces" },
  {
    label: "product-research on navy-950",
    fg: "product-research",
    bg: "navy-950",
    context: "Research family text on its navy surface",
  },
  {
    label: "product-blue-ink on paper-50",
    fg: "product-blue-ink",
    bg: "paper-50",
    context: "Blue Card running text on light",
  },
  {
    label: "paper-50 on product-blue-ink",
    fg: "paper-50",
    bg: "product-blue-ink",
    context:
      "Blue Card white text on its solid fill surface (contrast is symmetric, so the raw accent would fail exactly as badly here as it does as text — see the raw row below)",
  },
  { label: "product-green on paper-50", fg: "product-green", bg: "paper-50", context: "Green Card text on light" },
  {
    label: "paper-50 on product-green",
    fg: "paper-50",
    bg: "product-green",
    context: "Green Card white text on a solid green fill",
  },
  {
    label: "product-gold on product-gold-bg",
    fg: "product-gold",
    bg: "product-gold-bg",
    context: "Gold Card text on its near-black surface",
  },
  { label: "product-master on paper-50", fg: "product-master", bg: "paper-50", context: "Master Card text on light" },
  {
    label: "paper-50 on product-master",
    fg: "paper-50",
    bg: "product-master",
    context: "Master Card white text on a solid violet fill",
  },
  { label: "error on paper-50", fg: "error", bg: "paper-50", context: "form validation messages" },
  {
    label: "product-blue on paper-50 (raw — not used as text)",
    fg: "product-blue",
    bg: "paper-50",
    context: "shown for transparency: this is why product-blue-ink exists as a separate token",
  },
  {
    label: "product-green-highlight on paper-50 (raw — decorative only)",
    fg: "product-green-highlight",
    bg: "paper-50",
    context: "fails as text; reserve for small decorative accents (dots, underlines), never running copy",
  },
];

const TYPE_STEPS: { className: string; name: string; sample: string; usage: string }[] = [
  {
    className: "font-display text-display-2xl",
    name: "display-2xl",
    sample: "Research mentorship, done properly.",
    usage: "hero headline — one per page",
  },
  {
    className: "font-display text-display-xl",
    name: "display-xl",
    sample: "A pathway built for doctors.",
    usage: "major section headline",
  },
  {
    className: "font-display text-display-lg",
    name: "display-lg",
    sample: "From topic to publication.",
    usage: "subsection headline",
  },
  {
    className: "font-display text-display-md",
    name: "display-md",
    sample: "FSP Preparation",
    usage: "card / module heading",
  },
  {
    className: "font-display text-display-sm",
    name: "display-sm",
    sample: "Who this is for",
    usage: "small heading, accordion triggers",
  },
  {
    className: "font-body text-eyebrow uppercase text-gold-500",
    name: "eyebrow",
    sample: "German Dream Family",
    usage: "kicker label above a headline",
  },
  {
    className: "font-body text-body-lg",
    name: "body-lg",
    sample:
      "A full annual research mentorship package guiding you from topic selection to a submission-ready manuscript.",
    usage: "lead paragraph",
  },
  {
    className: "font-body text-body-md",
    name: "body-md",
    sample: "Every module pairs a mentor check-in with a concrete deliverable, so progress is never just a checkbox.",
    usage: "default paragraph (1.65 line-height)",
  },
  {
    className: "font-body text-body-sm",
    name: "body-sm",
    sample: "Duration: 12 months · Mentor-led · Publication-focused",
    usage: "secondary / metadata text",
  },
  {
    className: "font-body text-caption uppercase text-slate-500",
    name: "caption",
    sample: "Updated September 2026",
    usage: "captions, timestamps, field errors",
  },
];

function ColorSwatch({ token }: { token: ColorToken }) {
  const hex = COLOR_TOKENS[token];
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-navy-800/15">
      <div className="h-16 w-full" style={{ backgroundColor: hex }} />
      <div className="flex flex-col gap-0.5 bg-white px-3 py-2">
        <span className="text-body-sm font-medium text-ink-900">{token}</span>
        <span className="text-caption text-slate-500">{hex}</span>
      </div>
    </div>
  );
}

function ContrastRow({ check }: { check: (typeof CONTRAST_CHECKS)[number] }) {
  const ratio = contrastRatio(COLOR_TOKENS[check.fg], COLOR_TOKENS[check.bg]);
  const passesNormalText = ratio >= 4.5;
  const passesLargeText = ratio >= 3;

  return (
    <div className="flex flex-col gap-3 border-b border-navy-800/10 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div
        className="flex h-12 w-full max-w-[260px] items-center justify-center rounded-md text-body-sm font-medium"
        style={{ backgroundColor: COLOR_TOKENS[check.bg], color: COLOR_TOKENS[check.fg] }}
      >
        {check.label}
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-body-sm text-ink-900">{check.context}</span>
        <span className="text-caption text-slate-500">
          {ratio.toFixed(2)}:1 —{" "}
          {passesNormalText ? "AA normal text" : passesLargeText ? "AA large text / UI only" : "fails AA"}
        </span>
      </div>
      <Badge
        variant={passesNormalText ? "neutral" : passesLargeText ? "gold" : "neutral"}
        className={
          passesNormalText
            ? "border-product-green text-product-green"
            : passesLargeText
              ? ""
              : "border-error text-error"
        }
      >
        {passesNormalText ? "Pass 4.5:1" : passesLargeText ? "Pass 3:1 only" : "Fail"}
      </Badge>
    </div>
  );
}

export default function StyleguidePage() {
  if (!STYLEGUIDE_ENABLED) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-paper-50 pb-24">
      <div className="border-b border-gold-500/40 bg-navy-950 py-3 text-center text-body-sm font-medium text-gold-300">
        Development tool — not linked from the site, noindexed, and 404s in production unless
        NEXT_PUBLIC_ENABLE_STYLEGUIDE=true. Remove or keep gated before launch.
      </div>

      <Container className="flex flex-col gap-20 pt-14">
        <header className="flex flex-col gap-2">
          <p className="text-eyebrow uppercase text-gold-500">ApexMed International</p>
          <h1 className="font-display text-display-xl text-ink-900">Design system styleguide</h1>
          <p className="max-w-2xl text-body-md text-slate-500">
            Every token, type step, and primitive component in one place — the reference for building pages without
            reaching for a raw hex value or a one-off style.
          </p>
        </header>

        {/* ── Color tokens ── */}
        <section className="flex flex-col gap-6">
          <h2 className="font-display text-display-lg text-ink-900">Color tokens</h2>

          <div>
            <h3 className="mb-3 text-body-sm font-medium uppercase tracking-wide text-slate-500">Core</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {(
                [
                  "navy-950",
                  "navy-900",
                  "navy-800",
                  "gold-500",
                  "gold-400",
                  "gold-300",
                  "ink-900",
                  "slate-500",
                  "paper-50",
                ] as ColorToken[]
              ).map((token) => (
                <ColorSwatch key={token} token={token} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-body-sm font-medium uppercase tracking-wide text-slate-500">
              Product accents (one per Card family)
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {(
                [
                  "product-research",
                  "product-blue",
                  "product-blue-ink",
                  "product-green",
                  "product-green-highlight",
                  "product-gold",
                  "product-gold-bg",
                  "product-master",
                ] as ColorToken[]
              ).map((token) => (
                <ColorSwatch key={token} token={token} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-body-sm font-medium uppercase tracking-wide text-slate-500">
              Contrast audit (WCAG AA — 4.5:1 normal text, 3:1 large text / UI)
            </h3>
            <div className="rounded-lg border border-navy-800/15 bg-white px-4">
              {CONTRAST_CHECKS.map((check) => (
                <ContrastRow key={check.label} check={check} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Typography ── */}
        <section className="flex flex-col gap-6">
          <h2 className="font-display text-display-lg text-ink-900">Typography</h2>
          <p className="max-w-2xl text-body-md text-slate-500">
            Sora (600/700, tight tracking) for display type, Inter (400/500) for body copy. Every step below carries its
            own size, line-height, and tracking — headings are never just a scaled copy of another section&apos;s
            heading.
          </p>
          <div className="flex flex-col divide-y divide-navy-800/10 rounded-lg border border-navy-800/15 bg-white">
            {TYPE_STEPS.map((step) => (
              <div key={step.name} className="flex flex-col gap-2 p-5">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="font-mono text-caption text-gold-500">text-{step.name}</span>
                  <span className="text-caption text-slate-500">{step.usage}</span>
                </div>
                <p className={step.className}>{step.sample}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Buttons ── */}
        <section className="flex flex-col gap-6">
          <h2 className="font-display text-display-lg text-ink-900">Button</h2>
          <div className="flex flex-col gap-4 rounded-lg border border-navy-800/15 bg-white p-6">
            {(["primary", "secondary", "ghost", "gold"] as const).map((variant) => (
              <div key={variant} className="flex flex-wrap items-center gap-3">
                <span className="w-20 shrink-0 text-body-sm font-medium capitalize text-slate-500">{variant}</span>
                <Button variant={variant} size="sm">
                  Small
                </Button>
                <Button variant={variant} size="md">
                  Medium
                </Button>
                <Button variant={variant} size="lg">
                  Large
                </Button>
                <Button variant={variant} disabled>
                  Disabled
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Badge ── */}
        <section className="flex flex-col gap-6">
          <h2 className="font-display text-display-lg text-ink-900">Badge</h2>
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-navy-800/15 bg-white p-6">
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="gold">Featured</Badge>
            {ACCENTS.map((accent) => (
              <Badge key={accent} accent={accent}>
                {ACCENT_LABELS[accent]}
              </Badge>
            ))}
          </div>
        </section>

        {/* ── Card ── */}
        <section className="flex flex-col gap-6">
          <h2 className="font-display text-display-lg text-ink-900">Card</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>No accent</CardTitle>
                <CardDescription>Default card, no top border tint.</CardDescription>
              </CardHeader>
              <CardContent>Used for neutral content: mentors, blog posts, testimonials.</CardContent>
              <CardFooter>
                <Button size="sm" variant="secondary">
                  Learn more
                </Button>
              </CardFooter>
            </Card>
            {ACCENTS.map((accent) => (
              <Card key={accent} accent={accent}>
                <CardHeader>
                  <CardTitle>{ACCENT_LABELS[accent]}</CardTitle>
                  <CardDescription>accent=&quot;{accent}&quot;</CardDescription>
                </CardHeader>
                <CardContent>
                  Top border and any `text-[var(--accent)]` descendant pick up this family&apos;s color automatically.
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="secondary">
                    View program
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Form primitives ── */}
        <section className="flex flex-col gap-6">
          <h2 className="font-display text-display-lg text-ink-900">Form primitives</h2>
          <div className="grid grid-cols-1 gap-8 rounded-lg border border-navy-800/15 bg-white p-6 md:grid-cols-2">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sg-name">Full name</Label>
                <Input id="sg-name" placeholder="Dr. Jane Doe" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sg-email">Email (invalid state)</Label>
                <Input id="sg-email" aria-invalid defaultValue="not-an-email" />
                <FieldError>Enter a valid email address.</FieldError>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sg-interest">Interested in</Label>
                <Select defaultValue="gold-card">
                  <SelectTrigger id="sg-interest">
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue-card">Blue Card</SelectItem>
                    <SelectItem value="green-card">Green Card</SelectItem>
                    <SelectItem value="gold-card">Gold Card</SelectItem>
                    <SelectItem value="master-card">Master Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sg-message">Message</Label>
                <Textarea id="sg-message" placeholder="Tell us about your background..." rows={4} />
              </div>
              <div className="flex items-center gap-2.5">
                <Checkbox id="sg-consent" defaultChecked />
                <Label htmlFor="sg-consent">I agree to be contacted about this program.</Label>
              </div>
              <Button variant="gold" className="w-fit">
                Submit
              </Button>
            </div>
          </div>
        </section>

        {/* ── IconList ── */}
        <section className="flex flex-col gap-6">
          <h2 className="font-display text-display-lg text-ink-900">IconList</h2>
          <div className="grid grid-cols-1 gap-6 rounded-lg border border-navy-800/15 bg-white p-6 sm:grid-cols-2">
            <IconList
              items={[
                "Patient Interview Practice",
                "Case Documentation Writing Practice",
                "Mock FSP Sessions with Feedback",
              ]}
            />
            <IconList
              accent="master"
              items={["Statement of Purpose Guidance", "University Shortlisting", "uni-assist Application Walkthrough"]}
            />
          </div>
        </section>

        {/* ── Accordion ── */}
        <section className="flex flex-col gap-6">
          <h2 className="font-display text-display-lg text-ink-900">Accordion</h2>
          <div className="rounded-lg border border-navy-800/15 bg-white px-6">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Who is this program for?</AccordionTrigger>
                <AccordionContent>
                  Doctors and medical students pursuing structured research mentorship, from topic selection through to
                  a submission-ready manuscript.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is admission or publication guaranteed?</AccordionTrigger>
                <AccordionContent>
                  No. Every program page carries the relevant compliance disclaimer — see compliance_disclaimers in the
                  database.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How long does the Gold Card take?</AccordionTrigger>
                <AccordionContent>
                  Twelve months, covering A1–B2 German, FSP/KP prep, and research training.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* ── Tabs ── */}
        <section className="flex flex-col gap-6">
          <h2 className="font-display text-display-lg text-ink-900">Tabs</h2>
          <div className="rounded-lg border border-navy-800/15 bg-white p-6">
            <Tabs defaultValue="modules">
              <TabsList>
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="audience">Who it&apos;s for</TabsTrigger>
                <TabsTrigger value="journey">Journey</TabsTrigger>
              </TabsList>
              <TabsContent value="modules" className="text-body-md text-ink-900">
                FSP Preparation, KP &amp; Approbation Guidance, Research Training.
              </TabsContent>
              <TabsContent value="audience" className="text-body-md text-ink-900">
                Doctors preparing for FSP and KP exams; graduates pursuing full Approbation.
              </TabsContent>
              <TabsContent value="journey" className="text-body-md text-ink-900">
                Language assessment → structured training → medical German → FSP/KP → research mentorship.
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* ── Skeleton ── */}
        <section className="flex flex-col gap-6">
          <h2 className="font-display text-display-lg text-ink-900">Skeleton</h2>
          <div className="flex flex-col gap-3 rounded-lg border border-navy-800/15 bg-white p-6">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </section>

        {/* ── Container ── */}
        <section className="flex flex-col gap-6">
          <h2 className="font-display text-display-lg text-ink-900">Container</h2>
          <p className="max-w-2xl text-body-md text-slate-500">
            Default Container centers content at a max width. The bleed variant drops that constraint — reserved for one
            section per page (see Section below, and the noise-texture demo).
          </p>
          <div className="rounded-lg border border-dashed border-navy-800/30 bg-navy-950/5 py-4">
            <Container className="rounded bg-navy-950/10 py-3 text-center text-body-sm text-navy-950">
              Contained (max-w-6xl)
            </Container>
          </div>
          <div className="rounded-lg border border-dashed border-navy-800/30 bg-navy-950/5 py-4">
            <Container bleed className="bg-navy-950/10 py-3 text-center text-body-sm text-navy-950">
              Bleed (edge to edge)
            </Container>
          </div>
        </section>

        {/* ── Section, noise texture, and reveal motion ── */}
        <section className="flex flex-col gap-6">
          <h2 className="font-display text-display-lg text-ink-900">Section, noise texture &amp; reveal motion</h2>
          <p className="max-w-2xl text-body-md text-slate-500">
            The gold-foil noise overlay is meant for navy sections. Scroll this card out of view and back to see the one
            reveal animation the site uses, respecting prefers-reduced-motion.
          </p>
          <Section theme="navy" padding="sm" noise className="rounded-lg">
            <div className="px-6">
              <Reveal>
                <p className="text-eyebrow uppercase text-gold-400">Section theme=&quot;navy&quot; noise</p>
                <h3 className="mt-2 font-display text-display-md text-paper-50">Gold-foil grain, reveal-on-scroll</h3>
                <p className="mt-2 max-w-xl text-body-md text-paper-50/80">
                  This block re-renders its entrance animation only once per mount — refresh the page and scroll slowly
                  to see it settle in.
                </p>
              </Reveal>
            </div>
          </Section>
        </section>
      </Container>
    </main>
  );
}

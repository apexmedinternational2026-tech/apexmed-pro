import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PROFILE_ASSESSMENT_HREF } from "@/lib/navigation";

const STACK_CARDS = [
  { color: "var(--color-product-master)", rotate: "-9deg", top: "4%", left: "6%" },
  { color: "var(--color-product-green)", rotate: "7deg", top: "24%", left: "34%" },
  { color: "var(--color-gold-500)", rotate: "-5deg", top: "50%", left: "2%" },
  { color: "var(--color-product-blue-ink)", rotate: "11deg", top: "10%", left: "60%" },
] as const;

/**
 * Deliberately asymmetric: copy sits left in a constrained column, and the
 * card-stack artwork is positioned relative to the full-width Section (not
 * the centered Container), anchored past the right edge so it bleeds off
 * — clipped by the Section's own overflow-hidden rather than causing a
 * horizontal scrollbar.
 */
export function Hero() {
  return (
    <Section theme="navy" padding="xl" noise className="relative overflow-hidden pt-40">
      {/* Reichstag (Berlin) rather than a generic medical stock shot —
          ApexMed's core differentiator is the German licensing/Master's
          pathway, so the one photographic moment on the homepage should
          say "Germany," not "stock-photo doctor." Sits behind the noise
          texture and gradient below at low opacity so it reads as
          atmosphere, never competing with the navy/gold brand palette or
          the text sitting on top of it. */}
      <Image
        src="/images/hero-reichstag.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 object-cover opacity-[0.16]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/40"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 hidden w-[620px] lg:block"
        style={{ right: "-120px" }}
      >
        {STACK_CARDS.map((card, index) => (
          <div
            key={index}
            className="absolute h-56 w-40 rounded-2xl shadow-2xl ring-1 ring-paper-50/10"
            style={{
              backgroundColor: card.color,
              transform: `rotate(${card.rotate})`,
              top: card.top,
              left: card.left,
            }}
          />
        ))}
      </div>

      <Container className="relative z-10">
        <div className="flex max-w-xl flex-col items-start gap-6">
          <p className="text-eyebrow uppercase text-gold-400">ApexMed International</p>
          <h1 className="font-display text-display-2xl text-paper-50">
            Global Medical Excellence, Research &amp; International Pathways
          </h1>
          <p className="text-body-lg text-paper-50/80">
            Practical research training, publication guidance, and structured support for doctors and students
            building international careers.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="gold" size="lg">
              <Link href={PROFILE_ASSESSMENT_HREF}>Book a Free Profile Assessment</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="border-paper-50/30 text-paper-50 hover:bg-paper-50/10"
            >
              <Link href="/programs">Explore Our Programs</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}

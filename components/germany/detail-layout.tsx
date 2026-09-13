import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ComplianceNote } from "@/components/program/compliance-note";
import { FaqSection } from "@/components/germany/faq-section";
import { FaqJsonLd } from "@/components/seo/faq-jsonld";
import type { GermanyDetailContent } from "@/lib/germany-content";

export interface GermanyDetailLayoutProps {
  content: GermanyDetailContent;
  disclaimer: string;
}

/**
 * Shared shell for the four Germany pathway detail pages (fsp/kp/
 * approbation/facharzt) — one implementation of the hero/key-facts/
 * sections/FAQ/disclaimer structure, so the four pages differ only in
 * their content data (lib/germany-content.ts), not in markup that could
 * drift out of sync across four hand-duplicated files.
 */
export function GermanyDetailLayout({ content, disclaimer }: GermanyDetailLayoutProps) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Germany", href: "/germany" },
    { label: content.title, href: `/germany/${content.slug}` },
  ];

  return (
    <>
      <FaqJsonLd items={content.faqs} />

      <Section theme="navy" padding="lg" noise className="pt-32">
        <Container className="flex flex-col gap-4">
          <Breadcrumbs items={breadcrumbItems} tone="dark" />
          <p className="text-eyebrow uppercase text-gold-400">{content.eyebrow}</p>
          <h1 className="max-w-2xl font-display text-display-xl text-paper-50">{content.title}</h1>
          <p className="max-w-xl text-body-lg text-paper-50/80">{content.summary}</p>
        </Container>
      </Section>

      <Section theme="white" padding="sm">
        <Container>
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {content.keyFacts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-caption font-semibold uppercase tracking-wide text-slate-500">{fact.label}</dt>
                <dd className="mt-1 text-body-md text-ink-900">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section theme="light" padding="lg">
        <Container className="flex max-w-3xl flex-col gap-10">
          {content.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-display-md text-ink-900">{section.heading}</h2>
              <div className="mt-3 flex flex-col gap-3">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-body-md text-ink-900">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </Container>
      </Section>

      <Section theme="white" padding="md">
        <Container className="flex flex-col gap-6">
          <h2 className="font-display text-display-md text-ink-900">Frequently asked questions</h2>
          <FaqSection items={content.faqs} />
        </Container>
      </Section>

      <Section theme="light" padding="sm">
        <Container className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-display-sm text-ink-900">Want mentor-led guidance through this stage?</h2>
            <p className="mt-1 text-body-sm text-slate-500">
              A free profile assessment maps this stage against your current progress.
            </p>
          </div>
          <Button asChild variant="gold" size="lg">
            <Link href="/contact">Book a Free Profile Assessment</Link>
          </Button>
        </Container>
      </Section>

      <Section theme="white" padding="sm">
        <Container>
          <ComplianceNote body={disclaimer} />
        </Container>
      </Section>
    </>
  );
}

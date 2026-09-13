import type { Metadata } from "next";
import { Suspense } from "react";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProfileAssessmentForm } from "@/components/contact/profile-assessment-form";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Book a Free Profile Assessment — ApexMed International",
  description:
    "Tell us about your background and goals — we'll map the right research, German pathway, or Master's admissions Card for you.",
  alternates: { canonical: absoluteUrl("/contact") },
};

const BREADCRUMB_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Contact", href: "/contact" },
];

export default function ContactPage() {
  return (
    <>
      <Section theme="navy" padding="lg" noise className="pt-32">
        <Container className="flex flex-col gap-4">
          <Breadcrumbs items={BREADCRUMB_ITEMS} tone="dark" />
          <p className="text-eyebrow uppercase text-gold-400">Get Started</p>
          <h1 className="max-w-2xl font-display text-display-xl text-paper-50">Book a Free Profile Assessment</h1>
          <p className="max-w-xl text-body-lg text-paper-50/80">
            Tell us where you are in your journey and what you want to achieve. A mentor will review your profile
            and recommend the right pathway.
          </p>
        </Container>
      </Section>

      <Section theme="light" padding="lg">
        <Container className="max-w-3xl">
          {/* useSearchParams() inside the form requires a Suspense boundary
              for the page to remain statically prerenderable. */}
          <Suspense fallback={null}>
            <ProfileAssessmentForm />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import { getApprovedTestimonials } from "@/lib/supabase/queries/testimonials";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Testimonials — ApexMed International",
  description: "What doctors and medical students who've gone through ApexMed's mentorship say about their experience.",
  alternates: { canonical: absoluteUrl("/testimonials") },
};

const BREADCRUMB_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Testimonials", href: "/testimonials" },
];

export default async function TestimonialsIndexPage() {
  const testimonials = await getApprovedTestimonials();

  return (
    <>
      <Section theme="navy" padding="lg" noise className="pt-32">
        <Container className="flex flex-col gap-4">
          <Breadcrumbs items={BREADCRUMB_ITEMS} tone="dark" />
          <p className="text-eyebrow uppercase text-gold-400">Testimonials</p>
          <h1 className="max-w-2xl font-display text-display-xl text-paper-50">What mentees say.</h1>
          <p className="max-w-xl text-body-lg text-paper-50/80">
            Real feedback from doctors and medical students who went through ApexMed&apos;s research, German
            pathway, and Master&apos;s admissions mentorship.
          </p>
        </Container>
      </Section>

      <Section theme="light" padding="lg">
        <Container>
          {testimonials.length === 0 ? (
            <p className="text-body-md text-slate-500">No testimonials published yet — check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent>
                    <div
                      aria-label={`${testimonial.rating} out of 5 stars`}
                      className="mb-3 flex gap-0.5 text-gold-500"
                    >
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span key={index} aria-hidden="true">
                          {index < testimonial.rating ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <p className="text-body-md text-ink-900">&ldquo;{testimonial.quote}&rdquo;</p>
                    <p className="mt-4 text-body-sm font-medium text-ink-900">{testimonial.author_name}</p>
                    {testimonial.author_title && (
                      <p className="text-caption text-slate-500">{testimonial.author_title}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}

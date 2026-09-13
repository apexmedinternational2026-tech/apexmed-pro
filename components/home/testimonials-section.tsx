import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import type { Testimonial } from "@/lib/supabase/queries/testimonials";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <Section theme="light" padding="md">
      <Container>
        <div className="max-w-2xl">
          <p className="text-eyebrow uppercase text-gold-500">Testimonials</p>
          <h2 className="mt-3 font-display text-display-lg text-ink-900">What mentees say.</h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent>
                <div aria-label={`${testimonial.rating} out of 5 stars`} className="mb-3 flex gap-0.5 text-gold-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} aria-hidden="true">
                      {index < testimonial.rating ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <p className="text-body-md text-ink-900">&ldquo;{testimonial.quote}&rdquo;</p>
                <p className="mt-4 text-body-sm font-medium text-ink-900">{testimonial.author_name}</p>
                {testimonial.author_title && <p className="text-caption text-slate-500">{testimonial.author_title}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}

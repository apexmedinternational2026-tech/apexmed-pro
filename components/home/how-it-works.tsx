import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";

const STEPS = [
  {
    title: "Contact Us",
    description: "Share your background and goals with a mentor.",
  },
  {
    title: "Get Your Recommendation",
    description: "We recommend the right program for your stage and goal.",
  },
  {
    title: "Train with Structured Mentorship",
    description: "Work through your program with a mentor who has made this journey themselves.",
  },
  {
    title: "Build Your Profile",
    description: "You build a real academic and career profile.",
  },
];

/**
 * A connected vertical path with numbered nodes, not a row of identical
 * boxes — the brief calls out "boxes in a row" by name as something to
 * avoid, so this deliberately reads as a sequence instead of a grid.
 */
export function HowItWorks() {
  return (
    <Section theme="light" padding="lg">
      <Container>
        <div className="max-w-2xl">
          <p className="text-eyebrow uppercase text-gold-500">How It Works</p>
          <h2 className="mt-3 font-display text-display-lg text-ink-900">A path, not a checklist.</h2>
        </div>

        <ol className="relative mt-14 flex max-w-2xl flex-col gap-10">
          <div aria-hidden="true" className="absolute bottom-4 left-4 top-4 w-px bg-navy-800/15" />
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative flex gap-5">
              <div className="relative z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-navy-950 font-display text-body-sm font-semibold text-gold-400">
                {index + 1}
              </div>
              <div className="pt-0.5">
                <h3 className="font-display text-display-sm text-ink-900">{step.title}</h3>
                <p className="mt-1.5 text-body-sm text-slate-500">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { ProfileAssessmentButton } from "@/components/ui/profile-assessment-button";

export function FinalCta() {
  return (
    <Section theme="navy" padding="lg" noise>
      <Container className="flex flex-col items-center gap-6 text-center">
        <p className="text-eyebrow uppercase text-gold-400">Learn. Research. Publish. Grow. Go Global.</p>
        <h2 className="max-w-2xl font-display text-display-xl text-paper-50">
          Start with a free profile assessment — no obligation, just a clear next step.
        </h2>
        <ProfileAssessmentButton />
      </Container>
    </Section>
  );
}

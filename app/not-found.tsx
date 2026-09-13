import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Section theme="navy" padding="xl" noise className="flex min-h-screen items-center">
      <Container className="flex flex-col items-start gap-6">
        <p className="text-eyebrow uppercase text-gold-400">Error 404</p>
        <h1 className="max-w-2xl font-display text-display-xl text-paper-50">This page took a different pathway.</h1>
        <p className="max-w-xl text-body-lg text-paper-50/80">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="gold">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="secondary" className="border-paper-50/30 text-paper-50 hover:bg-paper-50/10">
            <Link href="/programs">Browse programs</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}

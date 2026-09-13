"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";

// Next.js requires error boundaries to be Client Components — this is the
// one file in the layout shell where that's unavoidable, not a choice.
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // No-ops when NEXT_PUBLIC_SENTRY_DSN isn't set (see instrumentation-client.ts).
    Sentry.captureException(error);
  }, [error]);

  return (
    <Section theme="navy" padding="xl" noise className="flex min-h-screen items-center">
      <Container className="flex flex-col items-start gap-6">
        <p className="text-eyebrow uppercase text-gold-400">Something went wrong</p>
        <h1 className="max-w-2xl font-display text-display-xl text-paper-50">We hit a snag on our end.</h1>
        <p className="max-w-xl text-body-lg text-paper-50/80">
          Our team has been notified. Try again, or head back to the homepage.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="gold" onClick={() => reset()}>
            Try again
          </Button>
          <Button asChild variant="secondary" className="border-paper-50/30 text-paper-50 hover:bg-paper-50/10">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}

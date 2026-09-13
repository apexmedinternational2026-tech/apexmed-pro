import type { ReactNode } from "react";
import Image from "next/image";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";

export interface AuthPageShellProps {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}

/**
 * Shared shell for /login, /signup, /forgot-password, and /reset-password
 * — one implementation of the background-photo treatment so the four
 * pages can't drift out of sync the way they had before this existed
 * (three of the four had no photo at all, while /admin/login did).
 * Reuses the same stethoscope/books photo as the admin login page for a
 * consistent "signing in" moment across both sides of the site, rather
 * than sourcing a second image for what's visually the same kind of page.
 */
export function AuthPageShell({ eyebrow, title, description, children }: AuthPageShellProps) {
  return (
    <Section theme="navy" padding="lg" noise className="relative overflow-hidden pt-32">
      <Image
        src="/images/login-stethoscope.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 object-cover opacity-20 blur-sm"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-navy-950/70" />

      <Container className="relative z-10 flex max-w-md flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-eyebrow uppercase text-gold-400">{eyebrow}</p>
          <h1 className="font-display text-display-lg text-paper-50">{title}</h1>
          {description && <p className="text-body-sm text-paper-50/80">{description}</p>}
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-lg">{children}</div>
      </Container>
    </Section>
  );
}

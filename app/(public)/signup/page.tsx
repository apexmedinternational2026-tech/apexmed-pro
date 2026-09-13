import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { SignUpForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create Account — ApexMed International",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <AuthPageShell
      eyebrow="Get started"
      title="Create your account"
      description="Track your profile assessment requests and webinar registrations in one place."
    >
      <SignUpForm />
    </AuthPageShell>
  );
}

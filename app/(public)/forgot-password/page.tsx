import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset Password — ApexMed International",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter the email you signed up with and we'll send you a reset link."
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}

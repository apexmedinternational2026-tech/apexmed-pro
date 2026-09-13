import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In — ApexMed International",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthPageShell eyebrow="Welcome back" title="Sign in">
      {/* useSearchParams() inside LoginForm needs a Suspense boundary. */}
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthPageShell>
  );
}

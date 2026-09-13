import type { Metadata } from "next";
import Link from "next/link";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { getVisitorSession } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Set New Password — ApexMed International",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage() {
  // By the time a visitor lands here, /auth/callback has already
  // exchanged the recovery link's code for a session — no session means
  // they arrived without going through that link (or it already expired),
  // not that the form should render and fail confusingly on submit.
  const session = await getVisitorSession();

  return (
    <AuthPageShell eyebrow="Account recovery" title="Set a new password">
      {session ? (
        <ResetPasswordForm />
      ) : (
        <div className="flex flex-col gap-4 text-center">
          <p className="text-body-md text-ink-900">
            This reset link is invalid or has expired. Request a new one to continue.
          </p>
          <Link
            href="/forgot-password"
            className="font-medium text-navy-900 underline decoration-navy-900/30 underline-offset-2 hover:decoration-navy-900"
          >
            Request a new reset link
          </Link>
        </div>
      )}
    </AuthPageShell>
  );
}

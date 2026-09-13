import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Sign in — ApexMed Admin",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-950 px-4">
      {/* Same photographic treatment as the public hero (see
          components/home/hero.tsx) — kept dim and blurred since this page
          has to stay legible and calm for a staff member signing in, not
          make a marketing impression. */}
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

      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-navy-800/10 bg-white p-8 shadow-lg">
        <div className="flex items-center gap-2">
          <Image src="/images/logo-icon.png" alt="" width={30} height={25} className="h-7 w-auto flex-none" />
          <p className="font-display text-display-sm text-ink-900">ApexMed Admin</p>
        </div>
        <p className="mt-1 text-body-sm text-slate-500">Sign in to manage the site.</p>
        <div className="mt-6">
          {/* useSearchParams() inside LoginForm needs a Suspense boundary. */}
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

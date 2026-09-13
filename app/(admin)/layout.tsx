import type { Metadata } from "next";
import type { ReactNode } from "react";

// Separate shell from the public site on purpose: no marketing Navbar/
// Footer, no Organization JSON-LD relevance, and never indexable — this
// route group is for staff, not search engines or visitors. Deliberately
// thin: the real authenticated shell (sidebar, sign-out) lives in
// app/(admin)/admin/(authenticated)/layout.tsx, one level down, so
// /admin/login — which must render without a session — doesn't inherit
// a shell built around having one.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-paper-50">{children}</div>;
}

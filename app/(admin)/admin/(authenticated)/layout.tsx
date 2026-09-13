import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdminSession } from "@/lib/supabase/auth";
import { SidebarNav } from "@/components/admin/sidebar-nav";
import { SignOutButton } from "@/components/admin/sign-out-button";

// Everything under this route group requires a session — middleware.ts
// already redirects unauthenticated requests to /admin/login before they
// reach here, but this re-checks independently (defense in depth, same
// reasoning as every Server Action calling requireAdminSession()) and is
// also how this layout gets the signed-in admin's name/role to display.
export default async function AuthenticatedAdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminSession();

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="border-b border-navy-800/15 bg-white px-4 py-6 lg:border-b-0 lg:border-r">
        <p className="px-3 font-display text-display-sm text-ink-900">ApexMed Admin</p>
        <div className="mt-6">
          <SidebarNav />
        </div>
      </aside>

      <div className="flex flex-col">
        <header className="flex items-center justify-between border-b border-navy-800/15 bg-white px-6 py-3">
          <div>
            <p className="text-body-sm font-medium text-ink-900">{session.profile.full_name}</p>
            <p className="text-caption capitalize text-slate-500">{session.profile.role}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* The admin panel otherwise had no way back to the live
                site short of hand-editing the URL. target="_blank" so
                checking a live change doesn't lose the admin session's
                place in whatever form/list they were on. */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-2 text-body-sm font-medium text-slate-500 transition-colors hover:text-ink-900"
            >
              View Site ↗
            </Link>
            <SignOutButton />
          </div>
        </header>
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}

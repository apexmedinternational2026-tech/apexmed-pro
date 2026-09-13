"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/programs", label: "Programs" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/mentors", label: "Mentors" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/webinars", label: "Webinars" },
  { href: "/admin/study-fields", label: "Study Fields" },
  { href: "/admin/settings", label: "Settings" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        // Exact match for the dashboard root ("/admin") so it doesn't stay
        // highlighted on every nested section; prefix match everywhere else.
        const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-2 text-body-sm font-medium transition-colors",
              isActive ? "bg-navy-950 text-paper-50" : "text-ink-900 hover:bg-navy-950/5",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

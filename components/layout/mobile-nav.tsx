"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/cn";
import { ProfileAssessmentButton } from "@/components/ui/profile-assessment-button";
import { ServiceIcon } from "@/components/ui/service-icon";
import { MenuIcon, CloseIcon } from "@/components/ui/icons";
import { SERVICES_MEGA_MENU, type NavItem } from "@/lib/navigation";

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Renders a slice of PRIMARY_NAV's plain-link/dropdown items — factored out
 * so the Services accordion item (which isn't in that array) can be spliced
 * between two slices of it in the JSX below. */
function renderMobileNavItems(items: NavItem[], pathname: string) {
  return items.map((item) => {
    // Active if the current page is this item's own href OR any of its
    // dropdown children's hrefs — so e.g. being on /blog/some-post still
    // highlights "Resources", not just a literal match on /blog itself.
    const isActive =
      item.href === "/"
        ? pathname === "/"
        : pathname === item.href || (item.items?.some((link) => pathname === link.href) ?? false);

    return item.items ? (
      <AccordionItem key={item.label} value={item.label} className="border-navy-800/40">
        <AccordionTrigger className={isActive ? "text-gold-400" : "text-paper-50"}>{item.label}</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-1 pb-2 pl-2">
            {item.items.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-2 py-2 text-body-md",
                  pathname === link.href ? "text-gold-400" : "text-paper-50/80",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    ) : (
      <Link
        key={item.label}
        href={item.href}
        className={cn(
          "block border-b border-navy-800/40 py-4 text-body-lg font-medium",
          isActive ? "text-gold-400" : "text-paper-50",
        )}
      >
        {item.label}
      </Link>
    );
  });
}

export function MobileNav({ items, isSignedIn }: { items: NavItem[]; isSignedIn: boolean }) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Closes whenever the route changes — following a link inside the sheet
  // shouldn't leave it mounted open behind the new page.
  const previousPathname = React.useRef(pathname);
  React.useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      setOpen(false);
    }
  }, [pathname]);

  // Body scroll lock while the sheet is open. overflow:hidden alone is
  // not enough — iOS Safari still lets the document elastic-scroll
  // ("rubber-band") a few pixels past its own bounds even while that's
  // set, which is what briefly revealed page content behind the sheet
  // (the hero image, right at its top edge) for an instant on scroll,
  // then snapped back. Pinning the body with position:fixed removes it
  // from the scroll flow at the OS level instead of relying on a CSS
  // property iOS only treats as advisory; scroll position is restored
  // on close so closing the menu doesn't jump the page.
  React.useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const body = document.body.style;
    const original = {
      position: body.position,
      top: body.top,
      left: body.left,
      right: body.right,
      overflow: body.overflow,
    };
    body.position = "fixed";
    body.top = `-${scrollY}px`;
    body.left = "0";
    body.right = "0";
    body.overflow = "hidden";
    return () => {
      body.position = original.position;
      body.top = original.top;
      body.left = original.left;
      body.right = original.right;
      body.overflow = original.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // Focus trap + Escape-to-close while open.
  React.useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    focusable[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-sheet"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 items-center justify-center rounded-md text-paper-50"
      >
        {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>

      {open && (
        <div
          id="mobile-nav-sheet"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          // overscroll-contain is the actual fix for a real, reported bug:
          // without it, scrolling to the bottom of the menu's own content
          // (past the last nav item and the CTA button) lets further
          // scroll input "chain" through to the page underneath — the
          // sheet itself stays fixed and visually in place, but the page
          // behind it scrolls, which is how the footer became visible
          // right below the open menu's own last items. body-scroll-lock
          // (below) stops the page scrolling on its own, but doesn't stop
          // scroll input landing on this element from propagating past it
          // once its own scrollable content is exhausted — that's
          // specifically what overscroll-behavior exists to contain.
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto overscroll-contain bg-navy-950 px-6 py-6"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-display-sm text-paper-50">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center text-paper-50"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          <Accordion type="single" collapsible className="mt-6 flex-1">
            {/* PRIMARY_NAV is [Home, About, Programs, Resources] — Services
                is spliced in here at its fixed position (after About,
                before Programs), same as the desktop mega-menu, rather
                than folded into that array's generic shape. */}
            {renderMobileNavItems(items.slice(0, 2), pathname)}

            <AccordionItem value="Services" className="border-navy-800/40">
              <AccordionTrigger className={pathname.startsWith("/services") ? "text-gold-400" : "text-paper-50"}>
                Services
              </AccordionTrigger>
              <AccordionContent>
                {/* Same 3 groupings as the desktop mega-menu, flattened —
                    a heading per group, then its services tap straight
                    through. No second-level nesting (no accordion inside
                    this accordion), per the brief's own instruction. */}
                <div className="flex flex-col gap-4 pb-2 pl-2">
                  {SERVICES_MEGA_MENU.map((group) => (
                    <div key={group.heading}>
                      <p className="px-2 text-caption font-semibold uppercase tracking-wide text-paper-50/40">
                        {group.heading}
                      </p>
                      <div className="mt-1 flex flex-col gap-1">
                        {group.items.map((service) => {
                          const href = `/services/${service.slug}`;
                          return (
                            <Link
                              key={service.slug}
                              href={href}
                              className={cn(
                                "flex items-center gap-2.5 rounded-md px-2 py-2 text-body-md",
                                pathname === href ? "text-gold-400" : "text-paper-50/80",
                              )}
                            >
                              <ServiceIcon iconKey={service.iconKey} aria-hidden="true" className="h-4 w-4 flex-none" />
                              {service.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <Link href="/services" className="px-2 text-body-sm font-medium text-gold-400">
                    View all services →
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>

            {renderMobileNavItems(items.slice(2), pathname)}
          </Accordion>

          <Link
            href={isSignedIn ? "/account" : "/login"}
            className="border-b border-navy-800/40 py-4 text-body-lg font-medium text-paper-50"
          >
            {isSignedIn ? "My Account" : "Sign In"}
          </Link>

          <ProfileAssessmentButton size="md" className="mt-6 w-full justify-center" />
        </div>
      )}
    </>
  );
}

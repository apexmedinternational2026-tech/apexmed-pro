"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { ChevronDownIcon } from "@/components/ui/icons";
import type { NavItem } from "@/lib/navigation";

export interface NavbarClientProps {
  items: NavItem[];
  logo: React.ReactNode;
  authLink: React.ReactNode;
  cta: React.ReactNode;
  mobileNav: React.ReactNode;
}

/**
 * Owns the two pieces of navbar behavior that genuinely need the client:
 * the scroll-triggered transparent→solid background, and the desktop
 * dropdown menus. Everything else (logo, CTA button, link labels) is
 * rendered server-side in navbar.tsx and handed in as props/children, so
 * this leaf stays as small as the interactivity actually requires.
 */
export function NavbarClient({ items, logo, authLink, cta, mobileNav }: NavbarClientProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "bg-navy-950/95 shadow-[0_1px_0_rgba(212,175,55,0.15)] backdrop-blur-sm" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-6 py-4 sm:px-8 xl:px-10">
        {logo}

        {/* xl: (1280px), not lg: (1024px) — six dropdown items, the
            wordmark, Sign In, and the CTA button need more room than a
            1024px-wide row has to give without wrapping or overflowing;
            see the matching xl:hidden on the mobile trigger below. Below
            this breakpoint the hamburger menu (MobileNav) carries all of
            this instead, which is exactly what it's for. */}
        <nav aria-label="Primary" className="hidden items-center gap-0.5 xl:flex">
          {items.map((item) =>
            item.items ? (
              <NavDropdown key={item.label} item={item} pathname={pathname} />
            ) : (
              <Link
                key={item.label}
                href={item.href}
                // Home's href is "/" — every path starts with it, so it
                // needs an exact match rather than the startsWith below.
                aria-current={item.href === "/" ? (pathname === "/" ? "page" : undefined) : pathname.startsWith(item.href) ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-md px-2 py-2 text-body-sm font-medium transition-colors",
                  (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href))
                    ? "text-gold-400"
                    : "text-paper-50/90 hover:text-paper-50",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden xl:flex xl:flex-none xl:items-center xl:gap-2">
          {authLink}
          {cta}
        </div>
        <div className="xl:hidden">{mobileNav}</div>
      </div>
    </header>
  );
}

function NavDropdown({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Active if the current page is any of this dropdown's own links — not
  // just its own href — so e.g. being on /germany/fsp still highlights
  // "Germany" even though that specific child link, not the parent href,
  // is the exact match.
  const isActive = pathname === item.href || (item.items?.some((link) => pathname === link.href) ?? false);

  function close() {
    setOpen(false);
  }

  // Escape closes the menu and returns focus to the trigger, exactly like
  // the ARIA APG disclosure-navigation pattern — a hard focus trap (Tab
  // cycling forever inside the menu) would be wrong here, since it should
  // stay possible to Tab straight through to the rest of the page.
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      close();
      triggerRef.current?.focus();
    }
  }

  // Closes when focus leaves the trigger+menu group entirely (Tab past the
  // last item, or click elsewhere) — but not while focus merely moves
  // between the trigger and its own menu items.
  function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
    if (!containerRef.current?.contains(event.relatedTarget as Node | null)) {
      close();
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onFocus={() => setOpen(true)}
        // Deliberately open-only, never a toggle: onMouseEnter above already
        // opens this on hover, so a toggle here would immediately re-close
        // it the instant a mouse user's click lands right after that hover
        // — the exact bug that made every dropdown look unresponsive to a
        // real click. Closing still works via mouse-leave, Escape, and
        // blur-out-of-the-group (handleBlur below); this only has to cover
        // pointer devices with no hover (touch/some tablets at the lg:
        // breakpoint) and keyboard activation, where onFocus already got
        // there first anyway.
        onClick={() => setOpen(true)}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-2 text-body-sm font-medium transition-colors",
          isActive ? "text-gold-400" : "text-paper-50/90 hover:text-paper-50",
        )}
      >
        {item.label}
        <ChevronDownIcon
          aria-hidden="true"
          className={cn("h-3.5 w-3.5 transition-transform duration-150", open && "rotate-180")}
        />
      </button>

      {open && (
        // The visible gap between button and menu used to be a margin
        // (mt-2) on the menu box itself, which left that 8px strip
        // covered by neither the button nor the menu — the container's
        // own hit-box stops at the button's bottom edge, since an
        // absolutely-positioned child doesn't extend its parent's flow
        // height. Moving the mouse straight down through that strip
        // briefly left the container entirely, firing onMouseLeave and
        // closing the menu before the pointer ever reached it — the
        // exact "hover opens it, moving down closes it" bug reported.
        // Fix: push the gap inside this wrapper as padding (pt-2)
        // instead, so the wrapper's own box — still a child of the
        // container — covers the full button-to-menu span with no dead
        // zone, while the visible menu (the nested div) keeps the same
        // spacing it always had.
        <div className="absolute left-0 top-full w-64 pt-2">
          <div
            role="menu"
            aria-label={item.label}
            className="rounded-lg border border-navy-800/40 bg-navy-950 p-2 shadow-xl"
          >
            {item.items?.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                aria-current={pathname === link.href ? "page" : undefined}
                className={cn(
                  "block rounded-md px-3 py-2.5 text-body-sm transition-colors hover:bg-navy-900",
                  pathname === link.href ? "text-gold-400" : "text-paper-50/85 hover:text-paper-50",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

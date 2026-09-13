"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MenuIcon, CloseIcon } from "@/components/ui/icons";
import type { NavItem } from "@/lib/navigation";
import { PROFILE_ASSESSMENT_HREF } from "@/lib/navigation";

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

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

  // Body scroll lock while the sheet is open.
  React.useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
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
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-navy-950 px-6 py-6"
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
            {items.map((item) =>
              item.items ? (
                <AccordionItem key={item.label} value={item.label} className="border-navy-800/40">
                  <AccordionTrigger className="text-paper-50">{item.label}</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-1 pb-2 pl-2">
                      {item.items.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="rounded-md px-2 py-2 text-body-md text-paper-50/80"
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
                  className="block border-b border-navy-800/40 py-4 text-body-lg font-medium text-paper-50"
                >
                  {item.label}
                </Link>
              ),
            )}
          </Accordion>

          <Link
            href={isSignedIn ? "/account" : "/login"}
            className="border-b border-navy-800/40 py-4 text-body-lg font-medium text-paper-50"
          >
            {isSignedIn ? "My Account" : "Sign In"}
          </Link>

          <Button asChild variant="gold" className="mt-6 w-full justify-center">
            <Link href={PROFILE_ASSESSMENT_HREF}>Book a Free Profile Assessment</Link>
          </Button>
        </div>
      )}
    </>
  );
}

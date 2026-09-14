import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PRIMARY_NAV, PROFILE_ASSESSMENT_HREF } from "@/lib/navigation";
import { getVisitorSession } from "@/lib/supabase/auth";
import { NavbarClient } from "./navbar-client";
import { MobileNav } from "./mobile-nav";

/**
 * Server Component: renders the static parts of the header (logo, CTA
 * link, and now the sign-in/account state) and hands them to NavbarClient
 * as already-rendered nodes, so only the scroll/dropdown behavior — not
 * the markup itself — lives in client JS. Assumes every public page opens
 * with a navy-themed hero (see components/ui/section.tsx), so the light
 * logo/link colors read correctly whether the header is
 * transparent-over-hero or solid-on-scroll.
 */
export async function Navbar() {
  const session = await getVisitorSession();

  const authLink = session ? (
    <Link
      href="/account"
      className="flex-none whitespace-nowrap rounded-md px-2 py-2 text-body-sm font-medium text-paper-50/90 transition-colors hover:text-paper-50"
    >
      My Account
    </Link>
  ) : (
    <Link
      href="/login"
      className="flex-none whitespace-nowrap rounded-md px-2 py-2 text-body-sm font-medium text-paper-50/90 transition-colors hover:text-paper-50"
    >
      Sign In
    </Link>
  );

  return (
    <NavbarClient
      items={PRIMARY_NAV}
      logo={
        <Link
          href="/"
          className="group flex flex-none items-center gap-1.5 whitespace-nowrap font-display text-display-sm font-bold text-paper-50 transition-colors sm:gap-2 sm:text-display-md"
        >
          {/* Cropped from the client's own logo artwork (see
              images/Logo.jpeg) — background-removed via a color-distance
              alpha mask since the source was a photographic wall-mockup,
              not a transparent asset. Text stays real HTML, not baked
              into the image, for accessibility/SEO and so it can still
              recolor correctly on both the transparent-over-hero and
              solid-on-scroll navbar states. */}
          <Image
            src="/images/logo-icon.png"
            alt=""
            width={36}
            height={30}
            priority
            className="h-6 w-auto flex-none transition-transform duration-200 group-hover:scale-110 sm:h-8"
          />
          <span className="transition-colors group-hover:text-gold-300">ApexMed</span>
          {/* "International" hidden below sm: (640px) — at the full bold
              display-md size, "ApexMed International" plus even just the
              hamburger trigger measured wider than a 320px viewport in
              testing (this word alone is the longest single word in the
              header). Rather than shrink the wordmark until an
              arbitrarily long brand name always happens to fit — fragile,
              and the actual failure mode a real audit caught — drop the
              second word below the width where there's room for it
              instead. */}
          <span className="hidden text-gold-400 transition-colors group-hover:text-gold-300 sm:inline">
            {" "}
            International
          </span>
        </Link>
      }
      authLink={authLink}
      cta={
        <Button asChild variant="gold" size="sm" className="flex-none">
          <Link href={PROFILE_ASSESSMENT_HREF}>Contact Us</Link>
        </Button>
      }
      mobileNav={<MobileNav items={PRIMARY_NAV} isSignedIn={Boolean(session)} />}
    />
  );
}

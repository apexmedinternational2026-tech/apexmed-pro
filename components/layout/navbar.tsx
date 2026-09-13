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
          className="group flex flex-none items-center gap-2 whitespace-nowrap font-display text-display-md font-bold text-paper-50 transition-colors"
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
            className="h-8 w-auto flex-none transition-transform duration-200 group-hover:scale-110"
          />
          <span className="transition-colors group-hover:text-gold-300">ApexMed</span>{" "}
          <span className="text-gold-400 transition-colors group-hover:text-gold-300">International</span>
        </Link>
      }
      authLink={authLink}
      cta={
        <Button asChild variant="gold" size="sm" className="flex-none">
          {/* Shorter label from xl: (where this button first appears)
              up to 2xl: — the full phrase is the longest single piece of
              content in the whole header and was the main thing forcing
              the row to overflow even after widening it; swapping in the
              full text only once there's real room (2xl:, 1536px+) keeps
              the nav from needing this width just to avoid wrapping. */}
          <Link href={PROFILE_ASSESSMENT_HREF}>
            <span className="2xl:hidden">Book Assessment</span>
            <span className="hidden 2xl:inline">Book a Free Profile Assessment</span>
          </Link>
        </Button>
      }
      mobileNav={<MobileNav items={PRIMARY_NAV} isSignedIn={Boolean(session)} />}
    />
  );
}

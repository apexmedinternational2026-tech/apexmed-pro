import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { LinkedInButton } from "@/components/layout/linkedin-button";
import { ChatWidgetLoader } from "@/components/chatbot/chat-widget-loader";

/**
 * Shell for every public marketing route. Navbar is `fixed`, so it
 * overlays whatever the page renders first — by design, every public page
 * should open with a `<Section theme="navy">` hero for the navbar to sit
 * transparently over. A page with no hero is responsible for its own top
 * padding; this layout doesn't force one, since that would break the
 * intentional overlap on hero pages.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-body-sm focus:font-medium focus:text-navy-950"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      <WhatsAppButton />
      <LinkedInButton />
      <ChatWidgetLoader />
    </>
  );
}

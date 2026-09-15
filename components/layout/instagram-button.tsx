import { getSiteSettings } from "@/lib/supabase/queries/site-settings";
import { InstagramIcon } from "@/components/ui/icons";

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

/**
 * Fixed floating "find us on Instagram" button — same fail-open-to-invisible
 * pattern as WhatsAppButton/LinkedInButton. Instagram's own brand gradient
 * (not a flat color) is part of how the glyph reads as "Instagram" at a
 * glance, same reasoning as WhatsApp's green / LinkedIn's blue.
 */
export async function InstagramButton() {
  const settings = await getSiteSettings();
  const instagram = asString(settings.social_instagram_url);

  if (!instagram) return null;

  return (
    <a
      href={instagram}
      target="_blank"
      rel="noreferrer"
      aria-label="Follow ApexMed International on Instagram"
      // Second of a 4-button corner stack — WhatsApp, then this, then
      // LinkedIn (components/layout/linkedin-button.tsx), then the chat
      // toggle on top. Same 16px/20px gap math throughout.
      className="fixed bottom-40 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DD2A7B] sm:bottom-24 sm:right-5 sm:h-14 sm:w-14"
    >
      <InstagramIcon className="h-5 w-5 sm:h-6 sm:w-6" />
    </a>
  );
}

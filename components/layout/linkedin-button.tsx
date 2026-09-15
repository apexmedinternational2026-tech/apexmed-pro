import { getSiteSettings } from "@/lib/supabase/queries/site-settings";
import { LinkedInIcon } from "@/components/ui/icons";

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

/**
 * Fixed floating "find us on LinkedIn" button — same fail-open-to-invisible
 * pattern as WhatsAppButton (renders nothing when no URL is configured),
 * and stacked directly above it using the same corner-stack math (see that
 * component's own sizing comment). LinkedIn's own brand blue (#0A66C2),
 * not the site's gold/navy palette — same reasoning as WhatsApp's own
 * brand green: a recognizable platform button reads faster in its own
 * color than forced into the site's accent system.
 */
export async function LinkedInButton() {
  const settings = await getSiteSettings();
  const linkedin = asString(settings.social_linkedin_url);

  if (!linkedin) return null;

  return (
    <a
      href={linkedin}
      target="_blank"
      rel="noreferrer"
      aria-label="Follow ApexMed International on LinkedIn"
      // Middle of a 3-button corner stack — WhatsApp, then this, then the
      // chat toggle on top. Same 16px/20px gap math throughout.
      className="fixed bottom-40 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#0A66C2] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A66C2] sm:bottom-24 sm:right-5 sm:h-14 sm:w-14"
    >
      <LinkedInIcon className="h-5 w-5 sm:h-6 sm:w-6" />
    </a>
  );
}

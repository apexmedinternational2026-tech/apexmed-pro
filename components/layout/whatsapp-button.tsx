import { getSiteSettings } from "@/lib/supabase/queries/site-settings";
import { WhatsAppIcon } from "@/components/ui/icons";

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

/**
 * Fixed floating "contact us on WhatsApp" button, present on every public
 * page — reuses the same contact_whatsapp_number the Footer already links
 * (see getSiteSettings' own cache() note: this costs nothing extra, it's
 * the same memoized request-scoped fetch both components share). Renders
 * nothing at all when no number is configured, same fail-open-to-invisible
 * pattern as the Footer's own WhatsApp link.
 */
export async function WhatsAppButton() {
  const settings = await getSiteSettings();
  const whatsapp = asString(settings.contact_whatsapp_number);

  if (!whatsapp) return null;

  const digitsOnly = whatsapp.replace(/\D/g, "");

  return (
    <a
      href={`https://wa.me/${digitsOnly}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`Chat with us on WhatsApp: ${whatsapp}`}
      // z-40, not z-50 like the header — this must never sit above the
      // header's own dropdowns/mobile sheet, only above ordinary page
      // content. Smaller, and sitting noticeably higher, on narrow
      // screens: at full size and bottom-5 on a ~400px-wide phone, this
      // sat directly over the corner of the hero's "Book a Free Profile
      // Assessment" button — a real conversion CTA, not just a visual
      // coincidence to shrug off, and that CTA runs nearly full-width on
      // narrow screens so there was nowhere else for it to safely sit.
      // Full size and the standard corner position only return at sm:
      // (640px+), where that overlap stopped happening in testing.
      className="fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:bottom-5 sm:right-5 sm:h-14 sm:w-14"
    >
      <WhatsAppIcon className="h-6 w-6 sm:h-7 sm:w-7" />
    </a>
  );
}

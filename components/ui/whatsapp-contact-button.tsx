import { getSiteSettings } from "@/lib/supabase/queries/site-settings";
import { Button, type ButtonProps } from "@/components/ui/button";
import { ProfileAssessmentButton } from "@/components/ui/profile-assessment-button";

export interface WhatsAppContactButtonProps {
  size?: ButtonProps["size"];
  className?: string;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

/**
 * The Services/Programs-page equivalent of ProfileAssessmentButton — same
 * "Contact Us" label, but opens WhatsApp directly instead of the /contact
 * lead form. Deliberately scoped to service and program detail pages only
 * (app/(public)/services/**, app/(public)/programs/[slug] via program-hero.tsx,
 * app/(public)/germany/**, app/(public)/masters/**, app/(public)/research/**)
 * — the site-wide chrome (navbar, footer, mobile nav) and the homepage's own
 * hero/final-CTA keep using ProfileAssessmentButton and still feed the
 * `leads` table, so the admin panel doesn't lose visibility into every
 * contact on the site, only the ones initiated from a specific
 * service/program page.
 *
 * Falls back to ProfileAssessmentButton (the /contact form) rather than
 * rendering nothing when no WhatsApp number is configured — a page should
 * never end up with zero way to get in touch.
 */
export async function WhatsAppContactButton({ size = "lg", className }: WhatsAppContactButtonProps) {
  const settings = await getSiteSettings();
  const whatsapp = asString(settings.contact_whatsapp_number);

  if (!whatsapp) {
    return <ProfileAssessmentButton size={size} className={className} />;
  }

  const digitsOnly = whatsapp.replace(/\D/g, "");

  return (
    <Button asChild variant="gold" size={size} className={className}>
      <a href={`https://wa.me/${digitsOnly}`} target="_blank" rel="noreferrer">
        Contact Us
      </a>
    </Button>
  );
}

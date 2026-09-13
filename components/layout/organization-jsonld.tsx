import { getSiteSettings } from "@/lib/supabase/queries/site-settings";
import { absoluteUrl } from "@/lib/site-url";
import type { Json } from "@/lib/supabase/database.types";

function asString(value: Json | undefined): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

/**
 * Site-wide Organization/EducationalOrganization markup, rendered once
 * from the root layout. Schema.org allows a single node to carry multiple
 * @type values, which is what we want here — ApexMed is one entity that's
 * simultaneously a generic Organization (for contact/social graph
 * purposes) and an EducationalOrganization (for how search engines should
 * actually classify the business) rather than two competing entities.
 */
export async function OrganizationJsonLd() {
  const settings = await getSiteSettings();

  const sameAs = [
    asString(settings.social_facebook_url),
    asString(settings.social_instagram_url),
    asString(settings.social_linkedin_url),
    asString(settings.social_youtube_url),
  ].filter((url): url is string => Boolean(url));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "EducationalOrganization"],
    name: "ApexMed International",
    url: absoluteUrl("/"),
    description:
      "Research training, publication mentorship, German language and medical licensing pathway guidance, and German Master's admissions support for doctors and medical students.",
    ...(asString(settings.contact_email) ? { email: asString(settings.contact_email) } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

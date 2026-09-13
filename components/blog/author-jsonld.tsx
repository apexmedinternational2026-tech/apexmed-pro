import { absoluteUrl } from "@/lib/site-url";

export interface AuthorJsonLdProps {
  fullName: string;
  slug: string;
  roleTitle?: string | null;
  photoUrl?: string | null;
}

/** Person JSON-LD for a blog post's author — mirrors the shape rendered on /mentors/[slug] itself. */
export function AuthorJsonLd({ fullName, slug, roleTitle, photoUrl }: AuthorJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: fullName,
    jobTitle: roleTitle ?? undefined,
    image: photoUrl ?? undefined,
    url: absoluteUrl(`/mentors/${slug}`),
    worksFor: {
      "@type": "Organization",
      name: "ApexMed International",
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

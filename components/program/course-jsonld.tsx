import { absoluteUrl } from "@/lib/site-url";

export interface CourseJsonLdProps {
  name: string;
  description: string;
  slug: string;
  /** Overrides the default `/programs/${slug}` URL — for a program reachable
   * at a different canonical path (e.g. /international-exams/usmle). */
  path?: string;
}

export function CourseJsonLd({ name, description, slug, path }: CourseJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url: absoluteUrl(path ?? `/programs/${slug}`),
    provider: {
      "@type": "Organization",
      name: "ApexMed International",
      sameAs: absoluteUrl("/"),
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

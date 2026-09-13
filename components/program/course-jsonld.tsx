import { absoluteUrl } from "@/lib/site-url";

export interface CourseJsonLdProps {
  name: string;
  description: string;
  slug: string;
}

export function CourseJsonLd({ name, description, slug }: CourseJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url: absoluteUrl(`/programs/${slug}`),
    provider: {
      "@type": "Organization",
      name: "ApexMed International",
      sameAs: absoluteUrl("/"),
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

import { absoluteUrl } from "@/lib/site-url";

export interface ArticleJsonLdProps {
  title: string;
  description: string;
  slug: string;
  imageUrl?: string | null;
  publishedAt: string | null;
  updatedAt: string;
  authorName?: string | null;
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  imageUrl,
  publishedAt,
  updatedAt,
  authorName,
}: ArticleJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: absoluteUrl(`/blog/${slug}`),
    image: imageUrl ?? undefined,
    datePublished: publishedAt ?? undefined,
    dateModified: updatedAt,
    author: authorName
      ? { "@type": "Person", name: authorName }
      : { "@type": "Organization", name: "ApexMed International" },
    publisher: {
      "@type": "Organization",
      name: "ApexMed International",
      url: absoluteUrl("/"),
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

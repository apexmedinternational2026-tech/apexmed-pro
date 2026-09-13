import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getPostSlugs, getRelatedPosts } from "@/lib/supabase/queries/blog";
import { NotFoundError } from "@/lib/supabase/errors";
import { estimateReadingMinutes } from "@/lib/content-length";
import { extractToc } from "@/lib/toc";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { mdxComponents } from "@/components/blog/mdx-components";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { AuthorCard } from "@/components/blog/author-card";
import { RelatedPosts } from "@/components/blog/related-posts";
import { BlogCta } from "@/components/blog/blog-cta";
import { ArticleJsonLd } from "@/components/blog/article-jsonld";
import { AuthorJsonLd } from "@/components/blog/author-jsonld";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

interface PostPageParams {
  slug: string;
}

export async function generateStaticParams(): Promise<PostPageParams[]> {
  const slugs = await getPostSlugs();
  return slugs.map((row) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }: { params: Promise<PostPageParams> }): Promise<Metadata> {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    return {};
  }

  const title = post.seo_title ?? post.title;
  const description = post.seo_description ?? post.excerpt ?? post.title;
  const canonicalPath = post.canonical_path ?? `/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(canonicalPath) },
    openGraph: {
      title,
      description,
      type: "article",
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<PostPageParams> }) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const relatedPosts = post.category_id ? await getRelatedPosts(post.category_id, post.id) : [];

  const toc = extractToc(post.body_mdx);
  const readingMinutes = post.reading_minutes ?? estimateReadingMinutes(post.body_mdx);
  const tagSlugs = post.tags.map((tag) => tag.slug);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    ...(post.category ? [{ label: post.category.name, href: `/blog/category/${post.category.slug}` }] : []),
    { label: post.title, href: `/blog/${post.slug}` },
  ];

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt ?? post.title}
        slug={post.slug}
        imageUrl={post.cover_image_url}
        publishedAt={post.published_at}
        updatedAt={post.updated_at}
        authorName={post.author?.full_name}
      />
      {post.author && (
        <AuthorJsonLd fullName={post.author.full_name} slug={post.author.slug} photoUrl={post.author.photo_url} />
      )}

      <Section theme="navy" padding="lg" noise className="pt-32">
        <Container className="flex flex-col gap-4">
          <Breadcrumbs items={breadcrumbItems} tone="dark" />
          {post.category && <p className="text-eyebrow uppercase text-gold-400">{post.category.name}</p>}
          <h1 className="max-w-3xl font-display text-display-xl text-paper-50">{post.title}</h1>
          {post.excerpt && <p className="max-w-2xl text-body-lg text-paper-50/80">{post.excerpt}</p>}
          <p className="text-body-sm text-paper-50/60">
            {readingMinutes} min read
            {post.published_at && <> · {new Date(post.published_at).toLocaleDateString()}</>}
          </p>
        </Container>
      </Section>

      <Section theme="light" padding="lg">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
          <article className="flex max-w-none flex-col gap-2">
            {/* next-mdx-remote defaults to stripping every JSX-expression
                attribute (blockJS: true) — array/object props like
                ComparisonTable's `headers`/`rows` or Checklist's `items`
                would silently come through as undefined without this.
                body_mdx is admin-authored content behind Supabase Auth,
                never arbitrary public input, so allowing expressions here
                isn't loosening anything for an untrusted author — and
                blockDangerousJS (on by default whenever blockJS is off)
                still blocks eval/require/.constructor-style escapes even
                so. See node_modules/next-mdx-remote/dist/plugins/ for
                exactly what each flag does. */}
            <MDXRemote source={post.body_mdx} components={mdxComponents} options={{ blockJS: false }} />

            <div className="mt-6 flex flex-col gap-8">
              {post.author && <AuthorCard author={post.author} />}
              <BlogCta tagSlugs={tagSlugs} categorySlug={post.category?.slug ?? null} />
              <RelatedPosts posts={relatedPosts} />
            </div>
          </article>

          <TableOfContents items={toc} />
        </Container>
      </Section>
    </>
  );
}

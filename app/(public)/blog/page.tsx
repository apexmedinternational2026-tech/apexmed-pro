import type { Metadata } from "next";
import { getPublishedPostsPage, getBlogCategories } from "@/lib/supabase/queries/blog";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CategoryPills } from "@/components/blog/category-pills";
import { PostCard } from "@/components/blog/post-card";
import { Pagination } from "@/components/ui/pagination";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog — ApexMed International",
  description:
    "Guides on the German medical licensing pathway, research methodology, and Master's admissions — written by ApexMed's mentors.",
  alternates: { canonical: absoluteUrl("/blog") },
};

const BREADCRUMB_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
];

interface BlogIndexPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogIndexPage({ searchParams }: BlogIndexPageProps) {
  const params = await searchParams;
  const page = Number(params.page) > 0 ? Number(params.page) : 1;

  const [{ posts, totalPages }, categories] = await Promise.all([getPublishedPostsPage({ page }), getBlogCategories()]);

  return (
    <>
      <Section theme="navy" padding="lg" noise className="pt-32">
        <Container className="flex flex-col gap-4">
          <Breadcrumbs items={BREADCRUMB_ITEMS} tone="dark" />
          <p className="text-eyebrow uppercase text-gold-400">Blog</p>
          <h1 className="max-w-2xl font-display text-display-xl text-paper-50">
            Guides for the pathway you&apos;re actually on.
          </h1>
          <p className="max-w-xl text-body-lg text-paper-50/80">
            German licensing, research methodology, and Master&apos;s admissions — written by ApexMed&apos;s mentors.
          </p>
        </Container>
      </Section>

      <Section theme="light" padding="lg">
        <Container className="flex flex-col gap-8">
          <CategoryPills categories={categories} />

          {posts.length === 0 ? (
            <p className="text-body-md text-slate-500">No posts published yet — check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} basePath="/blog" searchParams={params} />
        </Container>
      </Section>
    </>
  );
}

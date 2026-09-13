import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPublishedPostsPage,
  getBlogCategories,
  getBlogCategoryBySlug,
  getBlogCategorySlugs,
} from "@/lib/supabase/queries/blog";
import { NotFoundError } from "@/lib/supabase/errors";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CategoryPills } from "@/components/blog/category-pills";
import { PostCard } from "@/components/blog/post-card";
import { Pagination } from "@/components/ui/pagination";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

interface CategoryPageParams {
  slug: string;
}

export async function generateStaticParams(): Promise<CategoryPageParams[]> {
  const slugs = await getBlogCategorySlugs();
  return slugs.map((row) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }: { params: Promise<CategoryPageParams> }): Promise<Metadata> {
  const { slug } = await params;

  let category;
  try {
    category = await getBlogCategoryBySlug(slug);
  } catch {
    return {};
  }

  return {
    title: `${category.name} Articles — ApexMed International`,
    description: category.description ?? `Articles filed under ${category.name} from ApexMed International's mentors.`,
    alternates: { canonical: absoluteUrl(`/blog/category/${category.slug}`) },
  };
}

interface CategoryIndexPageProps {
  params: Promise<CategoryPageParams>;
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogCategoryPage({ params, searchParams }: CategoryIndexPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const page = Number(query.page) > 0 ? Number(query.page) : 1;

  let category;
  try {
    category = await getBlogCategoryBySlug(slug);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const [{ posts, totalPages }, categories] = await Promise.all([
    getPublishedPostsPage({ categorySlug: slug, page }),
    getBlogCategories(),
  ]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: category.name, href: `/blog/category/${category.slug}` },
  ];

  return (
    <>
      <Section theme="navy" padding="lg" noise className="pt-32">
        <Container className="flex flex-col gap-4">
          <Breadcrumbs items={breadcrumbItems} tone="dark" />
          <p className="text-eyebrow uppercase text-gold-400">Blog</p>
          <h1 className="max-w-2xl font-display text-display-xl text-paper-50">{category.name}</h1>
          {category.description && <p className="max-w-xl text-body-lg text-paper-50/80">{category.description}</p>}
        </Container>
      </Section>

      <Section theme="light" padding="lg">
        <Container className="flex flex-col gap-8">
          <CategoryPills categories={categories} activeSlug={category.slug} />

          {posts.length === 0 ? (
            <p className="text-body-md text-slate-500">No posts published in this category yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            basePath={`/blog/category/${category.slug}`}
            searchParams={query}
          />
        </Container>
      </Section>
    </>
  );
}

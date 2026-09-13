import { createPublicClient } from "../public";
import { DatabaseQueryError, NotFoundError } from "../errors";
import type { Tables } from "../database.types";

export type BlogCategory = Tables<"blog_categories">;
export type Tag = Tables<"tags">;

type PostAuthor = Pick<Tables<"mentors">, "id" | "slug" | "full_name" | "photo_url">;

export type BlogPostSummary = Pick<
  Tables<"blog_posts">,
  "id" | "slug" | "title" | "excerpt" | "cover_image_url" | "cover_image_alt" | "reading_minutes" | "published_at"
> & {
  category: Pick<Tables<"blog_categories">, "id" | "slug" | "name"> | null;
  author: PostAuthor | null;
};

export type BlogPostDetail = Tables<"blog_posts"> & {
  category: Tables<"blog_categories"> | null;
  author: PostAuthor | null;
  tags: Tag[];
};

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("blog_categories").select("*").order("name", { ascending: true });

  if (error) {
    throw new DatabaseQueryError("Failed to load blog categories.", {
      table: "blog_categories",
      originalError: error,
    });
  }

  return data;
}

export async function getBlogCategoryBySlug(slug: string): Promise<BlogCategory> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("blog_categories").select("*").eq("slug", slug).maybeSingle();

  if (error) {
    throw new DatabaseQueryError(`Failed to load blog category "${slug}".`, {
      table: "blog_categories",
      originalError: error,
    });
  }
  if (!data) {
    throw new NotFoundError(`Blog category "${slug}" was not found.`);
  }

  return data;
}

export async function getBlogCategorySlugs(): Promise<{ slug: string }[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("blog_categories").select("slug");

  if (error) {
    throw new DatabaseQueryError("Failed to load blog category slugs.", {
      table: "blog_categories",
      originalError: error,
    });
  }

  return data;
}

interface RawPostSummary extends Tables<"blog_posts"> {
  category: Pick<Tables<"blog_categories">, "id" | "slug" | "name"> | null;
  author: PostAuthor | null;
}

export async function getPublishedPosts(): Promise<BlogPostSummary[]> {
  const supabase = createPublicClient();

  // No .eq("status", "published"): anon_select_published_posts already
  // enforces it via RLS.
  const { data, error } = await supabase
    .from("blog_posts")
    .select<string, RawPostSummary>(
      `
      id, slug, title, excerpt, cover_image_url, cover_image_alt, reading_minutes, published_at,
      category:blog_categories(id, slug, name),
      author:mentors(id, slug, full_name, photo_url)
      `,
    )
    .order("published_at", { ascending: false });

  if (error) {
    throw new DatabaseQueryError("Failed to load blog posts.", {
      table: "blog_posts",
      originalError: error,
    });
  }

  return data;
}

const POSTS_PAGE_SIZE = 9;

export interface PublishedPostsPage {
  posts: BlogPostSummary[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * The /blog and /blog/category/[slug] index pages both go through this —
 * same category filter and page-size everywhere a post list renders, so
 * pagination math (and the "how many pages" the UI shows) can't drift
 * between the two.
 */
export async function getPublishedPostsPage(
  options: { categorySlug?: string; page?: number } = {},
): Promise<PublishedPostsPage> {
  const supabase = createPublicClient();
  const page = options.page && options.page > 0 ? options.page : 1;
  const from = (page - 1) * POSTS_PAGE_SIZE;
  const to = from + POSTS_PAGE_SIZE - 1;

  // Resolved to a real category_id up front and filtered on that column
  // directly, rather than filtering through the `category:blog_categories`
  // embed by slug — PostgREST's embedded-filter semantics differ by
  // whether the relationship is declared `!inner`, and forcing `!inner`
  // unconditionally would silently hide any post with no category at all
  // (category_id is nullable) from the unfiltered /blog listing. Filtering
  // the real FK column has no such ambiguity.
  let categoryId: string | undefined;
  if (options.categorySlug) {
    categoryId = (await getBlogCategoryBySlug(options.categorySlug)).id;
  }

  let query = supabase
    .from("blog_posts")
    .select<string, RawPostSummary>(
      `
      id, slug, title, excerpt, cover_image_url, cover_image_alt, reading_minutes, published_at,
      category:blog_categories(id, slug, name),
      author:mentors(id, slug, full_name, photo_url)
      `,
      { count: "exact" },
    )
    .order("published_at", { ascending: false });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw new DatabaseQueryError("Failed to load blog posts.", {
      table: "blog_posts",
      originalError: error,
    });
  }

  const total = count ?? data.length;

  return {
    posts: data,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / POSTS_PAGE_SIZE)),
  };
}

export interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  cover_image_alt: string;
}

/** A handful of other published posts in the same category — used for the "related posts" section on a post page. */
export async function getRelatedPosts(categoryId: string, excludePostId: string, limit = 3): Promise<RelatedPost[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, title, excerpt, cover_image_url, cover_image_alt")
    .eq("category_id", categoryId)
    .neq("id", excludePostId)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new DatabaseQueryError("Failed to load related posts.", {
      table: "blog_posts",
      originalError: error,
    });
  }

  return data;
}

export async function getPostSlugs(): Promise<{ slug: string }[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("blog_posts").select("slug");

  if (error) {
    throw new DatabaseQueryError("Failed to load blog post slugs.", {
      table: "blog_posts",
      originalError: error,
    });
  }

  return data;
}

interface RawPostDetail extends Tables<"blog_posts"> {
  category: Tables<"blog_categories"> | null;
  author: PostAuthor | null;
  tags: { tag: Tag }[];
}

export async function getPostBySlug(slug: string): Promise<BlogPostDetail> {
  const supabase = createPublicClient();

  // Single round trip for the post, its category, its author, and every
  // tag attached via blog_post_tags — no N+1 fan-out per tag.
  const { data, error } = await supabase
    .from("blog_posts")
    .select<string, RawPostDetail>(
      `
      *,
      category:blog_categories(*),
      author:mentors(id, slug, full_name, photo_url),
      tags:blog_post_tags(tag:tags(*))
      `,
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new DatabaseQueryError(`Failed to load blog post "${slug}".`, {
      table: "blog_posts",
      originalError: error,
    });
  }

  if (!data) {
    throw new NotFoundError(`Blog post "${slug}" was not found or is not published.`);
  }

  const { tags, ...post } = data;

  return {
    ...post,
    tags: tags.map((t) => t.tag),
  };
}

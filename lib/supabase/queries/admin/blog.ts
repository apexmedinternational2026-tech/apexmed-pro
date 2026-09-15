import "server-only";
import { createAdminClient } from "../../admin";
import { DatabaseQueryError, NotFoundError } from "../../errors";
import { ok, err, type Result } from "../../../result";
import type { Tables, TablesInsert } from "../../database.types";
import type { BlogPostInput } from "@/lib/validation/admin/blog-post";

export type AdminBlogPostSummary = Pick<
  Tables<"blog_posts">,
  "id" | "slug" | "title" | "status" | "published_at" | "updated_at" | "cover_image_url"
> & {
  category: Pick<Tables<"blog_categories">, "id" | "name"> | null;
  author: Pick<Tables<"mentors">, "id" | "full_name"> | null;
};

export type AdminBlogPostDetail = Tables<"blog_posts"> & { tagIds: string[] };

export async function listPostsAdmin(): Promise<AdminBlogPostSummary[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("blog_posts")
    .select(
      "id, slug, title, status, published_at, updated_at, cover_image_url, category:blog_categories(id, name), author:mentors(id, full_name)",
    )
    .order("updated_at", { ascending: false });

  if (error) throw new DatabaseQueryError("Failed to load posts.", { table: "blog_posts", originalError: error });
  return data;
}

export async function getPostByIdAdmin(id: string): Promise<AdminBlogPostDetail> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("blog_posts")
    .select("*, tags:blog_post_tags(tag_id)")
    .eq("id", id)
    .maybeSingle();

  if (error)
    throw new DatabaseQueryError(`Failed to load post "${id}".`, { table: "blog_posts", originalError: error });
  if (!data) throw new NotFoundError(`Post "${id}" was not found.`);

  const { tags, ...post } = data;
  return { ...post, tagIds: tags.map((t) => t.tag_id) };
}

export async function listBlogCategoriesAdmin(): Promise<Tables<"blog_categories">[]> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("blog_categories").select("*").order("name", { ascending: true });
  if (error)
    throw new DatabaseQueryError("Failed to load blog categories.", { table: "blog_categories", originalError: error });
  return data;
}

export async function listTagsAdmin(): Promise<Tables<"tags">[]> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("tags").select("*").order("name", { ascending: true });
  if (error) throw new DatabaseQueryError("Failed to load tags.", { table: "tags", originalError: error });
  return data;
}

function toInsert(input: BlogPostInput): Omit<TablesInsert<"blog_posts">, "id"> {
  return {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt || null,
    body_mdx: input.body_mdx,
    cover_image_url: input.cover_image_url || null,
    cover_image_alt: input.cover_image_alt,
    author_id: input.author_id || null,
    category_id: input.category_id || null,
    reading_minutes: input.reading_minutes ?? null,
    status: input.status,
    published_at:
      input.status === "published" && !input.published_at ? new Date().toISOString() : input.published_at || null,
    // seo_title/seo_description/seo_og_image_url/canonical_path are
    // deliberately not set here — the admin form no longer collects them
    // (they added confusing, easy-to-get-wrong manual-override fields for
    // metadata the site already generates sensibly from title/excerpt/slug).
    // Omitting the keys entirely, rather than setting them to null, means
    // this update() call never touches those columns — a post that already
    // has a manually-set SEO override (from before this change) keeps it.
  };
}

async function syncTags(admin: ReturnType<typeof createAdminClient>, postId: string, tagIds: string[]) {
  await admin.from("blog_post_tags").delete().eq("post_id", postId);
  if (tagIds.length > 0) {
    await admin.from("blog_post_tags").insert(tagIds.map((tagId) => ({ post_id: postId, tag_id: tagId })));
  }
}

export async function createPostAdmin(input: BlogPostInput): Promise<Result<Tables<"blog_posts">, string>> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("blog_posts").insert(toInsert(input)).select("*").single();

  if (error) {
    if (error.code === "23505") return err("That slug is already in use.");
    return err("Failed to create the post.");
  }

  await syncTags(admin, data.id, input.tag_ids);
  return ok(data);
}

export async function updatePostAdmin(id: string, input: BlogPostInput): Promise<Result<Tables<"blog_posts">, string>> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("blog_posts").update(toInsert(input)).eq("id", id).select("*").single();

  if (error) {
    if (error.code === "23505") return err("That slug is already in use.");
    return err("Failed to update the post.");
  }

  await syncTags(admin, id, input.tag_ids);
  return ok(data);
}

export async function deletePostAdmin(id: string): Promise<Result<true, string>> {
  const admin = createAdminClient();
  const { error } = await admin.from("blog_posts").delete().eq("id", id);
  if (error) return err("Failed to delete the post.");
  return ok(true);
}

export async function uploadCoverImageAdmin(file: File): Promise<Result<string, string>> {
  const admin = createAdminClient();
  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `blog-covers/${crypto.randomUUID()}.${extension}`;

  const { error } = await admin.storage.from("media").upload(path, file, {
    contentType: file.type || "image/jpeg",
    cacheControl: "31536000",
  });

  if (error) return err("Failed to upload the image.");

  const { data } = admin.storage.from("media").getPublicUrl(path);
  return ok(data.publicUrl);
}

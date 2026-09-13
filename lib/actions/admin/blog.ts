"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/supabase/auth";
import { blogPostSchema } from "@/lib/validation/admin/blog-post";
import {
  createPostAdmin,
  updatePostAdmin,
  deletePostAdmin,
  uploadCoverImageAdmin,
} from "@/lib/supabase/queries/admin/blog";
import type { Result } from "@/lib/result";

function parsePostForm(formData: FormData) {
  return blogPostSchema.safeParse({
    id: formData.get("id") || undefined,
    slug: formData.get("slug"),
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    body_mdx: formData.get("body_mdx"),
    cover_image_url: formData.get("cover_image_url"),
    cover_image_alt: formData.get("cover_image_alt"),
    author_id: formData.get("author_id"),
    category_id: formData.get("category_id"),
    tag_ids: formData.getAll("tag_ids"),
    reading_minutes: formData.get("reading_minutes") || undefined,
    status: formData.get("status"),
    published_at: formData.get("published_at"),
    seo_title: formData.get("seo_title"),
    seo_description: formData.get("seo_description"),
    seo_og_image_url: formData.get("seo_og_image_url"),
    canonical_path: formData.get("canonical_path"),
  });
}

function revalidateBlog(slug: string) {
  // /blog and /blog/[slug] don't exist as pages yet (see project notes),
  // but revalidatePath on a route that isn't statically generated is a
  // harmless no-op — this is here so publishing already does the right
  // thing the moment those pages ship, with nothing to remember to add then.
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
}

export async function createPostAction(formData: FormData): Promise<Result<{ id: string }, string>> {
  await requireAdminSession();
  const parsed = parsePostForm(formData);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid post data." };

  const result = await createPostAdmin(parsed.data);
  if (!result.ok) return result;

  revalidateBlog(parsed.data.slug);
  return { ok: true, value: { id: result.value.id } };
}

export async function updatePostAction(id: string, formData: FormData): Promise<Result<true, string>> {
  await requireAdminSession();
  const parsed = parsePostForm(formData);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid post data." };

  const result = await updatePostAdmin(id, parsed.data);
  if (!result.ok) return result;

  revalidateBlog(parsed.data.slug);
  return { ok: true, value: true };
}

export async function deletePostAction(id: string, slug: string): Promise<Result<true, string>> {
  await requireAdminSession();
  const result = await deletePostAdmin(id);
  if (!result.ok) return result;
  revalidateBlog(slug);
  return result;
}

export async function uploadCoverImageAction(formData: FormData): Promise<Result<string, string>> {
  await requireAdminSession();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "No file provided." };
  if (!file.type.startsWith("image/")) return { ok: false, error: "Only image files are allowed." };
  if (file.size > 5 * 1024 * 1024) return { ok: false, error: "Image must be under 5MB." };

  return uploadCoverImageAdmin(file);
}

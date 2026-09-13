"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createPostAction, updatePostAction } from "@/lib/actions/admin/blog";
import { POST_STATUS_OPTIONS } from "@/lib/validation/admin/blog-post";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SeoCharCount } from "@/components/admin/seo-char-count";
import { MdxEditor } from "./mdx-editor";
import { CoverImageUpload } from "./cover-image-upload";
import type { AdminBlogPostDetail } from "@/lib/supabase/queries/admin/blog";
import type { Tables } from "@/lib/supabase/database.types";

const STATUS_LABELS: Record<(typeof POST_STATUS_OPTIONS)[number], string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
};

export interface BlogPostFormProps {
  post?: AdminBlogPostDetail;
  categories: Tables<"blog_categories">[];
  tags: Tables<"tags">[];
  authors: Pick<Tables<"mentors">, "id" | "full_name">[];
}

function toLocalInputValue(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 16);
}

export function BlogPostForm({ post, categories, tags, authors }: BlogPostFormProps) {
  const router = useRouter();
  const isEdit = Boolean(post);

  const [status, setStatus] = React.useState<(typeof POST_STATUS_OPTIONS)[number]>((post?.status as never) ?? "draft");
  const [categoryId, setCategoryId] = React.useState(post?.category_id ?? "");
  const [authorId, setAuthorId] = React.useState(post?.author_id ?? "");
  const [selectedTagIds, setSelectedTagIds] = React.useState<string[]>(post?.tagIds ?? []);
  const [seoTitle, setSeoTitle] = React.useState(post?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = React.useState(post?.seo_description ?? "");
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  function toggleTag(id: string) {
    setSelectedTagIds((current) => (current.includes(id) ? current.filter((t) => t !== id) : [...current, id]));
  }

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setFormError(null);

    formData.set("status", status);
    formData.set("category_id", categoryId);
    formData.set("author_id", authorId);
    formData.delete("tag_ids");
    selectedTagIds.forEach((id) => formData.append("tag_ids", id));

    // Branches on `post` itself, not the derived `isEdit` boolean, so
    // TypeScript can actually narrow `post` to non-undefined in this
    // branch — a `post!.id` assertion here would be checking a fact
    // (isEdit implies post exists) the compiler has no way to verify.
    const result = post ? await updatePostAction(post.id, formData) : await createPostAction(formData);

    setIsPending(false);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-6">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={post?.title} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={post?.slug} required />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt ?? ""} rows={2} />
      </div>

      <MdxEditor name="body_mdx" defaultValue={post?.body_mdx ?? ""} />

      <CoverImageUpload defaultUrl={post?.cover_image_url ?? ""} defaultAlt={post?.cover_image_alt ?? ""} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="author_id">Author</Label>
          <Select value={authorId} onValueChange={setAuthorId}>
            <SelectTrigger id="author_id">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              {authors.map((author) => (
                <SelectItem key={author.id} value={author.id}>
                  {author.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category_id">Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger id="category_id">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reading_minutes">Reading minutes</Label>
          <Input
            id="reading_minutes"
            name="reading_minutes"
            type="number"
            min={1}
            defaultValue={post?.reading_minutes ?? ""}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <label
              key={tag.id}
              className="flex items-center gap-1.5 rounded-full border border-navy-800/20 px-3 py-1 text-body-sm text-ink-900"
            >
              <Checkbox checked={selectedTagIds.includes(tag.id)} onCheckedChange={() => toggleTag(tag.id)} />
              {tag.name}
            </label>
          ))}
          {tags.length === 0 && <p className="text-body-sm text-slate-500">No tags yet.</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {POST_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {STATUS_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {status === "scheduled" && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="published_at">Publish at</Label>
            <Input
              id="published_at"
              name="published_at"
              type="datetime-local"
              defaultValue={toLocalInputValue(post?.published_at ?? null)}
              required
            />
          </div>
        )}
      </div>

      <fieldset className="flex flex-col gap-4 rounded-xl border border-navy-800/10 p-4">
        <legend className="px-1 text-body-sm font-semibold text-ink-900">SEO</legend>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="seo_title">SEO title</Label>
          <Input
            id="seo_title"
            name="seo_title"
            value={seoTitle}
            onChange={(event) => setSeoTitle(event.target.value)}
          />
          <SeoCharCount value={seoTitle} min={50} max={60} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="seo_description">SEO description</Label>
          <Textarea
            id="seo_description"
            name="seo_description"
            rows={2}
            value={seoDescription}
            onChange={(event) => setSeoDescription(event.target.value)}
          />
          <SeoCharCount value={seoDescription} min={140} max={160} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="seo_og_image_url">OG image URL (overrides the cover image for social sharing)</Label>
          <Input id="seo_og_image_url" name="seo_og_image_url" defaultValue={post?.seo_og_image_url ?? ""} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="canonical_path">Canonical path</Label>
          <Input id="canonical_path" name="canonical_path" defaultValue={post?.canonical_path ?? ""} />
        </div>
      </fieldset>

      {formError && <p className="text-body-sm text-error">{formError}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" size="lg" disabled={isPending}>
          {isPending ? "Saving…" : isEdit ? "Save changes" : "Create post"}
        </Button>
      </div>
    </form>
  );
}

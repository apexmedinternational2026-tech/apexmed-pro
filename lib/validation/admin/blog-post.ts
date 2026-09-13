import { z } from "zod";

export const POST_STATUS_OPTIONS = ["draft", "scheduled", "published", "archived"] as const;

const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required.")
  .max(150)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only.");

export const blogPostSchema = z
  .object({
    id: z.string().uuid().optional(),
    slug: slugSchema,
    title: z.string().trim().min(2, "Title is required.").max(200),
    excerpt: z.string().trim().max(400).optional().or(z.literal("")),
    body_mdx: z.string().trim().min(1, "Post body cannot be empty."),
    cover_image_url: z.string().trim().url().optional().or(z.literal("")),
    // Required, and blocks submission when empty — an image with no alt
    // text is inaccessible to a screen reader, and this is the one place
    // in the CMS that catches it before publish rather than relying on
    // whoever wrote the post to remember.
    cover_image_alt: z.string().trim().min(1, "Alt text is required for the cover image.").max(300),
    author_id: z.string().uuid().optional().or(z.literal("")),
    category_id: z.string().uuid().optional().or(z.literal("")),
    tag_ids: z.array(z.string().uuid()).default([]),
    reading_minutes: z.coerce.number().int().positive().optional(),
    status: z.enum(POST_STATUS_OPTIONS),
    published_at: z.string().trim().optional().or(z.literal("")),
    seo_title: z.string().trim().max(70).optional().or(z.literal("")),
    seo_description: z.string().trim().max(200).optional().or(z.literal("")),
    seo_og_image_url: z.string().trim().url().optional().or(z.literal("")),
    canonical_path: z.string().trim().max(200).optional().or(z.literal("")),
  })
  .refine((data) => data.status !== "scheduled" || Boolean(data.published_at), {
    // "scheduled" without a future publish time is a status with no
    // meaning — the field is otherwise optional for draft/published/archived.
    message: "A scheduled post needs a publish date/time.",
    path: ["published_at"],
  });

export type BlogPostInput = z.infer<typeof blogPostSchema>;

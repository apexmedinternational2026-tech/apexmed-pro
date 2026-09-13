import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required.")
  .max(150)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only.");

export const studyFieldCategorySchema = z.object({
  id: z.string().uuid().optional(),
  slug: slugSchema,
  name: z.string().trim().min(1, "Name is required.").max(150),
});

export const studyFieldSchema = z.object({
  id: z.string().uuid().optional(),
  category_id: z.string().uuid("Select a category."),
  slug: slugSchema,
  name: z.string().trim().min(1, "Name is required.").max(150),
  overview: z.string().trim().max(2000).optional().or(z.literal("")),
  typical_universities: z.string().trim().max(2000).optional().or(z.literal("")),
  entry_requirements: z.string().trim().max(2000).optional().or(z.literal("")),
  language_requirements: z.string().trim().max(1000).optional().or(z.literal("")),
  career_outlook: z.string().trim().max(2000).optional().or(z.literal("")),
  is_published: z.boolean(),
  seo_title: z.string().trim().max(70).optional().or(z.literal("")),
  seo_description: z.string().trim().max(200).optional().or(z.literal("")),
  seo_og_image_url: z.string().trim().url().optional().or(z.literal("")),
  canonical_path: z.string().trim().max(200).optional().or(z.literal("")),
});

export type StudyFieldCategoryInput = z.infer<typeof studyFieldCategorySchema>;
export type StudyFieldInput = z.infer<typeof studyFieldSchema>;

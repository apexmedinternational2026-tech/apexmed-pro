import { z } from "zod";
import { isSupabaseStorageUrl } from "@/lib/supabase-storage-url";

const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required.")
  .max(150)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only.");

export const mentorSchema = z.object({
  id: z.string().uuid().optional(),
  slug: slugSchema,
  full_name: z.string().trim().min(2, "Full name is required.").max(150),
  role_title: z.string().trim().max(150).optional().or(z.literal("")),
  qualification: z.string().trim().max(150).optional().or(z.literal("")),
  institution: z.string().trim().max(200).optional().or(z.literal("")),
  bio: z.string().trim().max(4000).optional().or(z.literal("")),
  photo_url: z
    .string()
    .trim()
    .url()
    .refine(isSupabaseStorageUrl, {
      message: "Must be a Supabase Storage file URL (upload the photo via Storage, then paste its public URL here).",
    })
    .optional()
    .or(z.literal("")),
  publications_count: z.coerce.number().int().min(0).default(0),
  linkedin_url: z.string().trim().url().optional().or(z.literal("")),
  is_leadership: z.boolean(),
  is_published: z.boolean(),
});

export type MentorInput = z.infer<typeof mentorSchema>;

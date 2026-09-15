import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required.")
  .max(150)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only.");

export const WEBINAR_PLATFORM_OPTIONS = ["zoom", "google_meet", "ms_teams", "youtube_live", "other"] as const;

export const webinarSchema = z.object({
  id: z.string().uuid().optional(),
  slug: slugSchema,
  title: z.string().trim().min(2, "Title is required.").max(200),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  speaker_id: z.string().uuid().optional().or(z.literal("")),
  starts_at: z.string().trim().min(1, "Start date/time is required."),
  duration_minutes: z.coerce.number().int().positive().default(60),
  platform: z.enum(WEBINAR_PLATFORM_OPTIONS),
  join_url: z.string().trim().url().optional().or(z.literal("")),
  cover_image_url: z.string().trim().url().optional().or(z.literal("")),
  capacity: z.coerce.number().int().positive().optional(),
  is_published: z.boolean(),
});

export type WebinarInput = z.infer<typeof webinarSchema>;

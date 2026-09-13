import { z } from "zod";

// Matches exactly the keys seeded in supabase/seed.sql's site_settings
// insert — settings is a free-form key/value table, but the admin form
// only ever needs to edit this known set.
export const settingsSchema = z.object({
  contact_email: z.string().trim().email("Enter a valid email address."),
  contact_whatsapp_number: z.string().trim().min(1, "WhatsApp number is required."),
  website_url: z.string().trim().url("Enter a valid URL."),
  social_facebook_url: z.string().trim().url().optional().or(z.literal("")),
  social_instagram_url: z.string().trim().url().optional().or(z.literal("")),
  social_linkedin_url: z.string().trim().url().optional().or(z.literal("")),
  social_youtube_url: z.string().trim().url().optional().or(z.literal("")),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

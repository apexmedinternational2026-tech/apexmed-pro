"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/supabase/auth";
import { settingsSchema } from "@/lib/validation/admin/settings";
import { updateSettingsAdmin } from "@/lib/supabase/queries/admin/settings";
import type { Result } from "@/lib/result";

export async function updateSettingsAction(formData: FormData): Promise<Result<true, string>> {
  await requireAdminSession();

  const parsed = settingsSchema.safeParse({
    contact_email: formData.get("contact_email"),
    contact_whatsapp_number: formData.get("contact_whatsapp_number"),
    website_url: formData.get("website_url"),
    social_facebook_url: formData.get("social_facebook_url"),
    social_instagram_url: formData.get("social_instagram_url"),
    social_linkedin_url: formData.get("social_linkedin_url"),
    social_youtube_url: formData.get("social_youtube_url"),
  });

  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid settings." };

  const result = await updateSettingsAdmin(parsed.data);
  if (!result.ok) return result;

  // Settings feed the Footer and Organization JSON-LD on every public
  // page via the root layout — "layout" busts the whole public tree's
  // cache in one call instead of enumerating every route that uses them.
  revalidatePath("/", "layout");
  return { ok: true, value: true };
}

import { cache } from "react";
import { createPublicClient } from "../public";
import { DatabaseQueryError } from "../errors";
import type { Json } from "../database.types";

export type SiteSettings = Record<string, Json>;

/**
 * Fetches every row in site_settings and flattens it into a plain
 * key -> value map, since callers always want a specific setting by key
 * (e.g. settings.contact_email) rather than the raw row list.
 *
 * Wrapped in React's `cache()` because both the root layout's Organization
 * JSON-LD and the Footer call this on every request — without memoization
 * that's two round trips to Supabase per page for identical data.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("site_settings").select("*");

  if (error) {
    throw new DatabaseQueryError("Failed to load site settings.", {
      table: "site_settings",
      originalError: error,
    });
  }

  const settings: SiteSettings = {};
  for (const row of data) {
    settings[row.key] = row.value;
  }
  return settings;
});

export async function getSiteSetting(key: string): Promise<Json | undefined> {
  const settings = await getSiteSettings();
  return settings[key];
}

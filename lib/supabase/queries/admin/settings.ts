import "server-only";
import { createAdminClient } from "../../admin";
import { DatabaseQueryError } from "../../errors";
import { ok, err, type Result } from "../../../result";
import type { SettingsInput } from "@/lib/validation/admin/settings";

export async function getAllSettingsAdmin(): Promise<Record<string, string>> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("site_settings").select("*");
  if (error) throw new DatabaseQueryError("Failed to load settings.", { table: "site_settings", originalError: error });

  const settings: Record<string, string> = {};
  for (const row of data) {
    settings[row.key] = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
  }
  return settings;
}

// site_settings stores one JSON value per key row — upsert one row per
// field rather than a single "settings blob" row, so a public read of any
// one setting (Footer, Organization JSON-LD) never depends on the shape of
// fields it doesn't use.
export async function updateSettingsAdmin(input: SettingsInput): Promise<Result<true, string>> {
  const admin = createAdminClient();
  const rows = Object.entries(input).map(([key, value]) => ({ key, value: value ?? "" }));

  const { error } = await admin.from("site_settings").upsert(rows, { onConflict: "key" });
  if (error) return err("Failed to save settings.");
  return ok(true);
}

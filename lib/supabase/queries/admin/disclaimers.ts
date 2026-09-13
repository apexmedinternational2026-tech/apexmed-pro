import "server-only";
import { createAdminClient } from "../../admin";
import { DatabaseQueryError } from "../../errors";
import type { Tables } from "../../database.types";

export async function listDisclaimersAdmin(): Promise<Tables<"compliance_disclaimers">[]> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("compliance_disclaimers").select("*").order("key", { ascending: true });

  if (error) {
    throw new DatabaseQueryError("Failed to load compliance disclaimers.", {
      table: "compliance_disclaimers",
      originalError: error,
    });
  }

  return data;
}

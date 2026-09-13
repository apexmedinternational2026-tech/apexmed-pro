import { cache } from "react";
import { createPublicClient } from "../public";
import { DatabaseQueryError, NotFoundError } from "../errors";

/**
 * Fetches a compliance disclaimer's body by key, for pages that render
 * one without it being embedded in a program row (e.g. /germany, /masters
 * — topics that carry real legal weight but aren't a `programs` record).
 * Throws rather than returning null, same as every other disclaimer path
 * in this codebase — a page must never silently render without one.
 * Wrapped in `cache()` since /masters renders the same disclaimer after
 * every section on the page.
 */
export const getComplianceDisclaimer = cache(async (key: string): Promise<string> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("compliance_disclaimers").select("body").eq("key", key).maybeSingle();

  if (error) {
    throw new DatabaseQueryError(`Failed to load compliance disclaimer "${key}".`, {
      table: "compliance_disclaimers",
      originalError: error,
    });
  }

  if (!data) {
    throw new NotFoundError(`Compliance disclaimer "${key}" was not found.`);
  }

  return data.body;
});

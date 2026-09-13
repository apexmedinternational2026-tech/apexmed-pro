import "server-only";
import { createAdminClient } from "../../admin";
import { DatabaseQueryError, NotFoundError } from "../../errors";
import { ok, err, type Result } from "../../../result";
import type { Tables, TablesUpdate } from "../../database.types";
import type { ProgramEditInput } from "@/lib/validation/admin/program";

export type AdminProgramSummary = Tables<"programs"> & { family: Pick<Tables<"program_families">, "id" | "name"> };

export type AdminProgramModule = Tables<"program_modules"> & { items: Tables<"program_module_items">[] };

export type AdminProgramDetail = Tables<"programs"> & {
  family: Tables<"program_families">;
  modules: AdminProgramModule[];
  audiences: Tables<"program_audiences">[];
  journeySteps: Tables<"program_journey_steps">[];
};

// Reordering N small child rows (a handful of modules/items per program)
// as N parallel single-row updates, rather than one bulk statement — there
// is no bulk "set different values per row" call in postgrest-js short of
// a database function, and at this scale (never more than a dozen rows)
// the extra round trips cost nothing worth optimizing for.
async function applyOrder(
  admin: ReturnType<typeof createAdminClient>,
  table: "program_modules" | "program_module_items" | "program_audiences" | "program_journey_steps",
  orderedIds: string[],
): Promise<Result<true, string>> {
  const results = await Promise.all(
    orderedIds.map((id, index) => admin.from(table).update({ sort_order: index }).eq("id", id)),
  );

  const failed = results.find((result) => result.error);
  if (failed) return err("Failed to save the new order.");
  return ok(true);
}

export async function listProgramsAdmin(): Promise<AdminProgramSummary[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("programs")
    .select("*, family:program_families(id, name)")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new DatabaseQueryError("Failed to load programs.", { table: "programs", originalError: error });
  }

  return data;
}

interface RawAdminProgramDetail extends Tables<"programs"> {
  family: Tables<"program_families">;
  modules: (Tables<"program_modules"> & { items: Tables<"program_module_items">[] })[];
  audiences: Tables<"program_audiences">[];
  journey_steps: Tables<"program_journey_steps">[];
}

export async function getProgramForEditAdmin(id: string): Promise<AdminProgramDetail> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("programs")
    .select<string, RawAdminProgramDetail>(
      `
      *,
      family:program_families(*),
      modules:program_modules(*, items:program_module_items(*)),
      audiences:program_audiences(*),
      journey_steps:program_journey_steps(*)
      `,
    )
    .eq("id", id)
    .order("sort_order", { referencedTable: "modules", ascending: true })
    .order("sort_order", { referencedTable: "modules.items", ascending: true })
    .order("sort_order", { referencedTable: "audiences", ascending: true })
    .order("sort_order", { referencedTable: "journey_steps", ascending: true })
    .maybeSingle();

  if (error) {
    throw new DatabaseQueryError(`Failed to load program "${id}" for editing.`, {
      table: "programs",
      originalError: error,
    });
  }
  if (!data) {
    throw new NotFoundError(`Program "${id}" was not found.`);
  }

  const { journey_steps, ...program } = data;
  return { ...program, journeySteps: journey_steps };
}

export async function updateProgramAdmin(input: ProgramEditInput): Promise<Result<Tables<"programs">, string>> {
  const admin = createAdminClient();

  const update: TablesUpdate<"programs"> = {
    name: input.name,
    headline: input.headline,
    summary: input.summary,
    duration_label: input.duration_label || null,
    disclaimer_key: input.disclaimer_key,
    is_published: input.is_published,
    seo_title: input.seo_title || null,
    seo_description: input.seo_description || null,
    seo_og_image_url: input.seo_og_image_url || null,
    canonical_path: input.canonical_path || null,
  };

  const { data, error } = await admin.from("programs").update(update).eq("id", input.id).select("*").single();

  if (error) {
    // 23503 = foreign_key_violation — disclaimer_key must reference an
    // existing compliance_disclaimers row.
    if (error.code === "23503") return err("Select a valid disclaimer.");
    return err("Failed to save the program.");
  }

  return ok(data);
}

// ── Modules ────────────────────────────────────────────────────────────

export async function createModuleAdmin(
  programId: string,
  values: { title: string; description?: string; icon_key?: string },
): Promise<Result<Tables<"program_modules">, string>> {
  const admin = createAdminClient();
  const { count } = await admin
    .from("program_modules")
    .select("id", { count: "exact", head: true })
    .eq("program_id", programId);

  const { data, error } = await admin
    .from("program_modules")
    .insert({
      program_id: programId,
      title: values.title,
      description: values.description || null,
      icon_key: values.icon_key || null,
      sort_order: count ?? 0,
    })
    .select("*")
    .single();

  if (error) return err("Failed to create the module.");
  return ok(data);
}

export async function updateModuleAdmin(
  id: string,
  values: { title: string; description?: string; icon_key?: string },
): Promise<Result<Tables<"program_modules">, string>> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("program_modules")
    .update({ title: values.title, description: values.description || null, icon_key: values.icon_key || null })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return err("Failed to update the module.");
  return ok(data);
}

export async function deleteModuleAdmin(id: string): Promise<Result<true, string>> {
  const admin = createAdminClient();
  const { error } = await admin.from("program_modules").delete().eq("id", id);
  if (error) return err("Failed to delete the module.");
  return ok(true);
}

export async function reorderModulesAdmin(orderedIds: string[]): Promise<Result<true, string>> {
  return applyOrder(createAdminClient(), "program_modules", orderedIds);
}

// ── Module items ──────────────────────────────────────────────────────

export async function createModuleItemAdmin(
  moduleId: string,
  label: string,
): Promise<Result<Tables<"program_module_items">, string>> {
  const admin = createAdminClient();
  const { count } = await admin
    .from("program_module_items")
    .select("id", { count: "exact", head: true })
    .eq("module_id", moduleId);

  const { data, error } = await admin
    .from("program_module_items")
    .insert({ module_id: moduleId, label, sort_order: count ?? 0 })
    .select("*")
    .single();

  if (error) return err("Failed to create the item.");
  return ok(data);
}

export async function updateModuleItemAdmin(
  id: string,
  label: string,
): Promise<Result<Tables<"program_module_items">, string>> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("program_module_items").update({ label }).eq("id", id).select("*").single();
  if (error) return err("Failed to update the item.");
  return ok(data);
}

export async function deleteModuleItemAdmin(id: string): Promise<Result<true, string>> {
  const admin = createAdminClient();
  const { error } = await admin.from("program_module_items").delete().eq("id", id);
  if (error) return err("Failed to delete the item.");
  return ok(true);
}

export async function reorderModuleItemsAdmin(orderedIds: string[]): Promise<Result<true, string>> {
  return applyOrder(createAdminClient(), "program_module_items", orderedIds);
}

// ── Audiences ─────────────────────────────────────────────────────────

export async function createAudienceAdmin(
  programId: string,
  label: string,
): Promise<Result<Tables<"program_audiences">, string>> {
  const admin = createAdminClient();
  const { count } = await admin
    .from("program_audiences")
    .select("id", { count: "exact", head: true })
    .eq("program_id", programId);

  const { data, error } = await admin
    .from("program_audiences")
    .insert({ program_id: programId, label, sort_order: count ?? 0 })
    .select("*")
    .single();

  if (error) return err("Failed to create the audience.");
  return ok(data);
}

export async function updateAudienceAdmin(
  id: string,
  label: string,
): Promise<Result<Tables<"program_audiences">, string>> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("program_audiences").update({ label }).eq("id", id).select("*").single();
  if (error) return err("Failed to update the audience.");
  return ok(data);
}

export async function deleteAudienceAdmin(id: string): Promise<Result<true, string>> {
  const admin = createAdminClient();
  const { error } = await admin.from("program_audiences").delete().eq("id", id);
  if (error) return err("Failed to delete the audience.");
  return ok(true);
}

export async function reorderAudiencesAdmin(orderedIds: string[]): Promise<Result<true, string>> {
  return applyOrder(createAdminClient(), "program_audiences", orderedIds);
}

// ── Journey steps ─────────────────────────────────────────────────────

export async function createJourneyStepAdmin(
  programId: string,
  values: { step_label: string; description?: string },
): Promise<Result<Tables<"program_journey_steps">, string>> {
  const admin = createAdminClient();
  const { count } = await admin
    .from("program_journey_steps")
    .select("id", { count: "exact", head: true })
    .eq("program_id", programId);

  const { data, error } = await admin
    .from("program_journey_steps")
    .insert({
      program_id: programId,
      step_label: values.step_label,
      description: values.description || null,
      sort_order: count ?? 0,
    })
    .select("*")
    .single();

  if (error) return err("Failed to create the journey step.");
  return ok(data);
}

export async function updateJourneyStepAdmin(
  id: string,
  values: { step_label: string; description?: string },
): Promise<Result<Tables<"program_journey_steps">, string>> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("program_journey_steps")
    .update({ step_label: values.step_label, description: values.description || null })
    .eq("id", id)
    .select("*")
    .single();
  if (error) return err("Failed to update the journey step.");
  return ok(data);
}

export async function deleteJourneyStepAdmin(id: string): Promise<Result<true, string>> {
  const admin = createAdminClient();
  const { error } = await admin.from("program_journey_steps").delete().eq("id", id);
  if (error) return err("Failed to delete the journey step.");
  return ok(true);
}

export async function reorderJourneyStepsAdmin(orderedIds: string[]): Promise<Result<true, string>> {
  return applyOrder(createAdminClient(), "program_journey_steps", orderedIds);
}

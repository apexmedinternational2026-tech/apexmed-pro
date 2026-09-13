"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/supabase/auth";
import {
  programEditSchema,
  moduleSchema,
  moduleUpdateSchema,
  moduleItemSchema,
  moduleItemUpdateSchema,
  audienceSchema,
  audienceUpdateSchema,
  journeyStepSchema,
  journeyStepUpdateSchema,
  reorderSchema,
} from "@/lib/validation/admin/program";
import {
  updateProgramAdmin,
  createModuleAdmin,
  updateModuleAdmin,
  deleteModuleAdmin,
  reorderModulesAdmin,
  createModuleItemAdmin,
  updateModuleItemAdmin,
  deleteModuleItemAdmin,
  reorderModuleItemsAdmin,
  createAudienceAdmin,
  updateAudienceAdmin,
  deleteAudienceAdmin,
  reorderAudiencesAdmin,
  createJourneyStepAdmin,
  updateJourneyStepAdmin,
  deleteJourneyStepAdmin,
  reorderJourneyStepsAdmin,
} from "@/lib/supabase/queries/admin/programs";
import type { Result } from "@/lib/result";

// A program's public page is static/ISR (CLAUDE.md rule 1) — every action
// below that changes what that page renders busts its cache immediately
// rather than waiting for the next revalidate window, plus "/" since the
// homepage's program grid and family split both read published programs.
function revalidateProgram(slug: string) {
  revalidatePath(`/programs/${slug}`);
  revalidatePath("/");
}

export async function updateProgramAction(formData: FormData, slug: string): Promise<Result<true, string>> {
  await requireAdminSession();

  const parsed = programEditSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    headline: formData.get("headline"),
    summary: formData.get("summary"),
    duration_label: formData.get("duration_label"),
    disclaimer_key: formData.get("disclaimer_key"),
    is_published: formData.get("is_published") === "on",
    seo_title: formData.get("seo_title"),
    seo_description: formData.get("seo_description"),
    seo_og_image_url: formData.get("seo_og_image_url"),
    canonical_path: formData.get("canonical_path"),
  });

  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid program data." };

  const result = await updateProgramAdmin(parsed.data);
  if (!result.ok) return result;

  revalidateProgram(slug);
  return { ok: true, value: true };
}

export async function createModuleAction(formData: FormData, slug: string): Promise<Result<true, string>> {
  await requireAdminSession();
  const parsed = moduleSchema.safeParse({
    program_id: formData.get("program_id"),
    title: formData.get("title"),
    description: formData.get("description"),
    icon_key: formData.get("icon_key"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid module." };

  const result = await createModuleAdmin(parsed.data.program_id, parsed.data);
  if (!result.ok) return result;
  revalidateProgram(slug);
  return { ok: true, value: true };
}

export async function updateModuleAction(formData: FormData, slug: string): Promise<Result<true, string>> {
  await requireAdminSession();
  const parsed = moduleUpdateSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description"),
    icon_key: formData.get("icon_key"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid module." };

  const result = await updateModuleAdmin(parsed.data.id, parsed.data);
  if (!result.ok) return result;
  revalidateProgram(slug);
  return { ok: true, value: true };
}

export async function deleteModuleAction(id: string, slug: string): Promise<Result<true, string>> {
  await requireAdminSession();
  const result = await deleteModuleAdmin(id);
  if (!result.ok) return result;
  revalidateProgram(slug);
  return result;
}

export async function reorderModulesAction(
  orderedIds: string[],
  parentId: string,
  slug: string,
): Promise<Result<true, string>> {
  await requireAdminSession();
  const parsed = reorderSchema.safeParse({ orderedIds, parentId });
  if (!parsed.success) return { ok: false, error: "Invalid order." };

  const result = await reorderModulesAdmin(parsed.data.orderedIds);
  if (!result.ok) return result;
  revalidateProgram(slug);
  return result;
}

export async function createModuleItemAction(formData: FormData, slug: string): Promise<Result<true, string>> {
  await requireAdminSession();
  const parsed = moduleItemSchema.safeParse({ module_id: formData.get("module_id"), label: formData.get("label") });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid item." };

  const result = await createModuleItemAdmin(parsed.data.module_id, parsed.data.label);
  if (!result.ok) return result;
  revalidateProgram(slug);
  return { ok: true, value: true };
}

export async function updateModuleItemAction(formData: FormData, slug: string): Promise<Result<true, string>> {
  await requireAdminSession();
  const parsed = moduleItemUpdateSchema.safeParse({ id: formData.get("id"), label: formData.get("label") });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid item." };

  const result = await updateModuleItemAdmin(parsed.data.id, parsed.data.label);
  if (!result.ok) return result;
  revalidateProgram(slug);
  return { ok: true, value: true };
}

export async function deleteModuleItemAction(id: string, slug: string): Promise<Result<true, string>> {
  await requireAdminSession();
  const result = await deleteModuleItemAdmin(id);
  if (!result.ok) return result;
  revalidateProgram(slug);
  return result;
}

export async function reorderModuleItemsAction(
  orderedIds: string[],
  parentId: string,
  slug: string,
): Promise<Result<true, string>> {
  await requireAdminSession();
  const parsed = reorderSchema.safeParse({ orderedIds, parentId });
  if (!parsed.success) return { ok: false, error: "Invalid order." };

  const result = await reorderModuleItemsAdmin(parsed.data.orderedIds);
  if (!result.ok) return result;
  revalidateProgram(slug);
  return result;
}

export async function createAudienceAction(formData: FormData, slug: string): Promise<Result<true, string>> {
  await requireAdminSession();
  const parsed = audienceSchema.safeParse({ program_id: formData.get("program_id"), label: formData.get("label") });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid audience." };

  const result = await createAudienceAdmin(parsed.data.program_id, parsed.data.label);
  if (!result.ok) return result;
  revalidateProgram(slug);
  return { ok: true, value: true };
}

export async function updateAudienceAction(formData: FormData, slug: string): Promise<Result<true, string>> {
  await requireAdminSession();
  const parsed = audienceUpdateSchema.safeParse({ id: formData.get("id"), label: formData.get("label") });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid audience." };

  const result = await updateAudienceAdmin(parsed.data.id, parsed.data.label);
  if (!result.ok) return result;
  revalidateProgram(slug);
  return { ok: true, value: true };
}

export async function deleteAudienceAction(id: string, slug: string): Promise<Result<true, string>> {
  await requireAdminSession();
  const result = await deleteAudienceAdmin(id);
  if (!result.ok) return result;
  revalidateProgram(slug);
  return result;
}

export async function reorderAudiencesAction(
  orderedIds: string[],
  parentId: string,
  slug: string,
): Promise<Result<true, string>> {
  await requireAdminSession();
  const parsed = reorderSchema.safeParse({ orderedIds, parentId });
  if (!parsed.success) return { ok: false, error: "Invalid order." };

  const result = await reorderAudiencesAdmin(parsed.data.orderedIds);
  if (!result.ok) return result;
  revalidateProgram(slug);
  return result;
}

export async function createJourneyStepAction(formData: FormData, slug: string): Promise<Result<true, string>> {
  await requireAdminSession();
  const parsed = journeyStepSchema.safeParse({
    program_id: formData.get("program_id"),
    step_label: formData.get("step_label"),
    description: formData.get("description"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid step." };

  const result = await createJourneyStepAdmin(parsed.data.program_id, parsed.data);
  if (!result.ok) return result;
  revalidateProgram(slug);
  return { ok: true, value: true };
}

export async function updateJourneyStepAction(formData: FormData, slug: string): Promise<Result<true, string>> {
  await requireAdminSession();
  const parsed = journeyStepUpdateSchema.safeParse({
    id: formData.get("id"),
    step_label: formData.get("step_label"),
    description: formData.get("description"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid step." };

  const result = await updateJourneyStepAdmin(parsed.data.id, parsed.data);
  if (!result.ok) return result;
  revalidateProgram(slug);
  return { ok: true, value: true };
}

export async function deleteJourneyStepAction(id: string, slug: string): Promise<Result<true, string>> {
  await requireAdminSession();
  const result = await deleteJourneyStepAdmin(id);
  if (!result.ok) return result;
  revalidateProgram(slug);
  return result;
}

export async function reorderJourneyStepsAction(
  orderedIds: string[],
  parentId: string,
  slug: string,
): Promise<Result<true, string>> {
  await requireAdminSession();
  const parsed = reorderSchema.safeParse({ orderedIds, parentId });
  if (!parsed.success) return { ok: false, error: "Invalid order." };

  const result = await reorderJourneyStepsAdmin(parsed.data.orderedIds);
  if (!result.ok) return result;
  revalidateProgram(slug);
  return result;
}

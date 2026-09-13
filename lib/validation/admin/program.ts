import { z } from "zod";

// disclaimer_key is intentionally required with no empty-string escape
// hatch — CLAUDE.md rule 9 treats a program rendering without its
// disclaimer as a compliance failure, not a style choice, and the DB
// column itself is `not null references compliance_disclaimers(key)`.
// This is the one place in the admin that enforces it before the DB
// constraint would.
export const programEditSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2, "Name is required.").max(150),
  headline: z.string().trim().min(2, "Headline is required.").max(200),
  summary: z.string().trim().min(10, "Summary is required.").max(2000),
  duration_label: z.string().trim().max(100).optional().or(z.literal("")),
  disclaimer_key: z.string().trim().min(1, "A disclaimer is required and cannot be cleared."),
  is_published: z.boolean(),
  seo_title: z.string().trim().max(70).optional().or(z.literal("")),
  seo_description: z.string().trim().max(200).optional().or(z.literal("")),
  seo_og_image_url: z.string().trim().url("Enter a valid URL.").optional().or(z.literal("")),
  canonical_path: z.string().trim().max(200).optional().or(z.literal("")),
});

export type ProgramEditInput = z.infer<typeof programEditSchema>;

export const moduleSchema = z.object({
  program_id: z.string().uuid(),
  title: z.string().trim().min(1, "Title is required.").max(150),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  icon_key: z.string().trim().max(50).optional().or(z.literal("")),
});

export const moduleUpdateSchema = moduleSchema.omit({ program_id: true }).extend({ id: z.string().uuid() });

export const moduleItemSchema = z.object({
  module_id: z.string().uuid(),
  label: z.string().trim().min(1, "Label is required.").max(200),
});

export const moduleItemUpdateSchema = moduleItemSchema.omit({ module_id: true }).extend({ id: z.string().uuid() });

export const audienceSchema = z.object({
  program_id: z.string().uuid(),
  label: z.string().trim().min(1, "Label is required.").max(200),
});

export const audienceUpdateSchema = audienceSchema.omit({ program_id: true }).extend({ id: z.string().uuid() });

export const journeyStepSchema = z.object({
  program_id: z.string().uuid(),
  step_label: z.string().trim().min(1, "Step label is required.").max(150),
  description: z.string().trim().max(500).optional().or(z.literal("")),
});

export const journeyStepUpdateSchema = journeyStepSchema.omit({ program_id: true }).extend({ id: z.string().uuid() });

// Shared by every "drag to reorder" action: the client sends the full list
// of ids in their new order, and the Server Action writes sort_order = the
// index of each id in that array — see lib/actions/admin/programs.ts.
export const reorderSchema = z.object({
  parentId: z.string().uuid(),
  orderedIds: z.array(z.string().uuid()).min(1),
});

export type ReorderInput = z.infer<typeof reorderSchema>;

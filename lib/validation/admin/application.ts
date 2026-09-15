import { z } from "zod";
import { APPLICATION_STATUS_OPTIONS } from "@/lib/applications";

export const updateApplicationStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(APPLICATION_STATUS_OPTIONS, { errorMap: () => ({ message: "Select a valid status." }) }),
});

export const updateApplicationNotesSchema = z.object({
  id: z.string().uuid(),
  admin_notes: z.string().trim().max(5000, "Notes must be at most 5000 characters.").optional().or(z.literal("")),
});

export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
export type UpdateApplicationNotesInput = z.infer<typeof updateApplicationNotesSchema>;

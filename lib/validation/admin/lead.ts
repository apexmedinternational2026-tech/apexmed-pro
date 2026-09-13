import { z } from "zod";
import { LEAD_STATUS_OPTIONS } from "@/lib/leads";

export const updateLeadStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(LEAD_STATUS_OPTIONS, { errorMap: () => ({ message: "Select a valid status." }) }),
});

export const updateLeadNotesSchema = z.object({
  id: z.string().uuid(),
  admin_notes: z.string().trim().max(5000, "Notes must be at most 5000 characters.").optional().or(z.literal("")),
});

export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;
export type UpdateLeadNotesInput = z.infer<typeof updateLeadNotesSchema>;

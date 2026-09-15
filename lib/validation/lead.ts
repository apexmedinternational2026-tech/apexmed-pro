import { z } from "zod";
import { phoneSchema, honeypotSchema } from "./shared";

export const CURRENT_STATUS_OPTIONS = [
  "medical_student",
  "medical_graduate",
  "doctor",
  "fcps_trainee",
  "postgraduate_doctor",
  "resident",
  "consultant",
  "researcher",
  "healthcare_professional",
  "other",
] as const;

export const INTEREST_TYPE_OPTIONS = [
  "apexmed_research_card",
  "master_meta_analysis_card",
  "cdc_specialist_card",
  "blue_card",
  "green_card",
  "gold_card",
  "master_card",
  "international_exams",
  "ai_course",
  "green_earth",
  "counselling",
  "general_inquiry",
] as const;

// Single source of truth for the lead-capture / profile-assessment forms:
// both the React form and the API route handler that writes to `leads`
// import this schema, so the two can never validate differently.
export const leadSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Full name must be at most 100 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: phoneSchema,
  country: z.string().trim().min(1, "Country is required.").max(100, "Country must be at most 100 characters."),
  current_status: z.enum(CURRENT_STATUS_OPTIONS, {
    errorMap: () => ({ message: "Select your current status." }),
  }),
  interest_type: z.enum(INTEREST_TYPE_OPTIONS, {
    errorMap: () => ({ message: "Select what you're interested in." }),
  }),
  program_id: z.string().uuid("program_id must be a valid UUID.").optional(),
  message: z.string().trim().max(2000, "Message must be at most 2000 characters.").optional().or(z.literal("")),
  website: honeypotSchema,
});

export type LeadInput = z.infer<typeof leadSchema>;

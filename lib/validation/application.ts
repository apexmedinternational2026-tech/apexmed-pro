import { z } from "zod";
import { PHONE_REGEX, honeypotSchema } from "./shared";

export const EDUCATION_LEVEL_OPTIONS = [
  "medical_student",
  "mbbs",
  "bds",
  "postgraduate",
  "other",
] as const;

// Single source of truth for the application form: both the client
// component and the API route handler import this schema, so the two can
// never validate differently. File validation (type/size) happens
// separately in the API route — Zod doesn't handle a multipart File well
// across the client/server boundary the way it does plain form fields.
export const applicationSchema = z.object({
  service_id: z.string().uuid("Invalid service."),
  full_name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(150, "Full name must be at most 150 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  // Required here, unlike lib/validation/shared.ts's optional phoneSchema
  // — an application (unlike a general lead) always needs a way to reach
  // the applicant back.
  phone: z.string().trim().regex(PHONE_REGEX, "Enter a valid international phone number, e.g. +923001234567."),
  institution: z.string().trim().max(200).optional().or(z.literal("")),
  education_level: z.enum(EDUCATION_LEVEL_OPTIONS).optional().or(z.literal("")),
  year_of_study: z.string().trim().max(50).optional().or(z.literal("")),
  country: z.string().trim().max(100).optional().or(z.literal("")),
  motivation: z.string().trim().max(3000, "Motivation must be at most 3000 characters.").optional().or(z.literal("")),
  // Service-specific answers (see components/services/application-extra-fields.ts)
  // — a plain string-keyed record here; each field's own key/requiredness
  // is defined by that config, not by this schema, since the question set
  // differs per service.
  extra_fields: z.record(z.string(), z.string()).optional(),
  website: honeypotSchema,
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

// File constraints, checked in the API route (server-side, the only check
// that actually matters) and mirrored client-side for a fast, friendly
// error before the request is even sent.
export const CV_MAX_BYTES = 5 * 1024 * 1024; // 5MB
export const CV_ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;
export const CV_ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;

import { z } from "zod";
import { phoneSchema, honeypotSchema } from "./shared";

export const webinarRegistrationSchema = z.object({
  webinar_id: z.string().uuid("webinar_id must be a valid UUID."),
  full_name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Full name must be at most 100 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: phoneSchema,
  website: honeypotSchema,
});

export type WebinarRegistrationInput = z.infer<typeof webinarRegistrationSchema>;

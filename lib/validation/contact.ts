import { z } from "zod";
import { honeypotSchema } from "./shared";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be at most 100 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  subject: z.string().trim().max(150, "Subject must be at most 150 characters.").optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(2000, "Message must be at most 2000 characters."),
  website: honeypotSchema,
});

export type ContactInput = z.infer<typeof contactSchema>;

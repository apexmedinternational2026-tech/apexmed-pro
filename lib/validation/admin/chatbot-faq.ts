import { z } from "zod";

export const chatbotFaqSchema = z.object({
  id: z.string().uuid().optional(),
  question: z.string().trim().min(3, "Question is required.").max(300),
  answer: z.string().trim().min(3, "Answer is required.").max(3000),
  keywords: z.string().trim().max(500).optional().or(z.literal("")),
  category: z.string().trim().max(100).optional().or(z.literal("")),
  is_starter: z.boolean(),
  is_published: z.boolean(),
});

export type ChatbotFaqInput = z.infer<typeof chatbotFaqSchema>;

export const markUnansweredReviewedSchema = z.object({
  id: z.string().uuid(),
  reviewed: z.boolean(),
});

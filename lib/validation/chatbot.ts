import { z } from "zod";

export const chatMessageSchema = z.object({
  message: z.string().trim().min(1, "Type a message first.").max(500, "Keep questions under 500 characters."),
  // Client-generated crypto.randomUUID(), kept in sessionStorage by
  // chat-widget.tsx — not a real session/auth id, just a way to group one
  // visitor's unanswered questions together in the admin log without
  // collecting anything personally identifying.
  session_id: z.string().trim().max(100).optional().or(z.literal("")),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

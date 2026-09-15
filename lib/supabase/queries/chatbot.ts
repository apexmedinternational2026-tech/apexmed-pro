import "server-only";
import { createPublicClient } from "../public";
import { createAdminClient } from "../admin";
import { DatabaseQueryError } from "../errors";
import type { MatchableFaq } from "../../chatbot/match";

// Fetches every published FAQ so the Route Handler can score all of them
// in-process (lib/chatbot/match.ts) — this table is small (a curated
// knowledge base, not user-generated content), so "load them all, score in
// JS" stays cheap and keeps the matching logic in one plain, testable
// place instead of split across a DB query and application code.
export async function getPublishedFaqsForMatching(): Promise<MatchableFaq[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("chatbot_faqs")
    .select("id, question, answer, keywords")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new DatabaseQueryError("Failed to load chatbot FAQs.", { table: "chatbot_faqs", originalError: error });
  }

  return data;
}

export interface StarterFaq {
  id: string;
  question: string;
}

/** The tappable suggestion chips shown before a visitor types anything. */
export async function getStarterFaqs(): Promise<StarterFaq[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("chatbot_faqs")
    .select("id, question")
    .eq("is_starter", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new DatabaseQueryError("Failed to load starter questions.", { table: "chatbot_faqs", originalError: error });
  }

  return data;
}

/**
 * Logs a visitor message the matcher couldn't answer confidently — the
 * primary signal for growing the knowledge base, since there's no LLM
 * fallback here to paper over a gap. Best-effort: a logging failure must
 * never break the chat response itself, so callers should treat this as
 * fire-and-forget the same way lib/email.ts's notification sends are.
 */
export async function logUnansweredQuestion(input: {
  questionText: string;
  sessionId: string | null;
  bestScore: number | null;
}): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from("chatbot_unanswered_questions").insert({
    question_text: input.questionText,
    session_id: input.sessionId,
    best_score: input.bestScore,
  });

  if (error) {
    console.error("logUnansweredQuestion: failed to write", error);
  }
}

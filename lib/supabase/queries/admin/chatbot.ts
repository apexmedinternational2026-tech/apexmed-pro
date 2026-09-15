import "server-only";
import { createAdminClient } from "../../admin";
import { DatabaseQueryError, NotFoundError } from "../../errors";
import { ok, err, type Result } from "../../../result";
import type { Tables } from "../../database.types";
import type { ChatbotFaqInput } from "@/lib/validation/admin/chatbot-faq";

const UNANSWERED_PAGE_SIZE = 25;

export async function listFaqsAdmin(): Promise<Tables<"chatbot_faqs">[]> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("chatbot_faqs").select("*").order("sort_order", { ascending: true });
  if (error) throw new DatabaseQueryError("Failed to load chatbot FAQs.", { table: "chatbot_faqs", originalError: error });
  return data;
}

export async function getFaqByIdAdmin(id: string): Promise<Tables<"chatbot_faqs">> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("chatbot_faqs").select("*").eq("id", id).maybeSingle();
  if (error) throw new DatabaseQueryError(`Failed to load FAQ "${id}".`, { table: "chatbot_faqs", originalError: error });
  if (!data) throw new NotFoundError(`FAQ "${id}" was not found.`);
  return data;
}

export async function createFaqAdmin(input: ChatbotFaqInput): Promise<Result<Tables<"chatbot_faqs">, string>> {
  const admin = createAdminClient();
  const { count } = await admin.from("chatbot_faqs").select("id", { count: "exact", head: true });

  const { data, error } = await admin
    .from("chatbot_faqs")
    .insert({
      question: input.question,
      answer: input.answer,
      keywords: input.keywords || null,
      category: input.category || null,
      is_starter: input.is_starter,
      is_published: input.is_published,
      sort_order: count ?? 0,
    })
    .select("*")
    .single();

  if (error) return err("Failed to create the FAQ.");
  return ok(data);
}

export async function updateFaqAdmin(input: ChatbotFaqInput & { id: string }): Promise<Result<Tables<"chatbot_faqs">, string>> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("chatbot_faqs")
    .update({
      question: input.question,
      answer: input.answer,
      keywords: input.keywords || null,
      category: input.category || null,
      is_starter: input.is_starter,
      is_published: input.is_published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id)
    .select("*")
    .single();

  if (error) return err("Failed to update the FAQ.");
  return ok(data);
}

export async function deleteFaqAdmin(id: string): Promise<Result<true, string>> {
  const admin = createAdminClient();
  const { error } = await admin.from("chatbot_faqs").delete().eq("id", id);
  if (error) return err("Failed to delete the FAQ.");
  return ok(true);
}

export async function reorderFaqsAdmin(orderedIds: string[]): Promise<Result<true, string>> {
  const admin = createAdminClient();
  const results = await Promise.all(
    orderedIds.map((id, index) => admin.from("chatbot_faqs").update({ sort_order: index }).eq("id", id)),
  );
  if (results.some((r) => r.error)) return err("Failed to save the new order.");
  return ok(true);
}

export interface UnansweredListResult {
  questions: Tables<"chatbot_unanswered_questions">[];
  total: number;
  page: number;
  totalPages: number;
}

export async function listUnansweredQuestionsAdmin(showReviewed: boolean, page = 1): Promise<UnansweredListResult> {
  const admin = createAdminClient();
  const from = (page - 1) * UNANSWERED_PAGE_SIZE;
  const to = from + UNANSWERED_PAGE_SIZE - 1;

  let query = admin
    .from("chatbot_unanswered_questions")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (!showReviewed) query = query.eq("reviewed", false);

  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw new DatabaseQueryError("Failed to load unanswered questions.", {
      table: "chatbot_unanswered_questions",
      originalError: error,
    });
  }

  const total = count ?? 0;

  return {
    questions: data,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / UNANSWERED_PAGE_SIZE)),
  };
}

export async function markUnansweredReviewedAdmin(id: string, reviewed: boolean): Promise<Result<true, string>> {
  const admin = createAdminClient();
  const { error } = await admin.from("chatbot_unanswered_questions").update({ reviewed }).eq("id", id);
  if (error) return err("Failed to update this question.");
  return ok(true);
}

import { NextResponse } from "next/server";
import { chatMessageSchema } from "@/lib/validation/chatbot";
import { getPublishedFaqsForMatching, logUnansweredQuestion } from "@/lib/supabase/queries/chatbot";
import { findBestMatch, MIN_CONFIDENCE } from "@/lib/chatbot/match";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  // Looser window than the lead/application forms (those are rare,
  // deliberate submissions; a real conversation is several messages in a
  // few minutes) but still bounded — this endpoint does a full-table scan
  // and scoring pass per request, cheap at this table's size but not
  // something to leave fully open to scripted abuse.
  const rateLimit = checkRateLimit(`chatbot:${ip}`, { windowMs: 60 * 1000, max: 15 });
  if (!rateLimit.allowed) {
    return NextResponse.json({ ok: false, error: "Too many messages. Please wait a moment and try again." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = chatMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid message." },
      { status: 400 },
    );
  }

  const faqs = await getPublishedFaqsForMatching();
  const match = findBestMatch(parsed.data.message, faqs);
  const sessionId = parsed.data.session_id || null;

  if (!match || match.score < MIN_CONFIDENCE) {
    // Fire-and-forget — a logging failure must never block the visitor's
    // response (same contract as lib/email.ts's notification sends).
    void logUnansweredQuestion({
      questionText: parsed.data.message,
      sessionId,
      bestScore: match?.score ?? null,
    });

    return NextResponse.json({
      ok: true,
      answered: false,
      answer:
        "I don't have a confident answer for that yet. Our team can help directly — use the Contact Us form or the WhatsApp button on this page, and we'll get back to you.",
    });
  }

  return NextResponse.json({
    ok: true,
    answered: true,
    answer: match.faq.answer,
  });
}

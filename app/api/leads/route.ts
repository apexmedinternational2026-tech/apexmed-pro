import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation/lead";
import { createLead, type LeadSourceMeta } from "@/lib/supabase/queries/leads";
import { sendLeadNotificationEmail } from "@/lib/email";
import { sendLeadWhatsAppNotification } from "@/lib/whatsapp";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { getVisitorSession } from "@/lib/supabase/auth";

export const runtime = "nodejs";

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function extractMeta(body: unknown): LeadSourceMeta {
  if (typeof body !== "object" || body === null) return {};
  const record = body as Record<string, unknown>;
  const pick = (key: string): string | undefined => (typeof record[key] === "string" ? record[key] : undefined);

  return {
    source_page: pick("source_page"),
    utm_source: pick("utm_source"),
    utm_medium: pick("utm_medium"),
    utm_campaign: pick("utm_campaign"),
  };
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  const rateLimit = checkRateLimit(`leads:${ip}`);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    // Reject on honeypot: a non-empty `website` field fails leadSchema
    // (honeypotSchema enforces max length 0) exactly like any other
    // invalid field, but it's worth telling real submission failures
    // apart from bot traffic in the logs.
    const isHoneypot = parsed.error.issues.some((issue) => issue.path[0] === "website");
    if (isHoneypot) {
      console.warn(`POST /api/leads: honeypot triggered (ip=${ip}).`);
    }

    return NextResponse.json(
      {
        ok: false,
        error: "Please check the highlighted fields and try again.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  // Checked after the (free, local) rate-limit and Zod/honeypot checks —
  // no reason to spend a network round trip to Cloudflare verifying a
  // submission that already failed for free.
  const record = body as Record<string, unknown>;
  const turnstileToken = typeof record.turnstile_token === "string" ? record.turnstile_token : "";
  const turnstileResult = await verifyTurnstileToken(turnstileToken, ip !== "unknown" ? ip : undefined);

  if (!turnstileResult.success) {
    return NextResponse.json(
      { ok: false, error: turnstileResult.error ?? "Verification failed. Please try again." },
      { status: 400 },
    );
  }

  const meta = extractMeta(body);
  // Anonymous submission is still the common case — this stays null
  // (rather than failing) for the vast majority of visitors with no
  // account, exactly as before this feature existed.
  const visitor = await getVisitorSession();
  const result = await createLead(parsed.data, meta, visitor?.userId ?? null);

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
  }

  // Best-effort — never blocks or fails the response to the visitor; the
  // lead is already safely written by the time these run.
  void sendLeadNotificationEmail({
    fullName: result.value.full_name,
    email: result.value.email,
    phone: result.value.phone,
    country: result.value.country,
    interestType: result.value.interest_type,
    message: result.value.message,
  });
  void sendLeadWhatsAppNotification({
    fullName: result.value.full_name,
    email: result.value.email,
    phone: result.value.phone,
    country: result.value.country,
    interestType: result.value.interest_type,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}

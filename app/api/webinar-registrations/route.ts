import { NextResponse } from "next/server";
import { webinarRegistrationSchema } from "@/lib/validation/webinar-registration";
import { registerForWebinar } from "@/lib/supabase/queries/webinars";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { getVisitorSession } from "@/lib/supabase/auth";

export const runtime = "nodejs";

// Same shape as app/api/leads/route.ts — rate limit -> Zod/honeypot ->
// Turnstile -> write — kept as its own route rather than folded into
// /api/leads since a webinar registration writes a different table with
// its own (webinar_id, email) uniqueness rule and a friendlier
// "already registered" response, not a generic lead record.
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

  const rateLimit = checkRateLimit(`webinar-registrations:${ip}`);
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

  const parsed = webinarRegistrationSchema.safeParse(body);

  if (!parsed.success) {
    const isHoneypot = parsed.error.issues.some((issue) => issue.path[0] === "website");
    if (isHoneypot) {
      console.warn(`POST /api/webinar-registrations: honeypot triggered (ip=${ip}).`);
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

  const record = body as Record<string, unknown>;
  const turnstileToken = typeof record.turnstile_token === "string" ? record.turnstile_token : "";
  const turnstileResult = await verifyTurnstileToken(turnstileToken, ip !== "unknown" ? ip : undefined);

  if (!turnstileResult.success) {
    return NextResponse.json(
      { ok: false, error: turnstileResult.error ?? "Verification failed. Please try again." },
      { status: 400 },
    );
  }

  const visitor = await getVisitorSession();
  const result = await registerForWebinar(parsed.data, visitor?.userId ?? null);

  if (!result.ok) {
    // registerForWebinar returns user-safe messages ("already registered",
    // "not open for registration") for expected failures — 409/400 rather
    // than 500, since these aren't server errors.
    const status = result.error.includes("already registered") ? 409 : 400;
    return NextResponse.json({ ok: false, error: result.error }, { status });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

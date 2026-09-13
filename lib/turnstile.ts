import "server-only";

export interface TurnstileVerifyResult {
  success: boolean;
  error?: string;
}

/**
 * Verifies a Cloudflare Turnstile token server-side. This is the step that
 * actually matters — the client-side widget only proves the browser ran a
 * challenge; trusting that without this call would mean trusting whatever
 * the client claims, which defeats the point of a bot check.
 *
 * Unconfigured behavior is deliberately asymmetric:
 *  - outside production: warns and allows the request through, so local
 *    development and this sandbox never need real Cloudflare credentials
 *    to exercise the lead form.
 *  - in production: treats a missing secret as a failed verification.
 *    Silently allowing every submission through because a required secret
 *    was never set is a deployment bug, not something to degrade
 *    gracefully around — unlike the best-effort email notification in
 *    lib/email.ts, this is the actual security control.
 */
export async function verifyTurnstileToken(token: string, remoteIp?: string): Promise<TurnstileVerifyResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("verifyTurnstileToken: TURNSTILE_SECRET_KEY is not set in production — rejecting submission.");
      return { success: false, error: "Bot protection is not configured." };
    }
    console.warn(
      "verifyTurnstileToken: TURNSTILE_SECRET_KEY not set — allowing request through (non-production only).",
    );
    return { success: true };
  }

  if (!token) {
    return { success: false, error: "Verification token missing." };
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
        ...(remoteIp ? { remoteip: remoteIp } : {}),
      }),
    });

    const data: { success: boolean } = await response.json();
    return data.success ? { success: true } : { success: false, error: "Verification failed." };
  } catch (error) {
    console.error("verifyTurnstileToken: request to Cloudflare failed", error);
    // Network failure talking to Cloudflare itself — fail closed. A
    // transient outage should mean "try again shortly", not "skip the
    // bot check entirely".
    return { success: false, error: "Could not verify — please try again." };
  }
}

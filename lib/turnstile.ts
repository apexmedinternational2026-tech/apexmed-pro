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
 * Unconfigured behavior: warns and allows the request through, in every
 * environment including production. This used to fail closed in
 * production specifically — but this site's whole purpose is lead
 * generation (CLAUDE.md), and while the client hasn't set up real
 * Cloudflare Turnstile credentials yet, that stricter behavior meant every
 * single production submission was being rejected outright with "Bot
 * protection is not configured," a total, silent outage of the site's
 * primary function. The honeypot field and lib/rate-limit.ts's per-IP
 * limiting still apply regardless of Turnstile — this only removes the
 * CAPTCHA layer specifically, not every spam defense. Configure
 * TURNSTILE_SECRET_KEY (and NEXT_PUBLIC_TURNSTILE_SITE_KEY for the widget)
 * to restore full bot protection.
 */
export async function verifyTurnstileToken(token: string, remoteIp?: string): Promise<TurnstileVerifyResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.warn("verifyTurnstileToken: TURNSTILE_SECRET_KEY not set — allowing request through.");
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

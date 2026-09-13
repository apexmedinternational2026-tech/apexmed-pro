import * as Sentry from "@sentry/nextjs";

// Covers both the nodejs and edge runtimes (middleware.ts runs on edge) —
// Next calls register() once per runtime at startup, and NEXT_RUNTIME
// tells this which one is currently initializing.
export async function register() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  if (process.env.NEXT_RUNTIME === "nodejs" || process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn,
      // Sentry's SDK no-ops cleanly with `enabled: false` — this is what
      // makes local dev and this sandbox safe to run without a real DSN,
      // the same pattern as every other optional integration in this app
      // (email, Turnstile, Storage uploads).
      enabled: Boolean(dsn),
      tracesSampleRate: 0.1,
    });
  }
}

// Next's own hook (not a Sentry-specific convention) for reporting errors
// from Server Components, Route Handlers, and Server Actions that Next
// itself catches before they'd otherwise reach app/error.tsx.
export const onRequestError = Sentry.captureRequestError;

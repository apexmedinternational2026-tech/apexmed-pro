import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  // See instrumentation.ts for why an unset DSN disables rather than
  // errors — local dev and this sandbox never have a real one.
  enabled: Boolean(dsn),
  tracesSampleRate: 0.1,
  // Session replay is genuinely useful for debugging a reported error,
  // but records DOM content — masked by default (maskAllText below)
  // rather than opting into that risk before this app has an actual
  // privacy review of what a replay could capture on the admin side.
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: dsn ? 0.1 : 0,
  integrations: dsn ? [Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true })] : [],
});

// Next's hook for reporting client-side navigation errors — separate
// from the render-time errors app/error.tsx's boundary already catches.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

import "server-only";

// In-memory, per-process sliding-window rate limiter.
//
// This is a best-effort limiter, not a production-grade one: on a
// serverless runtime (Vercel), each invocation can land on a different
// lambda instance with its own memory, so a request flood distributed
// across cold instances won't be fully caught. For real production rate
// limiting, swap this for a shared store — e.g. Upstash Redis via
// @upstash/ratelimit — behind the same checkRateLimit() call shape so
// call sites don't need to change.
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

export function checkRateLimit(key: string, options: { windowMs?: number; max?: number } = {}): RateLimitResult {
  const windowMs = options.windowMs ?? WINDOW_MS;
  const max = options.max ?? MAX_REQUESTS;
  const now = Date.now();

  const timestamps = (hits.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs);

  if (timestamps.length >= max) {
    hits.set(key, timestamps);
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return { allowed: true, remaining: max - timestamps.length };
}

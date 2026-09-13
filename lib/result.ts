// A small Result type for operations that can fail in an expected way —
// form submissions, external calls — so callers branch on `ok` explicitly
// instead of wrapping every call site in try/catch. Reserve this for
// expected failure; the query layer in lib/supabase/queries/ still throws
// typed errors (see lib/supabase/errors.ts) for unexpected ones.
export type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

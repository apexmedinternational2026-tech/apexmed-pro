const FALLBACK_SITE_URL = "http://localhost:3000";

/**
 * Resolves an absolute URL for JSON-LD and canonical/OG tags. Falls back to
 * localhost so local dev never throws over a missing env var — production
 * always sets NEXT_PUBLIC_SITE_URL (see .env.example).
 */
export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL;
  return new URL(path, base).toString();
}

// next.config.mjs's remotePatterns only allows this project's own Supabase
// Storage host for next/image — every real photo in this app is either
// self-hosted or a Supabase Storage upload, there's no third source (see
// that file's own comment). A photo_url pointing anywhere else throws at
// render time instead of failing gracefully, which previously took down
// the entire public /mentors page over one bad admin paste (a Cloudinary
// *documentation* link, not an image). This is the one place that check
// lives, reused both to validate admin input (lib/validation/admin/mentor.ts)
// and to guard rendering itself (components/pages displaying a photo_url)
// — so a bad value that reaches the database by some other route (a direct
// Supabase dashboard edit, a future migration mistake) still degrades to
// the initials placeholder instead of crashing the page again.

const supabaseStorageHost = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

export function isSupabaseStorageUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  if (!supabaseStorageHost) return true; // can't validate without a configured Supabase URL — fail open rather than hide every photo.
  try {
    const parsed = new URL(value);
    return parsed.hostname === supabaseStorageHost && parsed.pathname.startsWith("/storage/v1/object/public/");
  } catch {
    return false;
  }
}

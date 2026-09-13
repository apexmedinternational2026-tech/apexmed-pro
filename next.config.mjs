import withBundleAnalyzerInit from "@next/bundle-analyzer";

const withBundleAnalyzer = withBundleAnalyzerInit({ enabled: process.env.ANALYZE === "true" });

// Resolved once at build/start time (next.config.mjs runs in plain Node,
// not the browser) so next/image's remotePatterns below can scope itself
// to this project's actual Supabase Storage host instead of a broad
// wildcard. Every image in this app is either self-hosted (next/font,
// generated OG images) or an admin-uploaded file in Supabase Storage —
// there is no third image source to account for. (middleware.ts resolves
// this same hostname again for the CSP's img-src/connect-src, since that
// header now lives there instead of here.)
function getSupabaseHostname() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

const supabaseHost = getSupabaseHostname();

// Content-Security-Policy is set per-request in middleware.ts instead of
// here — a nonce (required so Next's own inline hydration scripts can run
// at all; see middleware.ts's buildCsp comment for the incident this
// fixed) has to be freshly generated on every request, which a static
// headers() entry in this file structurally cannot do. Keeping two
// separate CSP sources would just invite them drifting apart, so this
// file no longer emits one at all.

const SECURITY_HEADERS = [
  // 2 years, includeSubDomains + preload — this domain should be added to
  // the browser HSTS preload list (hstspreload.org) once launched; the
  // header alone only protects repeat visitors from the first HTTPS visit
  // onward, not a visitor's very first request.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // Serves AVIF/WebP automatically via content negotiation for every
    // next/image usage in the app — this is the actual mechanism that
    // gets "banner artwork in WebP/AVIF" in a Next.js app; there's
    // nothing to manually convert since every image here is either
    // generated at request time (OG images) or an admin upload through
    // Supabase Storage, never a static file checked into the repo.
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);

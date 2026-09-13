import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// /admin/login must stay reachable without a session, or an unauthorized
// visitor could never even see the sign-in form — every other /admin/*
// path requires both a Supabase Auth session AND an admin_profiles row
// (see lib/supabase/auth.ts; the same double-check runs again inside every
// Server Action as defense in depth, since middleware can't be assumed to
// have run in front of a Server Action invocation).
const PUBLIC_ADMIN_PATHS = ["/admin/login"];

function getSupabaseHostname(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

const TURNSTILE_ORIGIN = "https://challenges.cloudflare.com";
const GOOGLE_TAG_ORIGIN = "https://www.googletagmanager.com";
const GOOGLE_ANALYTICS_ORIGIN = "https://*.google-analytics.com";
const SENTRY_INGEST_ORIGIN = "https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.ingest.de.sentry.io";

/**
 * CSP has to be built per-request, in middleware, rather than as a static
 * header in next.config.mjs — a nonce is only meaningful if it's fresh on
 * every response. The nonce is what lets Next.js's own required inline
 * bootstrap/RSC-streaming scripts (there are dozens on every page —
 * `self.__next_f.push(...)` chunks) actually run: without a nonce (or
 * 'unsafe-inline') on script-src, a real browser blocks every one of
 * those, which is what silently broke every button, form, and dropdown
 * on the site — hydration never completed because none of Next's own
 * scripts were allowed to execute. Next automatically reads the nonce
 * back out of this response header and applies it to every script tag it
 * injects itself, so nothing else is needed for Next's own scripts.
 *
 * Deliberately NOT using 'strict-dynamic' here: this app's only two
 * third-party scripts (Turnstile, GA) are loaded via next/script `src=`
 * tags from Client Components (components/ui/turnstile-widget.tsx,
 * components/analytics/analytics.tsx) that have no way to read the
 * per-request nonce, and 'strict-dynamic' would make the browser ignore
 * the host allowlist below and require a nonce on those tags too. Without
 * it, the explicit host list keeps allowing those `src=` scripts exactly
 * as before, and the nonce only needs to be threaded manually to the one
 * inline (non-src) script this app authors itself — GA's init snippet,
 * see components/analytics/analytics.tsx.
 */
function buildCsp(nonce: string): string {
  const supabaseHost = getSupabaseHostname();
  const connectSrcExtra = [
    supabaseHost ? `https://${supabaseHost}` : "",
    TURNSTILE_ORIGIN,
    GOOGLE_ANALYTICS_ORIGIN,
    SENTRY_INGEST_ORIGIN,
  ]
    .filter(Boolean)
    .join(" ");
  const imgSrcExtra = supabaseHost ? `https://${supabaseHost}` : "";

  // Next's dev-mode webpack build wraps every module in eval(...) to get
  // fast rebuilds and accurate stack traces (its production output never
  // does this — production uses a plain source-map devtool) — without
  // 'unsafe-eval' here, every module evaluation throws a CSP violation in
  // dev specifically, which is otherwise indistinguishable in the console
  // from a real bug. Scoped to development only so production keeps the
  // stricter policy.
  const scriptSrcExtra = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";

  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}'${scriptSrcExtra} ${TURNSTILE_ORIGIN} ${GOOGLE_TAG_ORIGIN}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: ${imgSrcExtra}`,
    `font-src 'self' data:`,
    `connect-src 'self' ${connectSrcExtra}`,
    `frame-src ${TURNSTILE_ORIGIN}`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ]
    .join("; ")
    .replace(/\s+/g, " ");
}

export async function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);

  // Set on the *request* headers too (not just the response) — this is
  // what Next's own renderer reads to discover the nonce and apply it to
  // the scripts it generates for this request; `x-nonce` is additionally
  // how a Server Component reads the raw value via headers() for a
  // custom inline script it authors itself (see app/layout.tsx).
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path));
  // /account is the one public route that needs a session — every other
  // public route (including /login, /signup, /forgot-password,
  // /reset-password themselves) must stay reachable while signed out, or
  // nobody could ever reach the form that gets them a session in the
  // first place.
  const isAccountRoute = pathname.startsWith("/account");

  if ((!isAdminRoute && !isAccountRoute) || isPublicAdminPath) {
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("Content-Security-Policy", csp);
    return response;
  }

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  // Middleware runs on the Edge runtime and has no access to next/headers'
  // cookies() — it reads/writes cookies straight off the request/response
  // objects instead, which is why this needs its own client rather than
  // reusing lib/supabase/server.ts.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: requestHeaders } });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  // getUser(), not getSession(): revalidates against Supabase itself
  // rather than trusting whatever JWT happens to be sitting in the
  // cookie — see the same note in lib/supabase/auth.ts.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAccountRoute) {
    // /account needs only a session — no admin_profiles check. A signed-in
    // visitor and a signed-in admin are the same Supabase Auth user pool
    // (see lib/supabase/auth.ts's getVisitorSession); nothing here blocks
    // an admin from also having their own visitor account.
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    response.headers.set("Content-Security-Policy", csp);
    return response;
  }

  const loginUrl = new URL("/admin/login", request.url);

  if (!user) {
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await supabase.from("admin_profiles").select("id").eq("id", user.id).maybeSingle();

  if (!profile) {
    // A real Supabase Auth account with no admin_profiles row — reject
    // rather than let it through, and don't leak *why* beyond a generic
    // flag the login page turns into one message.
    loginUrl.searchParams.set("error", "not_authorized");
    return NextResponse.redirect(loginUrl);
  }

  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  // Runs on every route (not just /admin) so the CSP nonce is set
  // site-wide — excludes Next's own static asset paths, which don't
  // render HTML and have no scripts of their own to nonce.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

# Runbook

Step-by-step procedures for operational tasks. See
[`README.md`](../README.md) for architecture and initial setup, and
[`CLAUDE.md`](../CLAUDE.md) for the engineering rules referenced below.

## Create the first admin user

There's no self-serve signup for `/admin` — a valid Supabase Auth session
is not sufficient on its own; an `admin_profiles` row is required too (see
README's "Auth model"). To create the first one:

1. In the Supabase dashboard: **Authentication > Users > Add user**.
   Create the account with a real email and a strong password (or invite
   by email, if you'd rather they set their own password).
2. Copy that user's UUID from the users list.
3. In the SQL editor, insert their profile:

   ```sql
   insert into admin_profiles (id, full_name, role)
   values ('<the-uuid-from-step-2>', 'Their Name', 'admin');
   ```

   `role` is one of `admin`, `editor`, `viewer` per the CHECK constraint
   in `supabase/migrations/..._governance.sql` — the app doesn't currently
   branch behavior on this value beyond displaying it, so `admin` is the
   safe default until/unless role-based permissions are actually built.

4. They can now sign in at `/admin/login`. To add more admins later, any
   existing admin can repeat steps 1–3 (there's no in-app "invite a
   teammate" flow yet).

## Rotate a leaked or compromised secret

Applies to `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY`,
`EMAIL_API_KEY`, or any other server-only secret in `.env.example`.

1. Generate a new value from the provider (Supabase: **Project Settings >
   API > service_role > Reveal/Regenerate**; similar for Turnstile/email
   provider dashboards).
2. Update it in Vercel (**Project Settings > Environment Variables**) for
   every affected environment, and in GitHub (**Settings > Secrets and
   variables > Actions**) if CI's `build` job uses it.
3. Redeploy. Old deployments holding the previous value in their build
   output are superseded, not retroactively patched — this is why
   `npm run check:secrets` exists as a _preventive_ CI gate rather than
   something to rely on for cleanup after the fact.
4. If the leaked secret was the **service role key** specifically: treat
   this as urgent. That key bypasses RLS on every table — assume anything
   it could read (leads, contact messages, admin data) was exposed for as
   long as the leak was live, not just theoretically exposable.

## Set up Cloudflare Turnstile

1. [Cloudflare dashboard](https://dash.cloudflare.com/) > **Turnstile** >
   **Add widget**. Widget mode "Managed" is the reasonable default.
2. Copy the **Site Key** into `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and the
   **Secret Key** into `TURNSTILE_SECRET_KEY` (Vercel + `.env.local`).
3. That's it — `components/ui/turnstile-widget.tsx` only renders once a
   site key exists, and `lib/turnstile.ts` only verifies once a secret
   exists. No code changes needed either side.
4. **Before this is configured, the form still works in development**
   (verification fails open outside production) **but every submission
   is rejected once `NODE_ENV=production`** with no secret set — this is
   deliberate fail-closed behavior, not a bug. Don't deploy to production
   without completing this step.

## Set up Sentry

1. [sentry.io](https://sentry.io/) > create a project (platform:
   Next.js).
2. **Settings > Projects > \<project\> > Client Keys (DSN)** — copy the
   DSN into `NEXT_PUBLIC_SENTRY_DSN`.
3. No further code changes needed: `instrumentation.ts` (server/edge) and
   `instrumentation-client.ts` (browser) both call `Sentry.init()` with
   `enabled: Boolean(dsn)`, and `app/error.tsx` / `app/global-error.tsx`
   already report caught errors via `Sentry.captureException()`.
4. This setup does **not** upload source maps or create releases (no
   `withSentryConfig` webpack wrapping) — stack traces in Sentry will
   point at minified code. Wiring up source-map upload is a reasonable
   next step but needs a Sentry auth token added to CI, which isn't done
   here to avoid a build-time dependency on a token that might not exist
   yet.

## Set up Google Analytics (with consent)

1. [analytics.google.com](https://analytics.google.com/) > create a GA4
   property > **Data Streams > Web** > copy the Measurement ID
   (`G-XXXXXXXXXX`).
2. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to that value.
3. Nothing else to do: `components/analytics/analytics.tsx` renders
   nothing at all without this var, and even with it set, the GA4 script
   only loads after a visitor clicks "Accept" on the consent banner it
   also renders — never speculatively before that.

## Verify Google Search Console / Bing Webmaster Tools

1. **Google**: [search.google.com/search-console](https://search.google.com/search-console)
   > Add property > enter the production domain > choose the "HTML tag"
   > verification method > copy the `content="..."` value (not the whole
   > tag) into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
2. **Bing**: [www.bing.com/webmasters](https://www.bing.com/webmasters) >
   Add a site > same HTML-tag method > copy the value into
   `NEXT_PUBLIC_BING_SITE_VERIFICATION`. (Bing also offers importing
   directly from Search Console, which skips needing this var at all.)
3. Deploy with those vars set, then click "Verify" in each console — the
   meta tag is already wired into `app/layout.tsx`'s `metadata.verification`
   and needs no further code change.
4. **Submit the sitemap** once it exists — `app/sitemap.ts` is a known
   gap right now (see README's "What's genuinely NOT done yet"). Until
   it's rebuilt, there's no `sitemap.xml` to submit; both consoles will
   still crawl the site via normal discovery in the meantime.

## Set up Google Business Profile

This is entirely a manual, external process — creating and verifying a
business listing (typically by postcard, phone, or email verification to
the business address) can't be automated or done from this repo. Go to
[business.google.com](https://business.google.com/) and follow Google's
own verification flow. There is deliberately no `LocalBusiness` JSON-LD
in this codebase yet — that schema type expects a real, verifiable
physical address, and none exists in `site_settings` or anywhere else in
this project; adding fabricated address data to satisfy the schema would
be inaccurate structured data, not a shortcut. Once a real address exists,
add it to `site_settings` and a `localBusinessSchema()`-style builder
alongside the existing `OrganizationJsonLd` in
`components/layout/organization-jsonld.tsx`.

## Run the RLS test suite against staging

`supabase/tests/rls.test.sql` is a self-contained smoke test — it creates
its own fixtures, runs entirely inside one transaction, and rolls that
transaction back at the end, so it never leaves data behind regardless of
which database it runs against.

```bash
psql "<your-staging-database-connection-string>" -f supabase/tests/rls.test.sql
```

Get the staging connection string from **Project Settings > Database >
Connection string** on your staging Supabase project specifically — running
this against production is safe (it rolls back), but staging is still the
right target for routine verification so a mistake in the test file itself
never has a chance to matter. Must run as a role that can bypass RLS (the
default `postgres` role in that connection string already can); the script
creates fixtures as that role, then switches to `anon` to verify what an
anonymous request can and can't see.

## Publish a study field page (and what the word-count gate means)

1. `/admin/study-fields` > **New field**. Pick (or first create) a
   category, fill in overview / typical universities / entry requirements
   / language requirements / career outlook.
2. The form shows a live word count against the 400-word minimum as you
   type (`components/admin/word-count-indicator.tsx`) — this is the same
   check the Server Action enforces, surfaced early rather than only
   discovered on submit.
3. Checking "Published" and saving under that threshold is rejected with
   an explanation, not a generic error — `lib/actions/admin/study-fields.ts`
   checks this before writing anything. This exists because thin,
   near-duplicate programmatic pages get penalized by search engines
   (see README's content-model section) — raise the threshold in
   `lib/content-length.ts`'s `MIN_FIELD_PAGE_WORDS` if the bar needs to
   move, rather than working around it per-page.

## Debug a failed Vercel build

Most build failures in this project trace back to one of two things:

1. **A missing/wrong env var.** The error `Missing required environment
variable: X` (from `lib/supabase/env.ts`'s `requireEnv()`) names the
   exact variable — check it's set for the environment that's building
   (Preview vs. Production have separate variable sets in Vercel).
2. **`database.types.ts` drifted from the real schema** after a migration
   landed without `npm run db:types` being re-run — this usually shows up
   as a TypeScript error in a query file referencing a column that
   "doesn't exist" on the generated `Row`/`Insert` type.

If neither explains it, reproduce locally with `npm run build` (not
`npm run dev`, which tolerates some things a production build won't) and
read the actual failing step's output — `next build` reports which
route's `generateStaticParams`/page-data-collection failed, same as the
error shape above.

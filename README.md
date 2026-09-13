# ApexMed International

Marketing and lead-generation website for ApexMed International, a medical
education company providing research training, publication mentorship,
German language and medical licensing (Approbation) pathway guidance, and
German Master's admissions support for doctors and medical students.

This README is written for a developer who already knows Next.js but has
never seen this specific project. See [`CLAUDE.md`](./CLAUDE.md) for the
non-negotiable engineering rules (SEO, RLS, TypeScript strictness,
compliance disclaimers) — read it before contributing, since several
decisions below only make sense in light of those rules. For step-by-step
"how do I do X" procedures (create the first admin user, rotate a leaked
key, set up Turnstile/Sentry/Analytics, publish content), see
[`docs/RUNBOOK.md`](./docs/RUNBOOK.md) instead of this file.

## Architecture overview

This is one Next.js App Router project with three distinct surfaces, not
three separate apps:

- **`app/(public)/*`** — the public marketing site. Every route here is
  Server-Component-first, statically generated or ISR'd
  (`export const revalidate = <seconds>`), and reads data through the
  **anon** Supabase client (`lib/supabase/public.ts`), which never touches
  cookies — that's deliberate, not an oversight: a cookie-reading client
  forces a route into dynamic rendering, which would violate the
  SSG/ISR-only rule for public pages (see CLAUDE.md rule 1). Content that
  needs interactivity (the contact form, dropdown nav, mobile nav sheet)
  is a small, isolated Client Component leaf inside an otherwise-static
  page — never the whole page.
- **`app/(admin)/admin/*`** — the staff-only CMS. Everything here requires
  a Supabase Auth session **and** a matching `admin_profiles` row (a valid
  login alone isn't enough — see "Auth model" below). `noindex, nofollow`
  on every route, and excluded from `robots.txt`/the sitemap.
- **`app/api/*`** and the two admin-scoped Route Handlers under
  `app/(admin)/admin/**/export/route.ts` — the only non-page HTTP surface.
  `app/api/leads/route.ts` is the sole **public** POST endpoint in the
  app; it's rate-limited, honeypot-checked, and Turnstile-verified before
  anything touches the database.

Underneath all three, one Postgres database (Supabase) with **Row Level
Security enabled on every table, no exceptions**. Two read paths and one
write path, and the two read paths are deliberately asymmetric:

- **Public reads** go through the anon key and rely entirely on RLS
  policies (`anon_select_published_*`) to filter out drafts/unpublished
  rows — there is no `.eq("is_published", true)` scattered through the
  query layer, because the database already guarantees it.
- **Admin reads** go through the service-role client
  (`lib/supabase/admin.ts`), which bypasses RLS entirely, so staff can see
  drafts and unpublished rows.
- **Every write in the entire app** — public lead submissions, admin
  content edits, all of it — goes through the service-role client from
  trusted server code (a Route Handler or a Server Action), never through
  an RLS-permitted authenticated write. There is intentionally no
  `authenticated`-role write policy anywhere in `supabase/migrations/`
  (the one exception, `authenticated_select_own_admin_profile`, is a
  read). This keeps the entire authorization model in one place —
  `requireAdminSession()` (`lib/supabase/auth.ts`), called at the top of
  every admin Server Action and independently re-checked in
  `middleware.ts` — rather than spread across a dozen RLS policies each
  re-deriving "is this caller an admin."

### Content model

Two families of content, both admin-managed:

- **Programs** ("Cards") — `programs` + `program_modules` (→
  `program_module_items`) + `program_audiences` + `program_journey_steps`,
  grouped under `program_families`. Every program has a required, non-null
  `disclaimer_key` FK into `compliance_disclaimers` — see CLAUDE.md rule 9;
  `components/program/compliance-note.tsx`'s `body` prop is a _required_
  prop specifically so a program page cannot compile without rendering
  its disclaimer.
- **Blog** — `blog_posts` (MDX in `body_mdx`, rendered via
  `next-mdx-remote/rsc`), `blog_categories`, `tags`. Custom MDX shortcodes
  (`Callout`, `Checklist`, `ComparisonTable`, `CtaBlock`) live in
  `components/blog/mdx-components.tsx`.
- **Study fields** (`study_fields` + `study_field_categories`) power the
  programmatic SEO pages at `/masters/fields/[slug]`. **Publishing one is
  gated on a 400-word minimum** (`lib/content-length.ts`,
  enforced in `lib/actions/admin/study-fields.ts`) — thin, near-duplicate
  programmatic pages get penalized by search engines, so the admin action
  itself refuses to publish under that threshold rather than relying on
  an editor remembering the rule.

### Auth model (admin)

Supabase Auth (email/password) plus an application-level `admin_profiles`
table — **a valid session is not sufficient for admin access on its own**.
`middleware.ts` checks both (session via `auth.getUser()`, not
`getSession()`, so it revalidates against Supabase rather than trusting a
possibly-stale JWT) before any `/admin/*` route renders. Every admin
Server Action calls `requireAdminSession()` independently — middleware
protects pages, but a Server Action is just a POST endpoint underneath and
can't assume middleware ran in front of it.

There's no self-serve admin signup, on purpose. See
[`docs/RUNBOOK.md`](./docs/RUNBOOK.md#create-the-first-admin-user) to
create the first admin account.

### Security layers

- **RLS** on every table (above).
- **CSP + security headers** (`next.config.mjs`) — `Content-Security-Policy`
  is built dynamically from `NEXT_PUBLIC_SUPABASE_URL` so `img-src`/
  `connect-src` scope to this project's actual Supabase Storage host
  rather than a broad wildcard, plus HSTS, `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- **Rate limiting** on `/api/leads` (`lib/rate-limit.ts`) — in-memory,
  documented in that file as not serverless-safe long-term; swap for
  Upstash Redis behind the same `checkRateLimit()` call shape when that
  matters.
- **Cloudflare Turnstile** on the profile-assessment form
  (`components/ui/turnstile-widget.tsx` + `lib/turnstile.ts`) — verified
  server-side, never trusted from the client alone. Fails **open**
  outside production and **closed** in production when unconfigured (see
  the comment in `lib/turnstile.ts` for why those two cases are
  deliberately different).
- **Secret-leak CI gate** (`scripts/check-secrets.mjs`) — greps compiled
  build output for the literal `SUPABASE_SERVICE_ROLE_KEY` value on every
  PR (`.github/workflows/ci.yml`). This has been run against a real build
  in this repo's history with a deliberately planted fake leak to confirm
  it actually catches one, not just that it runs.

### What's genuinely NOT done yet

Documented here rather than silently left for someone to discover:

- **`app/sitemap.ts`, `app/robots.ts`, and per-route
  `opengraph-image.tsx` files don't currently exist.** They were built in
  an earlier pass and were lost from the working tree before being
  committed; nothing since has depended on them, so the gap is real, not
  a stale note. Rebuilding them is a bounded, well-understood task (they
  need the query layer's `*Slugs()` functions and a `next/og` `ImageResponse`
  per program's `accent_token`) — flagged here so it isn't assumed to exist.
- `/webinars`, `/testimonials`, and `/programs` index pages are linked
  from the nav (`lib/navigation.ts`) but don't exist yet — the underlying
  data and admin management for webinars/testimonials do exist.
- Google Search Console / Bing Webmaster verification, Google Business
  Profile, and a real Sentry/Turnstile/GA4 configuration all require
  external accounts this repo can't create for you — see
  [`docs/RUNBOOK.md`](./docs/RUNBOOK.md) for exactly what to do once you
  have them.

## Stack

- Next.js 15 (App Router) + TypeScript (strict mode)
- Tailwind CSS v4
- Supabase (Postgres, Auth, Storage, RLS)
- Zod for validation, shared between client forms and server
- Radix UI primitives + `@dnd-kit` (admin drag-reorder) + `next-mdx-remote`
  (blog MDX rendering)
- Cloudflare Turnstile (bot protection), `@sentry/nextjs` (error
  monitoring), GA4 behind a cookie-consent gate
- ESLint (flat config) + Prettier + Husky + lint-staged + commitlint
- Deployed on Vercel; CI on GitHub Actions

## Prerequisites

- [Node.js](https://nodejs.org/) 20 LTS or later
- npm (ships with Node; the commands below assume it)
- A [Supabase](https://supabase.com/) account and project
- The [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started)
  — `npx supabase` works without a global install
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or
  [Podman](https://podman.io/), running, if you want to run Supabase
  locally (`supabase start`) or regenerate types with `--local`
- A [Vercel](https://vercel.com/) account (for deployment)
- Git

## Setup (cold start)

1. **Clone and install**

   ```bash
   git clone <repo-url>
   cd apexmed-international
   npm install
   ```

   `npm install` also runs `prepare` (`husky`), which wires up the local
   git hooks — see "Quality gates" below.

2. **Create a Supabase project** at
   [supabase.com/dashboard](https://supabase.com/dashboard) and note the
   Project URL, anon key, and service role key from
   **Project Settings > API**.

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in every value using the comments in `.env.example` as a guide.
   The Supabase values are required for anything to work at all; Turnstile,
   Sentry, GA4, and the search-console verification codes are each
   independently optional — every integration they gate degrades
   gracefully (warns and no-ops, or in Turnstile's case fails closed in
   production only) when its own var is unset. Never commit `.env.local`.

4. **Link the Supabase CLI and apply migrations**

   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npm run db:migrate
   ```

   All schema lives in `supabase/migrations/` — never change schema
   directly in the Supabase dashboard (CLAUDE.md rule 4). `supabase/seed.sql`
   has the full seed data set (7 programs, 9 mentors, 20 published study
   fields, 7 blog posts) if you want a populated database to develop
   against; apply it with `npm run db:reset` (local) or run it manually
   against a remote project.

5. **Generate database types**

   ```bash
   npm run db:types
   ```

   This needs a running local Supabase stack (`npx supabase start`, which
   needs Docker/Podman). Against a linked remote project instead:
   `npx supabase gen types typescript --linked > lib/supabase/database.types.ts`.

   > **Re-run this after every migration and commit the regenerated
   > file.** `lib/supabase/database.types.ts` is generated, never
   > hand-edited (CLAUDE.md rule 5) — a stale copy means the query layer
   > silently type-checks against columns that no longer exist.

6. **Create the first admin user** — see
   [`docs/RUNBOOK.md`](./docs/RUNBOOK.md#create-the-first-admin-user).
   There's no self-serve signup; this is a deliberate one-time manual step.

7. **Run the dev server**

   ```bash
   npm run dev
   ```

   The public site is at [http://localhost:3000](http://localhost:3000),
   the admin panel at
   [http://localhost:3000/admin](http://localhost:3000/admin).

## Common scripts

```bash
npm run dev            # start the local dev server
npm run build          # production build
npm run analyze        # production build with the bundle analyzer (opens .next/analyze/*.html)
npm run start          # run the production build locally
npm run lint           # ESLint
npm run format         # Prettier — writes
npm run format:check   # Prettier — check only (what CI runs)
npm run typecheck      # tsc --noEmit
npm test               # Vitest, once
npm run test:watch     # Vitest, watch mode
npm run check:secrets  # fails if SUPABASE_SERVICE_ROLE_KEY's value is in .next/ — see next.config.mjs's comment for why this only makes sense post-build
npm run db:types       # regenerate lib/supabase/database.types.ts
npm run db:migrate     # apply pending migrations (supabase db push)
npm run db:reset       # drop and recreate the local DB from migrations + seed
```

## Database changes

1. `npx supabase migration new <descriptive_name>`
2. Write the SQL under `supabase/migrations/`. If the migration creates a
   table, **enable RLS and define its policies in that same migration** —
   no exceptions, including internal/admin-only tables.
3. Apply with `npm run db:migrate` (or `npm run db:reset` locally to
   rebuild from scratch with seed data).
4. **Regenerate types** (`npm run db:types`) and commit the updated
   `database.types.ts` alongside the migration.

## Data access layer

- `lib/supabase/public.ts` — anon-key client, **no cookies**. Used by
  every public page's query functions specifically so those routes stay
  statically generable; see the architecture note above.
- `lib/supabase/server.ts` — cookie-based client for the admin auth flow
  (`lib/supabase/auth.ts`). Create a fresh instance per request.
- `lib/supabase/client.ts` — browser client (anon key). Currently unused
  by any Client Component — every mutation in this app goes through a
  Server Action or Route Handler instead — but kept for the rare case a
  future feature genuinely needs a direct client-side read.
- `lib/supabase/admin.ts` — service-role client. Guarded by both the
  `server-only` package and a runtime `typeof window` check, since this
  key bypasses every RLS policy in the project.
- `lib/supabase/queries/` — public-facing query functions (anon client).
  `lib/supabase/queries/admin/` — admin query functions (service-role
  client), one file per entity. Every function returns a clean domain
  shape typed against `database.types.ts`, never a raw Supabase response;
  read functions throw `DatabaseQueryError`/`NotFoundError`
  (`lib/supabase/errors.ts`) instead of returning null.
- `lib/actions/admin/` — every admin mutation as a `"use server"` Server
  Action: `requireAdminSession()` first, then Zod-parse the `FormData`
  (`lib/validation/admin/`), then call the matching query function, then
  `revalidatePath()` whatever public route the change affects.
- `lib/validation/` — Zod schemas shared between client forms and server
  validation. Covered by a Vitest suite (`npm test`).
- `lib/result.ts` — a small `Result<T, E>` type for operations with an
  expected failure mode, so callers branch on `.ok` instead of try/catch.

## Quality gates

- **Pre-commit** (`.husky/pre-commit`): `lint-staged` (ESLint --fix +
  Prettier on staged files) then a full `tsc --noEmit`.
- **Commit messages**: `.husky/commit-msg` runs commitlint
  (`commitlint.config.mjs`, Conventional Commits) — `feat: …`,
  `fix: …`, `chore: …`, etc.
- **CI** (`.github/workflows/ci.yml`), on every PR: typecheck, lint,
  `format:check`, `test`, then a separate `build` job that actually
  builds with real secrets (see below) and runs `check:secrets` against
  the output, plus a `commitlint` job covering the PR's whole commit
  range (catches anything a GitHub-web-UI commit could sneak past the
  local hook).

CI's `build` job needs these repo secrets configured (**Settings > Secrets
and variables > Actions**) to actually succeed — without them it fails
exactly the way a local build without `.env.local` fails, which is the
correct behavior, not a workflow bug:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `EMAIL_API_KEY`,
`LEAD_NOTIFICATION_EMAIL`, `TURNSTILE_SECRET_KEY`,
`NEXT_PUBLIC_TURNSTILE_SITE_KEY`.

## Performance

- Every public page is SSG or ISR — there is no client-side-only content
  on a public route (CLAUDE.md rule 1). Verify this holds for a given
  page by checking it has no `export const dynamic = "force-dynamic"`
  and either no `revalidate` export (fully static) or a deliberate
  `export const revalidate = <seconds>`.
- `next.config.mjs` sets `images.formats: ["image/avif", "image/webp"]`
  — every `next/image` usage gets AVIF/WebP automatically via content
  negotiation; there's no static banner artwork checked into the repo to
  manually convert (every image is either a Supabase Storage upload or,
  once rebuilt, a generated OG image).
- `npm run analyze` opens real webpack-bundle-analyzer reports. Last
  checked in this repo: every content page (home, blog, about, masters,
  germany hub, program pages) ships ~250 bytes of route-specific JS; the
  largest public Client Component bundle is `/contact` at ~20.5KB (the
  profile-assessment form + Turnstile widget) — comfortably under a 30KB
  budget, and isolated to the one page that needs it.
- Targets (LCP < 2.5s, CLS < 0.1, INP < 200ms, Lighthouse SEO 100 /
  Accessibility 95+) need to be verified against a real deployment —
  there's no live Supabase project or deployed URL in a fresh clone to
  run Lighthouse against yet.

## Deployment

Deploys to [Vercel](https://vercel.com/). Connect the repository and set
every variable from `.env.example` in **Project Settings > Environment
Variables** per environment (Development/Preview/Production).
`SUPABASE_SERVICE_ROLE_KEY` must only ever be a server-side env var, never
exposed to the client — Vercel's env var UI doesn't distinguish this for
you, so double-check it isn't accidentally added with client exposure
enabled.

## Compliance note

This business must never claim or imply guaranteed admission, visa
issuance, employment, residency placement, medical licensing
(Approbation), or publication. Any UI rendering a program or package must
include a disclaimer. See [`CLAUDE.md`](./CLAUDE.md) for the full rule.
#   a p e x m e d - I n t e r n a t i o n a l - p r o j e c t  
 
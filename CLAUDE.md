# CLAUDE.md

Guidance for Claude Code (and any contributor) working in this repository.

## Project

**ApexMed International** is a marketing and lead-generation website for a
medical education company. The business provides:

- Research training
- Publication mentorship
- German language and medical licensing (Approbation) pathway guidance
- German Master's admissions support for doctors and medical students

The site's job is to generate qualified leads (form submissions, consultation
bookings) from doctors and medical students considering these programs. It is
primarily a public-facing marketing site, not an LMS or student dashboard —
but as of the visitor-accounts feature (`supabase/migrations/20260913100003_visitor_accounts.sql`,
`/login`, `/signup`, `/account`), a visitor may optionally create an account
to see their own past profile-assessment requests and webinar registrations.
Every lead-capture form must keep working anonymously first — an account is
an added convenience on top of that, never a requirement to submit one.
Don't expand what a visitor account can do (saved programs, messaging,
course content, etc.) without that being an explicit ask — the account
surface is intentionally minimal.

## Stack

- **Next.js 15**, App Router, **TypeScript strict mode**
- **Tailwind CSS v4**
- **Supabase** (Postgres, Auth, Storage, RLS)
- **Server Components by default** — Client Components only when interactivity
  is genuinely required (forms, modals, tabs, anything with `useState`/event
  handlers that can't be done server-side)
- **Zod** for validation, with schemas shared between client and server
- Deployed on **Vercel**

## Non-Negotiable Rules

These are hard constraints. Do not weaken, work around, or "temporarily"
violate them, even if a task seems to require it — flag the conflict instead.

### 1. SEO is the top priority

- Every public page must be statically generated or use ISR. No
  client-side-only content rendering on public routes — content that matters
  for search engines and first paint must be rendered on the server.
- Every public page exports `generateMetadata()`.
- Client Components may enhance a page (interactivity, animation) but must
  never be the sole source of a public page's primary content.

### 2. Service role key is server-only

- `SUPABASE_SERVICE_ROLE_KEY` must never appear in any file that can reach the
  browser bundle — no Client Components, no code imported by a Client
  Component, no client-side config.
- Only `NEXT_PUBLIC_`-prefixed environment variables are client-safe. Treat
  every non-`NEXT_PUBLIC_` variable as server-only by default.

### 3. Row Level Security on every table

- Every table has RLS enabled. No exceptions, including internal, admin, or
  "temporary" tables.
- New migrations that create a table must enable RLS and define policies in
  the same migration.

### 4. Schema changes go through migrations only

- All database schema changes are made via files in `supabase/migrations/`.
- Never instruct the user (or yourself) to change schema directly in the
  Supabase dashboard. The dashboard is for inspection, not schema authorship.

### 5. Database types are generated, never hand-written

- Types live in `lib/supabase/database.types.ts` and are produced by the
  Supabase CLI type generator.
- Never hand-edit this file. If it's out of date, regenerate it from the
  current migrations instead of patching it manually.

### 6. Strict TypeScript hygiene

- No `any`.
- No `@ts-ignore`.
- No non-null assertion (`!`) without an inline comment explaining why it is
  safe at that call site.

### 7. No raw Supabase queries in components

- Components never call the Supabase client directly.
- All queries live in `lib/supabase/queries/` as named, typed functions
  (e.g. `getProgramBySlug(slug: string)`), which components/pages import and
  call.

### 8. Comments explain WHY, never WHAT

- A comment should capture a reason, trade-off, or non-obvious constraint —
  not restate what the next line already says.
- Delete any comment that merely restates the code.

### 9. Compliance disclaimers are a legal requirement

This business must **never** promise, imply, or guarantee:

- Admission to any program or institution
- Visa issuance
- Employment
- Residency placement
- Medical licensing (Approbation)
- Publication (of research, papers, etc.)

Any component that renders a program or package (cards, detail pages, pricing
tables, landing sections, PDFs/brochures generated from the site, etc.) must
render a disclaimer to this effect. Treat this as a legal requirement, not a
style preference — do not omit it for layout convenience, and do not word
copy in a way that implies a guaranteed outcome even if no disclaimer is
technically "missing."

## Code Style

- **Files:** kebab-case (`program-card.tsx`, `use-lead-form.ts`).
- **Components:** PascalCase (`ProgramCard`).
- **Functions:** camelCase (`getProgramBySlug`).
- One component per file. Co-locate that component's types in the same file.
- Prefer composition over props explosion — split a component before adding
  another boolean/variant prop to control unrelated behavior.
- No default exports, except Next.js pages/layouts/route handlers where the
  framework requires them.

## Project Structure (expected conventions)

- `app/` — routes, layouts, `generateMetadata()`, Server Components.
- `lib/supabase/queries/` — all typed Supabase query functions.
- `lib/supabase/database.types.ts` — generated types (do not hand-edit).
- `supabase/migrations/` — all schema changes, in order.
- `lib/validation/` (or co-located) — shared Zod schemas.

## Project Status

Past the documentation/setup-only stage this file originally described —
the app (frontend, backend, database) is built and connected to a live
Supabase project. See `README.md` for architecture, environment setup, the
migration workflow, and deployment/runbook details.

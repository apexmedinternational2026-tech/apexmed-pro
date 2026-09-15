-- Per-service application forms (client's Task 3 build prompt — the
-- highest-priority item in that document). `services` already exists
-- (the client's own earlier "Architecture Change" brief) — applications
-- reference it directly rather than duplicating a table that's already
-- there and already live with 10 real services.

create table applications (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete restrict,
  full_name text not null,
  email text not null,
  phone text not null,
  institution text,
  education_level text,
  year_of_study text,
  country text,
  cv_url text, -- a path within the private `applications` storage bucket, not a public URL — see lib/supabase/queries/applications.ts
  motivation text,
  -- Service-specific answers (components/services/application-extra-fields.ts
  -- defines which questions each service asks) — jsonb rather than a rigid
  -- column per question, since the question set differs per service and
  -- grows without a schema migration every time one is added or changed.
  extra_fields jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'under_review', 'accepted', 'rejected')),
  admin_notes text,
  created_at timestamptz not null default now()
);

create index applications_service_id_idx on applications (service_id);
create index applications_status_idx on applications (status);
create index applications_created_at_idx on applications (created_at);
-- Powers the "same email + same service within 24h" duplicate check
-- (application-layer, in lib/supabase/queries/applications.ts — a rolling
-- 24h window isn't expressible as a plain unique constraint).
create index applications_email_service_idx on applications (email, service_id);

alter table applications enable row level security;

-- Same reasoning as leads/contact_messages: an application holds a
-- prospect's PII (name, email, phone, CV) and internal admin notes.
-- Anonymous INSERT only — no SELECT/UPDATE/DELETE policy for anon, so
-- with RLS's default-deny, only the service role (which bypasses RLS,
-- from the admin panel's server-only code) can ever read or change one.
create policy "anon_insert_applications" on applications
  for insert
  to anon
  with check (true);

revoke all on table applications from anon, authenticated;
grant insert on table applications to anon;

-- Private CV storage — deliberately NOT the existing public `media`
-- bucket. A resume carries a name, address, phone number, and often a
-- photo; there is no reason it should ever be reachable by a guessed or
-- shared URL the way a blog cover image is. Downloads go through a
-- short-lived signed URL generated server-side by the admin client
-- (lib/supabase/queries/applications.ts), never a public URL.
insert into storage.buckets (id, name, public)
values ('applications', 'applications', false)
on conflict (id) do nothing;

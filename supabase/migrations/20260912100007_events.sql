-- Events: webinars and their registrations.

create table webinars (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  -- Optional: a webinar can exist before a speaker is confirmed.
  speaker_id uuid references mentors(id) on delete set null,
  starts_at timestamptz not null,
  duration_minutes integer not null default 60,
  platform text not null default 'zoom' check (platform in ('zoom', 'google_meet', 'ms_teams', 'youtube_live', 'other')),
  join_url text,
  cover_image_url text,
  capacity integer,
  is_published boolean not null default false,
  seo_title text,
  seo_description text,
  seo_og_image_url text,
  canonical_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index webinars_speaker_id_idx on webinars (speaker_id);
create index webinars_starts_at_idx on webinars (starts_at);

create trigger set_updated_at
  before update on webinars
  for each row execute function set_updated_at();

create table webinar_registrations (
  id uuid primary key default gen_random_uuid(),
  -- CASCADE: a registration has no meaning independent of its webinar.
  webinar_id uuid not null references webinars(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  created_at timestamptz not null default now(),
  unique (webinar_id, email)
);

create index webinar_registrations_webinar_id_idx on webinar_registrations (webinar_id);

alter table webinars enable row level security;
alter table webinar_registrations enable row level security;

-- An unpublished webinar (still being scheduled, speaker unconfirmed) must
-- not appear in a public "upcoming webinars" listing or be reachable
-- through a guessed or leaked slug.
create policy "anon_select_published_webinars" on webinars
  for select
  to anon
  using (is_published = true);

-- A visitor must be able to register without an account. The EXISTS check
-- stops a registration being created against a webinar that isn't actually
-- public yet (e.g. via a slug/id guessed or scraped before launch).
create policy "anon_insert_webinar_registrations" on webinar_registrations
  for insert
  to anon
  with check (
    exists (
      select 1 from webinars w
      where w.id = webinar_registrations.webinar_id
        and w.is_published = true
    )
  );

-- Deliberately no SELECT/UPDATE/DELETE policy: registrant name, email, and
-- phone are PII. With RLS's default-deny, anon (and any authenticated
-- non-admin) gets zero rows and cannot tamper with or harvest another
-- registrant's contact details, even via a crafted query.

grant select on table webinars to anon, authenticated;
grant insert on table webinar_registrations to anon;

-- Governance: compliance disclaimers, site settings, and admin profiles.
--
-- compliance_disclaimers is created first (before any table that
-- references it) so programs.disclaimer_key can declare its FK immediately
-- rather than being bolted on after the fact.

create table compliance_disclaimers (
  key text primary key,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on compliance_disclaimers
  for each row execute function set_updated_at();

alter table compliance_disclaimers enable row level security;

-- Disclaimers are legally required, public-facing text with no "draft"
-- state. Restricting reads here would only risk a program page rendering
-- without its mandatory legal copy — the exact outcome this schema exists
-- to prevent — so every row is world-readable by design.
create policy "anon_select_disclaimers" on compliance_disclaimers
  for select
  to anon
  using (true);

grant select on table compliance_disclaimers to anon, authenticated;

create table site_settings (
  key text primary key,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on site_settings
  for each row execute function set_updated_at();

alter table site_settings enable row level security;

-- Settings stored here (contact email, social links) are meant for public
-- display in the site header/footer, so read access carries no risk. Write
-- access is withheld from anon/authenticated entirely so a compromised
-- browser session can never rewrite site-wide configuration.
create policy "anon_select_site_settings" on site_settings
  for select
  to anon
  using (true);

grant select on table site_settings to anon, authenticated;

create table admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'admin' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now()
);

alter table admin_profiles enable row level security;

-- Stops one staff member from enumerating or reading another staff
-- member's profile (name, role) through the normal client API.
create policy "authenticated_select_own_admin_profile" on admin_profiles
  for select
  to authenticated
  using (auth.uid() = id);

grant select on table admin_profiles to authenticated;

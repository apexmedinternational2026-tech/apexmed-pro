-- Program content: families, programs ("Cards"), and their nested content
-- (modules, checklist items, audiences, journey steps).

create table program_families (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text,
  accent_token text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on program_families
  for each row execute function set_updated_at();

create table programs (
  id uuid primary key default gen_random_uuid(),
  -- RESTRICT: a family with live programs under it cannot be deleted out
  -- from under them by accident.
  family_id uuid not null references program_families(id) on delete restrict,
  slug text not null unique,
  name text not null,
  headline text not null,
  summary text not null,
  duration_label text,
  hero_image_url text,
  banner_image_url text,
  accent_token text,
  -- Structurally forces every program, published or not, to carry real
  -- legal disclaimer text. Do not make this nullable — see CLAUDE.md rule 9.
  disclaimer_key text not null references compliance_disclaimers(key) on delete restrict,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  seo_og_image_url text,
  canonical_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index programs_family_id_idx on programs (family_id);
create index programs_disclaimer_key_idx on programs (disclaimer_key);

create trigger set_updated_at
  before update on programs
  for each row execute function set_updated_at();

create table program_modules (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs(id) on delete cascade,
  title text not null,
  description text,
  icon_key text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index program_modules_program_id_idx on program_modules (program_id);

create trigger set_updated_at
  before update on program_modules
  for each row execute function set_updated_at();

create table program_module_items (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references program_modules(id) on delete cascade,
  label text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index program_module_items_module_id_idx on program_module_items (module_id);

create trigger set_updated_at
  before update on program_module_items
  for each row execute function set_updated_at();

create table program_audiences (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs(id) on delete cascade,
  label text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index program_audiences_program_id_idx on program_audiences (program_id);

create trigger set_updated_at
  before update on program_audiences
  for each row execute function set_updated_at();

create table program_journey_steps (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs(id) on delete cascade,
  step_label text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index program_journey_steps_program_id_idx on program_journey_steps (program_id);

create trigger set_updated_at
  before update on program_journey_steps
  for each row execute function set_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────

alter table program_families enable row level security;
alter table programs enable row level security;
alter table program_modules enable row level security;
alter table program_module_items enable row level security;
alter table program_audiences enable row level security;
alter table program_journey_steps enable row level security;

-- program_families has no publish flag of its own. Gating on "has at least
-- one published program" stops an unlaunched family (and its name/tagline)
-- from leaking into the public API before the business is ready to
-- announce it, without adding a redundant column that could drift out of
-- sync with the programs underneath it.
create policy "anon_select_families_with_published_program" on program_families
  for select
  to anon
  using (
    exists (
      select 1 from programs p
      where p.family_id = program_families.id
        and p.is_published = true
    )
  );

-- Direct guard on the row itself: an unpublished Card (draft pricing,
-- unreleased program) must never be readable by an anonymous visitor or
-- indexable through the public API.
create policy "anon_select_published_programs" on programs
  for select
  to anon
  using (is_published = true);

-- Child rows must not leak content for a program that isn't public yet —
-- checked via EXISTS against the parent, never trusting a copy of the flag
-- on the child row itself.
create policy "anon_select_modules_of_published_programs" on program_modules
  for select
  to anon
  using (
    exists (
      select 1 from programs p
      where p.id = program_modules.program_id
        and p.is_published = true
    )
  );

-- Same threat one level deeper: a checklist item must inherit the publish
-- state of its module's program, not just its immediate parent module.
create policy "anon_select_items_of_published_programs" on program_module_items
  for select
  to anon
  using (
    exists (
      select 1
      from program_modules m
      join programs p on p.id = m.program_id
      where m.id = program_module_items.module_id
        and p.is_published = true
    )
  );

create policy "anon_select_audiences_of_published_programs" on program_audiences
  for select
  to anon
  using (
    exists (
      select 1 from programs p
      where p.id = program_audiences.program_id
        and p.is_published = true
    )
  );

create policy "anon_select_journey_steps_of_published_programs" on program_journey_steps
  for select
  to anon
  using (
    exists (
      select 1 from programs p
      where p.id = program_journey_steps.program_id
        and p.is_published = true
    )
  );

grant select on table
  program_families,
  programs,
  program_modules,
  program_module_items,
  program_audiences,
  program_journey_steps
to anon, authenticated;

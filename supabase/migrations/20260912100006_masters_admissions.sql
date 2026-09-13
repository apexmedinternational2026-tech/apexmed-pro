-- Master's admissions content, used to power programmatic SEO pages
-- (one page per study field).

create table study_field_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on study_field_categories
  for each row execute function set_updated_at();

create table study_fields (
  id uuid primary key default gen_random_uuid(),
  -- RESTRICT: a category with published fields under it cannot be deleted
  -- out from under them by accident.
  category_id uuid not null references study_field_categories(id) on delete restrict,
  slug text not null unique,
  name text not null,
  overview text,
  typical_universities text,
  entry_requirements text,
  language_requirements text,
  career_outlook text,
  is_published boolean not null default false,
  seo_title text,
  seo_description text,
  seo_og_image_url text,
  canonical_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index study_fields_category_id_idx on study_fields (category_id);

create trigger set_updated_at
  before update on study_fields
  for each row execute function set_updated_at();

alter table study_field_categories enable row level security;
alter table study_fields enable row level security;

create policy "anon_select_categories_with_published_field" on study_field_categories
  for select
  to anon
  using (
    exists (
      select 1 from study_fields sf
      where sf.category_id = study_field_categories.id
        and sf.is_published = true
    )
  );

-- Programmatic-SEO pages are generated directly from this table; an
-- unpublished field row (unverified entry requirements, in-progress copy)
-- must not be servable or indexable before it has been reviewed.
create policy "anon_select_published_study_fields" on study_fields
  for select
  to anon
  using (is_published = true);

grant select on table study_field_categories, study_fields to anon, authenticated;

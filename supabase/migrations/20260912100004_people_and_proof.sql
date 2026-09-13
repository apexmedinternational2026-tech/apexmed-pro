-- People and social proof: mentors and testimonials.

create table mentors (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  full_name text not null,
  role_title text,
  qualification text,
  institution text,
  bio text,
  photo_url text,
  publications_count integer not null default 0,
  linkedin_url text,
  is_leadership boolean not null default false,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on mentors
  for each row execute function set_updated_at();

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_title text,
  author_photo_url text,
  -- Optional: a testimonial need not be tied to a specific Card.
  program_id uuid references programs(id) on delete set null,
  quote text not null,
  rating smallint not null check (rating between 1 and 5),
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index testimonials_program_id_idx on testimonials (program_id);

alter table mentors enable row level security;
alter table testimonials enable row level security;

-- Keeps an in-progress mentor profile (bio/credentials not finalized) out
-- of the public mentors listing.
create policy "anon_select_published_mentors" on mentors
  for select
  to anon
  using (is_published = true);

-- Prevents unmoderated testimonials — which could contain spam, unverifiable
-- claims, or content someone else submitted under a fake name — from ever
-- reaching the public site.
create policy "anon_select_approved_testimonials" on testimonials
  for select
  to anon
  using (is_approved = true);

grant select on table mentors, testimonials to anon, authenticated;

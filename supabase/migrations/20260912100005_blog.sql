-- Content marketing: blog categories, posts, and tags.

create table blog_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on blog_categories
  for each row execute function set_updated_at();

create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body_mdx text not null,
  cover_image_url text,
  cover_image_alt text not null,
  -- Optional: a post can survive its author leaving/being removed.
  author_id uuid references mentors(id) on delete set null,
  category_id uuid references blog_categories(id) on delete set null,
  reading_minutes integer,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'archived')),
  published_at timestamptz,
  seo_title text,
  seo_description text,
  seo_og_image_url text,
  canonical_path text,
  schema_type text not null default 'Article',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blog_posts_author_id_idx on blog_posts (author_id);
create index blog_posts_category_id_idx on blog_posts (category_id);
create index blog_posts_status_published_at_idx on blog_posts (status, published_at desc);

create trigger set_updated_at
  before update on blog_posts
  for each row execute function set_updated_at();

create table tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on tags
  for each row execute function set_updated_at();

create table blog_post_tags (
  post_id uuid not null references blog_posts(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create index blog_post_tags_tag_id_idx on blog_post_tags (tag_id);

alter table blog_categories enable row level security;
alter table blog_posts enable row level security;
alter table tags enable row level security;
alter table blog_post_tags enable row level security;

-- Same "no flag of its own" pattern as program_families: a category with no
-- published posts shouldn't appear in public category navigation yet.
create policy "anon_select_categories_with_published_post" on blog_categories
  for select
  to anon
  using (
    exists (
      select 1 from blog_posts bp
      where bp.category_id = blog_categories.id
        and bp.status = 'published'
    )
  );

-- The core content gate: draft, scheduled, and archived posts (which may
-- contain unreviewed medical/legal claims) must never be reachable by an
-- anonymous request, whether through the app or a direct API call.
create policy "anon_select_published_posts" on blog_posts
  for select
  to anon
  using (status = 'published');

-- Tags are pure taxonomy (a word or phrase) with no confidential or
-- unreviewed content, so exposing the full tag list cannot reveal the
-- existence or topic of an unpublished post.
create policy "anon_select_tags" on tags
  for select
  to anon
  using (true);

-- Guards the post<->tag join itself: without this, tag associations for a
-- draft post would remain enumerable even with the post row hidden,
-- letting someone infer a draft's existence and topic from its tags alone.
create policy "anon_select_tags_of_published_posts" on blog_post_tags
  for select
  to anon
  using (
    exists (
      select 1 from blog_posts bp
      where bp.id = blog_post_tags.post_id
        and bp.status = 'published'
    )
  );

grant select on table blog_categories, blog_posts, tags, blog_post_tags to anon, authenticated;

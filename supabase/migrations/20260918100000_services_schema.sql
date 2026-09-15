-- Services hub — the client's revised architecture (see the "Architecture
-- Change" build brief). "Service" is a presentation layer on top of
-- existing content: a service_item points at a program/course/study field
-- category rather than duplicating its content into a new table.
--
-- external_href is one field beyond the brief's own spec: some sub-items
-- (the German Medical Pathway's Overview/FSP/KP/Approbation) have real,
-- already-built content that lives at a dedicated static route
-- (/germany/fsp, etc.), not in any of programs/courses/study_field_categories
-- — there was no column to point at that. Rather than duplicate that
-- content into program_module-shaped rows just to satisfy the three
-- existing link columns, a sub-item can instead link straight out to its
-- real page. Exactly one of program_id/course_id/study_field_category_id/
-- external_href may be set — a sub-item points at one thing, or stands
-- alone with its own text.

create table services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_name text,
  tagline text,
  summary text,
  description text,
  icon_key text not null,
  accent_token text not null,
  hero_image_url text,
  disclaimer_key text references compliance_disclaimers(key) on delete restrict,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  meta_title text,
  meta_description text,
  og_image_url text,
  canonical_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index services_disclaimer_key_idx on services (disclaimer_key);

create trigger set_updated_at
  before update on services
  for each row execute function set_updated_at();

create table service_items (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  slug text not null,
  name text not null,
  summary text,
  icon_key text,
  program_id uuid references programs(id) on delete set null,
  course_id uuid references courses(id) on delete set null,
  study_field_category_id uuid references study_field_categories(id) on delete set null,
  external_href text,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (service_id, slug),
  constraint service_items_at_most_one_link check (
    num_nonnulls(program_id, course_id, study_field_category_id, external_href) <= 1
  )
);

create index service_items_service_id_idx on service_items (service_id);
create index service_items_program_id_idx on service_items (program_id);
create index service_items_course_id_idx on service_items (course_id);
create index service_items_study_field_category_id_idx on service_items (study_field_category_id);

create trigger set_updated_at
  before update on service_items
  for each row execute function set_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────

alter table services enable row level security;
alter table service_items enable row level security;

create policy "anon_select_published_services" on services
  for select to anon
  using (is_published = true);

create policy "anon_select_items_of_published_services" on service_items
  for select to anon
  using (
    is_published = true
    and exists (select 1 from services s where s.id = service_items.service_id and s.is_published = true)
  );

revoke all on table services, service_items from anon, authenticated;
grant select on table services, service_items to anon, authenticated;

-- ── leads.interest_type: one value per service, for attribution ──────────
alter table leads drop constraint leads_interest_type_check;
alter table leads add constraint leads_interest_type_check
  check (
    interest_type in (
      'apexmed_research_card',
      'master_meta_analysis_card',
      'cdc_specialist_card',
      'blue_card',
      'green_card',
      'gold_card',
      'master_card',
      'international_exams',
      'ai_course',
      'green_earth',
      'counselling',
      'general_inquiry',
      'service_research',
      'service_german_medical',
      'service_germany_masters',
      'service_usmle',
      'service_plab',
      'service_mrcp',
      'service_amc',
      'service_mental_health',
      'service_ai_healthcare',
      'service_green_earth'
    )
  );

-- ── Seed the ten services ─────────────────────────────────────────────────
-- Ten, not nine: MRCP is added as its own service per the client's answer
-- to Q2 (it already has full, PLAB-depth content — 4 modules, 19 items,
-- its own journey steps — not a one-line sub-item under PLAB).
-- accent_token stores the AccentToken key directly (lib/accent.ts
-- resolveAccentToken checks for this before falling back to the
-- descriptive-string map programs.accent_token uses).

insert into services (slug, name, short_name, tagline, summary, icon_key, accent_token, disclaimer_key, is_published, sort_order) values
  ('research', 'Research Services', 'Research', 'Original research, meta-analysis, and publication mentorship',
   'One-to-one mentorship through original research, meta-analysis, CDC WONDER studies, and medical writing.',
   'microscope', 'research-service', 'publication', true, 1),
  ('german-medical', 'German Medical Pathway', 'German Medical', 'Language, FSP, KP, and Approbation guidance',
   'Structured guidance through German language training, FSP and KP exam preparation, and the Approbation pathway.',
   'stethoscope', 'green', 'germany_licensing', true, 2),
  ('germany-masters', 'Germany Master''s Pathway', 'Germany Master''s', 'Master''s admissions guidance for Pakistani students',
   'Structured guidance through profile assessment, field selection, university applications, and visa preparation for a German Master''s degree.',
   'graduation-cap', 'master', 'admissions', true, 3),
  ('usmle', 'USMLE Pathway', 'USMLE', 'Step 1, Step 2 CK, and Step 3 mentorship',
   'One-to-one mentorship through the full USMLE sequence, from Step 1 through Step 3.',
   'flask-conical', 'usmle', 'exam_licensing', true, 4),
  ('plab', 'PLAB Pathway', 'PLAB', 'PLAB 1, PLAB 2, and GMC registration guidance',
   'Mentorship through PLAB 1 and the station-based PLAB 2, with GMC registration and NHS career guidance.',
   'clipboard-check', 'licensing', 'exam_licensing', true, 5),
  ('mrcp', 'MRCP Pathway', 'MRCP', 'Part 1, Part 2 Written, and PACES preparation',
   'Mentorship through the MRCP sequence — Part 1, Part 2 Written, and PACES — with UK career guidance.',
   'award', 'mrcp', 'exam_licensing', true, 6),
  ('amc', 'AMC Pathway', 'AMC', 'CAT MCQ, clinical/practical prep, and AHPRA registration',
   'Mentorship through the AMC CAT MCQ and clinical/practical exams, with Australian registration guidance.',
   'badge-check', 'amc', 'exam_licensing', true, 7),
  ('mental-health', 'Mental Health Support', 'Mental Health', 'Non-urgent counselling and peer support',
   'Confidential, non-urgent counselling and peer support for healthcare professionals and students.',
   'heart-handshake', 'mental-health', 'mental_health', true, 8),
  ('ai-healthcare', 'AI for Medical Healthcare', 'AI for Healthcare', 'A practical AI course for clinicians',
   'A complete course on artificial intelligence in healthcare — from fundamentals to real-world clinical applications.',
   'brain-circuit', 'ai-healthcare', 'education_only', true, 9),
  ('green-earth', 'Climate & Green Earth', 'Green Earth', 'ApexMed''s climate and sustainability initiative',
   'Doctors for a green earth — climate and health webinars, tree plantation, and sustainable healthcare advocacy.',
   'leaf', 'green-earth', null, true, 10);

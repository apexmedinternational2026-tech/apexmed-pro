-- Schema for four new content areas: International Licensing (USMLE/PLAB/
-- MRCP/AMC), standalone Courses (AI for Healthcare), Initiatives (Green
-- Earth), and Support Services (Mental Health). See the accompanying build
-- brief's PART 1 for the full spec this migration implements.

-- ── Compliance disclaimers ───────────────────────────────────────────────
-- Every program/course/service below is structurally required to carry one
-- of these (disclaimer_key is NOT NULL with an FK) — see CLAUDE.md rule 9.

insert into compliance_disclaimers (key, body) values
  (
    'exam_licensing',
    'ApexMed International provides educational mentorship, examination preparation and pathway guidance. We do not guarantee examination results, professional registration, residency placement, employment, visa approval or licensure. Final decisions are made by the relevant examination bodies, regulators, universities, employers and government authorities. Exam formats, eligibility criteria, registration requirements and immigration rules can change and vary by individual circumstances.'
  ),
  (
    'mental_health',
    'ApexMed''s counselling service provides non-urgent support for healthcare professionals and students. It is not an emergency or crisis service. Sessions are confidential within the limits of professional and legal duty of care. If you are in immediate danger, contact emergency services.'
  ),
  (
    'education_only',
    'This course provides educational content only. It does not constitute clinical guidance and should not be used as the basis for patient care decisions. AI tool capabilities, pricing and availability change frequently.'
  );

-- ── International Licensing: one more program family ────────────────────
-- accent_token here follows this codebase's existing free-text convention
-- (see lib/accent.ts's ACCENT_TOKEN_TEXT_MAP: "navy-gold", "sky-blue",
-- "deep-green", "amber-black", "violet") rather than the brief's literal
-- suggestion of "product-licensing", which isn't how any other family's
-- accent_token is actually stored.

insert into program_families (slug, name, tagline, accent_token, sort_order) values
  ('international-licensing', 'International Licensing & Exams', 'USMLE · PLAB · MRCP · AMC', 'deep-red', 5);

-- Four pathways. is_published = false: these reuse the existing
-- programs/[slug] template, but ship with no modules/journey steps yet
-- (PART 2 of the brief) — publishing now would put a real, indexable, but
-- nearly-empty page in front of visitors. Flip to true once each pathway's
-- module content is seeded.
insert into programs (family_id, slug, name, headline, summary, accent_token, disclaimer_key, is_published, sort_order)
select id, 'usmle-mentorship', 'USMLE Mentorship Program',
  'Structured mentorship through Step 1, Step 2 CK and Step 3',
  'One-to-one mentorship through the USMLE sequence — study planning, question-bank strategy, and exam-day preparation with a mentor who has been through the process.',
  'deep-red', 'exam_licensing', false, 1
from program_families where slug = 'international-licensing';

insert into programs (family_id, slug, name, headline, summary, accent_token, disclaimer_key, is_published, sort_order)
select id, 'plab-mentorship', 'PLAB Mentorship Program',
  'PLAB 1, PLAB 2, and GMC registration guidance',
  'Mentorship through PLAB 1 and the station-based PLAB 2, with GMC registration and NHS career guidance for the UK pathway.',
  'deep-red', 'exam_licensing', false, 2
from program_families where slug = 'international-licensing';

insert into programs (family_id, slug, name, headline, summary, accent_token, disclaimer_key, is_published, sort_order)
select id, 'mrcp-mentorship', 'MRCP Mentorship Program',
  'Part 1, Part 2 Written, and PACES preparation',
  'Mentorship through the MRCP sequence — Part 1, Part 2 Written, and PACES — with UK career guidance for postgraduate doctors.',
  'deep-red', 'exam_licensing', false, 3
from program_families where slug = 'international-licensing';

insert into programs (family_id, slug, name, headline, summary, accent_token, disclaimer_key, is_published, sort_order)
select id, 'amc-mentorship', 'AMC Mentorship Program',
  'CAT MCQ, clinical/practical prep, and AHPRA registration',
  'Mentorship through the AMC CAT MCQ and clinical/practical exams, with Australian registration and career guidance for IMGs.',
  'deep-red', 'exam_licensing', false, 4
from program_families where slug = 'international-licensing';

-- ── Standalone courses (not part of a program family) ────────────────────

create table courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tagline text,
  description text,
  hero_image_url text,
  format_label text, -- e.g. 'Complete online course'
  certification_label text, -- e.g. 'Certificate of Completion included'
  disclaimer_key text not null references compliance_disclaimers(key) on delete restrict,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  meta_title text,
  meta_description text,
  og_image_url text,
  canonical_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index courses_disclaimer_key_idx on courses (disclaimer_key);

create trigger set_updated_at
  before update on courses
  for each row execute function set_updated_at();

create table course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  module_number integer not null,
  title text not null,
  key_takeaway text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index course_modules_course_id_idx on course_modules (course_id);

create trigger set_updated_at
  before update on course_modules
  for each row execute function set_updated_at();

create table course_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references course_modules(id) on delete cascade,
  lesson_number text, -- '1.1', '4.10' — not numeric, so it can carry the module prefix
  title text not null,
  topics text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index course_lessons_module_id_idx on course_lessons (module_id);

create trigger set_updated_at
  before update on course_lessons
  for each row execute function set_updated_at();

-- ── Initiatives (Green Earth) ─────────────────────────────────────────────

create table initiatives (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  mission text,
  vision text,
  tagline text,
  description text,
  hero_image_url text,
  accent_token text,
  is_published boolean not null default false,
  meta_title text,
  meta_description text,
  og_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on initiatives
  for each row execute function set_updated_at();

create table initiative_sections (
  id uuid primary key default gen_random_uuid(),
  initiative_id uuid not null references initiatives(id) on delete cascade,
  title text not null,
  description text,
  icon_key text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index initiative_sections_initiative_id_idx on initiative_sections (initiative_id);

create trigger set_updated_at
  before update on initiative_sections
  for each row execute function set_updated_at();

create table initiative_section_items (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references initiative_sections(id) on delete cascade,
  label text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index initiative_section_items_section_id_idx on initiative_section_items (section_id);

create trigger set_updated_at
  before update on initiative_section_items
  for each row execute function set_updated_at();

-- ── Support services (Mental Health) ──────────────────────────────────────

create table support_services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  summary text,
  description text,
  disclaimer_key text not null references compliance_disclaimers(key) on delete restrict,
  is_published boolean not null default false,
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index support_services_disclaimer_key_idx on support_services (disclaimer_key);

create trigger set_updated_at
  before update on support_services
  for each row execute function set_updated_at();

create table support_service_offerings (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references support_services(id) on delete cascade,
  title text not null,
  description text,
  is_free boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index support_service_offerings_service_id_idx on support_service_offerings (service_id);

create trigger set_updated_at
  before update on support_service_offerings
  for each row execute function set_updated_at();

-- verified_on is NOT NULL deliberately (per the brief): a stale crisis
-- number is worse than no number, so every row is forced to record when it
-- was last checked. The admin panel must surface any row not verified in
-- the last 6 months (see PART 5's /admin/crisis-resources requirement —
-- not built by this migration, application-layer work).
create table crisis_resources (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  organisation text not null,
  phone text not null,
  hours text,
  notes text,
  verified_on date not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on crisis_resources
  for each row execute function set_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────
-- Same pattern as every existing content table: anon SELECT only where
-- is_published/is_active = true; child tables check the parent's flag via
-- EXISTS, never trusting a copy of the flag on the child row itself. No
-- anon writes anywhere — admin writes go through the service-role client
-- server-side (see lib/supabase/admin.ts), which bypasses RLS entirely.

alter table courses enable row level security;
alter table course_modules enable row level security;
alter table course_lessons enable row level security;
alter table initiatives enable row level security;
alter table initiative_sections enable row level security;
alter table initiative_section_items enable row level security;
alter table support_services enable row level security;
alter table support_service_offerings enable row level security;
alter table crisis_resources enable row level security;

create policy "anon_select_published_courses" on courses
  for select to anon
  using (is_published = true);

create policy "anon_select_modules_of_published_courses" on course_modules
  for select to anon
  using (
    exists (select 1 from courses c where c.id = course_modules.course_id and c.is_published = true)
  );

create policy "anon_select_lessons_of_published_courses" on course_lessons
  for select to anon
  using (
    exists (
      select 1
      from course_modules m
      join courses c on c.id = m.course_id
      where m.id = course_lessons.module_id and c.is_published = true
    )
  );

create policy "anon_select_published_initiatives" on initiatives
  for select to anon
  using (is_published = true);

create policy "anon_select_sections_of_published_initiatives" on initiative_sections
  for select to anon
  using (
    exists (select 1 from initiatives i where i.id = initiative_sections.initiative_id and i.is_published = true)
  );

create policy "anon_select_items_of_published_initiatives" on initiative_section_items
  for select to anon
  using (
    exists (
      select 1
      from initiative_sections s
      join initiatives i on i.id = s.initiative_id
      where s.id = initiative_section_items.section_id and i.is_published = true
    )
  );

create policy "anon_select_published_support_services" on support_services
  for select to anon
  using (is_published = true);

create policy "anon_select_offerings_of_published_services" on support_service_offerings
  for select to anon
  using (
    exists (
      select 1 from support_services s
      where s.id = support_service_offerings.service_id and s.is_published = true
    )
  );

-- crisis_resources: no publish flag — is_active is the equivalent gate,
-- named for what this table actually means (a number can be deactivated
-- without being a "draft").
create policy "anon_select_active_crisis_resources" on crisis_resources
  for select to anon
  using (is_active = true);

-- ── Grants ─────────────────────────────────────────────────────────────
-- Matches 20260913100002_lock_down_default_grants.sql's defense-in-depth:
-- these are brand new tables, so Supabase's platform-level default grants
-- (ALL to anon/authenticated on every new public-schema table) apply to
-- them too unless explicitly revoked here — RLS alone would otherwise be
-- the only layer, exactly the single point of failure that migration
-- already fixed for every table that existed before it.

revoke all on table
  courses,
  course_modules,
  course_lessons,
  initiatives,
  initiative_sections,
  initiative_section_items,
  support_services,
  support_service_offerings,
  crisis_resources
from anon, authenticated;

grant select on table
  courses,
  course_modules,
  course_lessons,
  initiatives,
  initiative_sections,
  initiative_section_items,
  support_services,
  support_service_offerings,
  crisis_resources
to anon, authenticated;

-- ── leads.interest_type: four new values ──────────────────────────────────
-- Postgres auto-names an inline `check (...)` constraint
-- `<table>_<column>_check` when no name is given — same rename-by-drop
-- pattern as 20260913100006_expand_lead_status_options.sql. Purely
-- additive (no existing value retired), so no data backfill needed first.

alter table leads
  drop constraint leads_interest_type_check;

alter table leads
  add constraint leads_interest_type_check
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
      'general_inquiry'
    )
  );

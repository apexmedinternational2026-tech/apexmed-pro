-- New "FCPS Trainee Research & Publication Support" program (user-supplied
-- content) — surfaced as a 5th item under the Research service's "What's
-- included" grid (see the service_items insert below), reusing the exact
-- module/audience/journey rendering every other program-linked service
-- item already gets (app/(public)/services/[slug]/[itemSlug]/page.tsx).
--
-- Deliberately NOT added to the 'research' program_families row: that
-- family feeds getPublishedPrograms()'s "Seven Cards" grid
-- (app/(public)/programs/page.tsx, whose H1 literally says "Seven Cards")
-- and the homepage's programCount stat — adding an 8th program there would
-- silently make both wrong. A new family, excluded from that grid by the
-- same DEFAULT_EXCLUDED_FAMILY_SLUGS mechanism the international-licensing
-- family already uses (lib/supabase/queries/programs.ts), keeps this
-- program fully published and fully rendered on its own service-item page
-- without leaking into the Cards grid it was never meant to join.

insert into program_families (slug, name, tagline, accent_token, sort_order) values
  ('service-programs', 'Service-Linked Programs', 'Programs surfaced through their own Service page rather than the Membership Cards grid.', 'navy-gold', 10);

insert into programs (family_id, slug, name, headline, summary, duration_label, accent_token, disclaimer_key, is_published, sort_order)
select
  (select id from program_families where slug = 'service-programs'),
  'fcps-research-publication',
  'FCPS Trainee Research & Publication Support',
  'One-Month Complete Research Support Program',
  'Structured research and publication support for FCPS trainees and postgraduate doctors — moving from your research idea and study planning through to a complete manuscript and journal submission.',
  '1 month', 'navy-gold', 'publication', true, 1;

with p as (select id from programs where slug = 'fcps-research-publication'),
mod1 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'Research Idea & Question', 'Turning a topic into a workable, feasible research question.', 1 from p returning id
),
mod2 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'Study Design & Methodology', 'Choosing and planning the right study design for your question.', 2 from p returning id
),
mod3 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'Data Collection', 'Planning and organizing how your data is collected and managed.', 3 from p returning id
),
mod4 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'Data Analysis', 'Statistical analysis planning and SPSS support, from descriptive statistics to interpretation.', 4 from p returning id
),
mod5 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'Manuscript Writing', 'Section-by-section guidance through a complete, submission-ready manuscript.', 5 from p returning id
),
mod6 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'Journal Selection', 'Finding the right journal for your topic, scope, and requirements.', 6 from p returning id
),
mod7 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'Submission Support', 'Formatting, cover letters, and the online submission process itself.', 7 from p returning id
),
mod8 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'Revision & Reviewer Response', 'Understanding reviewer feedback and preparing a strong resubmission.', 8 from p returning id
),
mod9 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'Specialties Supported', 'Research support is available across a wide range of clinical specialties.', 9 from p returning id
)
insert into program_module_items (module_id, label, sort_order)
select mod1.id, item, ord from mod1, unnest(array[
  'Research topic selection',
  'Research question development',
  'Feasibility assessment',
  'Study objectives'
]) with ordinality as t(item, ord)
union all
select mod2.id, item, ord from mod2, unnest(array[
  'Choosing the appropriate study design',
  'Research methodology',
  'Protocol development',
  'Inclusion and exclusion criteria',
  'Variables and outcome planning',
  'Sample-size concepts'
]) with ordinality as t(item, ord)
union all
select mod3.id, item, ord from mod3, unnest(array[
  'Data collection planning',
  'Data collection forms',
  'Variable organization',
  'Data management guidance'
]) with ordinality as t(item, ord)
union all
select mod4.id, item, ord from mod4, unnest(array[
  'Statistical analysis planning',
  'SPSS training and support',
  'Descriptive statistics',
  'Appropriate statistical tests',
  'Tables and figures',
  'Interpretation of results'
]) with ordinality as t(item, ord)
union all
select mod5.id, item, ord from mod5, unnest(array[
  'Introduction',
  'Literature review',
  'Methods',
  'Results',
  'Discussion',
  'Conclusion',
  'Abstract',
  'References',
  'Scientific writing and formatting'
]) with ordinality as t(item, ord)
union all
select mod6.id, item, ord from mod6, unnest(array[
  'Identifying suitable journals',
  'Journal scope and requirements',
  'PubMed-indexed journal guidance',
  'Journal selection according to the research topic'
]) with ordinality as t(item, ord)
union all
select mod7.id, item, ord from mod7, unnest(array[
  'Manuscript formatting',
  'Online submission guidance',
  'Cover letter guidance',
  'Submission process'
]) with ordinality as t(item, ord)
union all
select mod8.id, item, ord from mod8, unnest(array[
  'Understanding reviewer comments',
  'Manuscript revision guidance',
  'Response-to-reviewers guidance',
  'Resubmission support'
]) with ordinality as t(item, ord)
union all
select mod9.id, item, ord from mod9, unnest(array[
  'Medicine', 'Surgery', 'Pediatrics', 'Cardiology', 'Neurology', 'Psychiatry', 'Radiology', 'Dermatology',
  'Obstetrics & Gynecology', 'Orthopedics', 'ENT', 'Ophthalmology', 'Dentistry', 'Public Health',
  'Allied Health', 'Other Healthcare Specialties'
]) with ordinality as t(item, ord);

insert into program_audiences (program_id, label, sort_order)
select p.id, a.label, a.ord
from programs p, unnest(array[
  'FCPS trainees',
  'Postgraduate medical trainees',
  'Medical residents',
  'PMDC-registered doctors',
  'Consultants and senior doctors',
  'Medical students working on research projects',
  'Healthcare professionals'
]) with ordinality as a(label, ord)
where p.slug = 'fcps-research-publication';

insert into program_journey_steps (program_id, step_label, description, sort_order)
select p.id, s.label, s.description, s.ord
from programs p, unnest(
  array['Research Idea', 'Protocol & Study Planning', 'Data Collection', 'Data Analysis', 'Manuscript Preparation', 'Journal Selection', 'Submission', 'Revision & Reviewer Response', 'Publication Process'],
  array[
    'Selecting and refining a feasible research topic and question.',
    'Study design, methodology, and protocol development.',
    'Collecting data using a planned, organized process.',
    'Statistical analysis and interpretation of results.',
    'Writing a complete, submission-ready manuscript.',
    'Identifying the right journal for your research.',
    'Formatting and submitting your manuscript.',
    'Responding to reviewer feedback and resubmitting.',
    'Final publication, subject to journal and editorial decisions.'
  ]
) with ordinality as s(label, description, ord)
where p.slug = 'fcps-research-publication';

insert into service_items (service_id, slug, name, summary, program_id, is_published, sort_order)
select s.id, 'fcps-research-publication', 'FCPS Trainee Research & Publication Support', p.summary, p.id, true, 5
from services s, programs p
where s.slug = 'research' and p.slug = 'fcps-research-publication';

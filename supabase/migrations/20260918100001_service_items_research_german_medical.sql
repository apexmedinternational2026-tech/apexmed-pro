-- Sub-items for the first two services (PART 7 of the brief: "Start with
-- Research and German Medical — get those two right, then the rest follow
-- the same template").

-- ── Research Services ──────────────────────────────────────────────────
-- Three of four link to already-published Cards (program_id) — no content
-- duplicated, per the brief's own design principle. The fourth ("LTE &
-- Others" in the brief, renamed per Q5's own suggestion — it's clearer)
-- has no existing program to link, so it stands alone with just a summary.

insert into service_items (service_id, slug, name, summary, program_id, is_published, sort_order)
select s.id, 'original-research', 'Original Research Training', p.summary, p.id, true, 1
from services s, programs p
where s.slug = 'research' and p.slug = 'apexmed-research-card';

insert into service_items (service_id, slug, name, summary, program_id, is_published, sort_order)
select s.id, 'meta-analysis', 'Meta-Analysis', p.summary, p.id, true, 2
from services s, programs p
where s.slug = 'research' and p.slug = 'master-meta-analysis-card';

insert into service_items (service_id, slug, name, summary, program_id, is_published, sort_order)
select s.id, 'cdc-wonder', 'CDC WONDER', p.summary, p.id, true, 3
from services s, programs p
where s.slug = 'research' and p.slug = 'cdc-specialist-card';

insert into service_items (service_id, slug, name, summary, is_published, sort_order)
select s.id, 'writing-and-publication', 'Medical Writing & Publication',
  'Letters to the Editor, narrative reviews, case reports, clinical audits, synopsis writing (CPSP/FCPS), and general medical writing mentorship.',
  true, 4
from services s
where s.slug = 'research';

-- ── German Medical Pathway ────────────────────────────────────────────────
-- Real, already-built content for Overview/FSP/KP/Approbation lives at
-- dedicated static routes (/germany, /germany/fsp, /germany/kp,
-- /germany/approbation) rather than in the programs table — external_href
-- links straight out to it instead of duplicating it into program_module
-- rows. "Language" (German A1→B2) has no existing page anywhere in the
-- app yet — left unpublished rather than linking to something that
-- doesn't exist or rushing placeholder content; needs its own page built.

insert into service_items (service_id, slug, name, summary, external_href, is_published, sort_order)
select s.id, 'overview', 'Overview', 'The full German medical licensing pathway — from language through Approbation.', '/germany', true, 1
from services s where s.slug = 'german-medical';

insert into service_items (service_id, slug, name, summary, is_published, sort_order)
select s.id, 'language', 'German Language (A1 → B2)', 'Structured German language training from A1 through B2.', false, 2
from services s where s.slug = 'german-medical';

insert into service_items (service_id, slug, name, summary, external_href, is_published, sort_order)
select s.id, 'fsp', 'FSP', 'Fachsprachprüfung (medical German language exam) preparation.', '/germany/fsp', true, 3
from services s where s.slug = 'german-medical';

insert into service_items (service_id, slug, name, summary, external_href, is_published, sort_order)
select s.id, 'kp', 'KP', 'Kenntnisprüfung (medical knowledge exam) preparation.', '/germany/kp', true, 4
from services s where s.slug = 'german-medical';

insert into service_items (service_id, slug, name, summary, external_href, is_published, sort_order)
select s.id, 'approbation', 'Approbation', 'Guidance through the full Approbation (medical licensing) pathway.', '/germany/approbation', true, 5
from services s where s.slug = 'german-medical';

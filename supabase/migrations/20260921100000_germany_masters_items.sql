-- Germany Master's Pathway had zero sub-items — its hero rendered with
-- nothing else below it. Unlike USMLE/PLAB/MRCP/AMC, no program shares its
-- exact slug, so it gets real service_items instead: one linking to the
-- existing Master Card (program_id, same "link, don't duplicate" pattern
-- as Research Services), two linking out to the real, already-built
-- /masters pages (external_href, same pattern as German Medical's
-- Overview/FSP/KP/Approbation).

insert into service_items (service_id, slug, name, summary, program_id, is_published, sort_order)
select s.id, 'master-card', p.name, p.summary, p.id, true, 1
from services s, programs p
where s.slug = 'germany-masters' and p.slug = 'master-card';

insert into service_items (service_id, slug, name, summary, external_href, is_published, sort_order)
select s.id, 'fields-of-study', 'Fields of Study', 'Field categories for a German Master''s degree, with entry requirements, language requirements, and career outlook.', '/masters/fields', true, 2
from services s where s.slug = 'germany-masters';

insert into service_items (service_id, slug, name, summary, external_href, is_published, sort_order)
select s.id, 'application-process', 'Application Process', 'Why Germany, and the full Master''s admissions process — profile assessment, university selection, and application preparation.', '/masters', true, 3
from services s where s.slug = 'germany-masters';

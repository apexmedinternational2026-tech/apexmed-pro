-- Green Earth Initiative — as supplied, with PART 0.3's correction applied
-- while seeding: the impact-metrics numbers (10,000+ trees, 500+ doctors,
-- etc.) are not seeded at all, since they're one of the still-open client
-- questions ("can these be evidenced?"). No metrics section exists here to
-- render — the page simply doesn't have one yet, rather than showing a
-- hidden/null-guarded block for numbers nobody has confirmed. Same
-- reasoning for donations: no payment route exists, so no donate CTA is
-- seeded either — the "no one is turned away for lack of funds" line is
-- kept as plain supportive copy, not attached to a button that goes
-- nowhere real yet.
--
-- initiatives.slug matches its parent service's slug ('green-earth'),
-- same convention as the AI course — see 20260919100001's comment.

insert into initiatives (slug, name, mission, vision, tagline, description, accent_token, is_published) values (
  'green-earth',
  'Green Earth Initiative',
  'Empower healthcare professionals to lead climate action while building a healthier planet.',
  'A world where doctors are leaders in climate change awareness and action.',
  'Doctors for Green Earth — Healing People, Healing Planet',
  'ApexMed''s commitment to addressing climate change and environmental sustainability. Healthcare professionals have unique power to understand the health impacts of climate change, lead in their communities, model sustainable practices, and advocate for environmental policy — we provide education, support, and action opportunities.',
  'green-earth',
  true
);

with i as (select id from initiatives where slug = 'green-earth'),
s1 as (
  insert into initiative_sections (initiative_id, title, description, icon_key, sort_order)
  select id, 'Why Doctors Should Care About Climate', null, 'leaf', 1 from i returning id
),
s2 as (
  insert into initiative_sections (initiative_id, title, description, icon_key, sort_order)
  select id, 'Free Climate Change & Health Webinars', 'Monthly webinars, second Sunday of the month — free and open to all, with expert speakers and recordings available afterward.', 'graduation-cap', 2 from i returning id
),
s3 as (
  insert into initiative_sections (initiative_id, title, description, icon_key, sort_order)
  select id, 'Tree Plantation Projects', 'Participate in organized tree planting, support reforestation, and join community environmental projects.', 'leaf', 3 from i returning id
),
s4 as (
  insert into initiative_sections (initiative_id, title, description, icon_key, sort_order)
  select id, 'Sustainable Healthcare Advocacy', 'Practical guidance on green practices in clinics and prescribing, and how to advocate for change at your own institution.', 'stethoscope', 4 from i returning id
),
s5 as (
  insert into initiative_sections (initiative_id, title, description, icon_key, sort_order)
  select id, 'Climate Health Education Materials', 'Infographics, presentation slides, articles, research summaries, and advocacy toolkits — downloadable and shareable.', 'clipboard-check', 5 from i returning id
),
s6 as (
  insert into initiative_sections (initiative_id, title, description, icon_key, sort_order)
  select id, 'Community Engagement Programs', 'Educational talks, community health clinics, environmental health assessments, and professional development for climate advocates.', 'heart-handshake', 6 from i returning id
),
s7 as (
  insert into initiative_sections (initiative_id, title, description, icon_key, sort_order)
  select id, 'Sustainability Guide', 'Practical steps for your clinic, your practice, and your advocacy.', 'microscope', 7 from i returning id
),
s8 as (
  insert into initiative_sections (initiative_id, title, description, icon_key, sort_order)
  select id, 'How to Get Involved', 'No one is turned away for lack of funds.', 'badge-check', 8 from i returning id
)
insert into initiative_section_items (section_id, label, sort_order)
select s1.id, label, ord from s1, unnest(array[
  'Health impact — climate change is a health crisis',
  'Patient care — affects patients'' health and survival',
  'Professional duty — healthcare providers have a responsibility',
  'Leadership — doctors can influence policy and behavior',
  'Legacy — building a sustainable future for the next generation',
  'Community — strengthens ties with communities',
  'Meaning — aligns work with values',
  'Prevention — addresses the root cause of disease'
]) with ordinality as t(label, ord)
union all
select s2.id, label, ord from s2, unnest(array[
  'How climate change affects human health',
  'Heat-related illness and mortality',
  'Vector-borne disease spread (dengue, malaria)',
  'Air pollution and respiratory disease',
  'Mental health impacts of climate change',
  'Nutritional impacts (food security)',
  'Water quality and safety',
  'Climate justice and health equity',
  'The doctor''s role in climate advocacy',
  'Sustainable healthcare practices'
]) with ordinality as t(label, ord)
union all
select s3.id, label, ord from s3, unnest(array[
  'Participate in organized tree planting events',
  'Support virtual tree planting (trees planted in your honor)',
  'Join environmental cleanup projects',
  'Participate in local sustainability initiatives'
]) with ordinality as t(label, ord)
union all
select s4.id, label, ord from s4, unnest(array[
  'Green hospital practices', 'Reducing medical waste', 'Sustainable prescribing',
  'Digital health (paperless)', 'Energy efficiency in clinics', 'Environmental justice in healthcare'
]) with ordinality as t(label, ord)
union all
select s5.id, label, ord from s5, unnest(array[
  'Infographics on climate health impacts', 'Shareable presentation slides',
  'Articles and fact sheets', 'Research summaries', 'Advocacy toolkits', 'Sustainable healthcare guides'
]) with ordinality as t(label, ord)
union all
select s6.id, label, ord from s6, unnest(array[
  'Educational talks for students', 'Community health clinics', 'Environmental health assessments',
  'Advocacy workshops', 'Networking with climate advocates', 'Leadership development'
]) with ordinality as t(label, ord)
union all
select s7.id, label, ord from s7, unnest(array[
  'For your clinic: reduce paper, improve energy efficiency, reduce waste, conserve water',
  'For your practice: prescribe generic when possible, reduce unnecessary tests, go digital',
  'For your advocacy: speak up about climate health, educate patients, engage policymakers'
]) with ordinality as t(label, ord)
union all
select s8.id, label, ord from s8, unnest(array[
  'Attend webinars — join monthly sessions, completely free',
  'Participate in tree planting — join organized events, track your impact',
  'Implement green practices — apply learnings at work, advocate at your institution',
  'Volunteer — help organize projects, mentor others, become a climate advocate'
]) with ordinality as t(label, ord);

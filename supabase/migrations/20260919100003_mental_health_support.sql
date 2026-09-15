-- Mental Health Support — PART 0.1 of the brief is the most safety-
-- critical section in the whole document, and every correction it
-- prescribes is applied here at seed time, not as a follow-up pass:
--
--   - "Crisis Support" does NOT exist as an offering below. A 24-hour
--     response is not crisis support, full stop — its content is replaced
--     entirely by crisis_resources (the real emergency block).
--   - "Confidentiality guaranteed" becomes "confidential within the
--     limits of professional and legal duty of care" — no counselling
--     service can make an absolute guarantee.
--   - The "50% of medical students..." statistic is not seeded anywhere:
--     no citation was supplied, and PART 0.1 is explicit that it needs
--     one or must be removed.
--   - "First session free consultation" is not seeded: PART 0.1 says only
--     seed it if the client confirms it's a standing offer.
--   - No testimonials are seeded — real names with mental-health
--     disclosures need written consent PART 0.1 confirms doesn't exist
--     yet. The component-level omission lives in the page itself.

insert into support_services (slug, name, summary, description, disclaimer_key, is_published) values (
  'mental-health',
  'Mental Health Support',
  'Non-urgent counselling and peer support for healthcare professionals.',
  'Medical students face pressure. Residents work long hours. Doctors deal with life-and-death decisions. Researchers face rejection. Your mental health matters — ApexMed offers confidential, non-urgent counselling and peer support designed for medical professionals and students.',
  'mental_health',
  true
);

insert into support_service_offerings (service_id, title, description, is_free, sort_order)
select s.id, o.title, o.description, o.is_free, o.ord
from support_services s,
  (values
    ('Free Mental Health Webinars', 'Monthly live sessions with expert psychiatrists on stress management, anxiety, depression, burnout, work-life balance, and imposter syndrome — recorded for on-demand access, no registration required.', true, 1),
    ('Individual Counselling', 'One-on-one sessions with trained counsellors, flexible scheduling, online. Confidential within the limits of professional and legal duty of care.', false, 2),
    ('Group Counselling', 'Small-group support (4-6 people) with shared experiences, peer support, and professional guidance in a safe space.', false, 3),
    ('Workshops & Skill-Building', 'Stress management techniques, mindfulness and meditation, time management for busy doctors, and building resilience.', false, 4)
  ) as o(title, description, is_free, ord)
where s.slug = 'mental-health';

-- crisis_resources: the real emergency block, PART 0.1's own prescribed
-- text. verified_on records when each number was last checked against a
-- real source — see this migration's own note in the accompanying
-- session report about how (web search against each org's official
-- materials, not a live test call). crisis_resources.verified_on exists
-- specifically to force periodic re-verification (PART 5's "no row
-- unverified in 6 months" admin requirement) — treat this date as a
-- floor, not a one-time check that's now done forever.
insert into crisis_resources (country, organisation, phone, hours, notes, verified_on, is_active, sort_order) values
  ('Pakistan', 'Umang Helpline', '0311 7786264', '24/7', 'Free mental health helpline, WHO-recognized.', current_date, true, 1),
  ('Pakistan', 'Rozan Counseling Helpline', '0304 1111741', null, 'Counselling for emotional health, self-harm, and violence-related concerns.', current_date, true, 2),
  ('Pakistan', 'Emergency (Rescue 1122)', '1122', '24/7', 'National emergency rescue service.', current_date, true, 3);

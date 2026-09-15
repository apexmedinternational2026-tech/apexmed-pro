-- Module/item/audience/journey-step content for the 4 International
-- Licensing pathways (USMLE/PLAB/MRCP/AMC) — see the new-sections build
-- brief's PART 2. Detailed items came from the brief itself only for
-- USMLE's Step 1 module; the rest are written conservatively from each
-- module's own description, in the same register as the rest of this
-- file's content — no outcome guarantees, no numeric claims (per PART 0's
-- corrections philosophy applied consistently, not just to the three
-- sections the brief flagged by name).
--
-- Programs stay is_published = false until this migration runs, at which
-- point the application-layer pages (PART 2's routes) are also expected to
-- exist — flip each program's is_published only once its page is verified
-- against this real content.

-- ── USMLE ──────────────────────────────────────────────────────────────
with p as (
  select id from programs where slug = 'usmle'
),
mod1 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id,
    'Step 1 Mentorship',
    'Foundation-building in basic and clinical sciences — covers Anatomy, Biochemistry, Microbiology, Immunology, Pharmacology, Pathology, Physiology, Behavioral Sciences, and Biostatistics & Epidemiology.',
    1
  from p returning id
),
mod2 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'Step 2 CK Mentorship', 'Applying clinical knowledge to patient-care decision-making across major specialties.', 2 from p returning id
),
mod3 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'Step 3 Mentorship', 'Advanced clinical decision-making, including Computer-based Case Simulations (CCS).', 3 from p returning id
),
mod4 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'Personalized Mentorship', 'One-to-one guidance tailored to your stage, schedule, and target exam date.', 4 from p returning id
),
mod5 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'Question-Bank Strategy', 'Learning from every question, not just the ones you get right.', 5 from p returning id
),
mod6 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'Study Resources Guidance', 'Orientation to the resources that actually match your learning stage.', 6 from p returning id
),
mod7 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'Performance & Practice Exam Guidance', 'Turning practice exam results into an actionable plan.', 7 from p returning id
)
insert into program_module_items (module_id, label, sort_order)
select mod1.id, item, ord from mod1, unnest(array[
  'Personalized study planning',
  'Exam structure and blueprint orientation',
  'Basic science concept building',
  'Clinical integration of foundational knowledge',
  'High-yield topic prioritization',
  'Question bank strategy',
  'Question-solving technique refinement',
  'Clinical reasoning development',
  'Review of incorrect questions',
  'Weak-area identification',
  'Revision planning',
  'Practice exam strategy',
  'Performance tracking',
  'Time management',
  'Exam-day preparation',
  'Regular one-on-one mentor guidance'
]) with ordinality as t(item, ord)
union all
select mod2.id, item, ord from mod2, unnest(array[
  'Personalized study planning',
  'Clinical vignette practice',
  'Diagnostic reasoning development',
  'Management and treatment decision-making',
  'Question bank strategy',
  'Weak-area identification',
  'Practice exam strategy',
  'Performance tracking',
  'Regular one-on-one mentor guidance'
]) with ordinality as t(item, ord)
union all
select mod3.id, item, ord from mod3, unnest(array[
  'Personalized study planning',
  'CCS case-management practice',
  'Multi-step clinical decision-making',
  'Independent patient-management scenarios',
  'Question bank strategy',
  'Practice exam strategy',
  'Performance tracking',
  'Regular one-on-one mentor guidance'
]) with ordinality as t(item, ord)
union all
select mod4.id, item, ord from mod4, unnest(array[
  'Initial profile and readiness assessment',
  'Individualized study plan',
  'Regular progress review sessions',
  'Adjustments based on practice performance',
  'Direct access to your mentor'
]) with ordinality as t(item, ord)
union all
select mod5.id, item, ord from mod5, unnest(array[
  'Structured question-bank scheduling',
  'Right-and-wrong-answer review technique',
  'Concept extraction from each question',
  'Tracking recurring weak areas',
  'Timed-block practice strategy'
]) with ordinality as t(item, ord)
union all
select mod6.id, item, ord from mod6, unnest(array[
  'Core resource selection guidance',
  'Resource sequencing by exam stage',
  'Balancing question banks and content review',
  'Avoiding resource overload'
]) with ordinality as t(item, ord)
union all
select mod7.id, item, ord from mod7, unnest(array[
  'Practice exam scheduling strategy',
  'Score-report interpretation',
  'Timing and pacing strategy',
  'Final-review planning',
  'Exam-day logistics guidance'
]) with ordinality as t(item, ord);

insert into program_audiences (program_id, label, sort_order)
select p.id, a.label, a.ord
from programs p, unnest(array[
  'Medical students preparing for Step 1',
  'Medical graduates preparing for Step 2 CK or Step 3',
  'IMGs pursuing US residency',
  'Doctors seeking structured, one-on-one exam mentorship'
]) with ordinality as a(label, ord)
where p.slug = 'usmle';

-- unnest() given multiple arrays zips them positionally (row 1 = both
-- arrays' first element, etc.) — simpler and less error-prone than joining
-- two separately-numbered ordinality sets on their ordinals.
insert into program_journey_steps (program_id, step_label, description, sort_order)
select p.id, s.label, s.description, s.ord
from programs p, unnest(
  array['Assess', 'Plan', 'Study', 'Practice', 'Review', 'Improve', 'Test', 'Exam'],
  array[
    'Baseline knowledge and readiness assessment.',
    'A personalized study plan built around your timeline.',
    'Structured content review with your mentor.',
    'Question-bank practice with guided review.',
    'Reviewing every incorrect question for the concept behind it.',
    'Targeted work on identified weak areas.',
    'Full-length practice exams under timed conditions.',
    'Exam-day preparation and final guidance.'
  ]
) with ordinality as s(label, description, ord)
where p.slug = 'usmle';

-- ── PLAB ───────────────────────────────────────────────────────────────
with p as (
  select id from programs where slug = 'plab'
),
mod1 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'PLAB 1 Preparation', 'Applied medical knowledge preparation for the PLAB 1 written exam.', 1 from p returning id
),
mod2 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'PLAB 2 Preparation', 'Station-based clinical and communication skills preparation.', 2 from p returning id
),
mod3 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'GMC Registration & NHS Career Guidance', 'Guidance through GMC registration and early NHS career steps.', 3 from p returning id
)
insert into program_module_items (module_id, label, sort_order)
select mod1.id, item, ord from mod1, unnest(array[
  'Personalized study planning',
  'Applied knowledge question practice',
  'UK clinical guideline orientation',
  'Weak-area identification',
  'Practice exam strategy',
  'Regular one-on-one mentor guidance'
]) with ordinality as t(item, ord)
union all
select mod2.id, item, ord from mod2, unnest(array[
  'Consultation and communication skills practice',
  'Clinical examination technique',
  'Role-play station practice',
  'Structured feedback on mock stations',
  'Time management within stations',
  'Regular one-on-one mentor guidance'
]) with ordinality as t(item, ord)
union all
select mod3.id, item, ord from mod3, unnest(array[
  'GMC registration document guidance',
  'English language requirement orientation',
  'NHS job application guidance',
  'Interview preparation',
  'Early NHS career orientation'
]) with ordinality as t(item, ord);

insert into program_audiences (program_id, label, sort_order)
select p.id, a.label, a.ord
from programs p, unnest(array[
  'Medical graduates pursuing UK registration',
  'Doctors preparing for PLAB 1 or PLAB 2',
  'IMGs planning an NHS career',
  'Doctors who want structured, station-based practice'
]) with ordinality as a(label, ord)
where p.slug = 'plab';

insert into program_journey_steps (program_id, step_label, sort_order)
select p.id, s.label, s.ord
from programs p, unnest(array[
  'Assess', 'Plan', 'PLAB 1 Prep', 'Practise', 'PLAB 1', 'PLAB 2 Prep', 'Mocks', 'PLAB 2', 'GMC', 'NHS Career'
]) with ordinality as s(label, ord)
where p.slug = 'plab';

-- ── MRCP ───────────────────────────────────────────────────────────────
with p as (
  select id from programs where slug = 'mrcp'
),
mod1 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'MRCP Part 1 Preparation', 'Preparation for the Part 1 written exam.', 1 from p returning id
),
mod2 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'MRCP Part 2 Written Preparation', 'Preparation for the Part 2 Written clinical-scenario exam.', 2 from p returning id
),
mod3 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'PACES Preparation', 'Clinical examination skills preparation for PACES.', 3 from p returning id
),
mod4 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'UK Career Guidance', 'Guidance on postgraduate training and career progression in the UK.', 4 from p returning id
)
insert into program_module_items (module_id, label, sort_order)
select mod1.id, item, ord from mod1, unnest(array[
  'Personalized study planning',
  'Question bank strategy',
  'Weak-area identification',
  'Practice exam strategy',
  'Regular one-on-one mentor guidance'
]) with ordinality as t(item, ord)
union all
select mod2.id, item, ord from mod2, unnest(array[
  'Clinical scenario practice',
  'Diagnostic and management reasoning',
  'Question bank strategy',
  'Weak-area identification',
  'Regular one-on-one mentor guidance'
]) with ordinality as t(item, ord)
union all
select mod3.id, item, ord from mod3, unnest(array[
  'Clinical examination technique practice',
  'Communication skills practice',
  'Mock PACES station practice',
  'Structured feedback sessions',
  'Time management within stations'
]) with ordinality as t(item, ord)
union all
select mod4.id, item, ord from mod4, unnest(array[
  'Specialty training application guidance',
  'CV and portfolio guidance',
  'Interview preparation',
  'Career pathway orientation'
]) with ordinality as t(item, ord);

insert into program_audiences (program_id, label, sort_order)
select p.id, a.label, a.ord
from programs p, unnest(array[
  'Postgraduate doctors preparing for MRCP',
  'Doctors pursuing UK specialty training',
  'Doctors preparing for PACES',
  'Doctors planning a long-term UK career'
]) with ordinality as a(label, ord)
where p.slug = 'mrcp';

insert into program_journey_steps (program_id, step_label, sort_order)
select p.id, s.label, s.ord
from programs p, unnest(array[
  'Preparation', 'Examination', 'Postgraduate Development', 'UK Career'
]) with ordinality as s(label, ord)
where p.slug = 'mrcp';

-- ── AMC ────────────────────────────────────────────────────────────────
with p as (
  select id from programs where slug = 'amc'
),
mod1 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'AMC CAT MCQ Preparation', 'Preparation for the computer-adaptive multiple-choice exam.', 1 from p returning id
),
mod2 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'Clinical/Practical Preparation', 'Preparation for the clinical/practical examination.', 2 from p returning id
),
mod3 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'Australian Registration Guidance', 'Guidance through AHPRA registration requirements.', 3 from p returning id
),
mod4 as (
  insert into program_modules (program_id, title, description, sort_order)
  select id, 'Australian Career Guidance', 'Guidance on early career steps in the Australian health system.', 4 from p returning id
)
insert into program_module_items (module_id, label, sort_order)
select mod1.id, item, ord from mod1, unnest(array[
  'Personalized study planning',
  'Question bank strategy',
  'Weak-area identification',
  'Practice exam strategy',
  'Regular one-on-one mentor guidance'
]) with ordinality as t(item, ord)
union all
select mod2.id, item, ord from mod2, unnest(array[
  'Clinical examination technique practice',
  'Communication skills practice',
  'Mock station practice',
  'Structured feedback sessions',
  'Time management within stations'
]) with ordinality as t(item, ord)
union all
select mod3.id, item, ord from mod3, unnest(array[
  'AHPRA registration document guidance',
  'English language requirement orientation',
  'Registration pathway orientation'
]) with ordinality as t(item, ord)
union all
select mod4.id, item, ord from mod4, unnest(array[
  'Job application guidance',
  'Interview preparation',
  'Early career orientation in the Australian system'
]) with ordinality as t(item, ord);

insert into program_audiences (program_id, label, sort_order)
select p.id, a.label, a.ord
from programs p, unnest(array[
  'IMGs pursuing Australian registration',
  'Doctors preparing for the AMC CAT MCQ',
  'Doctors preparing for the clinical/practical exam',
  'Doctors planning a career in Australia'
]) with ordinality as a(label, ord)
where p.slug = 'amc';

insert into program_journey_steps (program_id, step_label, sort_order)
select p.id, s.label, s.ord
from programs p, unnest(array[
  'Prepare', 'Examine', 'Register', 'Apply', 'Build Your Career'
]) with ordinality as s(label, ord)
where p.slug = 'amc';

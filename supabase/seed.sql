-- Seed data for local development and preview environments.
-- Safe to run repeatedly against a fresh `supabase db reset`.

-- ── Compliance disclaimers ───────────────────────────────────────────────
-- Exact legal wording — do not paraphrase when editing.

insert into compliance_disclaimers (key, body) values
  ('publication',
   'Publication opportunities are subject to project availability, genuine scholarly contribution, journal requirements, peer review, and editorial decisions. Authorship is based on genuine scholarly contribution and applicable authorship standards. Journal indexing status should be verified at the time of submission.'),
  ('germany_licensing',
   'Licensing, Approbation, employment, residency, visa and other official decisions are subject to the requirements and decisions of the relevant authorities and institutions. Requirements vary by federal state, qualification and current regulations. ApexMed International provides guidance and mentorship and does not guarantee any official outcome.'),
  ('admissions',
   'Eligibility, deadlines, fees, language requirements and program availability are determined by each university and are subject to change. Applicants should verify current official requirements before making any financial commitment.'),
  ('exam_licensing',
   'ApexMed International provides educational mentorship, examination preparation and pathway guidance. We do not guarantee examination results, professional registration, residency placement, employment, visa approval or licensure. Final decisions are made by the relevant examination bodies, regulators, universities, employers and government authorities. Exam formats, eligibility criteria, registration requirements and immigration rules can change and vary by individual circumstances.'),
  ('mental_health',
   'ApexMed''s counselling service provides non-urgent support for healthcare professionals and students. It is not an emergency or crisis service. Sessions are confidential within the limits of professional and legal duty of care. If you are in immediate danger, contact emergency services.'),
  ('education_only',
   'This course provides educational content only. It does not constitute clinical guidance and should not be used as the basis for patient care decisions. AI tool capabilities, pricing and availability change frequently.');

-- ── Program families ─────────────────────────────────────────────────────

insert into program_families (slug, name, tagline, accent_token, sort_order) values
  ('research', 'Research & Publication Family', 'Learn research methodology, run real projects, and prepare manuscripts for publication — from your first study design to journal submission.', 'navy-gold', 1),
  ('german-dream', 'German Dream Family', 'German language from A1, medical German, FSP and KP preparation, Approbation guidance, and Master''s admissions support.', 'multi', 2),
  ('international-licensing', 'International Licensing & Exams', 'USMLE · PLAB · MRCP · AMC', 'deep-red', 5);

-- ── Programs ──────────────────────────────────────────────────────────────

insert into programs (family_id, slug, name, headline, summary, duration_label, accent_token, disclaimer_key, is_published, sort_order) values
  (
    (select id from program_families where slug = 'research'),
    'apexmed-research-card',
    'ApexMed Research Card',
    'One Card. One Year. Complete Research Support.',
    'A full annual research mentorship package guiding you from topic selection to a submission-ready manuscript, with dedicated one-on-one mentorship throughout.',
    '12 months', 'navy-gold', 'publication', true, 1
  ),
  (
    (select id from program_families where slug = 'research'),
    'master-meta-analysis-card',
    'Master Meta-Analysis Card',
    'Master Meta-Analysis, Systematic Review, and R.',
    'An intensive track focused on systematic review methodology, meta-analysis, and statistical programming in R for evidence synthesis.',
    '6 months', 'navy-gold', 'publication', true, 2
  ),
  (
    (select id from program_families where slug = 'research'),
    'cdc-specialist-card',
    'CDC Specialist Card',
    'CDC WONDER Research and Publication.',
    'A focused pathway for conducting original research using the CDC WONDER public health database, from query design to publication.',
    '4 months', 'navy-gold', 'publication', true, 3
  ),
  (
    (select id from program_families where slug = 'german-dream'),
    'blue-card',
    'Blue Card',
    'German A1 to B1 Plus Research Training.',
    'A combined language and research pathway taking you from German A1 through B1 while building your first research project.',
    '8 months', 'sky-blue', 'germany_licensing', true, 1
  ),
  (
    (select id from program_families where slug = 'german-dream'),
    'green-card',
    'Green Card',
    'German A1 to B2, Your Pathway to Germany, and Publication.',
    'A comprehensive track combining German language training up to B2, structured guidance on the Germany relocation pathway, and a publication-focused research component.',
    '10 months', 'deep-green', 'germany_licensing', true, 2
  ),
  (
    (select id from program_families where slug = 'german-dream'),
    'gold-card',
    'Gold Card',
    'German A1 to B2, Medical German, FSP, KP, and Approbation Support.',
    'The most comprehensive Card: full German language progression, Fachsprachprüfung (FSP) and Kenntnisprüfung (KP) preparation, Approbation pathway guidance, and research training.',
    '12 months', 'amber-black', 'germany_licensing', true, 3
  ),
  (
    (select id from program_families where slug = 'german-dream'),
    'master-card',
    'Master Card',
    'German A1 to B1, Research Training, and Master''s Admission Support.',
    'A dedicated pathway for medical students and graduates pursuing a German Master''s degree, combining language training, research experience, and admissions guidance.',
    '9 months', 'violet', 'admissions', true, 4
  );

-- International Licensing pathways: reuse the existing programs/[slug]
-- template, rendered via their own dedicated /international-exams route
-- (PART 2 of the new-sections build brief) with full module/journey-step
-- content seeded below, so published from the start here.
-- Short slugs (not the more descriptive "usmle-mentorship" etc.) to match
-- their dedicated route: /international-exams/usmle, not
-- /programs/usmle-mentorship. canonical_path points there explicitly even
-- though these remain reachable at /programs/<slug> too (same generic
-- programs/[slug] template, reused rather than duplicated).
insert into programs (family_id, slug, name, headline, summary, accent_token, disclaimer_key, is_published, sort_order, canonical_path) values
  (
    (select id from program_families where slug = 'international-licensing'),
    'usmle',
    'USMLE Mentorship Program',
    'Structured mentorship through Step 1, Step 2 CK and Step 3',
    'One-to-one mentorship through the USMLE sequence — study planning, question-bank strategy, and exam-day preparation with a mentor who has been through the process.',
    'deep-red', 'exam_licensing', true, 1, '/international-exams/usmle'
  ),
  (
    (select id from program_families where slug = 'international-licensing'),
    'plab',
    'PLAB Mentorship Program',
    'PLAB 1, PLAB 2, and GMC registration guidance',
    'Mentorship through PLAB 1 and the station-based PLAB 2, with GMC registration and NHS career guidance for the UK pathway.',
    'deep-red', 'exam_licensing', true, 2, '/international-exams/plab'
  ),
  (
    (select id from program_families where slug = 'international-licensing'),
    'mrcp',
    'MRCP Mentorship Program',
    'Part 1, Part 2 Written, and PACES preparation',
    'Mentorship through the MRCP sequence — Part 1, Part 2 Written, and PACES — with UK career guidance for postgraduate doctors.',
    'deep-red', 'exam_licensing', true, 3, '/international-exams/mrcp'
  ),
  (
    (select id from program_families where slug = 'international-licensing'),
    'amc',
    'AMC Mentorship Program',
    'CAT MCQ, clinical/practical prep, and AHPRA registration',
    'Mentorship through the AMC CAT MCQ and clinical/practical exams, with Australian registration and career guidance for IMGs.',
    'deep-red', 'exam_licensing', true, 4, '/international-exams/amc'
  );

-- ── International Licensing: modules + items + audiences + journey steps ──
-- Detailed items came from the new-sections build brief itself only for
-- USMLE's Step 1 module; the rest are written conservatively from each
-- module's own description, in the same register as the rest of this
-- file's content — no outcome guarantees, no numeric claims.

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

-- ── Modules + checklist items ─────────────────────────────────────────────
-- Each block inserts a program's modules, then fans each module's items out
-- via unnest(...) with ordinality so sort_order matches array position.

-- 1. ApexMed Research Card
with p as (
  select id from programs where slug = 'apexmed-research-card'
),
mod1 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'Research Foundations', 'compass', 1 from p returning id
),
mod2 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'Study Design & Data', 'flask', 2 from p returning id
),
mod3 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'Manuscript Writing', 'pen', 3 from p returning id
),
mod4 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'Submission & Mentorship', 'send', 4 from p returning id
)
insert into program_module_items (module_id, label, sort_order)
select mod1.id, item, ord from mod1, unnest(array[
  'Research Methodology Orientation',
  'Choosing a Feasible Topic',
  'Literature Search Strategy',
  'Reference Management Setup (Zotero/Mendeley)',
  'Research Ethics & Plagiarism Awareness'
]) with ordinality as t(item, ord)
union all
select mod2.id, item, ord from mod2, unnest(array[
  'Study Design Selection',
  'Data Collection Planning',
  'Sample Size Considerations',
  'Data Entry & Cleaning',
  'Basic Statistical Analysis',
  'Data Visualization Basics'
]) with ordinality as t(item, ord)
union all
select mod3.id, item, ord from mod3, unnest(array[
  'IMRaD Structure Workshop',
  'Abstract Writing Practice',
  'Results Section Drafting',
  'Discussion & Limitations Writing',
  'Reference Formatting (Vancouver/APA)',
  'Plagiarism Check & Revision'
]) with ordinality as t(item, ord)
union all
select mod4.id, item, ord from mod4, unnest(array[
  'Journal Selection Guidance',
  'Cover Letter Drafting',
  'Submission Portal Walkthrough',
  'Responding to Reviewer Comments',
  'One-on-One Mentor Check-ins'
]) with ordinality as t(item, ord);

insert into program_audiences (program_id, label, sort_order)
select p.id, a.label, a.ord
from programs p, unnest(array[
  'Medical students seeking their first publication',
  'Doctors building an academic CV',
  'Residents preparing for fellowship applications',
  'Graduates targeting international residency matching'
]) with ordinality as a(label, ord)
where p.slug = 'apexmed-research-card';

insert into program_journey_steps (program_id, step_label, sort_order)
select p.id, s.label, s.ord
from programs p, unnest(array[
  'Enrollment & Orientation',
  'Topic & Mentor Matching',
  'Structured Research Training',
  'Manuscript Drafting',
  'Submission Support',
  'Ongoing Mentorship Check-ins'
]) with ordinality as s(label, ord)
where p.slug = 'apexmed-research-card';

-- 2. Master Meta-Analysis Card
with p as (
  select id from programs where slug = 'master-meta-analysis-card'
),
mod1 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'Systematic Review Fundamentals', 'search', 1 from p returning id
),
mod2 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'Meta-Analysis Methodology', 'bar-chart', 2 from p returning id
),
mod3 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'R Programming for Evidence Synthesis', 'terminal', 3 from p returning id
),
mod4 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'Manuscript & Publication Support', 'send', 4 from p returning id
)
insert into program_module_items (module_id, label, sort_order)
select mod1.id, item, ord from mod1, unnest(array[
  'PRISMA Guidelines Overview',
  'PICO Framework Practice',
  'Database Search Strategy (PubMed, Embase, Cochrane)',
  'Study Screening & Selection',
  'Risk of Bias Assessment'
]) with ordinality as t(item, ord)
union all
select mod2.id, item, ord from mod2, unnest(array[
  'Effect Size Calculation',
  'Fixed vs Random Effects Models',
  'Heterogeneity Assessment (I², Q-statistic)',
  'Forest Plot Interpretation',
  'Publication Bias Assessment (Funnel Plot, Egger''s Test)',
  'Subgroup & Sensitivity Analysis'
]) with ordinality as t(item, ord)
union all
select mod3.id, item, ord from mod3, unnest(array[
  'R & RStudio Setup',
  'Introduction to the metafor Package',
  'Importing & Cleaning Extracted Data',
  'Running a Meta-Analysis in R',
  'Generating Forest & Funnel Plots in R',
  'Exporting Publication-Ready Outputs'
]) with ordinality as t(item, ord)
union all
select mod4.id, item, ord from mod4, unnest(array[
  'PRISMA Flow Diagram Preparation',
  'Writing the Methods Section',
  'Reporting Results per PRISMA Checklist',
  'Target Journal Shortlisting',
  'Mentor-Guided Revisions'
]) with ordinality as t(item, ord);

insert into program_audiences (program_id, label, sort_order)
select p.id, a.label, a.ord
from programs p, unnest(array[
  'Doctors and students pursuing evidence-based research',
  'Residents needing a meta-analysis for CV building',
  'Researchers wanting R programming skills',
  'Academics preparing systematic reviews for publication'
]) with ordinality as a(label, ord)
where p.slug = 'master-meta-analysis-card';

insert into program_journey_steps (program_id, step_label, sort_order)
select p.id, s.label, s.ord
from programs p, unnest(array[
  'Foundations of Systematic Review',
  'Protocol Registration Guidance',
  'Data Extraction & Analysis Training',
  'R-Based Statistical Modelling',
  'Manuscript Development',
  'Submission & Mentor Review'
]) with ordinality as s(label, ord)
where p.slug = 'master-meta-analysis-card';

-- 3. CDC Specialist Card
with p as (
  select id from programs where slug = 'cdc-specialist-card'
),
mod1 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'CDC WONDER Foundations', 'database', 1 from p returning id
),
mod2 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'Data Extraction & Analysis', 'bar-chart', 2 from p returning id
),
mod3 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'Research Design & Interpretation', 'lightbulb', 3 from p returning id
),
mod4 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'Manuscript & Submission', 'send', 4 from p returning id
)
insert into program_module_items (module_id, label, sort_order)
select mod1.id, item, ord from mod1, unnest(array[
  'Introduction to CDC WONDER Databases',
  'Understanding Mortality & Morbidity Datasets',
  'Query Design Basics',
  'Data Suppression Rules Awareness',
  'Ethical Use of Public Health Data'
]) with ordinality as t(item, ord)
union all
select mod2.id, item, ord from mod2, unnest(array[
  'Advanced Query Building',
  'Exporting & Structuring Extracted Data',
  'Trend Analysis Techniques',
  'Age-Adjusted Rate Calculations',
  'Statistical Software Setup (R/Excel)',
  'Basic Epidemiological Analysis'
]) with ordinality as t(item, ord)
union all
select mod3.id, item, ord from mod3, unnest(array[
  'Formulating a Research Question from Public Data',
  'Descriptive vs Analytical Study Design',
  'Interpreting Population-Level Trends',
  'Data Visualization for Public Health Findings',
  'Limitations of Secondary Data Research'
]) with ordinality as t(item, ord)
union all
select mod4.id, item, ord from mod4, unnest(array[
  'Manuscript Structuring for Database Studies',
  'Target Journal Identification',
  'Cover Letter & Submission Preparation',
  'Mentor-Guided Revisions',
  'Responding to Reviewer Feedback'
]) with ordinality as t(item, ord);

insert into program_audiences (program_id, label, sort_order)
select p.id, a.label, a.ord
from programs p, unnest(array[
  'Doctors interested in public health research',
  'Medical students seeking a database-driven publication',
  'Residents targeting US residency applications',
  'Researchers exploring epidemiological trends'
]) with ordinality as a(label, ord)
where p.slug = 'cdc-specialist-card';

insert into program_journey_steps (program_id, step_label, sort_order)
select p.id, s.label, s.ord
from programs p, unnest(array[
  'CDC WONDER Orientation',
  'Query & Extraction Training',
  'Guided Data Analysis',
  'Manuscript Drafting',
  'Submission Support',
  'Publication Mentorship'
]) with ordinality as s(label, ord)
where p.slug = 'cdc-specialist-card';

-- 4. Blue Card
with p as (
  select id from programs where slug = 'blue-card'
),
mod1 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'German A1 Foundations', 'flag-de', 1 from p returning id
),
mod2 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'German A2 Development', 'flag-de', 2 from p returning id
),
mod3 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'German B1 Consolidation', 'flag-de', 3 from p returning id
),
mod4 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'Research Training Track', 'flask', 4 from p returning id
)
insert into program_module_items (module_id, label, sort_order)
select mod1.id, item, ord from mod1, unnest(array[
  'Alphabet & Pronunciation',
  'Basic Greetings & Introductions',
  'Numbers, Dates & Time',
  'Everyday Vocabulary',
  'Simple Sentence Structure',
  'A1 Mock Exam Practice'
]) with ordinality as t(item, ord)
union all
select mod2.id, item, ord from mod2, unnest(array[
  'Past Tense (Perfekt) Introduction',
  'Expanded Vocabulary for Daily Life',
  'Modal Verbs Practice',
  'Listening Comprehension Exercises',
  'Simple Written Communication',
  'A2 Mock Exam Practice'
]) with ordinality as t(item, ord)
union all
select mod3.id, item, ord from mod3, unnest(array[
  'Complex Sentence Structures',
  'Medical-Context Vocabulary Introduction',
  'Speaking Practice: Everyday Scenarios',
  'Reading Comprehension (B1 Texts)',
  'Writing Formal & Informal Letters',
  'B1 Mock Exam & Feedback'
]) with ordinality as t(item, ord)
union all
select mod4.id, item, ord from mod4, unnest(array[
  'Research Methodology Orientation',
  'Topic Selection Guidance',
  'Literature Search Basics',
  'Data Collection Fundamentals',
  'Manuscript Structure Introduction',
  'Mentor Check-in Sessions'
]) with ordinality as t(item, ord);

insert into program_audiences (program_id, label, sort_order)
select p.id, a.label, a.ord
from programs p, unnest(array[
  'Doctors starting their German language journey',
  'Medical students planning to move to Germany',
  'Graduates preparing for FSP/KP long-term',
  'Applicants who also want early research experience'
]) with ordinality as a(label, ord)
where p.slug = 'blue-card';

insert into program_journey_steps (program_id, step_label, sort_order)
select p.id, s.label, s.ord
from programs p, unnest(array[
  'Language Level Assessment',
  'A1-A2 Structured Classes',
  'B1 Consolidation & Practice',
  'Parallel Research Onboarding',
  'Progress Evaluation',
  'Certification Readiness'
]) with ordinality as s(label, ord)
where p.slug = 'blue-card';

-- 5. Green Card
with p as (
  select id from programs where slug = 'green-card'
),
mod1 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'German A1-A2 Foundations', 'flag-de', 1 from p returning id
),
mod2 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'German B1-B2 Progression', 'flag-de', 2 from p returning id
),
mod3 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'Germany Pathway Guidance', 'map', 3 from p returning id
),
mod4 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'Publication Track', 'send', 4 from p returning id
)
insert into program_module_items (module_id, label, sort_order)
select mod1.id, item, ord from mod1, unnest(array[
  'Alphabet & Pronunciation Basics',
  'Everyday Vocabulary Building',
  'Grammar Foundations',
  'Listening & Speaking Practice',
  'A1 Mock Exam',
  'A2 Mock Exam'
]) with ordinality as t(item, ord)
union all
select mod2.id, item, ord from mod2, unnest(array[
  'Medical Vocabulary Introduction',
  'Complex Grammar Structures',
  'Reading Comprehension Practice',
  'Formal Writing Skills',
  'Speaking Fluency Practice',
  'B1 Mock Exam',
  'B2 Mock Exam'
]) with ordinality as t(item, ord)
union all
select mod3.id, item, ord from mod3, unnest(array[
  'Overview of the Approbation Process',
  'Document Recognition (Zeugnisbewertung) Guidance',
  'Regional State (Bundesland) Selection Tips',
  'Visa Application Overview',
  'Cost of Living & Relocation Planning'
]) with ordinality as t(item, ord)
union all
select mod4.id, item, ord from mod4, unnest(array[
  'Research Methodology Orientation',
  'Topic & Journal Selection Guidance',
  'Manuscript Drafting Support',
  'Submission Process Walkthrough',
  'Mentor-Guided Revisions'
]) with ordinality as t(item, ord);

insert into program_audiences (program_id, label, sort_order)
select p.id, a.label, a.ord
from programs p, unnest(array[
  'Doctors targeting the Germany relocation pathway',
  'Medical students planning long-term German licensing',
  'Graduates who need both language and publication support',
  'Applicants seeking end-to-end pathway guidance'
]) with ordinality as a(label, ord)
where p.slug = 'green-card';

insert into program_journey_steps (program_id, step_label, sort_order)
select p.id, s.label, s.ord
from programs p, unnest(array[
  'Language Assessment & Enrollment',
  'A1-A2 Training',
  'B1-B2 Training',
  'Germany Pathway Orientation',
  'Publication Track Onboarding',
  'Final Readiness Review'
]) with ordinality as s(label, ord)
where p.slug = 'green-card';

-- 6. Gold Card (5 modules — the most comprehensive Card)
with p as (
  select id from programs where slug = 'gold-card'
),
mod1 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'German A1-B2 Language Track', 'flag-de', 1 from p returning id
),
mod2 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'Medical German (Fachsprache)', 'stethoscope', 2 from p returning id
),
mod3 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'FSP Preparation', 'clipboard', 3 from p returning id
),
mod4 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'KP & Approbation Guidance', 'award', 4 from p returning id
),
mod5 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'Research Training', 'flask', 5 from p returning id
)
insert into program_module_items (module_id, label, sort_order)
select mod1.id, item, ord from mod1, unnest(array[
  'A1 Foundations',
  'A2 Development',
  'B1 Consolidation',
  'B2 Advanced Grammar & Fluency',
  'Medical Vocabulary Integration',
  'Cumulative Mock Exams'
]) with ordinality as t(item, ord)
union all
select mod2.id, item, ord from mod2, unnest(array[
  'Patient History Taking Vocabulary',
  'Clinical Documentation Language',
  'Doctor-Patient Communication Practice',
  'Medical Terminology Drills',
  'Case Presentation Practice in German'
]) with ordinality as t(item, ord)
union all
select mod3.id, item, ord from mod3, unnest(array[
  'FSP Exam Format Overview',
  'Patient Interview Practice',
  'Case Documentation Writing Practice',
  'Doctor-to-Doctor Discussion Simulation',
  'Mock FSP Sessions with Feedback',
  'Common FSP Question Bank Review'
]) with ordinality as t(item, ord)
union all
select mod4.id, item, ord from mod4, unnest(array[
  'Kenntnisprüfung (KP) Exam Overview',
  'Clinical Case Simulation Practice',
  'Approbation Application Document Checklist',
  'Bundesland-Specific Requirements Overview',
  'Approbation Process Timeline Guidance'
]) with ordinality as t(item, ord)
union all
select mod5.id, item, ord from mod5, unnest(array[
  'Research Methodology Orientation',
  'Topic Selection Support',
  'Manuscript Drafting Guidance',
  'Submission Process Walkthrough',
  'Mentor Check-in Sessions'
]) with ordinality as t(item, ord);

insert into program_audiences (program_id, label, sort_order)
select p.id, a.label, a.ord
from programs p, unnest(array[
  'Doctors preparing for FSP and KP exams',
  'Graduates pursuing full Approbation in Germany',
  'Medical professionals seeking comprehensive language-to-licensing support',
  'Applicants wanting research experience alongside licensing prep'
]) with ordinality as a(label, ord)
where p.slug = 'gold-card';

insert into program_journey_steps (program_id, step_label, sort_order)
select p.id, s.label, s.ord
from programs p, unnest(array[
  'Language Level Assessment',
  'A1-B2 Structured Training',
  'Medical German Immersion',
  'FSP Preparation & Mock Exams',
  'KP & Approbation Guidance',
  'Research Training & Mentorship'
]) with ordinality as s(label, ord)
where p.slug = 'gold-card';

-- 7. Master Card
with p as (
  select id from programs where slug = 'master-card'
),
mod1 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'German A1-B1 Language Track', 'flag-de', 1 from p returning id
),
mod2 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'Research Training', 'flask', 2 from p returning id
),
mod3 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'Master''s Program Selection', 'search', 3 from p returning id
),
mod4 as (
  insert into program_modules (program_id, title, icon_key, sort_order)
  select id, 'Admissions Application Support', 'file-text', 4 from p returning id
)
insert into program_module_items (module_id, label, sort_order)
select mod1.id, item, ord from mod1, unnest(array[
  'A1 Foundations',
  'A2 Development',
  'B1 Consolidation',
  'Academic Vocabulary Building',
  'Mock Exams (A1-B1)'
]) with ordinality as t(item, ord)
union all
select mod2.id, item, ord from mod2, unnest(array[
  'Research Methodology Orientation',
  'Literature Review Skills',
  'Basic Data Analysis',
  'Manuscript Structure Introduction',
  'Mentor Check-in Sessions'
]) with ordinality as t(item, ord)
union all
select mod3.id, item, ord from mod3, unnest(array[
  'Study Field Exploration',
  'University Shortlisting',
  'Entry Requirements Review',
  'Language Requirement Verification',
  'Program Comparison Worksheet'
]) with ordinality as t(item, ord)
union all
select mod4.id, item, ord from mod4, unnest(array[
  'Statement of Purpose Guidance',
  'CV/Resume Formatting for German Universities',
  'Recommendation Letter Coordination',
  'Application Portal (uni-assist) Walkthrough',
  'Document Checklist & Deadline Tracking',
  'Interview Preparation (if applicable)'
]) with ordinality as t(item, ord);

insert into program_audiences (program_id, label, sort_order)
select p.id, a.label, a.ord
from programs p, unnest(array[
  'Medical students seeking a German Master''s degree',
  'Graduates pivoting into public health or biomedical research',
  'Doctors seeking an academic Master''s pathway in Germany',
  'Applicants needing structured admissions guidance'
]) with ordinality as a(label, ord)
where p.slug = 'master-card';

insert into program_journey_steps (program_id, step_label, sort_order)
select p.id, s.label, s.ord
from programs p, unnest(array[
  'Language & Research Onboarding',
  'Structured Training (A1-B1)',
  'Study Field & University Shortlisting',
  'Application Document Preparation',
  'Submission via uni-assist',
  'Admission Decision Support'
]) with ordinality as s(label, ord)
where p.slug = 'master-card';

-- ── Mentors ───────────────────────────────────────────────────────────────

-- Full mentor team roster as supplied by the client (supabase/migrations/
-- 20260920100000_mentor_team_roster.sql). Dr. Nadir Akhtar is the Founder
-- & Research Lead, Dr. Saqib Muhammad is the Organizer — this reverses
-- what the site showed earlier in the project. Not seeded here: a live,
-- admin-entered test mentor row (real but ad-hoc, not part of the actual
-- team roster) that exists only in the live database, not in this
-- from-scratch seed.
insert into mentors (slug, full_name, role_title, qualification, institution, bio, publications_count, is_leadership, is_published, sort_order, photo_url) values
  ('dr-nadir-akhtar', 'Dr. Nadir Akhtar', 'Founder & Research Lead', 'MSc Biology', 'Karlsruhe Institute of Technology (KIT), Baden-Württemberg, Germany', 'Founder and Research Lead of ApexMed International, an M.Phil student at Karlsruhe Institute of Technology (KIT), Baden-Württemberg, Germany, with 20+ international research publications. Expertise in meta-analysis, systematic reviews, research methodology, scientific writing, data analysis, research project development, and publication strategy.', 20, true, true, 1, 'https://qorpimkeqevgokygftfa.supabase.co/storage/v1/object/public/media/mentor-photos/dr-nadir-akhtar.png'),
  ('dr-saqib-muhammad', 'Dr. Saqib Muhammad', 'Organizer', 'MBBS, Kabir Medical College Peshawar', 'Gandhara University', 'Organizer at ApexMed International — a researcher and medical educator with 30+ international, PubMed-indexed publications. Expertise in original research, meta-analysis, scientific writing, publication guidance, and research methodology. Also mentors ApexMed''s AI in Healthcare programme.', 30, true, true, 2, 'https://qorpimkeqevgokygftfa.supabase.co/storage/v1/object/public/media/mentor-photos/dr-saqib-muhammad.jpg'),
  ('dr-saajid-ahmed', 'Dr. Saajid Ahmed', 'Research Mentor', null, 'Quaid-i-Azam University, Islamabad', 'Research mentor at ApexMed International. Expertise in research mentorship, scientific writing, research methodology, and academic guidance. Academic and research background associated with Quaid-i-Azam University, Islamabad.', 0, false, true, 10, null),
  -- photo_url on these 4: demo/placeholder portraits (randomuser.me —
  -- free, no-copyright placeholder photos, not real photos of these
  -- real-named mentors), added per explicit confirmation after flagging
  -- that trade-off. Replace with each mentor's real photo as it becomes
  -- available; see supabase/migrations/20260916100000_mentor_demo_photos.sql.
  ('dr-shanza-gul', 'Dr. Shanza Gul', 'Medical Research Mentor', 'MBBS', null, 'Medical research mentor at ApexMed International, supporting mentees with research methodology, scientific writing, academic guidance, and research project support.', 0, false, true, 4, 'https://qorpimkeqevgokygftfa.supabase.co/storage/v1/object/public/media/mentor-photos/dr-shanza-gul.jpg'),
  ('dr-faiza-kiran', 'Dr. Faiza Kiran', 'Medical Research Mentor', 'MBBS', null, 'Medical research mentor at ApexMed International, supporting mentees with research methodology, scientific writing, academic guidance, and research project support.', 0, false, true, 5, 'https://qorpimkeqevgokygftfa.supabase.co/storage/v1/object/public/media/mentor-photos/dr-faiza-kiran.jpg'),
  ('dr-haris-khan', 'Dr. Haris Khan', 'Germany Medical Pathway Mentor', 'Medical Doctor', 'Baden-Württemberg, Germany', 'Germany Medical Pathway mentor at ApexMed International, with training and medical pathway experience in Baden-Württemberg, Germany, and B2-level German language proficiency. Focus areas: the German medical pathway, medical German, FSP pathway guidance, Germany career guidance, and IMG guidance.', 0, false, true, 6, 'https://qorpimkeqevgokygftfa.supabase.co/storage/v1/object/public/media/mentor-photos/dr-haris-khan.jpg'),
  ('dr-muratza', 'Dr. Muratza', 'Research Mentor', 'MBBS', null, 'Research mentor at ApexMed International, supporting mentees through the full research training track.', 0, false, true, 7, 'https://qorpimkeqevgokygftfa.supabase.co/storage/v1/object/public/media/mentor-photos/dr-muratza.jpg'),
  ('dr-alia', 'Dr. Alia', 'Psychiatry Mentor', 'MBBS, FCPS Psychiatry', null, 'Psychiatry mentor at ApexMed International''s Mental Health Support programme. Focus areas: psychiatry, mental health, clinical guidance, and psychological/mental health education.', 0, false, true, 8, 'https://qorpimkeqevgokygftfa.supabase.co/storage/v1/object/public/media/mentor-photos/dr-alia.jpg'),
  ('dr-waheed-alam', 'Dr. Waheed Alam', 'Psychiatry Mentor', 'MBBS, FCPS Psychiatry', null, 'Psychiatry mentor at ApexMed International''s Mental Health Support programme. Focus areas: psychiatry, mental health, clinical guidance, and psychological/mental health education.', 0, false, true, 9, 'https://qorpimkeqevgokygftfa.supabase.co/storage/v1/object/public/media/mentor-photos/dr-waheed-alam.jpg'),
  ('dr-javeria-gul', 'Dr. Javeria Gul', 'CDC Specialist', null, 'Khyber Medical College, Peshawar', 'CDC Specialist at ApexMed International, with 40+ international publications.', 40, false, true, 11, null),
  ('dr-waseem-khan', 'Dr. Waseem Khan', 'Meta-Analysis Specialist', null, null, 'Meta-Analysis Specialist at ApexMed International, with 30+ international publications.', 30, false, true, 12, null),
  ('dr-salman-ahmed', 'Dr. Salman Ahmed', 'Germany Medical Career Mentor', 'Medical Doctor', null, 'Germany Medical Career mentor at ApexMed International, a medical doctor practicing in Germany. Focus areas: the German medical career, hospital environment, medical practice in Germany, Germany pathway guidance, and career orientation for international doctors.', 0, false, true, 13, null),
  ('dr-talha-khan', 'Dr. Talha Khan', 'German Language Teacher', 'B2 Certified', 'Whitecliffe University of Applied Sciences', 'German Language Teacher at ApexMed International, B2 certified, and a Master''s student at Whitecliffe University of Applied Sciences.', 0, false, true, 14, null),
  ('dr-saira-geelani', 'Dr. Saira Geelani', 'MRCP/PLAB Mentor', 'MRCS', null, 'MRCP/PLAB mentor at ApexMed International.', 0, false, true, 15, null),
  ('dr-aleena-durrani', 'Dr. Aleena Durrani', 'MRCP/PLAB Mentor', 'MBBS, MRCP', null, 'MRCP/PLAB mentor at ApexMed International.', 0, false, true, 16, null),
  ('dr-sundas-khan', 'Dr. Sundas Khan', 'MRCP/PLAB Mentor', 'MBBS, PLAB 2 Qualified', null, 'MRCP/PLAB mentor at ApexMed International.', 0, false, true, 17, null),
  ('dr-shehzad', 'Dr. Shehzad', 'USMLE Mentor', 'USMLE Step 3 Qualified, ECFMG Certified', null, 'USMLE mentor at ApexMed International, a Pediatrics physician.', 0, false, true, 18, null),
  ('dr-bilal-nazer', 'Dr. Bilal Nazer', 'USMLE Mentor', 'USMLE Step 3 Qualified, ECFMG Certified', null, 'USMLE mentor at ApexMed International, an Internal Medicine physician.', 0, false, true, 19, null),
  ('dr-naila-jadoon', 'Dr. Naila Jadoon', 'USMLE Mentor', 'ECFMG Certified', null, 'USMLE mentor at ApexMed International, an Internal Medicine physician.', 0, false, true, 20, null),
  ('dr-aleem-khan', 'Dr. Aleem Khan', 'AI in Healthcare Mentor', null, null, 'AI in Healthcare mentor at ApexMed International.', 0, false, true, 21, null),
  ('dr-bacha-khan', 'Dr. Bacha Khan', 'Green Earth Project Mentor', 'PhD in Environmental Sciences', null, 'Green Earth Project mentor at ApexMed International, with a PhD in Environmental Sciences.', 0, false, true, 22, null);

-- ── Site settings ─────────────────────────────────────────────────────────

insert into site_settings (key, value) values
  ('contact_email', '"contact.apexmedinternational@gmail.com"'),
  ('contact_whatsapp_number', '"+923165359859"'),
  ('website_url', '"https://apexmedinternational.com"'),
  ('social_facebook_url', '"https://facebook.com/apexmedinternational"'),
  -- Canonical profile link, not the shared/session URL (which carries a
  -- "stkn" token that expires) — that form isn't safe to store permanently.
  ('social_instagram_url', '"https://www.instagram.com/apex_med_international/"'),
  ('social_linkedin_url', '"https://linkedin.com/company/apexmedinternational"'),
  ('social_youtube_url', '"https://youtube.com/@apexmedinternational"');

-- ── Study field categories ──────────────────────────────────────────────

insert into study_field_categories (slug, name, sort_order) values
  ('public-health-global-health', $$Public Health & Global Health$$, 1),
  ('biostatistics-data-science', $$Biostatistics & Data Science$$, 2),
  ('biomedical-life-sciences', $$Biomedical & Life Sciences$$, 3),
  ('clinical-translational-research', $$Clinical & Translational Research$$, 4),
  ('healthcare-management-policy', $$Healthcare Management & Policy$$, 5);

-- ── Study fields ─────────────────────────────────────────────────────────
-- 20 published, high-quality field pages — deliberately not the full
-- catalog of every conceivable field (see docs / CLAUDE.md context: thin,
-- near-duplicate programmatic pages are penalized by search engines).
-- Each combines to well over the 400-word minimum enforced in
-- lib/actions/admin/study-fields.ts. Remaining fields stay unpublished
-- until they have equally real content.

insert into study_fields (category_id, slug, name, overview, typical_universities, entry_requirements, language_requirements, career_outlook, is_published, seo_title, seo_description) values
  (
    (select id from study_field_categories where slug = 'public-health-global-health'),
    'public-health',
    $$Public Health (MPH)$$,
    $$A Master of Public Health takes a doctor or life-sciences graduate out of the one-patient-at-a-time view of medicine and into population-level thinking: how disease spreads, how health systems are financed, and how policy decisions actually change outcomes for millions of people rather than one. Most MPH programs in Germany combine a shared core in epidemiology, biostatistics, and health policy with an elective track that lets a student lean toward whichever of those three actually matches their career goal, and most end with an independent thesis based on real or publicly available data rather than a purely theoretical exam. Programs typically run two years full-time, structured as four teaching semesters or three teaching semesters plus a dedicated thesis semester, and several build in a short practicum placement at a health authority, hospital, or NGO partner as a required or optional component.$$,
    $$Heidelberg University and Bielefeld University's School of Public Health are the two most established names in German public health education, both with a long track record of English-taught MPH cohorts drawing heavily from international, often clinically trained applicants. Charite Universitatsmedizin Berlin and Ludwig Maximilian University Munich also run public-health-adjacent graduate tracks, usually with a stronger clinical-epidemiology lean given their hospital affiliations. Class sizes tend to be deliberately small — often well under fifty students per cohort — which in practice means closer supervision on the thesis and more direct access to faculty than a large lecture-based program would offer.$$,
    $$Programs generally ask for a completed Bachelor's degree (an MBBS is normally treated as equivalent once academically recognized) in medicine, a life science, or a closely related field, along with a transcript showing a reasonable overall grade average — most programs describe this in relative terms against the local grading scale rather than a single hard cutoff. A statement of purpose and two academic or professional references are standard; some programs also weigh prior clinical or field experience in public health, epidemiology, or a health NGO favorably, though it is rarely an absolute requirement for admission. Applications for most public and many private German universities are submitted through uni-assist, which pre-checks foreign qualifications before the university's own admissions committee reviews the file, so document translation and certification should be arranged well before the deadline rather than at the last minute.$$,
    $$The great majority of MPH programs aimed at international applicants are taught fully in English, so IELTS or TOEFL (or an equivalent, like a medical degree already taught in English) is the language requirement that actually matters for admission. German is not usually required to start the program, but a working level makes clinical-facing placements, part-time work, and eventual employment inside the German health system considerably easier, and several programs offer optional German-language modules alongside the core curriculum specifically for this reason.$$,
    $$Graduates commonly move into roles at public health institutes, health ministries, and multilateral bodies like WHO regional offices, as well as epidemiological surveillance and outbreak-response positions. Others use the degree as a bridge into a PhD and an academic public-health career, or move into hospital-adjacent administrative and quality-improvement roles where population-level thinking is directly useful day to day. A number of graduates also move into the growing global-health-consulting and health-NGO sector, where an MPH combined with a clinical background is specifically valued for bridging technical health expertise with program design and evaluation work.$$,
    true,
    $$Public Health (MPH) in Germany$$,
    $$What an MPH in Germany actually covers, which universities offer it, entry requirements, and realistic career paths for doctors moving into population health.$$
  ),
  (
    (select id from study_field_categories where slug = 'public-health-global-health'),
    'epidemiology',
    $$Epidemiology$$,
    $$Epidemiology programs go deeper into the quantitative side of public health than a general MPH does: study design, causal inference, outbreak investigation, and the statistical methods used to tell a real signal apart from noise in health data. It is a natural fit for a doctor who already enjoyed the research-methods side of medical school and wants that to become the actual center of their work rather than a side skill, and it sets up cleanly for either applied surveillance work or an academic research track afterward. Coursework typically moves from foundational study-design theory in the first semester into applied modeling — survival analysis, spatial epidemiology, or infectious-disease modeling depending on the program's particular strengths — before a data-driven thesis in the final semester.$$,
    $$Ludwig Maximilian University Munich runs one of the more quantitatively rigorous epidemiology tracks through its Institute for Medical Information Processing, Biometry and Epidemiology, and Bielefeld and Ulm University both offer dedicated epidemiology or epidemiology-adjacent graduate programs with a strong methods core. Several of these programs maintain close working relationships with regional public health offices and national surveillance bodies, which is often where thesis datasets and, later, practicum placements actually come from.$$,
    $$Beyond the standard medical or life-sciences Bachelor's, epidemiology programs place more explicit weight on quantitative aptitude than a general MPH does — some ask about prior coursework in statistics or research methods directly in the application, and a few use a short quantitative assessment or interview to confirm a candidate can handle the methods-heavy first semester. Research or fieldwork experience, even informal, is a genuine advantage in the application, and a short research-focused writing sample is sometimes requested alongside the standard transcript and references.$$,
    $$Research-track epidemiology programs are almost universally English-taught, since the field's own literature and conferences run in English regardless of country. German becomes more relevant only if a graduate later takes a role embedded in a German public-health institute or hospital surveillance unit, where day-to-day coordination with regional health authorities happens in German.$$,
    $$Field epidemiologist roles at national and regional public health institutes are the most direct path, alongside pharmacovigilance and drug-safety positions in the pharmaceutical industry, where the same causal-inference skill set is used to monitor real-world safety signals. Academic epidemiology, via a PhD, is the other common route, particularly for graduates who most enjoyed the methods coursework itself, and a smaller number move into health-technology and outbreak-response consulting where fast, methodologically sound analysis of incomplete data is exactly the skill being hired for.$$,
    true,
    $$Epidemiology Master's Programs in Germany$$,
    $$Epidemiology graduate programs in Germany: what the coursework actually covers, entry requirements, and career paths in surveillance, pharma, and academia.$$
  ),
  (
    (select id from study_field_categories where slug = 'public-health-global-health'),
    'global-health',
    $$Global Health$$,
    $$Global health programs look at health across borders rather than within one country's system: humanitarian response, health equity between high- and low-resource settings, and the practical realities of delivering care where infrastructure, funding, or political stability can't be taken for granted. Many programs build in an actual field placement or applied project component rather than relying purely on classroom case studies, which is part of why prior international or field exposure tends to matter more here than in a strictly domestic public-health track. Modules commonly cover humanitarian ethics, health-system strengthening, and the operational logistics of running a health program in a resource-constrained or crisis setting, alongside the same epidemiological and biostatistical grounding shared with a standard MPH.$$,
    $$Heidelberg University and the University of Tubingen both run global health tracks with genuine field-placement components, and Bielefeld offers a global-health-oriented specialization within its wider public health school. Several of these programs are also structured to allow a thesis based on data or fieldwork gathered during the placement itself, rather than requiring an entirely separate research project once the placement ends.$$,
    $$A clinical or public-health first degree is the most common background, but the application itself tends to weigh a candidate's actual international or field exposure — prior NGO work, a humanitarian placement, or cross-cultural clinical experience — more heavily than a purely academic global-health program would suggest. That history is usually expected to show up explicitly in the personal statement rather than just the transcript, and some programs request a short written case study or scenario response as part of the application to gauge practical judgment.$$,
    $$English-taught throughout for the coursework itself; German becomes relevant only where a program includes a placement inside the German health or development-aid system, which is worth checking program-by-program rather than assuming. A number of placements are instead conducted internationally in a third country, in which case the working language depends entirely on the specific placement organization.$$,
    $$Humanitarian and international NGOs, global health consultancy, and roles inside international development agencies are the most common landing points, along with positions at multilateral organizations that focus specifically on cross-border health coordination rather than a single national system. A meaningful number of graduates also return to clinical practice with a global-health lens that shapes later career choices, such as volunteering or contract work with humanitarian medical organizations alongside a domestic clinical role. Doctors moving into this field from a clinical background often start in a monitoring-and-evaluation or medical-coordinator role with an international NGO before moving into more senior program-design positions.$$,
    true,
    $$Global Health Master's Programs in Germany$$,
    $$Global health graduate programs in Germany, including field-placement components, entry requirements, and career paths in humanitarian and international health work.$$
  ),
  (
    (select id from study_field_categories where slug = 'public-health-global-health'),
    'health-economics',
    $$Health Economics$$,
    $$Health economics applies economic method — cost-effectiveness analysis, insurance-market design, health technology assessment — to the question of how a health system should actually allocate a limited budget across competing treatments and priorities. It is a genuinely different skill set from clinical medicine, closer to applied microeconomics than to biology, which is exactly why doctors who complete it tend to move into system-level or industry roles rather than back into direct patient care. The curriculum usually opens with a grounding in microeconomic theory and econometrics before moving into health-specific applications like pharmaceutical pricing, insurance design, and the economic evaluation methods used by health technology assessment bodies to decide whether a new treatment is worth its cost.$$,
    $$The University of Duisburg-Essen and Hannover Medical School both run dedicated health economics tracks with strong links to Germany's statutory health insurance system, and the University of Bayreuth offers a health-economics-adjacent management program with a comparable quantitative core. Several of these programs maintain direct research or internship ties to Germany's health technology assessment bodies, giving students a realistic view of how their coursework maps onto an actual career.$$,
    $$Some prior exposure to economics, statistics, or quantitative methods is genuinely useful and occasionally checked directly — a few programs run a short quantitative screening as part of admission — though a pure medical background without formal economics coursework is still routinely accepted provided the personal statement makes a clear case for the switch. Where a program is more economics-heavy from day one, an optional or required preparatory module in the relevant mathematics is sometimes offered before the main semester begins.$$,
    $$Programs are predominantly English-taught, though German is a real practical asset for anyone planning to work with a German statutory health insurer (Krankenkasse) or a domestic health technology assessment body after graduating, since internal reporting and stakeholder communication in those organizations happens almost entirely in German.$$,
    $$Health insurance funds, health technology assessment bodies, and pharmaceutical market-access teams are the most common employers, alongside health-sector consulting firms that specifically need someone who can speak both clinical and economic language. A smaller number of graduates move into health-focused investment or venture roles, where the same cost-effectiveness framework is used to evaluate the commercial potential of new health technologies rather than their public funding case. Fluency in at least one statistical or econometric software package, typically Stata or R, is expected on the job market even when it isn't a strict admissions requirement, so building that skill during the program is worth prioritizing early rather than leaving it for after graduation.$$,
    true,
    $$Health Economics Master's Programs in Germany$$,
    $$Health economics graduate programs in Germany: entry requirements, typical universities, and career paths in insurance, HTA, and pharma market access.$$
  ),
  (
    (select id from study_field_categories where slug = 'biostatistics-data-science'),
    'biostatistics',
    $$Biostatistics$$,
    $$Biostatistics is the methodological backbone behind every clinical trial and epidemiological study that ever gets published — sample size calculation, survival analysis, mixed models, and the R or SAS fluency needed to actually run them rather than just read about them. It is one of the more demanding quantitative fields on this list, and one of the most directly employable, since every CRO, pharma company, and academic clinical-trials unit needs biostatisticians who can be trusted with primary analysis. Programs typically build from foundational probability and inference through to applied clinical-trial biostatistics and survival analysis over two years, with a strong emphasis on hands-on statistical-software work running alongside the theoretical coursework rather than being treated as a separate skill.$$,
    $$The Institute for Medical Information Processing, Biometry and Epidemiology at Ludwig Maximilian University Munich is the standout name here, alongside dedicated biostatistics tracks at the University of Bremen and TU Dortmund's statistics department. Graduates of these programs are routinely recruited directly by German pharmaceutical companies and CROs specifically because of the programs' reputations for methodological rigor.$$,
    $$A genuinely strong quantitative background is expected — prior coursework in statistics, mathematics, or a heavily quantitative branch of the life sciences — and several programs use an entrance assessment or a required bridging module for applicants coming from a purely clinical background without that foundation already in place. Applicants are generally well served by being able to point to at least one prior course or project involving real statistical analysis, not just theoretical exposure to the concepts. A short writing sample describing a prior quantitative project, even a class assignment, is a genuinely useful addition to an application where it isn't explicitly requested.$$,
    $$English-taught at the programs listed above; mathematics and code are, in practice, the languages that actually determine whether a student keeps up with the coursework, and a working level of German is a secondary consideration at best for admission itself.$$,
    $$Clinical trial biostatistician roles inside CROs and pharmaceutical companies are the most direct and highest-demand outcome, alongside academic biostatistics core-facility positions and regulatory statistics roles at drug-approval agencies. Demand for this specific skill set has stayed consistently strong even during broader hiring slowdowns in adjacent fields, since every drug and device approval pathway structurally requires qualified biostatistical sign-off. Entry-level biostatistician roles in Germany's pharmaceutical sector are generally competitive with other quantitative fields, and the skill set transfers well internationally, which is part of why this remains one of the more portable qualifications on this list for a graduate who may not stay in Germany long-term.$$,
    true,
    $$Biostatistics Master's Programs in Germany$$,
    $$Biostatistics graduate programs in Germany: what the coursework covers, entry requirements, and career paths in clinical trials, pharma, and regulatory statistics.$$
  ),
  (
    (select id from study_field_categories where slug = 'biostatistics-data-science'),
    'health-data-science',
    $$Health Data Science$$,
    $$Health data science sits at the intersection of health informatics and machine learning: electronic health record analytics, clinical prediction models, and the practical engineering work of turning messy real-world hospital data into something a model can actually learn from. It has grown quickly as German hospitals digitize, and it rewards a doctor or life-scientist willing to become genuinely competent in Python rather than treating programming as an afterthought. Curricula typically pair core machine-learning and data-engineering coursework with health-specific modules on clinical data standards, interoperability, and the regulatory constraints that make health data meaningfully harder to work with than a typical commercial dataset. Group projects built around a real (properly anonymized) clinical dataset are a common feature of the first year, giving students a portfolio of applied work to point to well before the thesis stage.$$,
    $$RWTH Aachen, the Hasso Plattner Institute in Potsdam, and the University of Freiburg all run health-data-science or medical-informatics tracks with a strong applied-machine-learning component. Several maintain active partnerships with university hospitals, giving students realistic (properly anonymized) clinical datasets to work with rather than only public benchmark data.$$,
    $$Programming aptitude is expected either coming in or built intensively in the first semester — some programs ask for a coding sample or a short technical portfolio alongside the standard transcript and personal statement, particularly for applicants without a formal computer-science background. A clinical background is genuinely valued as a differentiator in the application specifically because it's rarer among an otherwise engineering-heavy applicant pool. Applicants sometimes strengthen their file with a link to a public code repository or a short personal project, even an informal one, as evidence of genuine hands-on ability rather than only coursework.$$,
    $$English-taught throughout, consistent with the field's international, fast-moving technical literature, and the day-to-day working language of most German tech and health-tech employers besides.$$,
    $$Clinical data scientist roles inside hospital digital-health teams, medtech startups building diagnostic or triage tools, and health-AI research groups are all realistic destinations, with strong overlap into general data-science roles outside healthcare specifically for graduates who want that option open. Germany's growing digital-health regulatory framework (including reimbursable prescribable health apps) has also created a newer category of roles specifically at the intersection of data science and health-tech regulatory affairs. A meaningful number of graduates also move into general data-science or machine-learning-engineering roles outside healthcare specifically, since the core technical skill set transfers directly, which gives this degree more career flexibility than its health-specific name might suggest.$$,
    true,
    $$Health Data Science Master's Programs in Germany$$,
    $$Health data science graduate programs in Germany: entry requirements, typical universities, and career paths in clinical data science and health AI.$$
  ),
  (
    (select id from study_field_categories where slug = 'biostatistics-data-science'),
    'bioinformatics',
    $$Bioinformatics$$,
    $$Bioinformatics applies computational methods to biological data at scale — genome and sequence analysis, computational pipelines for -omics data, and the tooling behind modern precision medicine. For a doctor interested in where molecular diagnostics is actually heading rather than where it's been, this is one of the more future-facing choices on this list, though it does ask for a genuine willingness to spend real time at a command line. Programs typically combine core molecular biology and genomics theory with a dedicated programming and pipeline-building track, often culminating in a thesis that involves analyzing a real genomic or transcriptomic dataset from a partner lab. Programming is typically taught in Python and R alongside the biological coursework, and by the second year students are expected to build and run their own analysis pipelines rather than only using pre-built tools.$$,
    $$The University of Tubingen, Saarland University, and the Free University of Berlin all run established bioinformatics graduate programs with strong genomics research groups attached, several of which are directly linked to Max Planck Institutes working in computational biology and genomics. Joint degree structures with a partner computer-science department are common at these universities, which is part of why the technical (as opposed to purely biological) side of the curriculum tends to be unusually strong.$$,
    $$A biology or medical background is welcomed, but some basic programming exposure is expected — several programs run an explicit bridging module in the first semester specifically for clinicians and biologists who haven't coded before, rather than assuming it as a prerequisite. Demonstrated interest in computational biology, even a self-taught project, strengthens an application meaningfully. Some familiarity with the command line or a scripting language, built through even a short online course beforehand, meaningfully eases the transition into the program's more technical first semester.$$,
    $$English-taught, matching the field's international research and publication culture, and consistent with how computational-biology labs across Germany actually operate day to day.$$,
    $$Genomics labs, precision-medicine companies, and broader biotech R&D departments are the most common employers, and a PhD pathway into computational biology research is a natural next step for graduates who want to stay closer to academia. Diagnostic-technology companies building next-generation sequencing-based tests are also a growing source of demand for graduates who can bridge molecular biology and computational pipeline work. Diagnostic-technology and next-generation-sequencing companies are a particularly strong source of demand for graduates who can bridge molecular biology and computational pipeline work, and salaries in this niche have generally kept pace with the broader tech sector rather than lagging behind it.$$,
    true,
    $$Bioinformatics Master's Programs in Germany$$,
    $$Bioinformatics graduate programs in Germany: entry requirements, typical universities, and career paths in genomics, precision medicine, and biotech R&D.$$
  ),
  (
    (select id from study_field_categories where slug = 'biostatistics-data-science'),
    'medical-data-science-digital-health',
    $$Medical Data Science & Digital Health$$,
    $$Digital health programs cover the newer, faster-moving end of health technology: digital therapeutics, telemedicine platforms, and the regulatory questions that come with treating software itself as a medical device. It is a genuinely mixed-background field — clinicians, engineers, and computer scientists all show up in the same cohort — which makes it one of the more collaborative programs on this list rather than one dominated by a single prior discipline. Coursework typically spans product design for health technology, the specific regulatory pathway for software as a medical device in the EU, and applied data-science methods for building and evaluating digital-health tools. A capstone project co-supervised with an industry partner is a common final requirement, giving graduates a concrete, demonstrable product to show employers alongside the degree itself.$$,
    $$The Hasso Plattner Institute, the University of Erlangen-Nuremberg, and the Karlsruhe Institute of Technology all run digital-health or medical-technology graduate tracks with active industry partnerships, often including capstone projects co-supervised by an actual digital-health company. All three of these institutes sit within Germany's broader, well-funded digital-health innovation ecosystem, which in practice means guest speakers, hackathons, and startup-incubator access well beyond the formal curriculum.$$,
    $$Mixed backgrounds are explicitly accepted — clinical, engineering, or computer science — provided the motivation letter makes a clear, specific case for why digital health rather than a generic tech or medical program; admissions committees tend to read this letter closely precisely because the applicant pool is so varied. Some prior exposure to either healthcare delivery or basic technical/programming concepts strengthens an application from either direction. A portfolio piece — even a simple prototype app or a short written product concept — is a genuine differentiator in an application pool that otherwise spans very different prior educational backgrounds.$$,
    $$English-taught for the coursework; Germany's fast-growing digital-health sector makes working German a genuine career asset after graduation, even if it isn't required to get in, particularly for roles that involve direct interaction with German statutory health insurers who now reimburse certain prescribed health apps.$$,
    $$Digital health startups, hospital digital-transformation offices, and medtech regulatory-affairs roles are the most common paths, with the regulatory side in particular benefiting from someone who understands both the clinical and technical sides of a product. Germany's DiGA framework for reimbursable digital health applications has created a specific, growing niche for graduates who understand both the technology and the regulatory approval pathway. Health insurers themselves have also become direct employers in this space as they build out internal digital-health evaluation teams to assess which apps and platforms qualify for reimbursement under Germany's DiGA framework.$$,
    true,
    $$Digital Health Master's Programs in Germany$$,
    $$Digital health and medical data science graduate programs in Germany: entry requirements, typical universities, and career paths in health tech.$$
  ),
  (
    (select id from study_field_categories where slug = 'biomedical-life-sciences'),
    'molecular-medicine',
    $$Molecular Medicine$$,
    $$Molecular medicine bridges clinical training and molecular biology, looking at disease mechanisms at the level of genes, proteins, and cellular pathways rather than organ systems. Programs are typically lab-rotation heavy, meaning a student spends real time at the bench across multiple research groups before settling on a thesis lab — good preparation for anyone seriously considering a research-heavy career rather than one built primarily around coursework. Most programs run over two years, with the first two to three semesters combining core coursework with two or three rotations, and the final semester or two dedicated entirely to the thesis project in the lab the student ultimately chooses. Seminar-style journal clubs, where students present and critique recent primary literature, run alongside the lab rotations and are where much of the program's actual scientific reasoning training happens.$$,
    $$Georg-August University Gottingen, the University of Freiburg, and Hannover Medical School all run strong molecular medicine programs with well-resourced lab-rotation systems, several of which are directly affiliated with major German research consortia and clusters of excellence in the biomedical sciences.$$,
    $$A solid life-sciences or medical background is expected, and prior lab experience — even a single undergraduate research project — is genuinely looked for, since the program structure assumes a baseline comfort with bench work from day one. Some programs also request a brief research statement outlining what kind of disease mechanism or molecular question the applicant is most interested in pursuing. Reaching out to a specific research group in advance, rather than applying to the program generically, is common practice among strong candidates and can meaningfully shape which lab rotations become available in the first semester.$$,
    $$English-taught at the research-intensive universities above; German is helpful for day-to-day life around a hospital-affiliated lab but not required for the coursework itself, and most lab groups at these institutions already operate in English given their international composition.$$,
    $$A PhD and academic research career is the most natural next step, though biotech R&D and pharmaceutical discovery-science roles are equally realistic for graduates who want to move into industry directly after the Master's. The lab-rotation structure itself is also a genuine advantage on the job market, since graduates can point to hands-on experience across multiple distinct research areas rather than a single narrow project. Graduates who complete a strong thesis project are frequently invited to continue directly into a PhD in the same lab, which is one of the more common and lowest-friction transitions from this particular degree.$$,
    true,
    $$Molecular Medicine Master's Programs in Germany$$,
    $$Molecular medicine graduate programs in Germany: lab-rotation structure, entry requirements, and career paths into research and biotech.$$
  ),
  (
    (select id from study_field_categories where slug = 'biomedical-life-sciences'),
    'biomedical-sciences',
    $$Biomedical Sciences$$,
    $$Biomedical sciences is deliberately broad — physiology, pharmacology, and pathology covered at a graduate level without committing early to one narrow specialty. It suits a graduate who wants to genuinely keep multiple doors open (a later PhD, an industry research role, or further clinical specialization) rather than one who already knows exactly which molecular mechanism they want to spend two years studying. The breadth of the curriculum is itself the point: students typically choose an elective concentration partway through the program once they have a clearer sense of direction, rather than being locked into one from the first semester. Assessment is typically a mix of written exams and lab-report-style coursework, reflecting the program's balance between theoretical breadth and hands-on technique across its core subjects.$$,
    $$The University of Wurzburg, Philipps University Marburg, and the University of Cologne all offer broad biomedical sciences programs, some fully in English and some in German depending on the specific track, with several offering a genuine choice of elective concentration in the second year. Each of these universities allows a somewhat different elective concentration in the second year, so comparing the specific elective list rather than only the program's general reputation is worth doing before choosing between them.$$,
    $$A Bachelor's degree or MBBS in a life-science or medical field is the standard baseline, without the more specific research-experience expectations that a narrower field like molecular medicine or neuroscience tends to have, which makes this a comparatively accessible entry point for a strong general life-sciences applicant. Because the program covers physiology, pharmacology, and pathology at a genuinely introductory graduate level for each, applicants without a strong prior grade in any one of the three are not automatically disadvantaged the way they might be in a more specialized single-discipline program.$$,
    $$A mix of English- and German-medium programs exists, so this is worth checking program-by-program rather than assuming, particularly since the balance can shift between core and elective modules within the same program.$$,
    $$Research assistant positions, pharmaceutical medical-science-liaison roles, and further specialization via a PhD are all common outcomes, reflecting the program's deliberately broad starting point. Because the degree doesn't commit graduates to one narrow specialty, it's also a reasonably common stepping stone into a more specialized second Master's or direct PhD entry once a clearer research interest has developed. Because the degree deliberately avoids early specialization, graduates are often well positioned for roles at the interface of two disciplines — for example a pharmacology-adjacent regulatory role — that a narrower degree would leave them less prepared for.$$,
    true,
    $$Biomedical Sciences Master's Programs in Germany$$,
    $$Biomedical sciences graduate programs in Germany: what the broad curriculum covers, entry requirements, and career flexibility after graduation.$$
  ),
  (
    (select id from study_field_categories where slug = 'biomedical-life-sciences'),
    'neuroscience',
    $$Neuroscience$$,
    $$Graduate neuroscience programs run from cellular and molecular neurobiology through to cognitive and clinical neuroscience, and Germany is genuinely strong in this field internationally, with well-funded institutes attached to several universities. It's a strong fit for a doctor eyeing eventual neurology or psychiatry research rather than pure clinical practice, particularly given how research-heavy the German academic track in those specialties tends to be. Programs typically combine foundational neurobiology coursework with a choice of specialization — cellular/molecular, systems, or cognitive/clinical neuroscience — and a substantial lab-based thesis project in the final year. Journal clubs and research seminars run throughout the program alongside formal coursework, giving students regular practice presenting and defending an interpretation of primary neuroscience literature.$$,
    $$The University of Freiburg, Heidelberg University, and Otto von Guericke University Magdeburg all run well-regarded graduate neuroscience programs with strong lab networks, several connected to dedicated brain-research institutes and clusters of excellence in neuroscience specifically. Each of these universities is affiliated with its own dedicated brain-research institute or cluster of excellence, which in practice determines which specific sub-areas of neuroscience a given cohort will have the strongest lab access to.$$,
    $$A clear preference for prior lab or research experience shows up across most of these programs, and a short interview is common as part of the admissions process specifically to gauge genuine research motivation rather than just academic performance. Applicants who can point to a specific area of neuroscience they're drawn to, rather than a general interest in the brain, tend to present more strongly in that interview. A short research proposal or statement of specific scientific interest, even a page long, is commonly requested and is read closely as a signal of genuine engagement with the field rather than a generic interest in the brain.$$,
    $$English-taught across the graduate neuroscience programs listed above, matching the field's internationally oriented research culture at every one of these institutes.$$,
    $$Academic neuroscience labs are the most direct path, with real alternatives in neurotechnology and pharmaceutical R&D, plus clinical-research liaison roles that connect neuroscience research directly back into hospital neurology and psychiatry departments. A smaller but growing number of graduates move into neurotechnology startups working on brain-computer interfaces or neuromodulation devices, an area where Germany has an increasingly active research and startup ecosystem. A number of graduates also move into scientific writing, medical communications, or science-journalism-adjacent roles that specifically value someone able to translate complex neuroscience findings for a non-specialist audience.$$,
    true,
    $$Neuroscience Master's Programs in Germany$$,
    $$Neuroscience graduate programs in Germany: entry requirements, typical universities, and career paths in academic research and neurotech.$$
  ),
  (
    (select id from study_field_categories where slug = 'biomedical-life-sciences'),
    'immunology',
    $$Immunology$$,
    $$Immunology programs cover immune-system mechanisms, immunotherapy, and vaccine science — a field that has only grown in visibility and funding since the pandemic put immunological literacy squarely in the public conversation. Coursework typically combines fundamental immune-biology theory with hands-on laboratory technique, since most graduates go on to some form of bench-based research or development role, and a thesis project in an active immunology or infection-research lab is a standard core requirement rather than an optional extra. Several programs also include a dedicated module on immunotherapy and vaccine development specifically, reflecting how much industry demand has grown in that particular sub-area over the past several years. Laboratory rotations across at least two different research groups are typical before a student commits to a final thesis lab, mirroring the same structure used in several other lab-based programs on this list.$$,
    $$Hannover Medical School, the University of Bonn, and the Technical University of Munich all run strong immunology-focused graduate tracks with active biotech and vaccine-research partnerships, and several are directly affiliated with major German infection-research institutes and consortia. All three of these universities have active infection-research or vaccine-development consortia attached, which is generally where the more advanced thesis projects in this field actually take place.$$,
    $$A life-sciences or medical degree is the standard entry point, with prior familiarity with basic laboratory technique — cell culture, standard assays — viewed favorably even if not formally mandatory. Applicants who can describe a specific immunological process or disease area they want to study tend to stand out in an otherwise fairly uniform applicant pool of strong life-sciences graduates. Any documented experience with standard immunology laboratory techniques — flow cytometry, ELISA, cell culture — is worth foregrounding explicitly in the application rather than assuming it will be inferred from a general life-sciences transcript.$$,
    $$English-taught across the programs above, consistent with immunology's highly international research and publication landscape at every level.$$,
    $$Immunotherapy and broader biotech R&D roles are the most common industry destination, alongside vaccine-development positions and continued academic immunology research via a PhD. Germany's biotech sector has a genuine concentration of vaccine and immunotherapy companies, which makes this one of the more industry-adjacent research fields on this list for graduates who want a realistic path into biotech without first completing a PhD. A number of graduates move specifically into contract research organizations that run pre-clinical immunology and vaccine studies on behalf of pharmaceutical sponsors, a growing niche within Germany's broader CRO sector.$$,
    true,
    $$Immunology Master's Programs in Germany$$,
    $$Immunology graduate programs in Germany: entry requirements, typical universities, and career paths in immunotherapy, vaccine development, and research.$$
  ),
  (
    (select id from study_field_categories where slug = 'clinical-translational-research'),
    'clinical-research',
    $$Clinical Research$$,
    $$Clinical research programs teach the practical machinery behind a clinical trial: Good Clinical Practice (GCP), trial design, regulatory submissions, and the operational realities of running a study across multiple sites. It's a natural next step for a doctor who wants to move from participating in trials to actually designing and leading them, without needing to become a full-time biostatistician to do it. Coursework typically covers trial phases and design, regulatory and ethics submission processes, and site-management logistics, often taught partly by faculty who are themselves practicing clinical-trial investigators or CRO professionals. Case studies drawn from real (anonymized) past trials are a common teaching tool, and several programs run a simulated multi-site trial exercise so students experience the coordination challenges firsthand before doing it for real.$$,
    $$Goethe University Frankfurt, the University of Cologne, and Charite Berlin all run clinical research tracks with direct ties into active hospital-based trial units, giving students realistic exposure to how a trial is actually run day to day rather than only its theory.$$,
    $$A medical or clinical background is strongly preferred, and several programs specifically ask applicants to document prior clinical exposure on their CV rather than treating it as implicit from having a medical degree. Some programs are structured as part-time or executive-format tracks specifically for candidates already working clinically, which changes both the entry expectations and the time commitment involved. Any prior involvement in a clinical trial as a sub-investigator, coordinator, or research assistant — even briefly — is worth describing in specific, concrete detail in the application rather than mentioned only in passing.$$,
    $$Programs run in a mix of English and German depending on the university, though the core vocabulary of Good Clinical Practice is standardized in English internationally regardless of the teaching language, which softens the practical impact of the language choice somewhat.$$,
    $$Clinical research associate and clinical research manager roles at CROs or pharmaceutical companies are the most direct outcome, along with positions inside hospital clinical-trials units and pharmaceutical regulatory-affairs departments. Demand for qualified clinical-trial professionals has stayed high as trial activity in Europe has grown, making this one of the more reliably employable programs on this list for graduates who complete it with genuine GCP competence. Because GCP certification and practical trial-coordination experience are both explicitly verifiable on a CV, graduates of these programs are often able to move into their first CRO or pharma role noticeably faster than candidates from a purely academic research background.$$,
    true,
    $$Clinical Research Master's Programs in Germany$$,
    $$Clinical research graduate programs in Germany: GCP and trial-design coursework, entry requirements, and career paths at CROs and hospital trial units.$$
  ),
  (
    (select id from study_field_categories where slug = 'clinical-translational-research'),
    'translational-medicine',
    $$Translational Medicine$$,
    $$Translational medicine is explicitly about moving basic-science discoveries into real clinical application — the "bench to bedside" pipeline — and programs often build in an industry-partnered thesis project specifically to give students exposure to how that pipeline actually works in practice, not just in theory. Curricula typically span molecular disease mechanisms, drug-development pathways, and the regulatory science that governs how a discovery actually becomes an approved treatment, taught by faculty who span both academic research and industry drug development. Coursework often includes a dedicated module on intellectual property and technology transfer specifically, since moving a discovery from a university lab into a company frequently depends as much on IP strategy as on the underlying science. Guest lectures from founders of university spin-out companies are a common feature, giving students a realistic view of how translational research actually turns into a product or company.$$,
    $$The Technical University of Munich, Heidelberg University, and Charite Berlin all run translational medicine programs with genuine industry-partnership tracks for the thesis component, often placing students directly inside a pharmaceutical or biotech R&D team for their final research project. All three universities run their translational medicine tracks in close coordination with an affiliated university hospital, which is what makes the bench-to-bedside framing of the coursework a practical reality rather than only a slogan.$$,
    $$A research background is expected, and prior publication or substantial thesis work from a previous degree is looked on favorably, since the program assumes a baseline familiarity with how a research project actually runs from question to result. A specific interest in how a particular disease area's basic science connects to real treatment development also strengthens an application meaningfully. Applicants who can point to a specific disease area or discovery they find genuinely compelling, rather than a general interest in "bridging research and industry," tend to write noticeably stronger personal statements for this particular program.$$,
    $$English-taught at the research-intensive universities listed above, matching the field's genuinely international drug-development and translational-research community.$$,
    $$Biotech and pharmaceutical translational-science teams are the most direct industry destination, alongside continued work inside academic medical centers and a PhD pathway for graduates who want to stay in research long-term. The industry-partnered thesis structure common to these programs also means a meaningful number of graduates are hired directly by the company they completed their thesis project with. A smaller number of graduates go on to found or join early-stage biotech spin-outs directly, particularly from programs with strong university technology-transfer offices and startup-support infrastructure already in place.$$,
    true,
    $$Translational Medicine Master's Programs in Germany$$,
    $$Translational medicine graduate programs in Germany: bench-to-bedside coursework, entry requirements, and career paths in biotech and academic medicine.$$
  ),
  (
    (select id from study_field_categories where slug = 'clinical-translational-research'),
    'pharmacology',
    $$Pharmacology$$,
    $$Pharmacology programs go deep into drug mechanisms, pharmacokinetics and pharmacodynamics, and the broader drug-development pipeline — a genuinely complementary skill set to clinical training that explains why the mechanism behind a drug's effect, not just its indication, actually matters. Coursework typically covers molecular and systems pharmacology, toxicology, and the stages of drug development from discovery through clinical trials, often with a laboratory component that gives students direct experience running pharmacological experiments rather than only studying them theoretically. Laboratory coursework typically includes hands-on experience with standard pharmacological assay techniques, and several programs require a supervised laboratory rotation in an active pharmacology or toxicology research group before the thesis stage begins. Toxicology is usually taught as an integrated part of the curriculum rather than a separate elective, reflecting how closely the two fields are related in both academic research and industry practice.$$,
    $$The University of Duisburg-Essen, Philipps University Marburg, and the University of Kiel all run graduate pharmacology programs, some English-taught and some in German depending on the specific track, several with direct links to pharmaceutical-industry research partners for thesis placements. Each of these universities maintains active research collaborations with pharmaceutical companies headquartered in Germany, which in practice shapes which thesis projects and eventual industry contacts become available to students.$$,
    $$A life-sciences or medical background is standard, and some programs list basic chemistry or mathematics coursework as a prerequisite for applicants without a strong existing quantitative foundation. A demonstrated interest in a specific drug class or mechanism, even from undergraduate coursework, is a genuine point of interest for admissions committees reviewing an otherwise fairly similar applicant pool. Prior coursework in organic chemistry, alongside the standard life-sciences or medical Bachelor's, is a genuine asset for this specific program given how chemistry-adjacent much of mechanistic pharmacology actually is.$$,
    $$A mix of English- and German-medium programs — worth confirming per university rather than assuming either, since this can also vary between the core curriculum and any specialized elective modules.$$,
    $$Pharmaceutical R&D and drug-safety or pharmacovigilance roles are the most common industry destinations, with academic pharmacology research as the alternative path via a PhD. Germany's large pharmaceutical sector provides a genuinely deep local job market for this specific skill set, which is part of why several of these programs maintain such close industry ties in the first place. Regulatory toxicology and drug-safety-assessment roles specifically are a strong and steady source of demand for pharmacology graduates, alongside the more commonly cited drug-discovery and pharmacovigilance paths.$$,
    true,
    $$Pharmacology Master's Programs in Germany$$,
    $$Pharmacology graduate programs in Germany: entry requirements, typical universities, and career paths in pharmaceutical R&D and drug safety.$$
  ),
  (
    (select id from study_field_categories where slug = 'clinical-translational-research'),
    'medical-physics',
    $$Medical Physics$$,
    $$Medical physics is a genuinely technical niche — radiotherapy physics, medical imaging technology, and radiation safety — that sits closer to engineering and physics than to biology, and it's consistently in demand wherever oncology and diagnostic imaging departments actually operate. Coursework typically covers radiation physics and dosimetry, imaging-system technology (CT, MRI, ultrasound), and radiation-protection regulation, usually alongside a substantial practical or clinical placement component inside a hospital medical-physics department. Clinical placement hours inside an active hospital medical-physics department are typically a formal, assessed part of the degree rather than an optional add-on, since practical competence with real equipment is treated as inseparable from the theoretical coursework. Radiation-protection regulation is usually examined as its own dedicated module, reflecting how central compliance with radiation-safety law is to the profession in practice.$$,
    $$Heidelberg University (with strong ties to the German Cancer Research Center, DKFZ), the University of Wurzburg, and the Technical University of Kaiserslautern all run established medical physics programs, several offering direct clinical-placement partnerships with major oncology and radiology departments. Heidelberg's proximity to DKFZ specifically gives that program's students access to one of Europe's largest cancer-research infrastructures for their clinical placement and thesis work.$$,
    $$A strong physics or engineering background is typically required alongside, or sometimes instead of, a medical one — this is the one field on this list where quantitative technical training matters more at the door than prior clinical exposure. A Bachelor's in physics, engineering, or a closely related quantitative discipline is generally treated as the standard entry qualification rather than a life-sciences degree alone. Because the coursework is genuinely physics-heavy from the first semester, applicants without a strong recent physics or engineering transcript should expect a harder adjustment than in most other programs covered here, regardless of any prior medical background.$$,
    $$English-taught programs exist at several of the universities above, though quantitative ability is what actually determines success in the coursework far more than language background does.$$,
    $$Hospital medical physics departments, radiotherapy equipment manufacturers, and medical imaging R&D teams are the most direct employers for graduates of this track. Because medical physicist roles in German hospitals often require specific professional certification beyond the Master's degree itself, graduates should plan for that additional certification step as part of their overall career timeline rather than expecting the degree alone to be sufficient. Graduates who complete the required additional professional certification are eligible for clinically responsible medical-physicist roles specifically, a formally regulated position in German hospitals that carries meaningfully more responsibility and compensation than a general physics-adjacent research role.$$,
    true,
    $$Medical Physics Master's Programs in Germany$$,
    $$Medical physics graduate programs in Germany: entry requirements, typical universities, and career paths in radiotherapy, imaging, and equipment R&D.$$
  ),
  (
    (select id from study_field_categories where slug = 'healthcare-management-policy'),
    'health-management',
    $$Health Management$$,
    $$Health management programs teach the operational and financial side of running a hospital or health organization — budgeting, quality management, and healthcare-specific leadership — for doctors whose career goal is administrative and strategic leadership rather than continued full-time clinical practice. Coursework typically spans healthcare finance, quality and process management, and organizational leadership, often taught in a case-study format drawing on real German hospital and health-system examples rather than generic international business cases. Case studies drawn from real German hospital groups are a standard teaching method, and several programs invite practicing hospital executives as guest lecturers or thesis co-supervisors to keep the curriculum grounded in current operational realities rather than abstract theory. A capstone consulting-style project — often for an actual hospital or health-system client — is a common final requirement in the executive-format versions of these programs.$$,
    $$The University of Bayreuth, EBS Universitat, and Hamburg Medical School all run dedicated health management tracks, several with a strong part-time or executive-format option for candidates already working, which is a common route for doctors who want to make this transition without stepping away from clinical practice entirely during their studies.$$,
    $$Professional or clinical experience is often weighted alongside academic record, and an admissions interview is common specifically to assess leadership potential and career motivation rather than purely academic fit. Programs aimed at working professionals typically expect a minimum number of years of relevant work experience already completed before applying. Programs aimed at working professionals typically ask for a CV that clearly documents management-adjacent responsibilities already held — leading a team, running a budget, coordinating a project — rather than clinical seniority alone.$$,
    $$A mix of English- and German-medium programs exists, and German genuinely matters here more than in most other fields on this list, since real hospital management roles are conducted in German day to day, including budget meetings, staff management, and regulatory correspondence.$$,
    $$Hospital administration, healthcare consulting, and health-insurance-fund management roles are the most common destinations for graduates of this track. Because these programs often draw candidates already working in the German health system, a meaningful number of graduates move directly into a more senior role at their existing employer immediately after finishing the degree. Graduates already working clinically who complete an executive-format program frequently move into a department-head or medical-director-track role at their existing hospital within a few years of finishing, rather than needing to change employer to make use of the degree.$$,
    true,
    $$Health Management Master's Programs in Germany$$,
    $$Health management graduate programs in Germany: entry requirements, typical universities, and career paths into hospital administration and consulting.$$
  ),
  (
    (select id from study_field_categories where slug = 'healthcare-management-policy'),
    'health-policy',
    $$Health Policy$$,
    $$Health policy programs focus on policy analysis, comparative health-system design, and regulatory frameworks — for a doctor more interested in shaping how a health system is built than in treating patients within whatever system already exists. Coursework tends to be writing- and analysis-heavy rather than lab- or clinic-based, typically covering comparative health-system design, health law and regulation, and applied policy-analysis methods, often taught alongside students from a broader public-policy program rather than a purely health-focused cohort. Simulation exercises — drafting a policy brief for a hypothetical minister, or debating a proposed reform from opposing stakeholder positions — are a common and distinctive teaching method in these programs, meant to build practical policy-advocacy skills rather than only academic analysis. Several programs also require a supervised policy internship at a ministry, NGO, or research institute as a core, assessed part of the degree.$$,
    $$The Hertie School in Berlin, Bielefeld University, and the University of Bremen all run health-policy-focused graduate programs with a strong analytical and policy-writing core, several with direct connections to German federal health-policy institutions through guest lectures and internship placements. The Hertie School in particular draws a genuinely international student body with prior government, NGO, or multilateral-organization experience, which shapes the seminar discussions as much as the formal syllabus does.$$,
    $$A social-science or health background is equally welcome, and most programs ask for a substantial writing sample or analytical piece alongside the standard application materials, since strong written analysis is central to the degree itself. A demonstrated interest in a specific policy area — pharmaceutical regulation, insurance design, or health-system financing, for example — helps an application stand out. A short op-ed-style writing sample on a live health-policy question, rather than a purely academic essay, is what several programs specifically request and weigh most heavily in the file.$$,
    $$English-taught at institutions like the Hertie School specifically; German becomes more relevant for roles that involve direct engagement with German policy implementation after graduation, particularly at the federal or state ministry level.$$,
    $$Health ministries, WHO and EU health-policy bodies, think tanks, and health-focused NGOs are the most common employers for graduates of this track. A number of graduates also move into health-policy research roles at universities or independent research institutes, continuing the same analytical work in an academic rather than governmental setting. Graduates with a clinical background specifically are often sought after for health-policy roles precisely because they can translate abstract policy proposals into a realistic sense of what will or won't work at the point of patient care.$$,
    true,
    $$Health Policy Master's Programs in Germany$$,
    $$Health policy graduate programs in Germany: entry requirements, typical universities, and career paths in ministries, think tanks, and international bodies.$$
  ),
  (
    (select id from study_field_categories where slug = 'healthcare-management-policy'),
    'hospital-management',
    $$Hospital Management$$,
    $$Hospital management is a narrower, more operationally focused sibling of general health management, specifically about the financial and operational realities of running a hospital within the German system, and many programs build in an actual internship placement inside a German hospital as a core part of the degree. Coursework typically covers hospital financing and reimbursement (including Germany's DRG-based hospital payment system specifically), operations and staff management, and healthcare quality regulation, with the internship component often running for a full semester rather than a short summer placement. Because the internship placement runs for a full semester at many of these programs, students are typically assigned real operational responsibilities during it rather than shadowing only, which is part of why the placement so often leads directly to a subsequent job offer.$$,
    $$The University of Applied Sciences Osnabruck, Ostfalia University, and Munich Business School all run hospital-management-specific programs with structured internship components, several with placement partnerships already arranged with regional hospital groups rather than leaving students to find one independently. Each of these institutions maintains standing internship partnerships with named regional hospital groups, so it is worth asking a program directly which hospitals its students are actually placed with before applying.$$,
    $$Prior clinical or business-adjacent experience is genuinely useful, and some programs explicitly prefer candidates who are already working part-time in a healthcare setting alongside their studies, since the internship and coursework are both designed around that kind of practical, ongoing exposure to hospital operations. Basic working German ahead of enrollment, even if not formally required for admission, is genuinely advisable given how quickly the internship placement puts students into real, German-language hospital operations.$$,
    $$Predominantly German-medium, since the role itself is embedded directly in the day-to-day operation of the German hospital system — this is the field on this list where German fluency matters most for the coursework itself, not just eventual employment, given that both the internship placement and most course materials assume working German from the outset.$$,
    $$Hospital department management, private-clinic operations, and healthcare-sector consulting are the most direct outcomes for graduates of this track. Because the internship component so often leads directly into a job offer from the host hospital, this is one of the more reliably direct pipelines from degree to employment among the programs covered here. Regional hospital groups in particular are active, repeat recruiters from these specific programs, since the internship structure effectively functions as an extended, low-risk trial period for both the hospital and the student before any formal hiring decision is made.$$,
    true,
    $$Hospital Management Master's Programs in Germany$$,
    $$Hospital management graduate programs in Germany: internship structure, entry requirements, and career paths into hospital and clinic operations.$$
  ),
  (
    (select id from study_field_categories where slug = 'healthcare-management-policy'),
    'international-health-systems',
    $$International Health & Health Systems$$,
    $$This field compares how different countries actually finance, organize, and deliver healthcare — genuinely useful for a doctor who expects to work across more than one health system over a career, or who wants to work directly with an international development or health-financing organization rather than a single national system. Coursework typically covers comparative health-system typologies, global health financing mechanisms, and health-system strengthening in low- and middle-income settings, often taught by faculty with direct field experience at organizations like the World Bank or WHO. Group consulting-style projects — often analyzing a real health-financing challenge for a partner organization in a specific country — are a common capstone format, giving graduates a concrete deliverable to reference in job applications afterward.$$,
    $$Heidelberg University, Bielefeld University, and the University of Bonn (through its development-research-adjacent institutes) all offer programs with a comparative health-systems focus, several maintaining direct academic partnerships with international health-financing and development organizations. Bonn's institutes in particular benefit from the city's concentration of United Nations and international development organizations, which regularly feeds guest lectures and internship leads back into the program.$$,
    $$International or cross-cultural experience is genuinely valued in the application, alongside the standard clinical or public-health first degree most programs on this list expect. A specific interest in a particular region or type of health system — a stated interest in Sub-Saharan African health financing, for instance, rather than a generic interest in global health broadly — tends to strengthen an application. Prior work or volunteer experience specifically involving a health system outside the applicant's home country — even a short clinical elective abroad — is worth describing in concrete detail, since it directly signals the comparative, cross-border thinking the program is built around.$$,
    $$English-taught for the coursework; German is more relevant for roles specifically inside German development agencies after graduation than for the degree itself, since most international health-financing work happens in English regardless of the employing country.$$,
    $$Multilateral health agencies, international NGOs, and health-systems consulting are the most common destinations, with a doctoral research pathway available for graduates who want to continue studying health systems comparatively. Graduates with a clinical background specifically are often valued in these roles for being able to connect system-level financing decisions back to what actually happens for a patient at the point of care. A number of graduates also move into roles at bilateral development agencies (Germany's own GIZ being one common example) where a combination of clinical background and comparative health-systems training is specifically valued for project design and evaluation work.$$,
    true,
    $$International Health Master's Programs in Germany$$,
    $$International health and health systems graduate programs in Germany: entry requirements, typical universities, and career paths in global health financing.$$
  );

-- ── Blog categories ──────────────────────────────────────────────────────

insert into blog_categories (slug, name, description) values
  ('germany-pathway', $$Germany Pathway$$, $$Language training, FSP, KP, Approbation, and everything between B2 German and practicing as a doctor in Germany.$$),
  ('research-publication', $$Research & Publication$$, $$Study design, statistics, and the practical mechanics of getting a paper from idea to publication.$$),
  ('masters-admissions', $$Master's Admissions$$, $$Applying to a German Master's program as a doctor or medical-science graduate.$$);

-- ── Tags ─────────────────────────────────────────────────────────────────

insert into tags (slug, name) values
  ('fsp', $$FSP$$),
  ('approbation', $$Approbation$$),
  ('blocked-account', $$Blocked Account$$),
  ('meta-analysis', $$Meta Analysis$$),
  ('r-programming', $$R Programming$$),
  ('systematic-review', $$Systematic Review$$),
  ('biostatistics', $$Biostatistics$$),
  ('cdc-wonder', $$CDC Wonder$$),
  ('pmdc', $$PMDC$$),
  ('fcps', $$FCPS$$);

-- ── Blog posts ───────────────────────────────────────────────────────────
-- 3 fully written, published posts demonstrating the target format and
-- using every required MDX shortcode (Callout, Checklist, ComparisonTable) —
-- each maps to a real search query from the target audience. The 4 draft
-- stubs below are the rest of the initial content roadmap: topics that
-- need a subject-matter review against current, specific regulatory
-- figures before they can responsibly be published (see CLAUDE.md rule 9)
-- — draft status means anon_select_published_posts' RLS policy already
-- keeps them unreachable on the public site.

insert into blog_posts (slug, title, excerpt, body_mdx, cover_image_alt, author_id, category_id, reading_minutes, status, published_at, seo_title, seo_description) values
  (
    'fsp-preparation-guide-for-pakistani-doctors',
    $$FSP Preparation Guide for Pakistani Doctors$$,
    $$What the Fachsprachprufung actually tests, how long real preparation takes after B2, and a step-by-step plan for Pakistani doctors preparing for it.$$,
    $$Every Pakistani doctor on the German medical licensing pathway eventually hits the same wall: you can hold a conversation in German, you passed B2, and the Fachsprachprufung (FSP) still feels like an entirely different exam. That's because it is. The FSP doesn't test your German in the abstract — it tests whether you can *work* as a doctor in German, under time pressure, in front of an examiner who is deliberately playing a difficult patient or a skeptical colleague.

This guide walks through what the exam actually checks, how long real preparation takes, and a stage-by-stage plan that holds up for doctors coming from Pakistan's MBBS and House Job background specifically — not a generic "learn medical vocabulary" checklist.

## What the FSP Actually Tests

The FSP has three parts, always in the same order: a simulated patient interview (Anamnese), written case documentation based on that interview, and a doctor-to-doctor discussion (Arztbrief) where you present your findings to an examiner acting as a colleague.

<Callout type="info">
The FSP is graded on communication, not clinical accuracy. Examiners are checking whether you can build rapport, ask the right follow-up questions in German, and document clearly enough that another doctor could act on your notes — not whether your differential diagnosis is textbook-perfect.
</Callout>

That distinction matters more than most candidates realize going in. A Pakistani doctor with five years of clinical experience can genuinely fail the FSP on communication structure alone, while a less experienced candidate with well-drilled German communication habits can pass comfortably. The exam rewards *rehearsed structure*, not raw medical knowledge.

## How Long You Actually Need After B2

Most well-prepared candidates need somewhere between 6 and 10 weeks of focused FSP-specific preparation after reaching a genuine B2 level — not calendar B2 (having finished a B2 course) but functional B2, meaning you can already hold an unscripted conversation without translating in your head first. If B2 still feels effortful, budget extra time before starting FSP-specific work rather than layering it on top of a shaky foundation.

<ComparisonTable
  caption="Roughly how B2 German and FSP-specific preparation differ in focus"
  headers={["", "General B2 German", "FSP-Specific Preparation"]}
  rows={[
    ["Goal", "Everyday fluency", "Structured clinical communication under time pressure"],
    ["Vocabulary focus", "General topics", "Anamnese questions, symptom descriptions, Arztbrief phrasing"],
    ["Practice format", "Conversation, grammar drills", "Mock patient interviews, timed documentation, doctor-to-doctor role play"],
    ["Typical duration", "6–12 months", "6–10 weeks, once B2 is functional"],
  ]}
/>

## A Step-by-Step Preparation Plan

**Weeks 1–2: Anamnese structure.** Learn one repeatable structure for a patient interview — chief complaint, history of present illness, past medical history, medications, allergies, social history, review of systems — and drill it until asking those questions in order feels automatic, not something you're constructing sentence by sentence.

**Weeks 3–4: Case documentation speed.** Practice writing up a case immediately after a mock interview, under a strict time limit. This is where most candidates lose the most points — not from bad German, but from documentation that's too slow, disorganized, or missing information a German colleague would expect to see.

**Weeks 5–6: The Arztbrief and doctor-to-doctor discussion.** This is the most underrated part of FSP preparation. Presenting your findings out loud, in German, to someone playing a colleague — including handling follow-up questions you didn't prepare for — needs its own dedicated practice, separate from the interview and documentation stages.

**Weeks 7–8+: Full mock exams under real conditions.** Run the complete three-part sequence, timed, back to back, ideally with someone who has actually sat the exam or examined candidates before. This is where structural weaknesses that don't show up in isolated practice finally surface.

<Checklist
  items={[
    "Comfortable holding an unscripted German conversation without translating mentally first",
    "One memorized, repeatable Anamnese question structure",
    "Practiced writing case documentation under a strict time limit",
    "Rehearsed presenting a case out loud to a 'colleague' and handling follow-up questions",
    "Completed at least 3 full timed mock exams before the real one",
    "Confirmed your specific Ärztekammer's current retake policy",
  ]}
/>

## Common Mistakes Pakistani Candidates Make

The most common failure pattern isn't a vocabulary gap — it's structure collapsing under pressure. A candidate who can name every symptom in German still loses points by asking questions out of order, missing a key history item, or freezing when the "colleague" pushes back on their assessment. The fix for all three is the same: rehearsed repetition until the structure survives nerves, not more passive vocabulary study.

A second common mistake is treating B2 as a finish line rather than a starting point for FSP prep specifically. Passing a B2 exam and being ready to run a real Anamnese under time pressure are genuinely different skills, and candidates who skip straight from "I passed B2" to "I'm taking the FSP next month" without dedicated FSP-specific practice are the ones most likely to need a retake.

## Where This Fits in the Wider Pathway

The FSP is one stage in a longer sequence — see our [complete German medical licensing pathway](/germany) for how it connects to the Kenntnisprüfung, Approbation, and eventual specialist training. Our dedicated [FSP preparation page](/germany/fsp) also covers exam format and administering-chamber details in more depth than fits here.$$,
    $$A doctor practicing a patient interview in German ahead of the Fachsprachprufung exam.$$,
    (select id from mentors where slug = 'dr-saqib-muhammad'),
    (select id from blog_categories where slug = 'germany-pathway'),
    9,
    'published',
    now(),
    $$FSP Preparation Guide for Pakistani Doctors$$,
    $$A step-by-step FSP preparation guide for Pakistani doctors: what the exam tests, how long to prepare after B2, a study plan, and common mistakes to avoid.$$
  ),
  (
    'how-to-conduct-a-meta-analysis-in-r-step-by-step',
    $$How to Conduct a Meta-Analysis in R: Step by Step$$,
    $$A practical, code-included walkthrough of running a meta-analysis in R with the metafor package — from PRISMA to forest plot to publication bias.$$,
    $$A meta-analysis is one of the highest-yield publication types for a doctor or medical student without dedicated lab access — it needs a clear question, a rigorous search, and statistical competence, not a wet lab or patient recruitment. R, and specifically the `metafor` package, is the most widely used free toolchain for running one properly. This walkthrough covers the full pipeline, with real code, from question to publication-ready output.

## Step 1: Form a Genuinely Answerable Question (PICO)

Before opening R, the question itself has to be narrow enough to actually answer. Use the PICO structure — Population, Intervention, Comparison, Outcome — and be specific. "Does drug X help diabetes" is not answerable; "In adults with type 2 diabetes (P), does drug X (I) compared to placebo (C) reduce HbA1c at 12 weeks (O)" is.

<Callout type="tip">
The single most common reason a meta-analysis gets rejected at peer review isn't the statistics — it's a PICO question broad enough that the included studies are too clinically different to pool meaningfully in the first place.
</Callout>

## Step 2: Systematic Search and the PRISMA Flow

Run your search across at least two databases (commonly PubMed and Embase, sometimes Scopus or Cochrane CENTRAL as a third), using the same search string logic across each. Document every number as you go: records identified, duplicates removed, records screened, full texts assessed, and studies finally included — this becomes your PRISMA flow diagram, which reviewers will check line by line against your reported study count.

<Checklist
  items={[
    "PICO question defined and written down before searching",
    "Search run across at least two databases with a documented search string",
    "PRISMA flow numbers tracked at every stage (identified, screened, included)",
    "Data extraction form prepared before opening the included papers",
    "Risk-of-bias assessment tool selected (e.g. Cochrane RoB 2, Newcastle-Ottawa)",
  ]}
/>

## Step 3: Extract Your Data

For each included study you'll typically need: sample sizes, means and standard deviations (for continuous outcomes) or event counts (for binary outcomes), and enough study-level detail to assess risk of bias. Build this in a spreadsheet first — clean, one row per study — before it ever touches R.

## Step 4: Load Your Data and Compute Effect Sizes in R

```r
install.packages("metafor")
library(metafor)

# Example: continuous outcome, mean difference
dat <- escalc(
  measure = "MD",
  m1i = mean_treatment, sd1i = sd_treatment, n1i = n_treatment,
  m2i = mean_control,   sd2i = sd_control,   n2i = n_control,
  data = my_studies
)
```

`escalc()` computes the effect size and variance for each study from your raw extracted numbers — this is the step that turns a spreadsheet of study data into something `metafor` can actually pool.

## Step 5: Fixed-Effect vs. Random-Effects — Choosing the Right Model

<ComparisonTable
  caption="Choosing between the two core meta-analysis models"
  headers={["", "Fixed-Effect Model", "Random-Effects Model"]}
  rows={[
    ["Assumption", "One true effect size across all studies", "True effect varies across studies"],
    ["When appropriate", "Studies are clinically and methodologically very similar", "Studies differ in population, dose, or setting (the common case)"],
    ["metafor function", "rma(..., method = 'FE')", "rma(..., method = 'REML')"],
    ["Typical use in practice", "Rare in clinical meta-analysis", "Default choice for most published clinical meta-analyses"],
  ]}
/>

In practice, most clinical meta-analyses use a random-effects model by default, because it's rare for included studies to be similar enough in population and methodology to justify assuming one single true effect.

```r
res <- rma(yi, vi, data = dat, method = "REML")
summary(res)
```

## Step 6: Check Heterogeneity

The I² statistic tells you what proportion of the variation across studies is due to real differences between them rather than chance — `metafor`'s `summary()` output reports this automatically alongside the Q-test p-value. As a rough guide, I² above 50% suggests substantial heterogeneity worth investigating (via subgroup analysis or meta-regression) rather than reporting a single pooled estimate as if the studies were interchangeable.

## Step 7: Build the Forest Plot

```r
forest(res, slab = paste(my_studies$author, my_studies$year))
```

The forest plot is the figure every reviewer looks at first — one row per study showing its effect size and confidence interval, with the pooled diamond at the bottom. Label rows clearly with author and year; a forest plot with unlabeled or cryptically labeled rows is a fast way to get a revision request.

## Step 8: Check for Publication Bias

```r
funnel(res)
regtest(res)
```

A funnel plot that looks asymmetric — small studies clustering on one side — is a warning sign that smaller negative studies may never have been published at all. Egger's test (`regtest()`) gives you a formal p-value for that asymmetry, and both the plot and the test are expected in a properly reported meta-analysis.

<Callout type="warning">
Don't skip the publication-bias check even when your result "looks clean." Reviewers routinely ask for a funnel plot and Egger's test regardless of how the forest plot looks, and not including one is one of the most common reasons for a revise-and-resubmit.
</Callout>

## Step 9: Report It Properly

Follow the PRISMA 2020 checklist when writing up the manuscript — it specifies exactly what needs to be reported, in what order, and most journals will ask for a completed PRISMA checklist as a submission requirement, not an optional extra.

Once you're comfortable with this pipeline on one dataset, the same structure — PICO, search, extraction, `escalc()`, `rma()`, forest plot, funnel plot — applies to essentially any meta-analysis question you take on next.$$,
    $$A forest plot generated in R, showing pooled effect sizes across multiple studies for a meta-analysis.$$,
    (select id from mentors where slug = 'dr-haris-khan'),
    (select id from blog_categories where slug = 'research-publication'),
    11,
    'published',
    now(),
    $$How to Conduct a Meta-Analysis in R (Step by Step)$$,
    $$Step-by-step guide to running a meta-analysis in R with metafor: PICO question, PRISMA search, fixed vs random effects, forest plots, and publication bias.$$
  ),
  (
    'cdc-wonder-database-tutorial-for-medical-researchers',
    $$CDC WONDER Database Tutorial for Medical Researchers$$,
    $$A practical walkthrough of the CDC WONDER database — what it contains, how to run a real query, and how to turn the results into a publishable study.$$,
    $$CDC WONDER (Wide-ranging Online Data for Epidemiologic Research) is a free, public database maintained by the US Centers for Disease Control and Prevention — and one of the most accessible ways for a doctor anywhere in the world to produce an original, publishable epidemiological study without needing institutional data access or a research grant.

## What CDC WONDER Actually Contains

WONDER isn't one dataset — it's a portal to several, each covering a different slice of US public health data, all free to query online without an application process.

<ComparisonTable
  caption="A few of the most commonly used CDC WONDER datasets"
  headers={["Dataset", "What It Covers", "Typical Use"]}
  rows={[
    ["Multiple Cause of Death", "US death certificate data by cause, demographics, and location", "Mortality trend studies, cause-specific death rate analysis"],
    ["Natality", "US birth certificate data", "Birth outcome and maternal health studies"],
    ["Cancer Statistics", "Cancer incidence by type, demographics, and region", "Cancer epidemiology and disparity research"],
    ["Provisional Mortality Statistics", "More recent, provisional death data", "Near-real-time trend monitoring"],
  ]}
/>

## Step 1: Define Your Question Before You Touch the Query Tool

Just like a meta-analysis, a good WONDER-based study starts with a specific, answerable question — a particular cause of death, a specific age group, a specific time range, a specific comparison (by state, by sex, by year-over-year trend). Opening the query tool without a defined question first is the fastest way to end up with an unfocused dataset and no clear paper to write from it.

## Step 2: Running a Query, Step by Step

1. Go to the CDC WONDER homepage and select the dataset relevant to your question (for example, "Multiple Cause of Death").
2. Read the dataset's documentation page first — each dataset has its own rules about suppressed small counts and coding conventions that will directly affect your results.
3. Use the "Request Form" to set your grouping variables (for example: year, state, age group) and your measures (crude rate, age-adjusted rate, deaths).
4. Apply ICD-10 code filters for your specific cause of interest — WONDER lets you filter by ICD-10 code ranges, not just broad category names.
5. Export the results as a tab-delimited file for analysis in R, Excel, or your statistics package of choice.

<Callout type="tip">
ICD-10 coding nuances matter more than they first appear. A cause of death you assume maps to one ICD-10 range sometimes spans several, or overlaps with a related code your search would otherwise miss — always check the actual code list in WONDER's documentation rather than relying on a remembered code range.
</Callout>

## Step 3: Understand What the Data Can and Can't Tell You

WONDER data is aggregated and ecological — it describes populations, not individuals. This matters for how you can validly interpret your results.

<Callout type="warning">
Avoid the ecological fallacy: a trend visible at the population level (for example, a state with a higher rate of a given cause of death) cannot be used to make claims about individual-level causation. Reviewers will flag this immediately if your discussion section overreaches beyond what aggregated data can actually support.
</Callout>

Small counts are also suppressed in WONDER's public output for privacy reasons, which affects analyses of rare outcomes or small subgroups — check each dataset's documentation for its specific suppression threshold before designing a study around a narrow subgroup.

<Checklist
  items={[
    "Specific, answerable research question defined before opening the query tool",
    "Correct dataset selected and its documentation actually read",
    "ICD-10 codes (or equivalent) verified against the dataset's own code list",
    "Suppression rules for small counts checked for your specific subgroup",
    "Results exported and cross-checked against a second query for consistency",
    "Ecological nature of the data reflected accurately in your discussion section",
  ]}
/>

## Step 4: From Query Results to Publication

Once you have clean exported data, the analysis itself is usually straightforward descriptive or trend statistics — rate comparisons over time, across regions, or across demographic groups — well within reach using R, Stata, or even well-organized Excel. Structure the write-up as a standard observational study: background, methods (including the exact WONDER dataset, query parameters, and date accessed — reviewers will ask for this level of detail since WONDER data can be updated), results, and a discussion that stays within the bounds of what ecological, aggregated data can support.

Because it's public, free, and well-documented, CDC WONDER remains one of the most accessible entry points into original epidemiological research for a doctor without institutional data access — the main skill it actually demands is a well-defined question and careful attention to the dataset's own documentation, not advanced statistics.$$,
    $$A researcher querying public health mortality data on the CDC WONDER online database.$$,
    (select id from mentors where slug = 'dr-nadir-akhtar'),
    (select id from blog_categories where slug = 'research-publication'),
    8,
    'published',
    now(),
    $$CDC WONDER Database Tutorial for Medical Researchers$$,
    $$How to use the CDC WONDER database for medical research: available datasets, a step-by-step query walkthrough, and how to turn results into a publication.$$
  );

insert into blog_posts (slug, title, excerpt, body_mdx, cover_image_alt, category_id, status) values
  (
    'approbation-process-in-germany-for-non-eu-doctors',
    $$Approbation Process in Germany for Non-EU Doctors$$,
    $$A full walkthrough of the Approbation application for non-EU doctors — coming soon.$$,
    $$Content in progress. This guide will walk through the full Approbation application process for non-EU doctors, state by state, once our mentorship team has finished reviewing it for accuracy against each Bundesland's current requirements.$$,
    $$A doctor reviewing Approbation application documents.$$,
    (select id from blog_categories where slug = 'germany-pathway'),
    'draft'
  ),
  (
    'pmdc-publication-requirements-explained',
    $$PMDC Publication Requirements Explained$$,
    $$What Pakistani doctors need to know about PMDC publication requirements — coming soon.$$,
    $$Content in progress. Regulatory requirements change over time, so this article is being held back until it can be verified against current PMDC guidance before publishing.$$,
    $$A stack of medical journals representing publication requirements.$$,
    (select id from blog_categories where slug = 'research-publication'),
    'draft'
  ),
  (
    'cpsp-fcps-synopsis-format-and-common-mistakes',
    $$CPSP FCPS Synopsis Format and Common Mistakes$$,
    $$The correct FCPS synopsis format and the mistakes that most often get one rejected — coming soon.$$,
    $$Content in progress. This guide will cover the current CPSP synopsis format and the most common reasons a synopsis gets sent back for revision.$$,
    $$A doctor drafting an FCPS research synopsis.$$,
    (select id from blog_categories where slug = 'research-publication'),
    'draft'
  ),
  (
    'blocked-account-for-germany-current-requirements',
    $$Blocked Account for Germany: Current Requirements$$,
    $$What a German blocked account (Sperrkonto) actually requires — coming soon.$$,
    $$Content in progress. Blocked account amounts and provider requirements are updated periodically, so this article is being held until it can be checked against the current published figures before publishing.$$,
    $$Euro banknotes representing a German blocked account for student visa purposes.$$,
    (select id from blog_categories where slug = 'germany-pathway'),
    'draft'
  );

-- ── Blog post tags ───────────────────────────────────────────────────────

insert into blog_post_tags (post_id, tag_id)
select (select id from blog_posts where slug = 'fsp-preparation-guide-for-pakistani-doctors'), (select id from tags where slug = 'fsp')
union all
select (select id from blog_posts where slug = 'fsp-preparation-guide-for-pakistani-doctors'), (select id from tags where slug = 'approbation')
union all
select (select id from blog_posts where slug = 'how-to-conduct-a-meta-analysis-in-r-step-by-step'), (select id from tags where slug = 'meta-analysis')
union all
select (select id from blog_posts where slug = 'how-to-conduct-a-meta-analysis-in-r-step-by-step'), (select id from tags where slug = 'r-programming')
union all
select (select id from blog_posts where slug = 'how-to-conduct-a-meta-analysis-in-r-step-by-step'), (select id from tags where slug = 'systematic-review')
union all
select (select id from blog_posts where slug = 'how-to-conduct-a-meta-analysis-in-r-step-by-step'), (select id from tags where slug = 'biostatistics')
union all
select (select id from blog_posts where slug = 'cdc-wonder-database-tutorial-for-medical-researchers'), (select id from tags where slug = 'cdc-wonder')
union all
select (select id from blog_posts where slug = 'approbation-process-in-germany-for-non-eu-doctors'), (select id from tags where slug = 'approbation')
union all
select (select id from blog_posts where slug = 'pmdc-publication-requirements-explained'), (select id from tags where slug = 'pmdc')
union all
select (select id from blog_posts where slug = 'cpsp-fcps-synopsis-format-and-common-mistakes'), (select id from tags where slug = 'fcps')
union all
select (select id from blog_posts where slug = 'blocked-account-for-germany-current-requirements'), (select id from tags where slug = 'blocked-account');

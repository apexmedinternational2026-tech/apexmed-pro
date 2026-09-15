-- Founder correction + full mentor team roster, as supplied by the client.
--
-- FOUNDER CORRECTION: Dr. Nadir Akhtar is the Founder & Research Lead, not
-- Dr. Saqib Muhammad — Dr. Saqib is the Organizer. This reverses what the
-- site showed before. Dr. Nadir's row also gets its slug corrected back to
-- 'dr-nadir-akhtar' — it had drifted to 'ahmar' via a direct admin-panel
-- edit at some point outside this migration history (discovered live,
-- confirmed a real, human, in-progress edit — not something to treat as
-- a bug to silently "fix" without this being the intentional correction
-- the client is now making explicitly).
--
-- 13 new mentors added, matching the supplied roster exactly. Two existing
-- rows not mentioned in the new roster (the 'dr-ahmar-shamim' slug,
-- currently "Dr.Shanza Sajid" — a real admin-entered test row that keeps
-- changing live — and 'dr-muratza') are left untouched: not everything
-- live has to appear in every document the client sends, and neither is
-- this migration's business to delete on an inference.

update mentors set
  slug = 'dr-nadir-akhtar',
  role_title = 'Founder & Research Lead',
  qualification = 'MSc Biology',
  institution = 'Karlsruhe Institute of Technology (KIT), Baden-Württemberg, Germany',
  bio = 'Founder and Research Lead of ApexMed International, an M.Phil student at Karlsruhe Institute of Technology (KIT), Baden-Württemberg, Germany, with 20+ international research publications. Expertise in meta-analysis, systematic reviews, research methodology, scientific writing, data analysis, research project development, and publication strategy.',
  publications_count = 20,
  is_leadership = true,
  sort_order = 1
where slug = 'ahmar';

update mentors set
  role_title = 'Organizer',
  bio = 'Organizer at ApexMed International — a researcher and medical educator with 30+ international, PubMed-indexed publications. Expertise in original research, meta-analysis, scientific writing, publication guidance, and research methodology. Also mentors ApexMed''s AI in Healthcare programme.',
  is_leadership = true,
  sort_order = 2
where slug = 'dr-saqib-muhammad';

update mentors set
  role_title = 'Medical Research Mentor',
  bio = 'Medical research mentor at ApexMed International, supporting mentees with research methodology, scientific writing, academic guidance, and research project support.'
where slug = 'dr-shanza-gul';

update mentors set
  role_title = 'Medical Research Mentor',
  bio = 'Medical research mentor at ApexMed International, supporting mentees with research methodology, scientific writing, academic guidance, and research project support.'
where slug = 'dr-faiza-kiran';

update mentors set
  role_title = 'Germany Medical Pathway Mentor',
  qualification = 'Medical Doctor',
  institution = 'Baden-Württemberg, Germany',
  bio = 'Germany Medical Pathway mentor at ApexMed International, with training and medical pathway experience in Baden-Württemberg, Germany, and B2-level German language proficiency. Focus areas: the German medical pathway, medical German, FSP pathway guidance, Germany career guidance, and IMG guidance.'
where slug = 'dr-haris-khan';

update mentors set
  role_title = 'Psychiatry Mentor',
  qualification = 'MBBS, FCPS Psychiatry',
  bio = 'Psychiatry mentor at ApexMed International''s Mental Health Support programme. Focus areas: psychiatry, mental health, clinical guidance, and psychological/mental health education.'
where slug = 'dr-alia';

update mentors set
  role_title = 'Psychiatry Mentor',
  qualification = 'MBBS, FCPS Psychiatry',
  bio = 'Psychiatry mentor at ApexMed International''s Mental Health Support programme. Focus areas: psychiatry, mental health, clinical guidance, and psychological/mental health education.'
where slug = 'dr-waheed-alam';

insert into mentors (slug, full_name, role_title, qualification, institution, bio, publications_count, is_leadership, is_published, sort_order) values
  ('dr-saajid-ahmed', 'Dr. Saajid Ahmed', 'Research Mentor', null, 'Quaid-i-Azam University, Islamabad', 'Research mentor at ApexMed International. Expertise in research mentorship, scientific writing, research methodology, and academic guidance. Academic and research background associated with Quaid-i-Azam University, Islamabad.', 0, false, true, 10),
  ('dr-javeria-gul', 'Dr. Javeria Gul', 'CDC Specialist', null, 'Khyber Medical College, Peshawar', 'CDC Specialist at ApexMed International, with 40+ international publications.', 40, false, true, 11),
  ('dr-waseem-khan', 'Dr. Waseem Khan', 'Meta-Analysis Specialist', null, null, 'Meta-Analysis Specialist at ApexMed International, with 30+ international publications.', 30, false, true, 12),
  ('dr-salman-ahmed', 'Dr. Salman Ahmed', 'Germany Medical Career Mentor', 'Medical Doctor', null, 'Germany Medical Career mentor at ApexMed International, a medical doctor practicing in Germany. Focus areas: the German medical career, hospital environment, medical practice in Germany, Germany pathway guidance, and career orientation for international doctors.', 0, false, true, 13),
  ('dr-talha-khan', 'Dr. Talha Khan', 'German Language Teacher', 'B2 Certified', 'Whitecliffe University of Applied Sciences', 'German Language Teacher at ApexMed International, B2 certified, and a Master''s student at Whitecliffe University of Applied Sciences.', 0, false, true, 14),
  ('dr-saira-geelani', 'Dr. Saira Geelani', 'MRCP/PLAB Mentor', 'MRCS', null, 'MRCP/PLAB mentor at ApexMed International.', 0, false, true, 15),
  ('dr-aleena-durrani', 'Dr. Aleena Durrani', 'MRCP/PLAB Mentor', 'MBBS, MRCP', null, 'MRCP/PLAB mentor at ApexMed International.', 0, false, true, 16),
  ('dr-sundas-khan', 'Dr. Sundas Khan', 'MRCP/PLAB Mentor', 'MBBS, PLAB 2 Qualified', null, 'MRCP/PLAB mentor at ApexMed International.', 0, false, true, 17),
  ('dr-shehzad', 'Dr. Shehzad', 'USMLE Mentor', 'USMLE Step 3 Qualified, ECFMG Certified', null, 'USMLE mentor at ApexMed International, a Pediatrics physician.', 0, false, true, 18),
  ('dr-bilal-nazer', 'Dr. Bilal Nazer', 'USMLE Mentor', 'USMLE Step 3 Qualified, ECFMG Certified', null, 'USMLE mentor at ApexMed International, an Internal Medicine physician.', 0, false, true, 19),
  ('dr-naila-jadoon', 'Dr. Naila Jadoon', 'USMLE Mentor', 'ECFMG Certified', null, 'USMLE mentor at ApexMed International, an Internal Medicine physician.', 0, false, true, 20),
  ('dr-aleem-khan', 'Dr. Aleem Khan', 'AI in Healthcare Mentor', null, null, 'AI in Healthcare mentor at ApexMed International.', 0, false, true, 21),
  ('dr-bacha-khan', 'Dr. Bacha Khan', 'Green Earth Project Mentor', 'PhD in Environmental Sciences', null, 'Green Earth Project mentor at ApexMed International, with a PhD in Environmental Sciences.', 0, false, true, 22);

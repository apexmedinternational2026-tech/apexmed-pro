-- Brings the three compliance disclaimers up to the client's Phase 1
-- content brief's exact wording — a data fix, not a schema change, but
-- routed through a migration anyway (rather than a one-off UPDATE run by
-- hand) so this text change is reproducible in every environment and
-- shows up in git history, matching how every other content decision in
-- this project is tracked. The original wording (see
-- supabase/seed.sql's original insert) was missing two sentences the
-- client's real brief includes: journal-indexing verification and
-- federal-state variation — both narrow the promise being made, so this
-- is a strictly more conservative disclaimer, never a looser one.

update compliance_disclaimers
set body = 'Publication opportunities are subject to project availability, genuine scholarly contribution, journal requirements, peer review, and editorial decisions. Authorship is based on genuine scholarly contribution and applicable authorship standards. Journal indexing status should be verified at the time of submission.'
where key = 'publication';

update compliance_disclaimers
set body = 'Licensing, Approbation, employment, residency, visa and other official decisions are subject to the requirements and decisions of the relevant authorities and institutions. Requirements vary by federal state, qualification and current regulations. ApexMed International provides guidance and mentorship and does not guarantee any official outcome.'
where key = 'germany_licensing';

update compliance_disclaimers
set body = 'Eligibility, deadlines, fees, language requirements and program availability are determined by each university and are subject to change. Applicants should verify current official requirements before making any financial commitment.'
where key = 'admissions';

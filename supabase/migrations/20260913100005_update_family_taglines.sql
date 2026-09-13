-- Aligns the two program families' taglines with the client's Phase 1
-- content brief's exact "two-family split" copy — rendered on the
-- homepage by components/home/family-split.tsx.

update program_families
set tagline = 'Learn research methodology, run real projects, and prepare manuscripts for publication — from your first study design to journal submission.'
where slug = 'research';

update program_families
set tagline = 'German language from A1, medical German, FSP and KP preparation, Approbation guidance, and Master''s admissions support.'
where slug = 'german-dream';

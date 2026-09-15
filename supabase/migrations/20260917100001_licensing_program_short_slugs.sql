-- Renames the 4 International Licensing programs to short slugs matching
-- their dedicated route (/international-exams/usmle, not
-- /programs/usmle-mentorship) — these reuse the generic programs/[slug]
-- template (still reachable at /programs/<slug> too), but canonical_path
-- points search engines at the purpose-built /international-exams page.
-- Safe to rename freely: these programs are still unpublished, so no
-- external link has ever pointed at the old slugs.

update programs set slug = 'usmle', canonical_path = '/international-exams/usmle' where slug = 'usmle-mentorship';
update programs set slug = 'plab', canonical_path = '/international-exams/plab' where slug = 'plab-mentorship';
update programs set slug = 'mrcp', canonical_path = '/international-exams/mrcp' where slug = 'mrcp-mentorship';
update programs set slug = 'amc', canonical_path = '/international-exams/amc' where slug = 'amc-mentorship';

-- Flips the 4 International Licensing pathways live now that their
-- content (20260917100002) and pages (/international-exams, PART 2 of the
-- new-sections build brief) both exist and were verified together.
update programs set is_published = true where slug in ('usmle', 'plab', 'mrcp', 'amc');

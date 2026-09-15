-- Per PART 4 of the brief, AI Healthcare / Green Earth / Mental Health
-- have no service_items rows — a service with zero items renders its own
-- linked content directly on the hub page instead of a click-through
-- grid. To make that lookup simple, the linked course/initiative/
-- support_service's slug matches its parent service's slug exactly (the
-- hub page just queries by the same slug it already has) — so the course
-- seeded in 20260919100000 as 'ai-for-healthcare' is renamed here to
-- 'ai-healthcare', matching the services row (published moments ago in
-- the same session, so no external link has had a chance to point at the
-- old slug yet).

update courses set slug = 'ai-healthcare' where slug = 'ai-for-healthcare';

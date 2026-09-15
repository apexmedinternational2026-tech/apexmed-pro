-- The Membership Cards grid orders by sort_order globally, but each
-- program family kept its own independent 1..N counter (Research: 1-3,
-- German Dream: 1-4) — with matching numbers, ties interleaved the two
-- families rather than grouping them, which is what the client's
-- screenshot showed (Blue, Research, Meta-Analysis, Green, Gold, CDC,
-- Master — alternating). Shifting German Dream's four Cards to 4-7 (their
-- relative order among themselves unchanged) puts every Research Card
-- ahead of every German Dream Card, per explicit request.
update programs set sort_order = 4 where slug = 'blue-card';
update programs set sort_order = 5 where slug = 'green-card';
update programs set sort_order = 6 where slug = 'gold-card';
update programs set sort_order = 7 where slug = 'master-card';

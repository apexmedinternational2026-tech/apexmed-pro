-- Defense-in-depth: lock table-level GRANTs down to exactly what each
-- table's own migration already documents as intended.
--
-- Discovered by actually running supabase/tests/rls.test.sql against a
-- real, live project for the first time (previously impossible in this
-- project's development environment — see database.types.ts's header).
-- The test expected `set local role anon; select ... from leads` to fail
-- with insufficient_privilege, since no earlier migration ever grants
-- anon SELECT on leads. It didn't fail — because Supabase provisions
-- every new database with default privileges that grant ALL (SELECT,
-- INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER) on every new
-- public-schema table to anon and authenticated automatically, a
-- platform-level default entirely separate from, and broader than, any
-- `grant` statement written in this project's own migrations.
--
-- This is *not* an active data exposure: RLS was already correctly
-- filtering every unintended read (confirmed directly — anon reads zero
-- rows from `leads` despite technically holding a SELECT grant), and
-- PostgREST never exposes raw TRUNCATE through the REST API regardless of
-- the underlying grant. But it means RLS has been the *only* layer
-- between anon/authenticated and full read/write/truncate access on
-- every table — if RLS were ever accidentally disabled on one table (a
-- bad migration, a manual dashboard mistake), the pre-existing broad
-- grant would immediately allow full access with no second layer to catch
-- it. This migration removes that single point of failure.

revoke all on table
  compliance_disclaimers,
  site_settings,
  admin_profiles,
  program_families,
  programs,
  program_modules,
  program_module_items,
  program_audiences,
  program_journey_steps,
  mentors,
  testimonials,
  blog_categories,
  blog_posts,
  tags,
  blog_post_tags,
  study_field_categories,
  study_fields,
  webinars,
  webinar_registrations,
  leads,
  contact_messages
from anon, authenticated;

-- Public, read-only content — matches every earlier migration's own
-- "grant select ... to anon, authenticated" exactly. RLS policies (see
-- each table's own migration) then filter rows — published-only, etc. —
-- within that.
grant select on table
  compliance_disclaimers,
  site_settings,
  program_families,
  programs,
  program_modules,
  program_module_items,
  program_audiences,
  program_journey_steps,
  mentors,
  testimonials,
  blog_categories,
  blog_posts,
  tags,
  blog_post_tags,
  study_field_categories,
  study_fields,
  webinars
to anon, authenticated;

-- Staff-profile lookups: authenticated only, matching
-- authenticated_select_own_admin_profile — anon gets nothing on this
-- table at all.
grant select on table admin_profiles to authenticated;

-- Write-only, anon-submitted forms — INSERT only, matching each table's
-- own anon_insert_* policy. No SELECT/UPDATE/DELETE for anyone but the
-- service role, which bypasses grants and RLS entirely.
grant insert on table leads to anon;
grant insert on table contact_messages to anon;
grant insert on table webinar_registrations to anon;

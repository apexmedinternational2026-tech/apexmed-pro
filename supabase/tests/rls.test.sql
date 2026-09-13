-- RLS smoke test.
--
-- Run against a database that has had the migrations applied (seed data is
-- not required — this script creates and cleans up its own fixture data).
--
--   psql "$SUPABASE_DB_URL" -f supabase/tests/rls.test.sql
--   -- or --
--   supabase db execute -f supabase/tests/rls.test.sql
--
-- Must be run as a role that can bypass RLS (e.g. the default `postgres`
-- connection role), since it sets up fixtures before switching to `anon`.
-- Everything happens inside one transaction that is rolled back at the
-- end, so this script never leaves data behind.

begin;

-- Fixture: an unpublished program, created (as the superuser role) so we
-- have something concrete that "should be invisible to anon" means.
do $$
declare
  v_program_id uuid;
  v_family_id uuid;
  v_disclaimer_key text;
begin
  select id into v_family_id from program_families limit 1;
  if v_family_id is null then
    insert into program_families (slug, name)
    values ('rls-test-family', 'RLS Test Family')
    returning id into v_family_id;
  end if;

  select key into v_disclaimer_key from compliance_disclaimers limit 1;
  if v_disclaimer_key is null then
    insert into compliance_disclaimers (key, body)
    values ('rls-test-disclaimer', 'Test disclaimer body.')
    returning key into v_disclaimer_key;
  end if;

  insert into programs (family_id, slug, name, headline, summary, disclaimer_key, is_published)
  values (v_family_id, 'rls-test-unpublished-program', 'RLS Test Program', 'Headline', 'Summary', v_disclaimer_key, false)
  returning id into v_program_id;

  -- is_local = true: this GUC survives only for the current transaction,
  -- which is fine since the role switch below happens in the same one.
  perform set_config('rls_test.program_id', v_program_id::text, true);
end $$;

-- From here on, everything runs as the anon role — exactly what a browser
-- request authenticated with the public anon API key is evaluated as.
set local role anon;

-- 1. leads: anon was never GRANTed SELECT on this table (only INSERT), and
--    no SELECT policy exists either. This must fail at the privilege
--    level, before RLS is even consulted.
do $$
begin
  perform 1 from leads limit 1;
  raise exception 'RLS TEST FAILED: anon was able to SELECT from leads';
exception
  when insufficient_privilege then
    raise notice 'PASS: anon cannot SELECT leads (permission denied)';
end $$;

-- 2. programs: anon *is* granted SELECT, but the RLS policy restricts rows
--    to is_published = true. Selecting the unpublished fixture program
--    must come back empty — not error, and definitely not return the row.
do $$
declare
  v_count integer;
begin
  select count(*) into v_count
  from programs
  where id = current_setting('rls_test.program_id')::uuid;

  if v_count <> 0 then
    raise exception 'RLS TEST FAILED: anon could read an unpublished program';
  end if;

  raise notice 'PASS: anon reads zero rows for an unpublished program';
end $$;

-- 3. testimonials: anon is granted SELECT but was never granted UPDATE,
--    and no UPDATE policy exists. This must fail at the privilege level.
do $$
begin
  update testimonials set is_approved = true where true;
  raise exception 'RLS TEST FAILED: anon was able to UPDATE testimonials';
exception
  when insufficient_privilege then
    raise notice 'PASS: anon cannot UPDATE testimonials (permission denied)';
end $$;

-- Undo everything: fixture rows, role switch, all of it.
rollback;

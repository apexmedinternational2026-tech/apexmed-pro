-- Public visitor accounts (doctors/students), layered on top of the
-- existing anonymous submission flow rather than replacing it — a lead or
-- webinar registration submitted without being signed in must keep working
-- exactly as before (anon_insert_leads / anon_insert_webinar_registrations
-- are untouched by this migration). user_id is purely additive: NULL for
-- every anonymous submission, populated only when the API route sees an
-- active session at write time (see app/api/leads/route.ts and
-- app/api/webinar-registrations/route.ts).
--
-- Deliberately no new "profiles" table for visitors: a full_name is
-- captured once at sign-up into auth.users' own metadata (see
-- lib/actions/auth.ts) rather than duplicated into a second table this
-- project would have to keep in sync — admin_profiles exists as a
-- separate table because admin status itself is the thing being modeled
-- (its presence/absence *is* the authorization check); a visitor account
-- has no equivalent second fact to store yet.

alter table leads
  add column user_id uuid references auth.users(id) on delete set null;

alter table webinar_registrations
  add column user_id uuid references auth.users(id) on delete set null;

create index leads_user_id_idx on leads (user_id) where user_id is not null;
create index webinar_registrations_user_id_idx on webinar_registrations (user_id) where user_id is not null;

-- Mirrors anon_insert_leads exactly, for the authenticated role — a
-- signed-in visitor submitting the same profile-assessment form must be
-- able to, same as an anonymous one.
create policy "authenticated_insert_leads" on leads
  for insert
  to authenticated
  with check (true);

-- The one new capability this migration actually exists for: a visitor
-- can read their own submitted leads (and only their own — auth.uid()
-- makes this impossible to widen via a crafted query), which is what
-- powers the "My Account" page. Still nobody's UPDATE/DELETE: a
-- submitted lead stays exactly as submitted.
create policy "authenticated_select_own_leads" on leads
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "authenticated_insert_webinar_registrations" on webinar_registrations
  for insert
  to authenticated
  with check (
    exists (
      select 1 from webinars w
      where w.id = webinar_registrations.webinar_id
        and w.is_published = true
    )
  );

create policy "authenticated_select_own_webinar_registrations" on webinar_registrations
  for select
  to authenticated
  using (user_id = auth.uid());

-- 20260913100002_lock_down_default_grants.sql already revoked the
-- platform's over-broad defaults on these tables — this only grants the
-- two new privileges the policies above actually use.
grant insert on table leads to authenticated;
grant select on table leads to authenticated;
grant insert on table webinar_registrations to authenticated;
grant select on table webinar_registrations to authenticated;

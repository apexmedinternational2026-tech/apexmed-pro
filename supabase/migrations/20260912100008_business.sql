-- Business: lead capture and contact form submissions. Both are
-- write-only from the anon role's point of view — see the RLS policies
-- below.

create table leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  country text,
  current_status text check (current_status in ('medical_student', 'doctor_general', 'doctor_specialist', 'resident', 'other')),
  interest_type text check (
    interest_type in (
      'apexmed_research_card',
      'master_meta_analysis_card',
      'cdc_specialist_card',
      'blue_card',
      'green_card',
      'gold_card',
      'master_card',
      'general_inquiry'
    )
  ),
  -- Optional: a lead can reference a Card without that Card ever being
  -- deleted-out-from-under it — the lead record itself must survive.
  program_id uuid references programs(id) on delete set null,
  message text,
  source_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'converted', 'closed')),
  admin_notes text,
  created_at timestamptz not null default now()
);

create index leads_program_id_idx on leads (program_id);
create index leads_status_created_at_idx on leads (status, created_at desc);

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table leads enable row level security;
alter table contact_messages enable row level security;

-- Public lead-capture forms (contact, profile assessment) must work
-- without an account.
create policy "anon_insert_leads" on leads
  for insert
  to anon
  with check (true);

-- A lead record holds a prospect's name, email, phone, and admin notes
-- written about them. Deliberately no SELECT policy: with RLS's
-- default-deny, anon (and any authenticated non-admin) always gets zero
-- rows, so a leaked anon key can never be used to scrape the leads table —
-- only the service role (which bypasses RLS) can read it. No UPDATE/DELETE
-- policy either, for the same reason: a submitted lead can't be altered or
-- erased by the person who submitted it.
create policy "anon_insert_contact_messages" on contact_messages
  for insert
  to anon
  with check (true);

-- Same reasoning as leads: a contact message is unsolicited PII from a
-- site visitor, readable only through the service role from the admin
-- backend.

grant insert on table leads to anon;
grant insert on table contact_messages to anon;

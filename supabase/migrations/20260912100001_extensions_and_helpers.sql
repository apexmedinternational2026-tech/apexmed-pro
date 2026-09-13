-- Extensions and shared helpers used by every later migration.

create extension if not exists pgcrypto; -- provides gen_random_uuid()

-- Single trigger function for updated_at maintenance. Attached (in later
-- migrations) to every table that has an updated_at column, so timestamp
-- upkeep never depends on application code remembering to set it.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function set_updated_at() is
  'BEFORE UPDATE trigger: stamps updated_at with the current time. Attach to any table with an updated_at column.';

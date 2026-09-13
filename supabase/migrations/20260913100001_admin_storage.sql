-- Storage for admin-uploaded images (blog cover images today; mentor
-- photos / program hero images can reuse the same bucket under their own
-- folder prefix later).
--
-- No custom RLS policies on storage.objects are needed for this bucket:
-- reads are served straight from the public URL because the bucket itself
-- is public (`public = true` below) — Storage doesn't consult
-- storage.objects policies for a public bucket's read path — and every
-- write in this app goes through the service-role admin client
-- (lib/supabase/admin.ts) from an already-authorized Server Action, which
-- bypasses RLS entirely, the same way every other admin write in this
-- schema does. storage.objects itself still has Supabase's own
-- RLS enabled by default, satisfying CLAUDE.md rule 3 without this
-- migration needing to add anything on top of it.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

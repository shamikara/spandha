-- Spandha Supabase RLS hardening
--
-- Run this in the Supabase SQL editor after your Prisma tables exist.
--
-- Current app architecture:
-- - The browser talks to Next.js API routes.
-- - Next.js API routes use Prisma + DATABASE_URL.
-- - Users are identified by the app JWT cookie, not Supabase Auth.
--
-- Because of that, the safest Supabase default is to enable RLS and prevent
-- anon/authenticated Supabase API roles from reading or writing app tables.
-- Prisma/server routes remain responsible for authorization.

begin;

-- Remove direct table access from browser-facing Supabase roles.
revoke all on table
  public.users,
  public.profiles,
  public.preferences,
  public.adverts,
  public.interests,
  public.notifications,
  public.content_blocks
from anon, authenticated;

-- If sequences are introduced later, keep browser-facing roles from using them.
revoke all on all sequences in schema public from anon, authenticated;

-- Enable RLS on all application tables.
alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.preferences enable row level security;
alter table public.adverts enable row level security;
alter table public.interests enable row level security;
alter table public.notifications enable row level security;
alter table public.content_blocks enable row level security;

-- Drop policies if this script is re-run.
drop policy if exists "No direct client access to users" on public.users;
drop policy if exists "No direct client access to profiles" on public.profiles;
drop policy if exists "No direct client access to preferences" on public.preferences;
drop policy if exists "No direct client access to adverts" on public.adverts;
drop policy if exists "No direct client access to interests" on public.interests;
drop policy if exists "No direct client access to notifications" on public.notifications;
drop policy if exists "No direct client access to content blocks" on public.content_blocks;

-- Explicit deny policies. These make the intent obvious in the Supabase UI.
create policy "No direct client access to users"
  on public.users
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "No direct client access to profiles"
  on public.profiles
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "No direct client access to preferences"
  on public.preferences
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "No direct client access to adverts"
  on public.adverts
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "No direct client access to interests"
  on public.interests
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "No direct client access to notifications"
  on public.notifications
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "No direct client access to content blocks"
  on public.content_blocks
  for all
  to anon, authenticated
  using (false)
  with check (false);

commit;

-- Verification query:
-- select
--   schemaname,
--   tablename,
--   rowsecurity
-- from pg_tables
-- where schemaname = 'public'
--   and tablename in (
--     'users',
--     'profiles',
--     'preferences',
--     'adverts',
--     'interests',
--     'notifications',
--     'content_blocks'
--   )
-- order by tablename;

-- Future option:
-- If you later use Supabase Auth directly from the browser, replace the deny
-- policies with user-scoped policies. Because Spandha currently uses CUID user
-- IDs and app JWT cookies, Supabase Auth's auth.uid() will not automatically
-- match users.id without a mapping table or a custom JWT claim.

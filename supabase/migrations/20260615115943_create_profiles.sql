-- Role-based access control: a `profiles` table mirroring `auth.users`, with the
-- authoritative role stored in `auth.users.raw_app_meta_data` (the JWT's
-- `app_metadata`, which users cannot edit) and synced down to this table so RLS
-- policies can make ownership/role decisions at the database level.
--
-- NOTE ON THE ADMIN POLICIES: the original spec expressed the admin checks as an
-- inline `exists (select 1 from public.profiles where id = auth.uid() and ...)`.
-- A policy ON public.profiles that itself SELECTs public.profiles triggers RLS
-- recursively and Postgres aborts with "infinite recursion detected in policy for
-- relation profiles" (42P17). We keep the intended behaviour (role read from the
-- profiles table, kept in sync by the set-role API) but route the check through a
-- SECURITY DEFINER helper, `public.is_admin()`, which bypasses RLS and so breaks
-- the recursion. The check is still self-scoped (it only inspects the caller's own
-- row via auth.uid()), so it cannot be abused for privilege escalation.

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  role       text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- New-user trigger: create a profile row whenever an auth user is created.
-- SECURITY DEFINER so the insert bypasses RLS (there is intentionally no INSERT
-- policy on profiles — rows are only ever created by this trigger). The role is
-- read from app_metadata (set server-side with the service role), never from the
-- user-editable user_metadata, and falls back to 'user'.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_app_meta_data ->> 'role', 'user')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Backfill: the trigger above only fires for FUTURE signups, so seed a profile row
-- for every user that already exists. Idempotent via ON CONFLICT, so re-running is
-- safe. Runs as the migration role (bypasses RLS).
insert into public.profiles (id, email, role)
select id, email, coalesce(raw_app_meta_data ->> 'role', 'user')
from auth.users
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Admin check helper (recursion-safe — see note at top of file).
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- Since 2026-04-28 new public tables are NOT auto-exposed to the Data API, so the
-- `authenticated` role needs an explicit grant for the SELECT policies below to be
-- reachable via supabase-js. Writes go exclusively through the service-role admin
-- client (which bypasses RLS), so no UPDATE/INSERT grant is given to authenticated.
grant select on table public.profiles to authenticated;

create policy "Users can view own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Admins can view all profiles"
  on public.profiles
  for select
  to authenticated
  using ((select public.is_admin()));

-- UPDATE needs both USING (which existing rows may be targeted) and WITH CHECK
-- (what the row may become) — without WITH CHECK an admin could rewrite rows into
-- a state the policy would otherwise forbid.
create policy "Admins can update roles"
  on public.profiles
  for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

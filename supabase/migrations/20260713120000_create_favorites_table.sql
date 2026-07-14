-- Favorites: a user's saved motorcycle listings.
--
-- Pure association (join) table between auth.users and public.motorcycles. A row's
-- existence == "this user favorited this listing"; its absence == not favorited.
-- There is deliberately no surrogate id and no UPDATE path: a favorite is added by
-- INSERT and removed by DELETE only. Favorites are PRIVATE to their owner (unlike
-- the public-readable motorcycles catalog).

create table public.favorites (
  user_id       uuid not null references auth.users (id) on delete cascade,
  motorcycle_id uuid not null references public.motorcycles (id) on delete cascade,
  created_at    timestamptz not null default now(),
  -- Composite PK is both the natural key and the "can't favorite the same listing
  -- twice" uniqueness constraint. user_id leads so "list my favorites" and "is this
  -- favorited by me" (both filter user_id first) use this index directly.
  primary key (user_id, motorcycle_id)
);

-- Postgres does NOT auto-index the referencing side of a FK. Without this, the
-- ON DELETE CASCADE from motorcycles seq-scans favorites per deleted listing.
create index favorites_motorcycle_id_idx on public.favorites (motorcycle_id);

-- RLS is required on public-schema tables.
alter table public.favorites enable row level security;

-- New public tables are NOT auto-exposed to the Data API (auto_expose_new_tables =
-- false), so the Data API role needs an explicit grant. Favorites are private, so
-- ONLY `authenticated` is granted (no `anon`), and there is no UPDATE (no update path).
grant select, insert, delete on table public.favorites to authenticated;

-- RLS: purely self-scoped. No public-read policy (a favorites list is private) and
-- no is_admin() override (nothing here reads across users, so no recursion concern).
create policy "Users can view their own favorites"
  on public.favorites for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own favorites"
  on public.favorites for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can remove their own favorites"
  on public.favorites for delete
  to authenticated
  using ((select auth.uid()) = user_id);

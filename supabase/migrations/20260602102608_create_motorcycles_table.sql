create table public.motorcycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  make text not null,
  model text not null,
  year integer not null check (year >= 1885 and year <= extract(year from now()) + 1),
  engine_cc integer,
  mileage integer default 0,
  color text,
  vin text unique,
  description text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS (required for public schema tables)
alter table public.motorcycles enable row level security;

-- Grant access to authenticated role (tables are no longer auto-exposed as of Apr 28 2026)
grant select, insert, update, delete on table public.motorcycles to authenticated;

-- RLS policies: users can only access their own motorcycles
create policy "Users can view their own motorcycles"
  on public.motorcycles for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own motorcycles"
  on public.motorcycles for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own motorcycles"
  on public.motorcycles for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own motorcycles"
  on public.motorcycles for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Auto-update updated_at on row changes
create function public.handle_updated_at()
returns trigger
language plpgsql
security invoker
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger motorcycles_updated_at
  before update on public.motorcycles
  for each row execute function public.handle_updated_at();
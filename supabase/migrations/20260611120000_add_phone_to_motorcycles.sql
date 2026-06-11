-- Add phone column to motorcycles for seller contact

alter table public.motorcycles
  add column if not exists phone text;

-- Allow selecting phone by anon (keeps public read behavior)
grant select(phone) on table public.motorcycles to anon;

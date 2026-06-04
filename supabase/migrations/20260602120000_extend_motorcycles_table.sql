-- Rename make → brand to match the form field (if it exists)
do $$
begin
  if exists(select 1 from information_schema.columns where table_name='motorcycles' and column_name='make') then
    alter table public.motorcycles rename column make to brand;
  end if;
end
$$;

-- Add columns needed by the create-product form (use if not exists for safety)
alter table public.motorcycles
  add column if not exists name             text,
  add column if not exists engine           text,
  add column if not exists power_kw         integer,
  add column if not exists price            numeric(10, 2),
  add column if not exists in_stock         boolean      not null default true,
  add column if not exists license_categories text[]     not null default '{}',
  add column if not exists silhouette_category text,
  add column if not exists photo_urls       text[]       not null default '{}';

-- Replace single image_url with photo_urls array (already added above)
alter table public.motorcycles drop column if exists image_url;

-- Drop columns not used by the form
alter table public.motorcycles drop column if exists engine_cc;
alter table public.motorcycles drop column if exists mileage;
alter table public.motorcycles drop column if exists vin;
alter table public.motorcycles drop column if exists description;

-- Create the motorcycle-photos bucket (public so image URLs are readable without auth)
insert into storage.buckets (id, name, public)
values ('motorcycle-photos', 'motorcycle-photos', true)
on conflict (id) do nothing;

-- Authenticated users can upload photos into their own product folders.
-- Folder structure: motorcycle-photos/{productId}/{filename}
-- The productId must match a motorcycles row owned by the uploader,
-- but we enforce ownership at the application level (user generates the UUID
-- and passes it as the motorcycles.id on insert). Storage-level policy
-- simply requires the user to be authenticated.
create policy "Authenticated users can upload photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'motorcycle-photos');

-- Authenticated users can update (replace) their own uploaded files.
-- upsert = INSERT + UPDATE, so both policies are required.
create policy "Authenticated users can update their photos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'motorcycle-photos' and (select auth.uid()) = owner);

-- Authenticated users can delete their own uploaded files.
create policy "Authenticated users can delete their photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'motorcycle-photos' and (select auth.uid()) = owner);

-- Anyone (including anonymous visitors) can read photos because the
-- bucket is public — product listings must be visible without sign-in.
create policy "Public can view photos"
  on storage.objects for select
  using (bucket_id = 'motorcycle-photos');

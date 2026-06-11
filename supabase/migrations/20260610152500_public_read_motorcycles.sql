-- Public read access for the motorcycles catalog.
--
-- The original policies only let an authenticated user SELECT their OWN rows,
-- which means a server-rendered, SEO-indexable public catalog/detail page would
-- return zero rows for anonymous visitors. This migration makes listings
-- world-readable (the intended trade-off for a public catalog) while keeping RLS
-- enabled. Write policies (insert/update/delete) are unchanged — still owner-only.

-- Allow the anon role to read the table (authenticated already has SELECT).
grant select on table public.motorcycles to anon;

-- Permissive SELECT policy for everyone. Combined with the existing
-- "Users can view their own motorcycles" policy via OR, this exposes all
-- listings for reading. RLS remains enabled.
create policy "Public can view all motorcycles"
  on public.motorcycles for select
  to anon, authenticated
  using (true);

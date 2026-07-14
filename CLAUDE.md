# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Testing
Do not run tests (npm test, npx playwright test, vitest, jest, etc.) automatically 
after implementing a feature or fixing a bug. Only run tests when explicitly asked to.

## Commands

```bash
npm run dev        # start dev server (Next.js, default port 3000; if that's occupied Next auto-picks the next free port — check the terminal output before assuming)
npm run build       # production build
npm run start        # run a production build
npm run typecheck     # tsc --noEmit — run this after any non-trivial change
npm run clean        # wipe .next
npm run dev:clean      # clean + dev
```

There is no test suite and no lint script configured — `typecheck` is the only automated check. `playwright` is a devDependency but there is no `playwright.config.*` or spec suite checked in; it's available for ad hoc browser-driven verification, not as a configured test runner. There is no single-test-runner command because no test framework is installed.

Supabase CLI is used for migrations (`supabase/migrations/*.sql`, applied against the linked hosted project — see `supabase/config.toml` / `.temp/project-ref`). There is no local Supabase stack checked in; migrations are the source of truth for schema but are applied to the hosted project referenced there.

Seeded test accounts (one admin, one regular user) for manual QA are listed in `README.md` — use those instead of registering fresh accounts when testing role-gated flows.

## Architecture

Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + Supabase (Postgres, Auth, Storage). Path alias `@/*` → `src/*`.

### Auth & authorization — three cooperating layers, all reading the same source of truth

The **role** (`'user' | 'admin'`) lives in `auth.users.raw_app_meta_data` (i.e. the JWT's `app_metadata`), set exclusively server-side with the service-role client. Never trust `user_metadata` — users can edit that themselves. A `public.profiles` table mirrors the role for RLS purposes and is kept in sync whenever the role changes.

1. **`src/proxy.ts`** — Next 16 renamed `middleware.ts` → `proxy.ts` (the file must be named `proxy.ts`, not `middleware.ts`, or every route 404s). Delegates to `src/utils/supabase/middleware.ts`'s `updateSession()`, which on every matched request: refreshes the Supabase session cookie, and redirects based on route lists (`PROTECTED_ROUTES`, `ADMIN_ROUTES`, `GUEST_ONLY_ROUTES`) — this is convenience/UX only, not the security boundary.
2. **`src/lib/auth/roles.ts`** — server-side helpers (`getUserRole`, `isAdmin`, `requireAdmin`) that take a Supabase server client and read the role from `app_metadata`. Use these in Server Components / Route Handlers / Server Actions.
3. **API routes / RLS are the real gate.** Every privileged route handler independently re-checks `user.app_metadata?.role`, e.g. `src/app/api/admin/set-role/route.ts`. Postgres RLS policies use a `SECURITY DEFINER` helper `public.is_admin()` (see `supabase/migrations/20260615115943_create_profiles.sql`) rather than an inline subquery on `profiles` from a policy *on* `profiles`, because that recurses (Postgres error 42P17).

Three Supabase client constructors, each scoped to where it may run — do not cross these:
- `src/utils/supabase/client.ts` — browser (Client Components), session in cookies.
- `src/utils/supabase/server.ts` — server (Server Components/Route Handlers), reads/writes via `next/headers` cookies.
- `src/lib/supabase/admin.ts` — **server-only**, service-role key, bypasses RLS entirely. Only for `app/api/**`/server actions that need to write `app_metadata` or otherwise override RLS. Key is `SUPABASE_SERVICE_ROLE_KEY` (deliberately not `NEXT_PUBLIC_`-prefixed).

Always call `supabase.auth.getUser()` for authorization decisions, never `getSession()` — only `getUser()` revalidates the token against Supabase Auth.

`src/context/UserContext.tsx` (`UserProvider`/`useUser`) is a client-side convenience layer seeded with the server-resolved user (`RootLayout` in `src/app/layout.tsx` fetches it) to avoid an auth flash, kept in sync via `onAuthStateChange`, and calls `router.refresh()` on changes so Server Components re-render. It does not itself enforce route protection — that's the proxy's job. Note that `router.refresh()` re-renders an already-mounted client tree with fresh server props rather than remounting it — client components that fork a server-fetched prop into local state (e.g. `useState(propValue)`) will go stale across a refresh unless they derive their rendered value from the prop on every render instead of only seeding from it once.

### Data layer

`src/lib/motorcycles.ts` is the read path for listings: `getMotorcycles()`, `getMotorcyclesByBrand()` (React `cache()`-wrapped, Fisher–Yates shuffled for the detail-page brand marquee), `getMotorcycleById()`, `getFavoriteMotorcycles()` (the signed-in user's full favorited listings, via one PostgREST embedded-join query `favorites -> motorcycles` rather than fetching ids then a second query), `isMotorcycleFavoritedByUser()`. All are server-only (`import 'server-only'`) and map the DB's snake_case `MotorcycleRow` to the UI's camelCase `Motorcycle` view-model (`dbRowToMotorcycle`) — extend that mapper, not the raw row shape, when adding fields the UI needs. The write path (create listing + photo upload) lives client-side in `src/app/create-product/CreateProductForm.tsx`, which uploads to Supabase Storage then inserts into `motorcycles` directly from the browser client (RLS-gated, not through an API route).

`src/services/<feature>/` is the pattern for other client-side write paths that don't need a Route Handler: e.g. `src/services/favorites/favorites.ts` wraps `addFavorite`/`removeFavorite`/`getFavoriteMotorcycleIds` around the browser Supabase client, each independently re-checking `getUser()` before writing (mirrors the "RLS is the real gate, but fail with a friendly error first" convention used elsewhere) rather than trusting a component-level auth check alone.

Schema: `public.motorcycles` (owner-scoped via `user_id` + RLS, publicly readable per `supabase/migrations/20260610152500_public_read_motorcycles.sql`), `public.profiles` (role mirror, see above), and `public.favorites` (pure user↔motorcycle join table, composite PK `(user_id, motorcycle_id)`, no surrogate id, no UPDATE — add via INSERT, remove via DELETE only; self-scoped RLS, `authenticated`-only grants, see `supabase/migrations/20260713120000_create_favorites_table.sql`). Check `supabase/migrations/` in chronological order for the authoritative current schema — later migrations (`extend_motorcycles_table`, `add_phone_to_motorcycles`) change columns beyond what the first migration shows.

Types: `src/components/catalog-home/types.ts` defines the canonical `Motorcycle`, `FilterState`, `LicenseCategory`, `SilhouetteCategory` types used across catalog, filters, and the create-product form — despite the folder name, these are treated as the app-wide domain types (`src/types/types.ts`'s `ProductForm` imports from here).

### Catalog & filtering

`MotorcycleCatalog.tsx` (client) receives server-fetched `Motorcycle[]` as a prop and does all filtering client-side via `useMemo` over `FilterState` (brand/category/color/year/power range) — there's no server-side filtered query. `initialCategory` seeds state from a `?category=` URL param set by the navbar. Mobile uses a slide-in drawer (same `FilterSidebar` instance, shared prop bag) instead of the desktop sticky sidebar.

`src/components/catalog-home/MotorcycleCard.tsx` (+ its co-located `MotorcycleCard.css`, BEM `moto-card__*` classes, not Tailwind) is the one card component shared between the public catalog grid and the profile page's Favorites tab (`src/app/profile/tabs/FavoriteCard.tsx` wraps it with an absolutely-positioned remove button rather than forking the markup) — treat it as a shared component, not catalog-owned, when changing its visuals. Its header uses a CSS container query (`container-type: inline-size`, child elements sized in `cqi` units), so the rendered card scales with the width of whatever grid cell it's placed in — resize a card by narrowing its grid column, not by editing the component.

### Profile page

`src/app/profile/page.tsx` is a Server Component gated by the proxy's `PROTECTED_ROUTES`; it does any per-tab server data fetching (e.g. `getFavoriteMotorcycles()`) and passes results down as props. `ProfileClient.tsx` (`'use client'`) owns all UI state — the active tab, sidebar/bottom-nav, and class-based dark mode (toggles `.dark` on `<html>`, persisted to `localStorage('profileDarkMode')`, removed on unmount since dark mode is currently scoped to this page only). Tabs under `src/app/profile/tabs/` are switched by conditional render, not routed (`{activeTab === 'favorites' && <FavoritesTab />}`), so navigating between them never triggers a Server Component re-fetch — only a full page load (or `router.refresh()`) does. As of this writing Favorites is wired to real Supabase data; the remaining tabs (`Compare`, `Alerts`, `RecentlyViewed`, `MyListings`, `Preferences`, `Stats`) are still self-contained mocks with hardcoded fixture data — check a given tab's source before assuming it reflects real backend state.

### Styling

Tailwind v4 (CSS-first config via `@theme` in `src/app/globals.css`, no `tailwind.config.ts`). `globals.css` also carries unlayered base-element resets (`main`, `section`, `h1`, `p`) that are NOT inside `@layer base` — they beat Tailwind utility classes on the same element due to source order, not specificity. When a utility class on one of these elements silently has no effect, check for a conflicting unlayered rule; work around it with a wrapping `div`/`span` or an `!` important-prefixed utility rather than fighting specificity. Dark mode is class-based (`@custom-variant dark`), currently scoped to the profile page.

### Repo-local agent config

`.claude/agents/` defines four role-scoped subagents (architect, backend, frontend, reviewer) with explicit boundaries (e.g. reviewer never edits files, backend never touches UI) — prefer delegating to the matching one for large architecture/backend/frontend/review tasks rather than doing everything in one flat context. `.claude/settings.json` wires up the Supabase MCP server for this project. Both `.claude/` and `.agents/` (bundled skills) are gitignored — local-only, not shared via the repo.

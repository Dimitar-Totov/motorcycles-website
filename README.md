# Motorcycles App

## https://motorcyclestudentapp.netlify.app/

A motorcycle marketplace and catalog application. Users can browse and filter listed motorcycles, view detailed listings, create their own listings with photos, and save favorites to their profile. Authentication and role-based access (user/admin) are backed by Supabase.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS v4 (CSS-first config via `@theme`, no `tailwind.config.ts`)
- **Backend:** Supabase (Postgres, Auth, Storage)
- **Language:** TypeScript
- **Icons/UX:** lucide-react, sonner (toasts)

Path alias `@/*` resolves to `src/*`.

## Features

- **Catalog browsing & filtering** — client-side filtering by brand, category, color, year, and power range (`MotorcycleCatalog.tsx`), with a category shortcut from the navbar via `?category=` query param.
- **Motorcycle detail pages** — `/catalog/[id]/details`, including a shuffled marquee of other listings from the same brand.
- **Authentication & role-based access** — sign in/up at `/auth`; routes are protected via `src/proxy.ts` (Next 16's replacement for `middleware.ts`), with server-side role checks (`user` / `admin`) as the actual security boundary, enforced again at the API/RLS layer.
- **Create listing** — `/create-product`, uploads photos to Supabase Storage and inserts the listing directly from the browser client (RLS-gated).
- **Favorites** — add/remove favorite motorcycles; reflected in the profile page's Favorites tab.
- **Profile page** (`/profile`) — tabbed UI (Favorites, Compare, Alerts, Recently Viewed, My Listings, Preferences, Stats) with class-based dark mode. **Only the Favorites tab is wired to real Supabase data** — the remaining tabs are currently self-contained UI mocks with hardcoded fixture data.
- Static/info pages: About, Services, Contact, Terms, Privacy.

## Project Structure

```
src/
  app/                # Next.js App Router routes (catalog, auth, profile, create-product, ...)
  components/
    catalog-home/     # Catalog grid, filters, shared MotorcycleCard, domain types
  context/             # UserContext (client-side auth convenience layer)
  lib/
    auth/roles.ts       # Server-side role helpers (getUserRole, isAdmin, requireAdmin)
    motorcycles.ts       # Server-only read path for listings
    supabase/admin.ts     # Service-role client (server-only, bypasses RLS)
  services/            # Client-side write paths (e.g. favorites)
  utils/supabase/        # Browser & server Supabase client constructors
  proxy.ts             # Route protection / session refresh (Next 16 middleware entry point)
supabase/
  migrations/           # SQL migrations — source of truth for schema
```

## Getting Started

### Prerequisites

- Node.js
- A Supabase project (URL, anon key, and service role key)

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
   The service role key bypasses Row Level Security and must never be exposed to the browser — it's used only in server-only modules, API routes, and server actions.
3. Start the dev server:
   ```bash
   npm run dev
   ```
   Defaults to port 3000; if occupied, Next.js auto-picks the next free port — check the terminal output.

## Available Scripts

```bash
npm run dev        # start dev server (Next.js)
npm run build       # production build
npm run start        # run a production build
npm run typecheck     # tsc --noEmit — run after any non-trivial change
npm run clean        # wipe .next
npm run dev:clean      # clean + dev
```

There is no test suite and no lint script configured — `typecheck` is the only automated check. `playwright` is available as a devDependency for ad hoc browser-driven verification, not as a configured test runner.

## Database / Supabase

Schema is defined by the migrations under `supabase/migrations/`, applied in chronological order against the linked hosted Supabase project (see `supabase/config.toml`). There is no local Supabase stack checked in — migrations are the authoritative source of truth for the schema, applied directly to the hosted project.

Core tables:
- `public.motorcycles` — listings, owner-scoped via `user_id` + RLS, publicly readable.
- `public.profiles` — mirrors each user's role (`user` / `admin`) for RLS purposes.
- `public.favorites` — user↔motorcycle join table (composite primary key, insert/delete only).

## Seeded Test Accounts

The following accounts exist in the linked Supabase project for manual QA of role-gated flows — use these instead of registering fresh accounts when testing auth/authorization behavior.

Admin
Email: admin@gmail.com
Password: Admin123456!

User1
Email: john.doe@email.com
Password: JohnDoe123456!

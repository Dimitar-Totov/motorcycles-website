import { createBrowserClient } from '@supabase/ssr'

/**
 * Browser-side Supabase client (Client Components only).
 *
 * Unlike the old singleton in `src/lib/supabaseClient.ts`, `@supabase/ssr`'s
 * browser client persists the session in **cookies** (not localStorage), so the
 * same session is readable by Server Components and middleware during SSR.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

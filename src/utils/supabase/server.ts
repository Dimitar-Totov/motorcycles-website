import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Server-side Supabase client (Server Components, Route Handlers, Server Actions).
 *
 * Reads/writes the session through Next's cookie store. In Next 15 `cookies()`
 * is async, hence the `await`. Writing cookies from a Server Component throws —
 * we swallow that because the middleware (`updateSession`) is responsible for
 * refreshing/persisting the session cookie on every request.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // Called from a Server Component — safe to ignore, middleware refreshes the session.
          }
        },
      },
    },
  )
}

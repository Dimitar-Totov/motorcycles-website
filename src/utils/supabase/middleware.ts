import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/** Routes that require an authenticated user. */
const PROTECTED_ROUTES = ['/profile', '/create-product']
/** Routes only signed-out users should see (e.g. the auth screen). */
const GUEST_ONLY_ROUTES = ['/auth']

/**
 * Runs on every matched request: refreshes the Supabase auth token (so server
 * code always sees a valid session) and enforces route protection — replacing
 * the old client-side `<AuthGuard>`/`<Navigate>` redirects.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // IMPORTANT: getUser() revalidates the token with Supabase Auth. Never use
  // getSession() for authorization decisions in server code.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const needsAuth = PROTECTED_ROUTES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  const guestOnly = GUEST_ONLY_ROUTES.some((p) => pathname === p || pathname.startsWith(`${p}/`))

  if (needsAuth && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  if (guestOnly && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/profile'
    return NextResponse.redirect(url)
  }

  // Return supabaseResponse as-is so refreshed auth cookies are preserved.
  return supabaseResponse
}

import type { SupabaseClient, User } from '@supabase/supabase-js'

import type { UserRole } from '@/lib/types/roles'

/**
 * Server-side role helpers. Every function takes a Supabase **server** client
 * (created from cookies via `@/utils/supabase/server`) so the same logic works in
 * Server Components, Route Handlers, and Server Actions.
 *
 * The role is read from `app_metadata`, which is set exclusively server-side with
 * the service role and travels in the JWT. Never trust `user_metadata` — users can
 * edit it themselves via `supabase.auth.updateUser()`.
 */

export async function getCurrentUser(supabase: SupabaseClient): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getUserRole(supabase: SupabaseClient): Promise<UserRole> {
  const user = await getCurrentUser(supabase)
  return (user?.app_metadata?.role as UserRole | undefined) ?? 'user'
}

export async function isAdmin(supabase: SupabaseClient): Promise<boolean> {
  return (await getUserRole(supabase)) === 'admin'
}

/**
 * Guard for admin-only server components and server actions. Throws if the caller
 * is not an admin — call it at the top of any privileged server code path.
 */
export async function requireAdmin(supabase: SupabaseClient): Promise<void> {
  if (!(await isAdmin(supabase))) {
    throw new Error('Unauthorized: admin access required')
  }
}

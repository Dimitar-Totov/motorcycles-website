import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

/**
 * Idempotent add. Resolves the current user via `getUser()` (never `getSession()`
 * for authorization — see `src/utils/supabase/middleware.ts`) and throws if there
 * is no authenticated user. Upserts on the composite key so a double-click or an
 * already-favorited listing never surfaces a 23505 unique-violation to the caller.
 */
export async function addFavorite(motorcycleId: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('You must be signed in to favorite a listing.')

  const { error } = await supabase
    .from('favorites')
    .upsert(
      { user_id: user.id, motorcycle_id: motorcycleId },
      { onConflict: 'user_id,motorcycle_id', ignoreDuplicates: true },
    )
  if (error) throw error
}

/**
 * Idempotent remove. RLS scopes the delete to the current user automatically (the
 * USING clause), so no manual user_id filter is required. Deleting a row that
 * doesn't exist (or belongs to someone else) is a no-op, not an error. Checks for
 * a signed-in user up front (mirrors addFavorite) so a stale/expired session
 * surfaces the same friendly error instead of a raw Postgres permission error.
 */
export async function removeFavorite(motorcycleId: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('You must be signed in to manage favorites.')

  const { error } = await supabase.from('favorites').delete().eq('motorcycle_id', motorcycleId)
  if (error) throw error
}

/**
 * For a future "My Favorites" page or bulk initial-state on a catalog grid.
 * RLS auto-scopes to the current user.
 */
export async function getFavoriteMotorcycleIds(): Promise<string[]> {
  const { data, error } = await supabase.from('favorites').select('motorcycle_id')
  if (error) throw error
  return (data ?? []).map((row) => row.motorcycle_id)
}

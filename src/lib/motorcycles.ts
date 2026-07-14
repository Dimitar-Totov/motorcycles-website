import 'server-only'

import { cache } from 'react'
import { createClient } from '@/utils/supabase/server'
import { BRAND_TOKENS } from '@/components/catalog-home/mockData'
import type {
  LicenseCategory,
  Motorcycle,
  SilhouetteCategory,
} from '@/components/catalog-home/types'

/** Raw shape of a row in the public.motorcycles table. */
export interface MotorcycleRow {
  id: string
  user_id: string
  name: string | null
  brand: string
  model: string
  year: number
  color: string | null
  engine: string | null
  power_kw: number | null
  price: number | null
  in_stock: boolean
  license_categories: string[] | null
  silhouette_category: string | null
  photo_urls: string[] | null
  created_at: string
  updated_at: string
}

const FALLBACK_SILHOUETTE: SilhouetteCategory = 'naked'

/** Build a card gradient from the brand's accent color, with a dark fallback. */
function gradientForBrand(brand: string): string {
  const token = BRAND_TOKENS[brand]
  if (token) return `linear-gradient(150deg, ${token} 0%, #0b1220 95%)`
  return 'linear-gradient(150deg, #334155 0%, #0b1220 95%)'
}

/** Map a DB row (snake_case, nullable) to the UI's Motorcycle view-model. */
export function dbRowToMotorcycle(row: MotorcycleRow): Motorcycle {
  return {
    id: row.id,
    name: row.name ?? `${row.brand} ${row.model}`,
    model: row.model,
    brand: row.brand,
    brandGradient: gradientForBrand(row.brand),
    year: row.year,
    color: row.color ?? '',
    powerKw: row.power_kw ?? 0,
    engine: row.engine ?? '',
    price: row.price ?? 0,
    inStock: row.in_stock,
    licenseCategories: (row.license_categories ?? []) as LicenseCategory[],
    silhouetteCategory: (row.silhouette_category as SilhouetteCategory) ?? FALLBACK_SILHOUETTE,
    photoUrls: row.photo_urls ?? [],
  }
}

/** Fetch every listing for the public catalog (Server Component data source). */
export async function getMotorcycles(): Promise<Motorcycle[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('motorcycles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load motorcycles:', error.message)
    return []
  }
  return (data as MotorcycleRow[]).map(dbRowToMotorcycle)
}

/**
 * Fetch up to `limit` other listings of the same brand for the detail-page
 * marquee. Shuffled (Fisher–Yates) so the strip varies per request; the current
 * listing is excluded via `excludeId`. Returns [] when the brand has no other
 * listings (the caller hides the marquee in that case).
 */
export const getMotorcyclesByBrand = cache(
  async (brand: string, excludeId?: string, limit = 10): Promise<Motorcycle[]> => {
    const supabase = await createClient()
    let query = supabase.from('motorcycles').select('*').eq('brand', brand)
    if (excludeId) query = query.neq('id', excludeId)

    const { data, error } = await query
    if (error || !data) {
      if (error) console.error('Failed to load brand motorcycles:', error.message)
      return []
    }

    const rows = data as MotorcycleRow[]
    for (let i = rows.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[rows[i], rows[j]] = [rows[j], rows[i]]
    }
    return rows.slice(0, limit).map(dbRowToMotorcycle)
  },
)

/**
 * Fetch a single listing by id for the detail page; null when not found.
 * Wrapped in React `cache()` so generateMetadata and the page component share a
 * single DB query within the same request.
 */
export const getMotorcycleById = cache(async (id: string): Promise<Motorcycle | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('motorcycles')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null
  return dbRowToMotorcycle(data as MotorcycleRow)
})

/**
 * Fetch the current user's full favorited listing list for the profile page's
 * Favorites tab. Single embedded-join query (`favorites -> motorcycles`):
 * `favorites` is RLS-scoped to the caller automatically (no manual user_id
 * filter needed) and `motorcycles` is publicly readable, so the embed resolves
 * without a second round-trip — cheaper than fetching favorite ids then a
 * second `getMotorcyclesByIds` call. No signed-in user (shouldn't happen on
 * `/profile`, which the proxy gates, but handled defensively like the rest of
 * the codebase treats `auth.getUser()` returning null server-side) or zero
 * favorites both resolve to `[]` rather than throwing.
 */
export async function getFavoriteMotorcycles(): Promise<Motorcycle[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('favorites')
    .select('motorcycles(*)')
    .order('created_at', { ascending: false })

  if (error || !data) {
    if (error) console.error('Failed to load favorite motorcycles:', error.message)
    return []
  }

  return (data as unknown as { motorcycles: MotorcycleRow | null }[])
    .map((row) => row.motorcycles)
    .filter((row): row is MotorcycleRow => row !== null)
    .map(dbRowToMotorcycle)
}

/**
 * Does the current user (if any) have this listing favorited? Used to seed
 * the detail page's `AddToFavoritesButton` with its initial state server-side
 * (no client-side fetch/flash). Anonymous visitors always resolve to `false`
 * without querying `favorites` (the table grants `authenticated` only, so an
 * anon query would just error). RLS scopes the select to the caller, so no
 * manual user_id filter is needed once signed in.
 */
export async function isMotorcycleFavoritedByUser(motorcycleId: string): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('favorites')
    .select('motorcycle_id')
    .eq('motorcycle_id', motorcycleId)
    .maybeSingle()

  if (error) {
    console.error('Failed to check favorite status:', error.message)
    return false
  }
  return !!data
}

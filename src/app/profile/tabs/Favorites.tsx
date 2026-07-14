'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import FavoriteCard from './FavoriteCard'
import type { Motorcycle } from '@/components/catalog-home/types'

interface Props {
  /** Real, server-resolved favorites — supplied by the parent (`ProfileClient`). */
  motorcycles: Motorcycle[]
}

/**
 * Renders `motorcycles` minus anything the user has just removed. Tracking
 * only the removed ids (rather than forking `motorcycles` into local state)
 * means the list stays in sync if the server re-resolves a fresh
 * `motorcycles` prop into an already-mounted tree (e.g. a `router.refresh()`
 * triggered by `UserContext`'s `onAuthStateChange`), while still letting a
 * removed card play its shrink/fade-out before disappearing.
 */
export default function FavoritesTab({ motorcycles }: Props) {
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set())
  const items = motorcycles.filter(m => !removedIds.has(m.id))

  function handleRemoved(id: string) {
    setRemovedIds(prev => new Set(prev).add(id))
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Favorites</h2>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-zinc-100 dark:bg-zinc-800">
            <Heart className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">No favorites yet</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
            Motorcycles you favorite from the catalog will show up here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {items.map(m => (
            <FavoriteCard key={m.id} motorcycle={m} onRemoved={handleRemoved} />
          ))}
        </div>
      )}
    </div>
  )
}

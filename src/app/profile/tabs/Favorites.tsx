import { useState } from 'react'
import { Heart } from 'lucide-react'

interface Moto {
  id: number
  name: string
  price: string
  year: number
  km: string
  isNew: boolean
  favorited: boolean
}

const initialData: Moto[] = [
  { id: 1, name: 'Yamaha MT-09',  price: '15 800 €', year: 2024, km: '0 km',      isNew: true,  favorited: true },
  { id: 2, name: 'Honda CB650R',  price: '7 200 €',  year: 2021, km: '18 200 km', isNew: false, favorited: true },
  { id: 3, name: 'Kawasaki Z900', price: '11 490 €', year: 2024, km: '0 km',      isNew: true,  favorited: true },
  { id: 4, name: 'BMW R1250 GS',  price: '16 500 €', year: 2022, km: '24 000 km', isNew: false, favorited: true },
]

function MotoCard({ item }: { item: Moto }) {
  const [fav, setFav] = useState(item.favorited)

  return (
    <div
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click() }}
      className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-800 hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none"
    >
      {/* Thumbnail */}
      <div className="relative h-20 bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
        <span className="text-3xl select-none" aria-hidden>🏍️</span>

        {/* New / Used tag */}
        <span
          className={[
            'absolute top-2 left-2 text-[10px] px-1.5 py-0.5 rounded font-medium',
            item.isNew
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
              : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
          ].join(' ')}
        >
          {item.isNew ? 'New' : 'Used'}
        </span>

        {/* Heart button */}
        <button
          onClick={e => { e.stopPropagation(); setFav(f => !f) }}
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          className={[
            'absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center',
            'transition-transform duration-100 active:scale-90 hover:scale-110',
            'focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 outline-none',
            fav
              ? 'bg-orange-500'
              : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600',
          ].join(' ')}
        >
          <Heart
            className={[
              'w-3.5 h-3.5',
              fav ? 'fill-white text-white' : 'text-zinc-400',
            ].join(' ')}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{item.name}</div>
        <div className="text-sm text-orange-600 dark:text-orange-400 font-medium mt-0.5">{item.price}</div>
        <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{item.year} · {item.km}</div>
      </div>
    </div>
  )
}

export default function FavoritesTab() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Favorites</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {initialData.map(item => (
          <MotoCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

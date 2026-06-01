type Status = 'active' | 'pending' | 'sold'

interface Listing {
  id: number
  name: string
  published: string
  views: number
  price: string
  status: Status
}

const LISTINGS: Listing[] = [
  { id: 1, name: 'Honda CB500F 2020',        published: '12 May 2026', views: 47, price: '5 400 €', status: 'active'  },
  { id: 2, name: 'Kawasaki Ninja 400 2019',  published: '28 Apr 2026', views: 31, price: '4 100 €', status: 'pending' },
]

const STATUS_CHIP: Record<Status, string> = {
  active:  'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400',
  pending: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
  sold:    'bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400',
}

const STATUS_DOT: Record<Status, string> = {
  active:  'bg-green-500',
  pending: 'bg-yellow-500',
  sold:    'bg-zinc-400',
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_CHIP[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[status]}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default function MyListingsTab() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">My Listings</h2>

      <div className="space-y-3 mb-4">
        {LISTINGS.map(listing => (
          <div
            key={listing.id}
            tabIndex={0}
            className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-sm transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none"
          >
            <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-2xl flex-shrink-0 select-none" aria-hidden>
              🏍️
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{listing.name}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Published {listing.published} · {listing.views} views
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{listing.price}</div>
              <StatusBadge status={listing.status} />
            </div>
          </div>
        ))}
      </div>

      <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none">
        <span className="text-base leading-none font-bold" aria-hidden>+</span>
        Add listing
      </button>
    </div>
  )
}

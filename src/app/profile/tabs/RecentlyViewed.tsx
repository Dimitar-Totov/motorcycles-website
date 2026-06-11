interface ViewedItem {
  name: string
  meta: string
  time: string
}

const ITEMS: ViewedItem[] = [
  { name: 'Triumph Speed Triple 1200', meta: 'New · 2024 · 19 500 €',    time: '1h ago'     },
  { name: 'Suzuki GSX-S1000',          meta: 'New · 2023 · 12 200 €',    time: '3h ago'     },
  { name: 'KTM 890 Duke R',            meta: 'Used · 2022 · 9 800 €',    time: 'Yesterday'  },
  { name: 'Honda Africa Twin',         meta: 'New · 2024 · 16 700 €',    time: 'Yesterday'  },
  { name: 'Yamaha Ténéré 700',         meta: 'Used · 2021 · 8 400 €',    time: '2 days ago' },
]

export default function RecentlyViewedTab() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Recently Viewed</h2>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        {ITEMS.map((item, i) => (
          <div
            key={item.name}
            tabIndex={0}
            className={[
              'group flex items-center gap-3 px-4 py-3 cursor-pointer outline-none',
              /* Left accent border — transparent by default, orange on hover/focus */
              'border-l-[3px] border-l-transparent hover:border-l-orange-400 focus-visible:border-l-orange-500',
              'bg-white dark:bg-zinc-800',
              'hover:bg-zinc-50 dark:hover:bg-zinc-700',
              'transition-all duration-150',
              'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-500',
              i < ITEMS.length - 1 ? 'border-b border-b-zinc-100 dark:border-b-zinc-700' : '',
            ].join(' ')}
          >
            {/* Thumbnail */}
            <div className="w-10 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-lg flex-shrink-0 select-none" aria-hidden>
              🏍️
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{item.name}</div>
              <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{item.meta}</div>
            </div>

            {/* Timestamp */}
            <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-auto whitespace-nowrap flex-shrink-0">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

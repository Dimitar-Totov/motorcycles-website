import { useState, useEffect } from 'react'

const METRICS = [
  { value: 148, label: 'Viewed listings' },
  { value: 12,  label: 'Saved'           },
  { value: 3,   label: 'Compared'        },
]

const CATEGORIES = [
  { label: 'Naked',              percent: 54, color: 'bg-orange-500' },
  { label: 'Enduro / Adventure', percent: 29, color: 'bg-blue-400'  },
  { label: 'Sport',              percent: 17, color: 'bg-zinc-400'  },
]

export default function StatsTab() {
  const [mounted, setMounted] = useState(false)

  /* Small delay ensures the CSS transition fires after the initial 0% render */
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Stats</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {METRICS.map(m => (
          <div key={m.label} className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4">
            <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{m.value}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-6">
        <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Category Breakdown
        </div>
        <div className="space-y-4">
          {CATEGORIES.map((cat, i) => (
            <div key={cat.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-zinc-600 dark:text-zinc-300">{cat.label}</span>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{cat.percent}%</span>
              </div>
              <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-[width] duration-[600ms] ease-in-out ${cat.color}`}
                  style={{
                    width: mounted ? `${cat.percent}%` : '0%',
                    transitionDelay: `${i * 120}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

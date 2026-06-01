import { useState } from 'react'
import type { ComponentType } from 'react'
import { Tag, DollarSign, Calendar, Gauge, MapPin } from 'lucide-react'

interface TextRow {
  type: 'text'
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
}

interface ChipsRow {
  type: 'chips'
  icon: ComponentType<{ className?: string }>
  label: string
  options: string[]
  defaultActive: string[]
}

type PrefRow = TextRow | ChipsRow

const ROWS: PrefRow[] = [
  {
    type: 'chips',
    icon: Tag,
    label: 'Category',
    options: ['Naked', 'Enduro', 'Sport', 'Adventure', 'Touring'],
    defaultActive: ['Naked', 'Enduro'],
  },
  { type: 'text', icon: DollarSign, label: 'Budget',      value: 'Up to 15 000 €'   },
  { type: 'text', icon: Calendar,   label: 'Year range',  value: '2019 – 2024'      },
  { type: 'text', icon: Gauge,      label: 'Max mileage', value: 'Up to 40 000 km'  },
  { type: 'text', icon: MapPin,     label: 'Location',    value: 'Plovdiv ± 100 km' },
]

function ChipSet({ options, defaultActive }: { options: string[]; defaultActive: string[] }) {
  const [active, setActive] = useState<string[]>(defaultActive)

  function toggle(opt: string) {
    setActive(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt])
  }

  return (
    <div className="flex flex-wrap gap-1 justify-end">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => toggle(opt)}
          className={[
            'text-[11px] px-2.5 py-0.5 rounded-full border transition-colors duration-150',
            'focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 outline-none',
            active.includes(opt)
              ? 'bg-orange-500 border-transparent text-white'
              : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600',
          ].join(' ')}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export default function PreferencesTab() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Preferences</h2>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-700">
        {ROWS.map(row => {
          const Icon = row.icon
          return (
            <div key={row.label} className="flex items-center gap-3 px-4 py-3">
              <Icon className="w-4 h-4 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
              <span className="text-sm text-zinc-500 dark:text-zinc-400 w-28 flex-shrink-0">
                {row.label}
              </span>
              <div className="ml-auto">
                {row.type === 'chips' ? (
                  <ChipSet options={row.options} defaultActive={row.defaultActive} />
                ) : (
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{row.value}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

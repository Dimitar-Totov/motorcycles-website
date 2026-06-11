import { useState } from 'react'

interface Spec {
  label: string
  values: string[]
  bestIndex: number | null
}

const MODELS = ['Yamaha MT-09', 'Kawasaki Z900', 'Honda CB650R']
const MODEL_YEARS = ['2024', '2024', '2021']

const SPECS: Spec[] = [
  { label: 'Price',       values: ['15 800 €', '11 490 €', '7 200 €'], bestIndex: 2    },
  { label: 'Power',       values: ['119 hp',   '125 hp',   '95 hp'],   bestIndex: 1    },
  { label: 'Engine',      values: ['890 cc',   '948 cc',   '649 cc'],  bestIndex: null },
  { label: 'Weight',      values: ['189 kg',   '193 kg',   '202 kg'],  bestIndex: 0    },
  { label: 'Year',        values: ['2024',     '2024',     '2021'],    bestIndex: null },
  { label: 'Seat height', values: ['820 mm',   '795 mm',   '810 mm'],  bestIndex: 1    },
]

export default function CompareTab() {
  const [removed, setRemoved] = useState<number[]>([])
  const visible = [0, 1, 2].filter(i => !removed.includes(i))

  if (visible.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <span className="text-5xl select-none" aria-hidden>⚖️</span>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          Add at least 2 motorcycles to compare
        </div>
        <button
          onClick={() => setRemoved([])}
          className="border border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950 px-4 py-2 rounded-lg text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none"
        >
          Restore all models
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Compare</h2>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700">
              {/* Empty label column */}
              <th className="sticky left-0 bg-white dark:bg-zinc-800 w-28 min-w-[7rem] p-3 text-left border-r border-zinc-100 dark:border-zinc-700" />
              {visible.map(i => (
                <th key={i} className="p-3 text-left bg-white dark:bg-zinc-800 group">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{MODELS[i]}</div>
                      <div className="text-xs text-zinc-400 dark:text-zinc-500">{MODEL_YEARS[i]}</div>
                    </div>
                    <button
                      onClick={() => setRemoved(r => [...r, i])}
                      aria-label={`Remove ${MODELS[i]}`}
                      className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-lg leading-none transition-opacity duration-150 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 outline-none rounded mt-0.5"
                    >
                      ×
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SPECS.map((spec, rowIdx) => {
              const isEven = rowIdx % 2 === 0
              const rowBg = isEven
                ? 'bg-white dark:bg-zinc-800'
                : 'bg-zinc-50 dark:bg-zinc-900'
              return (
                <tr key={spec.label} className={rowBg}>
                  {/* Sticky label cell — inherits row bg */}
                  <td className={`sticky left-0 ${rowBg} p-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 w-28 min-w-[7rem] border-r border-zinc-100 dark:border-zinc-700`}>
                    {spec.label}
                  </td>
                  {visible.map(i => {
                    const isBest = spec.bestIndex === i
                    return (
                      <td
                        key={i}
                        className={[
                          'p-3 text-sm',
                          isBest
                            ? 'text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-950'
                            : 'text-zinc-700 dark:text-zinc-300',
                        ].join(' ')}
                      >
                        {spec.values[i]}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

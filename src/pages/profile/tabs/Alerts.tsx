import { useState } from 'react'

interface Alert {
  id: number
  name: string
  criteria: string
  newCount: number
  active: boolean
}

const initialAlerts: Alert[] = [
  { id: 1, name: 'BMW GS series, 2020–2024',  criteria: 'Up to 20 000 € · Under 50 000 km', newCount: 3, active: true  },
  { id: 2, name: 'Naked bikes, up to 800 cc', criteria: 'Up to 9 000 € · Used',              newCount: 1, active: true  },
  { id: 3, name: 'Ducati Scrambler',          criteria: 'New models',                         newCount: 0, active: false },
]

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onChange}
      className={[
        'relative flex-shrink-0 w-10 h-6 rounded-full',
        'transition-colors duration-200 outline-none',
        'focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
        on ? 'bg-orange-500' : 'bg-zinc-300 dark:bg-zinc-600',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm',
          'transition-transform duration-200',
          on ? 'translate-x-4' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  )
}

export default function AlertsTab() {
  const [alerts, setAlerts] = useState(initialAlerts)

  function toggle(id: number) {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Alerts</h2>

      <div className="space-y-2">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors duration-150"
          >
            <span className="text-2xl flex-shrink-0 select-none" aria-hidden>🏍️</span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {alert.name}
                </span>
                {alert.newCount > 0 && (
                  <span className="animate-badge-pulse inline-flex text-[10px] px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 font-medium">
                    {alert.newCount} new
                  </span>
                )}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {alert.criteria}
              </div>
            </div>

            <Toggle on={alert.active} onChange={() => toggle(alert.id)} />
          </div>
        ))}
      </div>

      <button className="mt-4 w-full md:w-auto border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-4 py-2.5 rounded-xl text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none">
        + Create new alert
      </button>
    </div>
  )
}

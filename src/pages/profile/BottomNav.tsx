import type { ComponentType } from 'react'
import { Heart, Scale, Bell, LayoutList, Settings } from 'lucide-react'
import type { TabId } from './Profile'

interface NavTab {
  id: TabId
  icon: ComponentType<{ className?: string }>
  label: string
}

const tabs: NavTab[] = [
  { id: 'favorites',   icon: Heart,      label: 'Favorites' },
  { id: 'compare',     icon: Scale,      label: 'Compare'   },
  { id: 'alerts',      icon: Bell,       label: 'Alerts'    },
  { id: 'listings',    icon: LayoutList, label: 'Listings'  },
  { id: 'preferences', icon: Settings,   label: 'More'      },
]

interface Props {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export default function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex justify-around py-2 z-50 md:hidden">
      {tabs.map(tab => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            aria-current={isActive ? 'page' : undefined}
            className={[
              'flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg min-w-0',
              'transition-colors duration-150 outline-none',
              'focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
              isActive
                ? 'text-orange-600 dark:text-orange-400'
                : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300',
            ].join(' ')}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

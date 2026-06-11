import type { ComponentType } from 'react'
import {
  Heart, Scale, Bell, Clock, LayoutList,
  Settings, BarChart2, LogOut, Sun, Moon, ShieldCheck,
} from 'lucide-react'
import type { TabId } from './ProfileClient'

interface NavItemData {
  id: TabId
  icon: ComponentType<{ className?: string }>
  label: string
  count?: number
  newCount?: number
}

const sections: { label: string; items: NavItemData[] }[] = [
  {
    label: 'Activity',
    items: [
      { id: 'favorites',       icon: Heart,       label: 'Favorites',       count: 12  },
      { id: 'compare',         icon: Scale,       label: 'Compare',         count: 3   },
      { id: 'alerts',          icon: Bell,        label: 'Alerts',          newCount: 2 },
      { id: 'recently-viewed', icon: Clock,       label: 'Recently Viewed'             },
    ],
  },
  {
    label: 'Seller',
    items: [
      { id: 'listings', icon: LayoutList, label: 'My Listings', count: 2 },
    ],
  },
  {
    label: 'Profile',
    items: [
      { id: 'preferences', icon: Settings,  label: 'Preferences' },
      { id: 'stats',       icon: BarChart2, label: 'Stats'       },
    ],
  },
]

interface SidebarProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  darkMode: boolean
  onToggleDark: () => void
  userInitials: string
  userName: string
  memberSince: string
  onLogout: () => void
}

interface NavItemProps {
  item: NavItemData
  isActive: boolean
  onClick: (id: TabId) => void
}

function NavItem({ item, isActive, onClick }: NavItemProps) {
  const Icon = item.icon
  const badgeCount = item.newCount ?? item.count
  const isNew = (item.newCount ?? 0) > 0
  const showBadge = (badgeCount ?? 0) > 0

  return (
    <div className="relative group">
      <button
        onClick={() => onClick(item.id)}
        aria-current={isActive ? 'page' : undefined}
        className={[
          'relative w-full flex items-center justify-center lg:justify-start',
          'gap-0 lg:gap-3 px-2 lg:px-3 py-2 rounded-lg text-sm',
          'border-l-[3px]',
          'transition-all duration-150 outline-none',
          'focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
          isActive
            ? [
                'bg-orange-50 dark:bg-orange-950',
                'text-orange-600 dark:text-orange-400',
                'font-medium',
                'md:border-transparent lg:border-orange-500',
              ].join(' ')
            : [
                'border-transparent',
                'text-zinc-500 dark:text-zinc-400',
                'hover:bg-zinc-100 dark:hover:bg-zinc-800',
                'hover:text-zinc-900 dark:hover:text-zinc-100',
              ].join(' '),
        ].join(' ')}
      >
        {/* Icon with tablet overlay badge */}
        <span className="relative flex-shrink-0">
          <Icon
            className={[
              'w-5 h-5 transition-transform duration-150',
              isActive
                ? 'text-orange-500 dark:text-orange-400'
                : 'opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5',
            ].join(' ')}
          />
          {showBadge && (
            <span
              className={[
                'absolute -top-1.5 -right-1.5 lg:hidden',
                'w-4 h-4 flex items-center justify-center',
                'text-[9px] rounded-full font-medium text-white',
                isNew ? 'bg-red-500 animate-badge-pulse' : 'bg-orange-500',
              ].join(' ')}
            >
              {badgeCount}
            </span>
          )}
        </span>

        {/* Label — desktop only */}
        <span className="hidden lg:block truncate">{item.label}</span>

        {/* Desktop badge */}
        {showBadge && (
          <span
            className={[
              'hidden lg:inline-flex ml-auto',
              'text-[10px] px-2 py-0.5 rounded-full font-medium',
              isNew ? 'animate-badge-pulse' : '',
              isActive
                ? 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400'
                : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400',
            ].join(' ')}
          >
            {isNew ? `${badgeCount} new` : badgeCount}
          </span>
        )}
      </button>

      {/* Floating tooltip for icon-only rail (md, not lg) */}
      <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 lg:hidden opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <div className="bg-zinc-900 dark:bg-zinc-700 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">
          {item.label}
          {isNew && (item.newCount ?? 0) > 0 ? ` · ${item.newCount} new` : ''}
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({
  activeTab,
  onTabChange,
  darkMode,
  onToggleDark,
  userInitials,
  userName,
  memberSince,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-14 lg:w-60 flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto">

      {/* Spacer that clears the navbar */}
      <div className="h-20 lg:h-[88px] flex-shrink-0" />

      {/* User block */}
      <div className="flex items-center gap-3 px-2 lg:px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="w-9 h-9 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 select-none">
          {userInitials}
        </div>
        <div className="hidden lg:block min-w-0">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{userName}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Since {memberSince}</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 px-1 lg:px-2 overflow-y-auto">
        {sections.map((section, si) => (
          <div key={section.label} className={si > 0 ? 'mt-1' : ''}>
            {/* Section label — desktop only */}
            <div className="hidden lg:block text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-medium px-4 pt-3 pb-1">
              {section.label}
            </div>
            {/* Divider between sections — tablet icon rail only */}
            {si > 0 && (
              <div className="lg:hidden h-px bg-zinc-100 dark:bg-zinc-800 mx-1 mb-1" />
            )}
            <div className="space-y-0.5">
              {section.items.map(item => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={activeTab === item.id}
                  onClick={onTabChange}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-zinc-100 dark:border-zinc-800 p-1 lg:p-2 space-y-0.5">
        <button
          onClick={onToggleDark}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex items-center justify-center lg:justify-start gap-0 lg:gap-3 w-full rounded-lg px-2 lg:px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none"
        >
          {darkMode
            ? <Sun className="w-5 h-5 flex-shrink-0" />
            : <Moon className="w-5 h-5 flex-shrink-0" />
          }
          <span className="hidden lg:block">{darkMode ? 'Light mode' : 'Dark mode'}</span>
        </button>

        <button
          onClick={onLogout}
          className="flex items-center justify-center lg:justify-start gap-0 lg:gap-3 w-full rounded-lg px-2 lg:px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 outline-none"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="hidden lg:block">Sign out</span>
        </button>
      </div>
    </aside>
  )
}

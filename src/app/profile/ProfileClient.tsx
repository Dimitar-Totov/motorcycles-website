'use client'

import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Sun, Moon } from 'lucide-react'
import { useUser } from '@/context/UserContext'
import type { Motorcycle } from '@/components/catalog-home/types'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import FavoritesTab from './tabs/Favorites'
import CompareTab from './tabs/Compare'
import AlertsTab from './tabs/Alerts'
import RecentlyViewedTab from './tabs/RecentlyViewed'
import MyListingsTab from './tabs/MyListings'
import PreferencesTab from './tabs/Preferences'
import StatsTab from './tabs/Stats'

export type TabId =
  | 'favorites'
  | 'compare'
  | 'alerts'
  | 'recently-viewed'
  | 'listings'
  | 'preferences'
  | 'stats'

const TAB_TITLES: Record<TabId, string> = {
  'favorites':       'Favorites',
  'compare':         'Compare',
  'alerts':          'Alerts',
  'recently-viewed': 'Recently Viewed',
  'listings':        'My Listings',
  'preferences':     'Preferences',
  'stats':           'Stats',
}

interface Props {
  /** Server-resolved favorites, fetched in `page.tsx` and threaded down to `FavoritesTab`. */
  favoriteMotorcycles: Motorcycle[]
}

export default function Profile({ favoriteMotorcycles }: Props) {
  const { user, logout } = useUser()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabId>('favorites')
  // Start light (matches the server-rendered HTML), then read the persisted
  // preference on the client — localStorage is unavailable during SSR.
  const [darkMode, setDarkMode] = useState(false)
  const darkModeHydrated = useRef(false)

  useEffect(() => {
    setDarkMode(localStorage.getItem('profileDarkMode') === 'true')
  }, [])

  // Apply .dark to <html> so the full viewport (including above the navbar) turns dark.
  // Persist only after the initial read so we don't clobber the stored value on first paint.
  useLayoutEffect(() => {
    const html = document.documentElement
    html.classList.toggle('dark', darkMode)
    if (!darkModeHydrated.current) {
      darkModeHydrated.current = true
      return
    }
    localStorage.setItem('profileDarkMode', String(darkMode))
  }, [darkMode])

  // Remove .dark when navigating away from the profile page
  useEffect(() => {
    return () => { document.documentElement.classList.remove('dark') }
  }, [])

  async function handleLogout() {
    await logout()
    router.push('/')
    router.refresh()
  }

  const fullName = user?.user_metadata?.full_name as string | undefined
  const userInitials = fullName
    ? fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0].toUpperCase() ?? '?')
  const userName = fullName ?? user?.email ?? 'Rider'
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    : 'May 2024'

  function toggleDark() {
    setDarkMode(d => !d)
  }

  return (
    <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-sans min-h-screen">

        {/* Fixed left sidebar — hidden on mobile */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          darkMode={darkMode}
          onToggleDark={toggleDark}
          userInitials={userInitials}
          userName={userName}
          memberSince={memberSince}
          onLogout={handleLogout}
        />

        {/* Main area — offset by sidebar width on md/lg */}
        <div className="md:pl-14 lg:pl-60 pb-16 md:pb-0">

          {/* Section header bar */}
          <div className="sticky top-0 z-30 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 md:px-6 lg:px-8 h-12 flex items-center justify-between">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {TAB_TITLES[activeTab]}
            </span>
            <button
              onClick={toggleDark}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none"
            >
              {darkMode
                ? <Sun className="w-4 h-4" />
                : <Moon className="w-4 h-4" />
              }
            </button>
          </div>

          {/* Tab content — key re-mounts the div to trigger fade-slide-in */}
          <div className="p-4 md:p-6 lg:p-8">
            <div key={activeTab} className="animate-fade-slide-in">
              {activeTab === 'favorites'       && <FavoritesTab motorcycles={favoriteMotorcycles} />}
              {activeTab === 'compare'         && <CompareTab />}
              {activeTab === 'alerts'          && <AlertsTab />}
              {activeTab === 'recently-viewed' && <RecentlyViewedTab />}
              {activeTab === 'listings'        && <MyListingsTab />}
              {activeTab === 'preferences'     && <PreferencesTab />}
              {activeTab === 'stats'           && <StatsTab />}
            </div>
          </div>
        </div>

        {/* Bottom nav — mobile only */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
  )
}

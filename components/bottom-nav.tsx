'use client'
import { Home, Wrench, BookOpen, Zap, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TabId = 'home' | 'calculators' | 'nec' | 'sparky' | 'profile'

interface BottomNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const tabs: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'home',        label: 'Home',    icon: Home },
  { id: 'calculators', label: 'Tools',   icon: Wrench },
  { id: 'nec',         label: 'Codes',   icon: BookOpen },
  { id: 'sparky',      label: 'Sparky',  icon: Zap },
  { id: 'profile',     label: 'Profile', icon: User },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/[0.06]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="flex items-stretch">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 transition-all duration-200',
                isActive
                  ? 'text-orange-400'
                  : 'text-zinc-600'
              )}
            >
              <div className={cn(
                'flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200',
                isActive ? 'bg-orange-500/10' : 'bg-transparent'
              )}>
                <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className={cn(
                'text-[10px] font-medium tracking-wide transition-opacity duration-200',
                isActive ? 'opacity-100' : 'opacity-50'
              )}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
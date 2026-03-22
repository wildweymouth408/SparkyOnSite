'use client'
import { useState, useEffect } from 'react'
import { BottomNav, type TabId } from '@/components/bottom-nav'
import { ToolsTab } from '@/components/tools-tab'
import { ReferenceTab } from '@/components/reference-tab'
import { AskSparkyTab } from '@/components/ask-sparky-tab'
import { HomeTab } from '@/components/home-tab'
import { MoreTab } from '@/components/more-tab'
import { DisclaimerModal } from '@/components/disclaimer-modal'

export default function SparkyApp() {
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const [pendingToolId, setPendingToolId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    function handleDarkMode() {
      const current = localStorage.getItem('sparky_dark_mode')
      if (current === 'false') {
        document.documentElement.classList.remove('dark')
      } else {
        document.documentElement.classList.add('dark')
      }
    }
    window.addEventListener('sparky_dark_mode_changed', handleDarkMode)
    return () => {
      window.removeEventListener('sparky_dark_mode_changed', handleDarkMode)
    }
  }, [])

  function handleNavigate(tab: TabId, toolId?: string) {
    if (toolId) setPendingToolId(toolId)
    setActiveTab(tab)
  }

  function handleToolConsumed() {
    setPendingToolId(null)
  }

  if (!mounted) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#f59e0b] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-semibold text-foreground">Sparky</span>
            <span className="text-xs text-[#52525b]">Loading your tools...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#f97316] to-[#f59e0b] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-foreground">
            Sparky
          </span>
          <span className="text-xs text-[#52525b]">
            {activeTab === 'home' ? '' : 
             activeTab === 'calculators' ? '/ Tools' :
             activeTab === 'nec' ? '/ Codes' :
             activeTab === 'sparky' ? '/ Sparky' :
             '/ Profile'}
          </span>
        </div>
        <div className="h-1 w-12 overflow-hidden rounded-full bg-[#27272a]">
          <div
            className="h-full w-4 rounded-full sunrise-gradient"
            style={{ animation: 'electron-flow 1.5s linear infinite' }}
          />
        </div>
      </header>

      {/* Content */}
      <main
        className="flex-1 overflow-y-auto px-4 py-4 pb-32"
        style={{ paddingBottom: 'calc(8rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {activeTab === 'home'        && <HomeTab onNavigate={handleNavigate} />}
        {activeTab === 'calculators' && (
          <ToolsTab
            initialToolId={pendingToolId}
            key={pendingToolId ?? 'calculators'}
            onToolConsumed={handleToolConsumed}
          />
        )}
        {activeTab === 'nec'         && <ReferenceTab />}
        {activeTab === 'sparky'      && <AskSparkyTab />}
        {activeTab === 'profile'     && <MoreTab />}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <DisclaimerModal />
    </div>
  )
}
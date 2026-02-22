'use client'
import { useState, useEffect } from 'react'
import { BottomNav, type TabId } from '@/components/bottom-nav'
import { ToolsTab } from '@/components/tools-tab'
import { ReferenceTab } from '@/components/reference-tab'
import { AskSparkyTab } from '@/components/ask-sparky-tab'
import { HomeTab } from '@/components/home-tab'
import { MoreTab } from '@/components/more-tab'

export default function SparkyApp() {
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const [pendingToolId, setPendingToolId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Apply saved field mode class on mount
    const savedField = localStorage.getItem('sparky_field_mode')
    if (savedField === 'true') {
      document.documentElement.classList.add('field-mode')
    }

    // Listen for field mode toggle from More tab
    function handleFieldMode() {
      const current = localStorage.getItem('sparky_field_mode')
      if (current === 'true') {
        document.documentElement.classList.add('field-mode')
      } else {
        document.documentElement.classList.remove('field-mode')
      }
    }

    // Listen for dark mode toggle from More tab  
    function handleDarkMode() {
      const current = localStorage.getItem('sparky_dark_mode')
      if (current === 'false') {
        document.documentElement.classList.remove('dark')
      } else {
        document.documentElement.classList.add('dark')
      }
    }

    window.addEventListener('sparky_field_mode_changed', handleFieldMode)
    window.addEventListener('sparky_dark_mode_changed', handleDarkMode)
    return () => {
      window.removeEventListener('sparky_field_mode_changed', handleFieldMode)
      window.removeEventListener('sparky_dark_mode_changed', handleDarkMode)
    }
  }, [])

  // Called by HomeTab Quick Actions
  function handleNavigate(tab: TabId, toolId?: string) {
    if (toolId) setPendingToolId(toolId)
    setActiveTab(tab)
  }

  // Clear pending tool after Tools tab picks it up
  function handleToolConsumed() {
    setPendingToolId(null)
  }

  if (!mounted) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#0f1115]">
        <div className="flex flex-col items-center gap-3">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#ff6b00]" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span className="text-xs uppercase tracking-widest text-[#555]">Loading...</span>
        </div>
      </div>
    )
  }

  const tabAccentColor: Record<TabId, string> = {
    home:      '#ff6b00',
    tools:     '#00d4ff',
    reference: '#00ff88',
    sparky:    '#ff6b00',
    more:      '#888888',
  }

  const tabTitle: Record<TabId, string> = {
    home:      'Home',
    tools:     'Tools',
    reference: 'Reference',
    sparky:    'Ask Sparky',
    more:      'More',
  }

  return (
    <div className="flex h-dvh flex-col bg-[#0f1115] text-[#f0f0f0]">
      <header className="flex items-center justify-between border-b border-[#333] bg-[#0f1115] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5"
            style={{ color: tabAccentColor[activeTab] }}>
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span className="text-sm font-bold uppercase tracking-wider" style={{ color: tabAccentColor[activeTab] }}>
            Sparky
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#555]">
            / {tabTitle[activeTab]}
          </span>
        </div>
        <div className="h-1 w-16 overflow-hidden bg-[#222]">
          <div
            className="h-full w-4"
            style={{
              backgroundColor: tabAccentColor[activeTab],
              animation: 'electron-flow 1.5s linear infinite',
            }}
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        {activeTab === 'home'      && <HomeTab onNavigate={handleNavigate} />}
        {activeTab === 'tools'     && (
          <ToolsTab
            initialToolId={pendingToolId}
            key={pendingToolId ?? 'tools'}
            onToolConsumed={handleToolConsumed}
          />
        )}
        {activeTab === 'reference' && <ReferenceTab />}
        {activeTab === 'sparky'    && <AskSparkyTab />}
        {activeTab === 'more'      && <MoreTab />}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  User, Palette, Ruler, Bell, HelpCircle, Info, FileText, LogOut,
  ChevronRight, Sun, Moon, Monitor, Check,
} from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-orange-500 px-4 mb-1">{title}</h2>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
        {children}
      </div>
    </div>
  )
}

function Row({
  icon: Icon, label, value, onPress, danger = false, trailing,
}: {
  icon: React.ElementType
  label: string
  value?: string
  onPress?: () => void
  danger?: boolean
  trailing?: React.ReactNode
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${onPress ? 'hover:bg-zinc-800/60 active:bg-zinc-800' : 'cursor-default'} ${danger ? 'text-red-400' : ''}`}
      onClick={onPress}
      disabled={!onPress && !trailing}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${danger ? 'bg-red-500/10' : 'bg-orange-500/10'}`}>
        <Icon className={`h-4 w-4 ${danger ? 'text-red-400' : 'text-orange-400'}`} />
      </div>
      <span className={`flex-1 text-sm font-medium ${danger ? 'text-red-400' : 'text-white'}`}>{label}</span>
      {value && <span className="text-xs text-zinc-500 mr-1">{value}</span>}
      {trailing ?? (onPress && <ChevronRight className="h-4 w-4 text-zinc-600 shrink-0" />)}
    </button>
  )
}

type Theme = 'system' | 'dark' | 'light'
type Units = 'imperial' | 'metric'

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [theme, setTheme] = useState<Theme>('dark')
  const [units, setUnits] = useState<Units>('imperial')
  const [notifyUpdates, setNotifyUpdates] = useState(true)
  const [notifyTips, setNotifyTips] = useState(false)

  async function handleSignOut() {
    await signOut()
    router.push('/')
  }

  const themeIcons: Record<Theme, React.ElementType> = { system: Monitor, dark: Moon, light: Sun }
  const ThemeIcon = themeIcons[theme]

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-16">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950 border-b border-zinc-800 px-4 py-3">
        <h1 className="text-lg font-bold">Settings</h1>
      </div>

      <div className="px-4 pt-6 max-w-lg mx-auto">

        {/* Account */}
        <Section title="Account">
          <Row
            icon={User}
            label={user?.email ?? 'Not signed in'}
            value={user ? 'Signed in' : undefined}
          />
        </Section>

        {/* Appearance */}
        <Section title="Appearance">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                <ThemeIcon className="h-4 w-4 text-orange-400" />
              </div>
              <span className="text-sm font-medium text-white flex-1">Theme</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['system', 'dark', 'light'] as Theme[]).map(t => {
                const Icon = themeIcons[t]
                return (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-medium capitalize transition-colors ${
                      theme === t
                        ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                        : 'border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {t}
                    {theme === t && <Check className="h-3 w-3" />}
                  </button>
                )
              })}
            </div>
          </div>
        </Section>

        {/* Units */}
        <Section title="Units">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                <Ruler className="h-4 w-4 text-orange-400" />
              </div>
              <span className="text-sm font-medium text-white flex-1">Measurement System</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['imperial', 'metric'] as Units[]).map(u => (
                <button
                  key={u}
                  onClick={() => setUnits(u)}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-medium capitalize transition-colors ${
                    units === u
                      ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                      : 'border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  {u === 'imperial' ? 'Imperial (ft, in)' : 'Metric (m, mm)'}
                  {units === u && <Check className="h-3 w-3" />}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
              <Bell className="h-4 w-4 text-orange-400" />
            </div>
            <span className="flex-1 text-sm font-medium text-white">App Updates</span>
            <button
              onClick={() => setNotifyUpdates(v => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors ${notifyUpdates ? 'bg-orange-500' : 'bg-zinc-700'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifyUpdates ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
              <Bell className="h-4 w-4 text-orange-400" />
            </div>
            <span className="flex-1 text-sm font-medium text-white">Tips & Tricks</span>
            <button
              onClick={() => setNotifyTips(v => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors ${notifyTips ? 'bg-orange-500' : 'bg-zinc-700'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifyTips ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </Section>

        {/* Support */}
        <Section title="Support">
          <Row icon={HelpCircle} label="Help & FAQ" onPress={() => router.push('/help')} />
          <Row icon={HelpCircle} label="What's New" onPress={() => router.push('/whats-new')} />
          <Row
            icon={HelpCircle}
            label="Contact Support"
            onPress={() => window.location.href = 'mailto:ianw@sparkyonsite.com'}
          />
        </Section>

        {/* About */}
        <Section title="About">
          <Row icon={Info} label="Version" value="1.0.0 (Beta)" />
          <Row icon={Info} label="About Sparky" onPress={() => router.push('/')} />
        </Section>

        {/* Legal */}
        <Section title="Legal">
          <Row icon={FileText} label="Privacy Policy" onPress={() => router.push('/privacy')} />
          <Row icon={FileText} label="Terms of Service" onPress={() => router.push('/terms')} />
        </Section>

        {/* Sign Out */}
        {user && (
          <Section title="Account Actions">
            <Row icon={LogOut} label="Sign Out" onPress={handleSignOut} danger />
          </Section>
        )}

      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { LogOut, Bell, Sun, Moon, Zap, User, ChevronRight, Info, Wallet, FileText, Shield, ExternalLink, Tag, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { CredentialsTab } from './credentials-tab'

interface Profile {
  name?: string
  role?: string
  years_exp?: number
  email?: string
}

export function MoreTab() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(false)

  const [signingOut, setSigningOut] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showWallet, setShowWallet] = useState(false)

  const [promoCode, setPromoCode] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoMessage, setPromoMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const [activePromo, setActivePromo] = useState<{ code: string; expires_at: string } | null>(null)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email ?? null)
      const { data } = await supabase
        .from('profiles')
        .select('name, role, years_exp')
        .eq('id', user.id)
        .single()
      if (data) setProfile({ ...data, email: user.email })
    }
    loadProfile()
    loadActivePromo()

    const savedNotifications = localStorage.getItem('sparky_notifications')
    if (savedNotifications !== null) setNotifications(JSON.parse(savedNotifications))

    const savedDark = localStorage.getItem('sparky_dark_mode')
    if (savedDark !== null) setDarkMode(JSON.parse(savedDark))


  }, [])

  async function loadActivePromo() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('user_promos')
      .select('code, expires_at')
      .eq('user_id', user.id)
      .gt('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (data) setActivePromo(data)
  }

  async function handleRedeemPromo() {
    const code = promoCode.trim().toUpperCase()
    if (!code) return
    setPromoLoading(true)
    setPromoMessage(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setPromoMessage({ text: 'Sign in to redeem a promo code.', ok: false })
      setPromoLoading(false)
      return
    }

    // Verify code exists
    const { data: codeRow } = await supabase
      .from('promo_codes')
      .select('code, duration_days')
      .eq('code', code)
      .maybeSingle()

    if (!codeRow) {
      setPromoMessage({ text: 'Invalid promo code.', ok: false })
      setPromoLoading(false)
      return
    }

    // Check if already used by this user
    const { data: existing } = await supabase
      .from('user_promos')
      .select('code')
      .eq('user_id', user.id)
      .eq('code', code)
      .maybeSingle()

    if (existing) {
      setPromoMessage({ text: 'You've already used this code.', ok: false })
      setPromoLoading(false)
      return
    }

    const now = new Date()
    const expiresAt = new Date(now.getTime() + codeRow.duration_days * 24 * 60 * 60 * 1000)

    const { error } = await supabase.from('user_promos').insert({
      user_id: user.id,
      code,
      activated_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    })

    if (error) {
      setPromoMessage({ text: 'Could not activate code. Try again.', ok: false })
    } else {
      setPromoMessage({ text: `Beta access activated! Expires ${expiresAt.toLocaleDateString()}.`, ok: true })
      setActivePromo({ code, expires_at: expiresAt.toISOString() })
      setPromoCode('')
    }
    setPromoLoading(false)
  }

  async function handleSignOut() {
    setSigningOut(true)
    await supabase.auth.signOut()
    window.location.reload()
  }

  function toggleNotifications() {
    const next = !notifications
    setNotifications(next)
    localStorage.setItem('sparky_notifications', JSON.stringify(next))
  }

  function toggleDarkMode() {
    const next = !darkMode
    setDarkMode(next)
    if (next) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('sparky_dark_mode', JSON.stringify(next))
    window.dispatchEvent(new Event('sparky_dark_mode_changed'))
  }



  const displayName = profile?.name || email?.split('@')[0] || 'Electrician'
  const roleLabel = profile?.role
    ? `${profile.role}${profile.years_exp ? ` · ${profile.years_exp} yrs` : ''}`
    : null

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">

      {/* Profile Card */}
      <div className="rounded border border-[#27272a] bg-[#13161a] p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-[#f97316]/10 border border-[#f97316]/30">
            <User className="h-6 w-6 text-[#f97316]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-[#fafafa] truncate">{displayName}</span>
            {roleLabel && (
              <span className="text-xs text-[#f97316] uppercase tracking-wider mt-0.5">{roleLabel}</span>
            )}
            <span className="text-[11px] text-[#a1a1aa] truncate mt-0.5">{email}</span>
          </div>
        </div>
      </div>

      {/* Credential Wallet */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-medium uppercase tracking-widest text-[#71717a] px-1 mb-1">
          Wallet
        </span>
        <button
          onClick={() => setShowWallet(!showWallet)}
          className="flex items-center justify-between rounded border border-[#27272a] bg-[#13161a] px-4 py-3 text-left w-full"
        >
          <div className="flex items-center gap-3">
            <Wallet className="h-4 w-4 text-[#f97316]" />
            <div className="flex flex-col">
              <span className="text-sm text-[#ccc]">Credential Wallet</span>
              <span className="text-[10px] text-[#71717a] uppercase tracking-wider">Licenses · Certs · Cards</span>
            </div>
          </div>
          <ChevronRight className={`h-4 w-4 text-[#a1a1aa] transition-transform duration-200 ${showWallet ? 'rotate-90' : ''}`} />
        </button>
        {showWallet && (
          <div className="rounded border border-[#27272a] bg-[#0d1014] px-3 py-4">
            <CredentialsTab />
          </div>
        )}
      </div>

      {/* Beta Access */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-medium uppercase tracking-widest text-[#71717a] px-1 mb-1">
          Beta Access
        </span>

        {activePromo ? (
          <div className="flex items-center gap-3 rounded border border-[#f97316]/30 bg-[#f97316]/8 px-4 py-3">
            <CheckCircle2 className="h-4 w-4 text-[#f97316] shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm text-[#fafafa] font-medium">Beta access active</span>
              <span className="text-[11px] text-[#a1a1aa]">
                Code {activePromo.code} · Expires {new Date(activePromo.expires_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 rounded border border-[#27272a] bg-[#13161a] px-4 py-3">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-[#f97316] shrink-0" />
              <span className="text-sm text-[#ccc]">Enter Promo Code</span>
            </div>
            <div className="flex gap-2">
              <input
                value={promoCode}
                onChange={e => setPromoCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleRedeemPromo()}
                placeholder="BETA001"
                className="flex-1 h-9 px-3 text-sm font-mono bg-[#0d1014] border border-[#3f3f46] text-[#fafafa] placeholder-[#52525b] focus:outline-none focus:border-[#f97316]"
                disabled={promoLoading}
              />
              <button
                onClick={handleRedeemPromo}
                disabled={promoLoading || !promoCode.trim()}
                className="h-9 px-4 text-xs font-bold uppercase tracking-wider bg-[#f97316] text-black disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {promoLoading ? '...' : 'Redeem'}
              </button>
            </div>
            {promoMessage && (
              <p className={`text-[11px] ${promoMessage.ok ? 'text-green-400' : 'text-red-400'}`}>
                {promoMessage.text}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-medium uppercase tracking-widest text-[#71717a] px-1 mb-1">
          Settings
        </span>



        {/* Dark Mode */}
        <div className="flex items-center justify-between rounded border border-[#27272a] bg-[#13161a] px-4 py-3">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="h-4 w-4 text-[#a1a1aa]" /> : <Sun className="h-4 w-4 text-[#a1a1aa]" />}
            <span className="text-sm text-[#ccc]">Dark Mode</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${darkMode ? 'bg-[#f97316]' : 'bg-[#3f3f46]'}`}
            aria-label="Toggle dark mode"
          >
            <span className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${darkMode ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between rounded border border-[#27272a] bg-[#13161a] px-4 py-3">
          <div className="flex items-center gap-3">
            <Bell className="h-4 w-4 text-[#a1a1aa]" />
            <span className="text-sm text-[#ccc]">Notifications</span>
          </div>
          <button
            onClick={toggleNotifications}
            className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${notifications ? 'bg-[#f97316]' : 'bg-[#3f3f46]'}`}
            aria-label="Toggle notifications"
          >
            <span className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${notifications ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* About */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-medium uppercase tracking-widest text-[#71717a] px-1 mb-1">
          About
        </span>
        <button
          onClick={() => setShowAbout(!showAbout)}
          className="flex items-center justify-between rounded border border-[#27272a] bg-[#13161a] px-4 py-3 text-left w-full"
        >
          <div className="flex items-center gap-3">
            <Zap className="h-4 w-4 text-[#f97316]" />
            <span className="text-sm text-[#ccc]">About Sparky</span>
          </div>
          <ChevronRight className={`h-4 w-4 text-[#a1a1aa] transition-transform duration-200 ${showAbout ? 'rotate-90' : ''}`} />
        </button>
        {showAbout && (
          <div className="rounded border border-[#27272a] bg-[#0d1014] px-4 py-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#f97316]">
                <Zap className="h-4 w-4 text-black" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#f97316]">Sparky</div>
                <div className="text-[10px] text-[#a1a1aa] uppercase tracking-wider">Field Electrical Assistant</div>
              </div>
            </div>
            <p className="text-xs text-[#777] leading-relaxed">
              Built by an 11-year Silicon Valley electrician for apprentices and journeymen in the field.
              Fast NEC lookups, load calculations, conduit math, and an AI assistant that speaks your language.
            </p>
            <div className="flex items-center gap-2 pt-1 border-t border-[#1a1d22]">
              <Info className="h-3 w-3 text-[#71717a]" />
              <span className="text-[10px] text-[#71717a] uppercase tracking-wider">Version 1.0 · Built with ⚡ in California</span>
            </div>
          </div>
        )}
      </div>

      {/* Legal */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-medium uppercase tracking-widest text-[#71717a] px-1 mb-1">
          Legal
        </span>
        <a
          href="/terms"
          className="flex items-center justify-between rounded border border-[#27272a] bg-[#13161a] px-4 py-3 text-left w-full"
        >
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-[#f97316]" />
            <span className="text-sm text-[#ccc]">Terms of Service</span>
          </div>
          <ExternalLink className="h-4 w-4 text-[#a1a1aa]" />
        </a>
        <a
          href="/privacy"
          className="flex items-center justify-between rounded border border-[#27272a] bg-[#13161a] px-4 py-3 text-left w-full"
        >
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-[#f97316]" />
            <span className="text-sm text-[#ccc]">Privacy Policy</span>
          </div>
          <ExternalLink className="h-4 w-4 text-[#a1a1aa]" />
        </a>
      </div>

      {/* Sign Out */}
      <div className="flex flex-col gap-1">
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex items-center justify-center gap-2 rounded border border-red-900/40 bg-red-950/20 px-4 py-3 text-sm font-medium uppercase tracking-wider text-red-400 transition-colors hover:bg-red-950/40 disabled:opacity-50 w-full"
        >
          <LogOut className="h-4 w-4" />
          {signingOut ? 'Signing Out...' : 'Sign Out'}
        </button>
      </div>

      <div className="pb-4" />
    </div>
  )
}


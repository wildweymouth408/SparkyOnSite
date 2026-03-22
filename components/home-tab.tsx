'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Zap, User, Lightbulb, Edit2, Check, X,
  Plus, ChevronRight, Briefcase,
  BookOpen, Cylinder, Triangle, Ruler, Cable,
  Gauge, Box, Settings, HardHat,
  Sun, Mic, MicOff, Send, Loader2
} from 'lucide-react'
import { getTipOfTheDay } from '@/lib/tips'
import { getTopTools, hasUsageData } from '@/lib/usage'
import { supabase } from '@/lib/supabase'
import { JobDetailView } from './job-detail-view'

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
  interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    start(): void
    stop(): void
    abort(): void
    onresult: ((event: SpeechRecognitionEvent) => void) | null
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
    onend: (() => void) | null
    onstart: (() => void) | null
  }
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList
  }
  interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult
    length: number
  }
  interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative
    isFinal: boolean
  }
  interface SpeechRecognitionAlternative {
    transcript: string
    confidence: number
  }
  interface SpeechRecognitionErrorEvent extends Event {
    error: string
  }
}

// ─── TYPES ─────────────────────────────────────────────────────────────────────

interface UserProfile {
  name: string
  role: string
  yearsExp: number
  workType: string
  licenseNumber: string
  licenseState: string
}

interface Job {
  id: string
  user_id: string
  name: string
  address: string | null
  job_type: string | null
  notes: string | null
  last_used_at: string
  created_at: string
}

type TabId = 'home' | 'calculators' | 'nec' | 'sparky' | 'profile'

interface HomeTabProps {
  onNavigate?: (tab: TabId, toolId?: string) => void
}

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────

const ROLE_OPTIONS = [
  'Apprentice - Year 1', 'Apprentice - Year 2', 'Apprentice - Year 3',
  'Apprentice - Year 4', 'Apprentice - Year 5', 'Journeyman', 'Foreman',
  'General Foreman', 'Master Electrician', 'Estimator', 'Inspector',
]
const WORK_TYPES = ['Residential', 'Commercial', 'Industrial', 'Mixed']

// ─── TOOL DEFINITIONS ──────────────────────────────────────────────────────────

const ALL_TOOLS = [
  { id: 'voltage-drop',  label: 'Voltage Drop',    desc: 'V, A, length, wire',      icon: Zap,      color: '#f97316', tab: 'calculators' as TabId },
  { id: 'conduit-fill',  label: 'Conduit Fill',     desc: 'Type, size, wire count',  icon: Cylinder, color: '#f97316', tab: 'calculators' as TabId },
  { id: 'ohms-law',      label: "Ohm's Law",        desc: 'V, I, R triangle',        icon: Triangle, color: '#f97316', tab: 'calculators' as TabId },
  { id: 'pipe-bending',  label: 'Pipe Bending',     desc: 'Offsets, 90s, saddles',   icon: Ruler,    color: '#f97316', tab: 'calculators' as TabId },
  { id: 'wire-sizing',   label: 'Wire Sizing',      desc: 'Load, distance, NEC',     icon: Cable,    color: '#f97316', tab: 'calculators' as TabId },
  { id: 'ampacity',      label: 'Ampacity',         desc: 'Derating & correction',   icon: Gauge,    color: '#f97316', tab: 'calculators' as TabId },
  { id: 'box-fill',      label: 'Box Fill',         desc: 'NEC 314.16 volumes',      icon: Box,      color: '#f97316', tab: 'calculators' as TabId },
  { id: 'motor-fla',     label: 'Motor FLA',        desc: '430.248/250 tables',      icon: Settings, color: '#f97316', tab: 'calculators' as TabId },
  { id: 'construction',  label: 'Construction',     desc: 'Fractions, feet & inches',icon: HardHat,  color: '#f97316', tab: 'calculators' as TabId },
]

const DEFAULT_QUICK_ACTIONS = [
  { id: 'voltage-drop', label: 'Voltage Drop',    desc: 'Most-used calculator', icon: Zap,      color: '#f97316', tab: 'calculators' as TabId },
  { id: 'pipe-bending', label: 'Conduit Bending', desc: 'Chart, brands, calc',  icon: Ruler,    color: '#f97316', tab: 'calculators' as TabId },
  { id: 'nec-ref',      label: 'NEC Reference',   desc: 'Look up an article',   icon: BookOpen, color: '#f97316', tab: 'nec'         as TabId },
  { id: 'box-fill',     label: 'Box Fill',         desc: 'NEC 314.16 volumes',   icon: Box,      color: '#f97316', tab: 'calculators' as TabId },
]

// ─── FIELD MODE HOOK ───────────────────────────────────────────────────────────

function useFieldMode() {
  const [fieldMode, setFieldMode] = useState(false)
  useEffect(() => {
    const saved = localStorage.getItem('sparky_field_mode')
    if (saved !== null) setFieldMode(JSON.parse(saved))
    function handleChange() {
      const updated = localStorage.getItem('sparky_field_mode')
      if (updated !== null) setFieldMode(JSON.parse(updated))
    }
    window.addEventListener('sparky_field_mode_changed', handleChange)
    return () => window.removeEventListener('sparky_field_mode_changed', handleChange)
  }, [])
  return fieldMode
}

// ─── AUTH SCREEN ───────────────────────────────────────────────────────────────

function AuthScreen({ onAuth }: { onAuth: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const inp = 'w-full bg-[#0a0b0e] border border-[#2a2a35] px-3 py-3 text-sm text-[#f0f0f0] focus:border-[#f97316] focus:outline-none'
  const lbl = 'block text-[10px] uppercase tracking-wider text-[#52525b] mb-1.5'

  async function handleSubmit() {
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
      }
      onAuth()
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full justify-center px-2 py-6">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center justify-center w-14 h-14 bg-[#f97316] mb-3">
          <Zap className="h-7 w-7 text-[#09090b]" />
        </div>
        <h1 className="text-2xl font-bold text-[#f97316] uppercase tracking-wider">Sparky</h1>
        <p className="text-[11px] text-[#52525b] uppercase tracking-widest mt-1">Your Field Electrical Assistant</p>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <label className={lbl}>Email</label>
          <input className={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <label className={lbl}>Password</label>
          <input className={inp} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {error && <p className="text-xs text-[#ff4444]">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          className="w-full py-3.5 bg-[#f97316] text-[#09090b] text-sm font-bold uppercase tracking-wider disabled:opacity-40 mt-2"
        >
          {loading ? 'Please wait...' : isLogin ? 'Sign In →' : 'Create Account →'}
        </button>
        <button onClick={() => setIsLogin(!isLogin)} className="text-xs text-[#52525b] underline text-center">
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}

// ─── ONBOARDING SCREEN ─────────────────────────────────────────────────────────

function OnboardingScreen({ onComplete }: { onComplete: (profile: UserProfile) => void }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('Journeyman')
  const [yearsExp, setYearsExp] = useState(1)
  const [workType, setWorkType] = useState('Commercial')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [licenseState, setLicenseState] = useState('CA')
  const [step, setStep] = useState(1)

  const inp = 'w-full bg-[#0a0b0e] border border-[#2a2a35] px-3 py-3 text-sm text-[#f0f0f0] focus:border-[#f97316] focus:outline-none'
  const sel = 'w-full bg-[#0a0b0e] border border-[#2a2a35] px-3 py-3 text-sm text-[#f0f0f0] focus:border-[#f97316] focus:outline-none appearance-none'
  const lbl = 'block text-[10px] uppercase tracking-wider text-[#52525b] mb-1.5'

  return (
    <div className="flex flex-col h-full justify-center px-2 py-6">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center justify-center w-14 h-14 bg-[#f97316] mb-3">
          <Zap className="h-7 w-7 text-[#09090b]" />
        </div>
        <h1 className="text-2xl font-bold text-[#f97316] uppercase tracking-wider">Sparky</h1>
        <p className="text-[11px] text-[#52525b] uppercase tracking-widest mt-1">Your Field Electrical Assistant</p>
      </div>

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div className="text-center mb-2">
            <p className="text-sm text-[#888]">Let's set up your profile so Sparky knows who you are.</p>
          </div>
          <div>
            <label className={lbl}>Your First Name</label>
            <input className={inp} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Mike" autoFocus />
          </div>
          <div>
            <label className={lbl}>Your Role</label>
            <select className={sel} value={role} onChange={e => setRole(e.target.value)}>
              {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>Years of Experience</label>
            <input className={inp} type="number" min={0} max={50} value={yearsExp} onChange={e => setYearsExp(parseInt(e.target.value) || 0)} />
          </div>
          <div>
            <label className={lbl}>Primary Work Type</label>
            <div className="grid grid-cols-2 gap-2">
              {WORK_TYPES.map(w => (
                <button key={w} onClick={() => setWorkType(w)}
                  className={`py-2.5 text-xs font-bold uppercase tracking-wider border transition-all ${workType === w ? 'border-[#f97316] text-[#f97316] bg-[#f9731612]' : 'border-[#2a2a35] text-[#52525b]'}`}>
                  {w}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => name.trim() ? setStep(2) : null} disabled={!name.trim()}
            className="w-full py-3.5 bg-[#f97316] text-[#09090b] text-sm font-bold uppercase tracking-wider disabled:opacity-40 mt-2">
            Continue →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div className="text-center mb-2">
            <p className="text-sm text-[#888]">Optional — add your license info now or later.</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className={lbl}>License Number</label>
              <input className={inp} value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} placeholder="C-10 #12345" />
            </div>
            <div>
              <label className={lbl}>State</label>
              <input className={inp} value={licenseState} onChange={e => setLicenseState(e.target.value.toUpperCase().slice(0, 2))} placeholder="CA" maxLength={2} />
            </div>
          </div>
          <div className="bg-[#111] border border-[#2a2a35] p-3 mt-2">
            <p className="text-[10px] text-[#52525b] leading-relaxed">
              You can add OSHA cards, certifications, and other credentials in the Profile tab after setup.
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => setStep(1)} className="flex-1 py-3.5 border border-[#2a2a35] text-[#52525b] text-sm font-bold uppercase tracking-wider">
              ← Back
            </button>
            <button onClick={() => onComplete({ name: name.trim(), role, yearsExp, workType, licenseNumber, licenseState })}
              className="flex-[2] py-3.5 bg-[#f97316] text-[#09090b] text-sm font-bold uppercase tracking-wider">
              Let's Go →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── ASK SPARKY VOICE WIDGET ───────────────────────────────────────────────────

const SPARKY_SYSTEM_PROMPT = `You are Sparky, an expert electrician with 20+ years of experience and deep knowledge of the NEC codebook. Answer electrical questions clearly and practically. Always cite the relevant NEC article number when applicable. Keep answers concise enough to read on a job site. Never guess — if you're unsure, say so.

CONDUIT BENDING MATH (EMT hand benders — always show your work):
Offset multipliers (distance between bends = offset height × multiplier):
10° → ×6.0  | shrinkage per inch of offset: 1/16"
22.5° → ×2.6 | shrinkage per inch: 3/16"
30° → ×2.0  | shrinkage per inch: 1/4" ← recommend for most offsets
45° → ×1.414 | shrinkage per inch: 3/8"
60° → ×1.154 | shrinkage per inch: 1/2"
90° take-up: 1/2" EMT→5" 3/4"→6" 1"→8" 1-1/4"→11" 1-1/2"→13" 2"→16"
Show step-by-step calculations and mark placement in plain terms.`

function AskSparkyWidget({ fieldMode }: { fieldMode: boolean }) {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [usedVoice, setUsedVoice] = useState(false)
  const [modelUsed, setModelUsed] = useState<'ollama' | 'cloud' | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SR) setVoiceSupported(true)
    if ('speechSynthesis' in window) {
      const load = () => { voicesRef.current = window.speechSynthesis.getVoices() }
      load()
      window.speechSynthesis.addEventListener('voiceschanged', load)
      return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
    }
  }, [])

  function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.continuous = false
    rec.interimResults = false
    rec.lang = 'en-US'
    rec.onstart = () => { setIsListening(true); setUsedVoice(true) }
    rec.onresult = (e) => { const text = e.results[0][0].transcript; setInput(text) }
    rec.onend = () => setIsListening(false)
    rec.onerror = () => setIsListening(false)
    recognitionRef.current = rec
    rec.start()
  }

  function stopListening() {
    recognitionRef.current?.stop()
    setIsListening(false)
  }

  function speak(text: string) {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const cleaned = text.replace(/\*\*/g, '').replace(/#{1,3}\s/g, '').substring(0, 600)
    const utt = new SpeechSynthesisUtterance(cleaned)
    utt.rate = 0.95
    const preferred = voicesRef.current.find(v =>
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Alex'))
    )
    if (preferred) utt.voice = preferred
    window.speechSynthesis.speak(utt)
  }

  async function callCloud(text: string): Promise<string> {
    const { supabase } = await import('@/lib/supabase')
    const { data: { session } } = await supabase.auth.getSession()
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
    const res = await fetch('/api/ask-sparky', {
      method: 'POST',
      headers,
      body: JSON.stringify({ messages: [{ role: 'user', content: text }] }),
    })
    const data = await res.json()
    return data.reply || 'Something went wrong.'
  }

  async function ask() {
    const text = input.trim()
    if (!text || loading) return
    setLoading(true)
    setResponse('')
    setModelUsed(null)
    try {
      let reply = ''
      try {
        const res = await fetch('http://localhost:11434/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'qwen2.5:3b',
            messages: [
              { role: 'system', content: SPARKY_SYSTEM_PROMPT },
              { role: 'user', content: text },
            ],
          }),
        })
        if (!res.ok) throw new Error(`status ${res.status}`)
        const data = await res.json()
        reply = data.choices?.[0]?.message?.content || ''
        if (reply) setModelUsed('ollama')
      } catch {
        reply = await callCloud(text)
        setModelUsed('cloud')
      }
      setResponse(reply)
      if (usedVoice) speak(reply)
    } catch {
      setResponse('Connection error. Check your signal.')
    } finally {
      setLoading(false)
      setInput('')
      setUsedVoice(false)
    }
  }

  const border = fieldMode ? 'border-yellow-400/30 bg-black' : 'border-[#2a2a35] bg-[#111]'
  const inputCls = fieldMode
    ? 'flex-1 h-11 px-3 text-sm bg-black border border-yellow-400/30 text-yellow-100 placeholder-yellow-400/30 focus:outline-none focus:border-yellow-400'
    : 'flex-1 h-11 px-3 text-sm bg-[#0a0b0e] border border-[#3f3f46] text-[#f0f0f0] placeholder-[#444] focus:outline-none focus:border-[#f97316]'

  return (
    <div className={`border p-4 flex flex-col gap-3 ${border}`}>
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-[#f97316]" />
        <span className={`text-[11px] font-bold uppercase tracking-widest ${fieldMode ? 'text-yellow-300' : 'text-[#f97316]'}`}>
          Ask Sparky
        </span>
        <span className={`ml-auto text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border ${
          modelUsed === 'ollama' ? 'border-green-500/60 text-green-400'
            : modelUsed === 'cloud' ? fieldMode ? 'border-yellow-400/20 text-yellow-400/40' : 'border-[#3f3f46] text-[#444]'
            : fieldMode ? 'border-yellow-400/10 text-yellow-400/30' : 'border-[#27272a] text-[#3f3f46]'
        }`}>
          {modelUsed === 'ollama' ? 'Local' : modelUsed === 'cloud' ? 'Cloud' : 'Local→Cloud'}
        </span>
        {voiceSupported && (
          <span className={`text-[9px] uppercase tracking-wider ${fieldMode ? 'text-yellow-400/40' : 'text-[#444]'}`}>
            {usedVoice ? '🎤 → spoken' : 'mic on'}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {voiceSupported && (
          <button
            onClick={() => isListening ? stopListening() : startListening()}
            disabled={loading}
            className={`h-11 w-11 shrink-0 flex items-center justify-center border transition-all ${
              isListening
                ? 'border-[#f97316] bg-[#f9721620] text-[#f97316] animate-pulse'
                : fieldMode ? 'border-yellow-400/30 text-yellow-400/50'
                : 'border-[#3f3f46] text-[#52525b] hover:border-[#f97316] hover:text-[#f97316]'
            }`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
        )}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && ask()}
          placeholder={isListening ? 'Listening...' : '"I have 3/4 EMT, need a 6" offset..."'}
          className={inputCls}
          disabled={loading}
        />
        <button
          onClick={ask}
          disabled={loading || !input.trim()}
          className="h-11 w-11 shrink-0 flex items-center justify-center bg-[#f97316] text-[#09090b] disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>

      {response && (
        <div className={`text-sm leading-relaxed p-3 border-l-2 border-[#f97316] ${fieldMode ? 'text-yellow-100 bg-black' : 'text-[#ddd] bg-[#0a0b0e]'}`}>
          {response}
        </div>
      )}
      {loading && (
        <div className="flex gap-1 items-center px-1">
          <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}
    </div>
  )
}

// ─── MAIN HOME TAB ─────────────────────────────────────────────────────────────

export function HomeTab({ onNavigate }: HomeTabProps) {
  const fieldMode = useFieldMode()
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [quickActions, setQuickActions] = useState(DEFAULT_QUICK_ACTIONS)
  const [showEditProfile, setShowEditProfile] = useState(false)

  // ── Jobs state ────────────────────────────────────────────────────────────
  const [jobs, setJobs] = useState<Job[]>([])
  const [loadingJobs, setLoadingJobs] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [showNewJob, setShowNewJob] = useState(false)
  const [newJobName, setNewJobName] = useState('')
  const [creatingJob, setCreatingJob] = useState(false)

  const tip = getTipOfTheDay()

  // ── Field mode style tokens ───────────────────────────────────────────────
  const fm = {
    page:       fieldMode ? 'bg-black' : '',
    card:       fieldMode ? 'bg-black border-yellow-400/40' : 'bg-[#111] border-[#2a2a35]',
    heading:    fieldMode ? 'text-yellow-300' : 'text-[#888]',
    body:       fieldMode ? 'text-yellow-100' : 'text-[#f0f0f0]',
    muted:      fieldMode ? 'text-yellow-400/70' : 'text-[#888]',
    dim:        fieldMode ? 'text-yellow-400/40' : 'text-[#52525b]',
    tipCard:    fieldMode ? 'bg-black border border-yellow-400/30' : 'relative overflow-hidden border border-[#2a2a35] bg-[#111]',
    tipText:    fieldMode ? 'text-yellow-100 text-sm font-bold' : 'text-xs font-medium leading-relaxed text-[#ccc]',
    tipBody:    fieldMode ? 'text-yellow-300/80 text-sm' : 'mt-1 text-[11px] leading-relaxed text-[#777]',
    actionBtn:  fieldMode
      ? 'border border-yellow-400/40 bg-black p-4 flex flex-col gap-2 text-left active:scale-[0.98] min-h-[80px]'
      : 'border border-[#2a2a35] bg-[#111] p-3 flex flex-col gap-1.5 text-left transition-colors hover:border-[#3f3f46] active:scale-[0.98]',
    actionLabel: fieldMode ? 'text-sm font-bold text-yellow-100'  : 'text-xs font-bold text-[#f0f0f0]',
    actionDesc:  fieldMode ? 'text-xs text-yellow-400/60'          : 'text-[10px] text-[#52525b]',
  }

  useEffect(() => {
    if (hasUsageData()) {
      const topIds = getTopTools(4)
      const topTools = topIds
        .map(id => ALL_TOOLS.find(t => t.id === id))
        .filter(Boolean) as typeof ALL_TOOLS
      if (topTools.length < 4) {
        const extras = ALL_TOOLS
          .filter(t => !topIds.includes(t.id))
          .slice(0, 4 - topTools.length)
        setQuickActions([...topTools, ...extras].slice(0, 4).map(t => ({ ...t, desc: t.desc })))
      } else {
        setQuickActions(topTools.slice(0, 4))
      }
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id)
        loadUserData(session.user.id)
      }
      setLoaded(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id)
        loadUserData(session.user.id)
      } else {
        setUserId(null)
        setProfile(null)
        setJobs([])
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadUserData(uid: string) {
    const { data: prof } = await supabase
      .from('profiles').select('*').eq('id', uid).single()
    if (prof) {
      setProfile({
        name: prof.name,
        role: prof.role,
        yearsExp: prof.years_exp,
        workType: prof.work_type,
        licenseNumber: prof.license_number || '',
        licenseState: prof.license_state || 'CA',
      })
    }
    loadJobs(uid)
  }

  async function loadJobs(uid?: string) {
    const id = uid || userId
    if (!id) return
    setLoadingJobs(true)
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', id)
      .order('last_used_at', { ascending: false })
    if (data) setJobs(data)
    setLoadingJobs(false)
  }

  async function createJob() {
    if (!newJobName.trim() || !userId || creatingJob) return
    setCreatingJob(true)
    const { data } = await supabase
      .from('jobs')
      .insert({
        user_id: userId,
        name: newJobName.trim(),
        last_used_at: new Date().toISOString(),
      })
      .select()
      .single()
    if (data) {
      setJobs(prev => [data, ...prev])
      setNewJobName('')
      setShowNewJob(false)
      // Open the new job right away
      setSelectedJobId(data.id)
    }
    setCreatingJob(false)
  }

  async function saveProfile(p: UserProfile) {
    if (!userId) return
    await supabase.from('profiles').upsert({
      id: userId,
      name: p.name,
      role: p.role,
      years_exp: p.yearsExp,
      work_type: p.workType,
      license_number: p.licenseNumber,
      license_state: p.licenseState,
    })
    setProfile(p)
  }

  // ── Guard states ──────────────────────────────────────────────────────────
  if (!loaded) return null
  if (!userId) return <AuthScreen onAuth={() => {}} />
  if (!profile) return <OnboardingScreen onComplete={p => saveProfile(p)} />

  // ── Job detail view (full-screen navigation) ──────────────────────────────
  if (selectedJobId) {
    return (
      <JobDetailView
        jobId={selectedJobId}
        userId={userId}
        onBack={() => { setSelectedJobId(null); loadJobs() }}
        onDeleted={() => { setSelectedJobId(null); loadJobs() }}
      />
    )
  }

  const categoryColors: Record<string, string> = {
    safety: '#ff3333', code: '#f97316', technique: '#f97316', tool: '#f97316',
  }

  // ── Main home tab render ──────────────────────────────────────────────────
  return (
    <div className={`flex flex-col gap-5 pb-6 ${fm.page}`}>

      {/* Field mode banner */}
      {fieldMode && (
        <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 px-3 py-2">
          <Sun className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400">
            Field Mode · High-Vis Active
          </span>
        </div>
      )}

      {/* Profile header */}
      <div className={`border p-4 flex items-center gap-3 ${fm.card}`}>
        <div className="flex items-center justify-center w-12 h-12 bg-[#f97316] shrink-0">
          <User className="h-6 w-6 text-[#09090b]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-lg font-bold ${fm.body}`}>{profile.name}</div>
          <div className={`text-xs ${fm.muted}`}>{profile.role}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[10px] ${fm.dim}`}>{profile.yearsExp} yr{profile.yearsExp !== 1 ? 's' : ''} experience</span>
            <span className="text-[#3f3f46]">·</span>
            <span className={`text-[10px] ${fm.dim}`}>{profile.workType}</span>
            {profile.licenseNumber && (
              <>
                <span className="text-[#3f3f46]">·</span>
                <span className={`text-[10px] ${fm.dim}`}>{profile.licenseState} #{profile.licenseNumber}</span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowEditProfile(true)}
          className={`transition-colors p-1 shrink-0 ${fieldMode ? 'text-yellow-400/60 hover:text-yellow-300' : 'text-[#52525b] hover:text-[#f97316]'}`}
        >
          <Edit2 className="h-4 w-4" />
        </button>
      </div>

      {/* Ask Sparky voice widget */}
      <AskSparkyWidget fieldMode={fieldMode} />

      {/* Tip of the day */}
      {tip && (
        <div className={fm.tipCard}>
          {!fieldMode && (
            <div className="absolute left-0 top-0 h-full w-1" style={{ backgroundColor: categoryColors[tip.category] || '#f97316' }} />
          )}
          <div className={`p-3 ${!fieldMode ? 'pl-4' : ''}`}>
            <div className="flex items-center gap-2 mb-1.5">
              <Lightbulb className={`h-3.5 w-3.5 ${fieldMode ? 'text-yellow-400' : 'text-[#f97316]'}`} />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${fieldMode ? 'text-yellow-400' : 'text-[#f97316]'}`}>
                Sparky's Tip
              </span>
              <span className={`text-[10px] uppercase tracking-wider ${fm.dim}`}>{tip.category}</span>
            </div>
            <p className={fm.tipText}>{tip.title}</p>
            <p className={fm.tipBody}>{tip.body}</p>
            {tip.reference && (
              <span className={`mt-1 inline-block font-mono text-[10px] ${fm.dim}`}>{tip.reference}</span>
            )}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-[11px] font-bold uppercase tracking-wider ${fm.heading}`}>
            {hasUsageData() ? 'Your Top Tools' : 'Quick Actions'}
          </h2>
          {hasUsageData() && (
            <span className={`text-[9px] uppercase tracking-wider ${fm.dim}`}>Based on your usage</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map(action => {
            const Icon = action.icon
            const borderColor = fieldMode ? '#facc15' : action.color
            return (
              <button
                key={action.id}
                onClick={() => onNavigate?.(action.tab, action.id !== 'nec-ref' ? action.id : undefined)}
                className={fm.actionBtn}
                style={{ borderLeftColor: borderColor, borderLeftWidth: 3 }}
              >
                <Icon className={fieldMode ? 'h-5 w-5' : 'h-4 w-4'} style={{ color: fieldMode ? '#facc15' : action.color }} />
                <span className={fm.actionLabel}>{action.label}</span>
                <span className={fm.actionDesc}>{action.desc}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Jobs section ──────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Briefcase className={`h-4 w-4 ${fieldMode ? 'text-yellow-400' : 'text-[#f97316]'}`} />
            <h2 className={`text-[11px] font-bold uppercase tracking-wider ${fm.heading}`}>Jobs</h2>
          </div>
          <button
            onClick={() => setShowNewJob(true)}
            className={`flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1.5 transition-colors ${
              fieldMode
                ? 'text-yellow-400 border border-yellow-400/30 hover:border-yellow-400'
                : 'text-[#f97316] border border-[#f97316]/30 hover:border-[#f97316]'
            }`}
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>

        {/* Inline new job form */}
        {showNewJob && (
          <div className={`border p-3 mb-3 flex flex-col gap-2 ${fm.card}`}>
            <input
              autoFocus
              placeholder="Job name (required)"
              value={newJobName}
              onChange={e => setNewJobName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') createJob(); if (e.key === 'Escape') { setShowNewJob(false); setNewJobName('') } }}
              className={`w-full px-3 py-2.5 text-sm focus:outline-none ${
                fieldMode
                  ? 'bg-black border border-yellow-400/30 text-yellow-100 placeholder-yellow-400/30 focus:border-yellow-400'
                  : 'bg-[#0a0b0e] border border-[#2a2a35] text-[#f0f0f0] placeholder-[#444] focus:border-[#f97316]'
              }`}
            />
            <div className="flex gap-2">
              <button
                onClick={createJob}
                disabled={!newJobName.trim() || creatingJob}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider disabled:opacity-40 ${
                  fieldMode ? 'bg-yellow-400 text-black' : 'bg-[#f97316] text-[#09090b]'
                }`}
              >
                {creatingJob ? 'Creating…' : 'Create Job'}
              </button>
              <button
                onClick={() => { setShowNewJob(false); setNewJobName('') }}
                className={`px-4 py-2.5 text-xs uppercase tracking-wider ${fm.dim}`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Jobs list */}
        {loadingJobs ? (
          <div className={`text-xs text-center py-6 ${fm.dim}`}>Loading jobs…</div>
        ) : jobs.length === 0 ? (
          <div className={`border border-dashed p-8 text-center ${fieldMode ? 'border-yellow-400/20' : 'border-[#2a2a35]'}`}>
            <Briefcase className={`h-6 w-6 mx-auto mb-2 ${fm.dim}`} />
            <p className={`text-[11px] ${fm.dim}`}>No jobs yet — tap + to add your first job</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {jobs.map(job => (
              <button
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`w-full border p-3 text-left active:scale-[0.99] transition-transform ${fm.card}`}
                style={{ borderLeftColor: fieldMode ? '#facc15' : '#f97316', borderLeftWidth: 3 }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-sm font-bold truncate ${fm.body}`}>{job.name}</span>
                  <ChevronRight className={`h-4 w-4 shrink-0 ${fm.dim}`} />
                </div>
                {job.address && (
                  <span className={`text-[11px] truncate block mt-0.5 ${fm.muted}`}>{job.address}</span>
                )}
                <span className={`text-[10px] mt-1 block ${fm.dim}`}>
                  {new Date(job.last_used_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile modal */}
      {showEditProfile && profile && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/70" onClick={() => setShowEditProfile(false)}>
          <div
            className="w-full bg-[#09090b] border-t border-[#2a2a35] p-4 flex flex-col gap-4 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-wider text-[#f0f0f0]">Edit Profile</span>
              <button onClick={() => setShowEditProfile(false)}><X className="h-4 w-4 text-[#52525b]" /></button>
            </div>

            {([
              { label: 'Name',              value: profile.name,          key: 'name',          type: 'text' },
              { label: 'Years Experience',  value: String(profile.yearsExp), key: 'yearsExp',    type: 'number' },
              { label: 'License Number',    value: profile.licenseNumber, key: 'licenseNumber', type: 'text' },
              { label: 'License State',     value: profile.licenseState,  key: 'licenseState',  type: 'text' },
            ] as const).map(f => (
              <div key={f.key}>
                <label className="block text-[10px] uppercase tracking-wider text-[#52525b] mb-1.5">{f.label}</label>
                <input
                  className="w-full bg-[#0a0b0e] border border-[#2a2a35] px-3 py-2.5 text-sm text-[#f0f0f0] focus:border-[#f97316] focus:outline-none"
                  type={f.type}
                  value={f.value}
                  onChange={e => setProfile(prev => prev ? {
                    ...prev,
                    [f.key]: f.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value,
                  } : prev)}
                />
              </div>
            ))}

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#52525b] mb-1.5">Role</label>
              <select
                className="w-full bg-[#0a0b0e] border border-[#2a2a35] px-3 py-2.5 text-sm text-[#f0f0f0] focus:border-[#f97316] focus:outline-none appearance-none"
                value={profile.role}
                onChange={e => setProfile(prev => prev ? { ...prev, role: e.target.value } : prev)}
              >
                {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#52525b] mb-2">Work Type</label>
              <div className="grid grid-cols-2 gap-2">
                {WORK_TYPES.map(w => (
                  <button key={w}
                    onClick={() => setProfile(prev => prev ? { ...prev, workType: w } : prev)}
                    className={`py-2.5 text-xs font-bold uppercase tracking-wider border transition-all ${profile.workType === w ? 'border-[#f97316] text-[#f97316] bg-[#f9731612]' : 'border-[#2a2a35] text-[#52525b]'}`}>
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { saveProfile(profile); setShowEditProfile(false) }}
              className="w-full py-3 bg-[#f97316] text-[#09090b] text-sm font-bold uppercase tracking-wider mt-2"
            >
              Save Profile
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

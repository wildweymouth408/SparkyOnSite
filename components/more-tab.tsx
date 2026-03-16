'use client'

import { useState, useEffect } from 'react'
import { LogOut, Bell, Sun, Moon, Zap, User, ChevronRight, Info, Wallet, Plus, Trash2, Briefcase, Share2, Eye, Camera, Calculator } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { CredentialsTab } from './credentials-tab'
import { getJobs, saveJob, deleteJob, generateId, addCalculationToJob, type Job, type SavedCalculation } from '@/lib/storage'
import { calculateWireSizing, type WireSizingInputs, type WireSizingResult } from '@/lib/calculations'
import { SYSTEM_VOLTAGES, INSULATION_TYPES } from '@/lib/calculator-data'
import { toast } from 'sonner'

const JOB_COLORS = ['#ff6b00', '#00d4ff', '#00ff88', '#ff3333', '#aa88ff', '#ffaa00']

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
  const [fieldMode, setFieldMode] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showWallet, setShowWallet] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [showNewJob, setShowNewJob] = useState(false)
  const [newJobName, setNewJobName] = useState('')
  const [newJobAddress, setNewJobAddress] = useState('')
  const [selectedJobForCalc, setSelectedJobForCalc] = useState<Job | null>(null)
  const [showCalcModal, setShowCalcModal] = useState(false)
  const [calcType, setCalcType] = useState<string>('wire-sizing')
  const [wireInputs, setWireInputs] = useState<WireSizingInputs>({
    loadAmps: 20,
    distance: 100,
    systemVoltage: 120,
    material: 'copper',
    insulationType: 'THHN',
    maxDropPercent: 3,
    ambientTemp: 30,
    conductorsInRaceway: 3,
  })
  const [wireResult, setWireResult] = useState<WireSizingResult | null>(null)

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

    const savedNotifications = localStorage.getItem('sparky_notifications')
    if (savedNotifications !== null) setNotifications(JSON.parse(savedNotifications))
    const savedDark = localStorage.getItem('sparky_dark_mode')
    if (savedDark !== null) setDarkMode(JSON.parse(savedDark))
    const savedField = localStorage.getItem('sparky_field_mode')
    if (savedField !== null) setFieldMode(JSON.parse(savedField))
    setJobs(getJobs())
  }, [])

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
    localStorage.setItem('sparky_dark_mode', JSON.stringify(next))
    window.dispatchEvent(new Event('sparky_dark_mode_changed'))
  }

  function handleCreateJob() {
    if (!newJobName.trim()) return
    const job: Job = {
      id: generateId(),
      name: newJobName.trim(),
      address: newJobAddress.trim(),
      crew: [],
      tasks: [],
      notes: [],
      calculations: [],
      status: 'on-track',
      color: JOB_COLORS[jobs.length % JOB_COLORS.length],
      createdAt: new Date().toISOString(),
    }
    saveJob(job)
    const updated = getJobs()
    setJobs(updated)
    setNewJobName('')
    setNewJobAddress('')
    setShowNewJob(false)
  }

  function handleShareJob(job: Job) {
    const jobDetails = `
Job: ${job.name}
Address: ${job.address || 'Not specified'}
Status: ${job.status === 'complete' ? 'Complete' : job.status === 'at-risk' ? 'At Risk' : 'On Track'}
Tasks: ${job.tasks.filter(t => t.status === 'completed').length}/${job.tasks.length} completed
Crew: ${job.crew.length} members
Created: ${new Date(job.createdAt).toLocaleDateString()}
${job.notes.length > 0 ? `Notes: ${job.notes.join(', ')}` : ''}
    `.trim()

    // Create share options
    const shareOptions = [
      { name: 'Messages', action: () => {
        if (/iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)) {
          window.open(`sms:&body=${encodeURIComponent(jobDetails)}`, '_blank')
        } else {
          window.open(`sms:?body=${encodeURIComponent(jobDetails)}`, '_blank')
        }
      }},
      { name: 'Email', action: () => {
        window.open(`mailto:?subject=Job Details: ${job.name}&body=${encodeURIComponent(jobDetails)}`, '_blank')
      }},
      { name: 'WhatsApp', action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(jobDetails)}`, '_blank')
      }},
      { name: 'Telegram', action: () => {
        window.open(`https://t.me/share/url?url=&text=${encodeURIComponent(jobDetails)}`, '_blank')
      }},
      { name: 'Copy', action: () => {
        navigator.clipboard.writeText(jobDetails)
        alert('Job details copied to clipboard!')
      }},
    ]

    // Simple implementation: show alert with options
    const option = prompt(
      `Share job "${job.name}" via:\n\n` +
      `1. Messages\n` +
      `2. Email\n` +
      `3. WhatsApp\n` +
      `4. Telegram\n` +
      `5. Copy to clipboard\n\n` +
      `Enter number (1-5):`
    )
    
    const index = parseInt(option || '') - 1
    if (index >= 0 && index < shareOptions.length) {
      shareOptions[index].action()
    }
  }

  function handleViewJob(job: Job) {
    // For now, show a detailed view in an alert
    // In a future update, this could open a modal or separate view
    const details = `
JOB DETAILS
───────────
Name: ${job.name}
Address: ${job.address || 'Not specified'}
Status: ${job.status === 'complete' ? '✅ Complete' : job.status === 'at-risk' ? '⚠️ At Risk' : '🟡 On Track'}
Created: ${new Date(job.createdAt).toLocaleDateString()}

CREW: ${job.crew.length} member${job.crew.length !== 1 ? 's' : ''}
${job.crew.map(m => `  • ${m.name} (${m.role})`).join('\n') || '  None assigned'}

TASKS: ${job.tasks.filter(t => t.status === 'completed').length}/${job.tasks.length} completed
${job.tasks.map(t => `  • ${t.name} - ${t.status} (${t.priority})`).join('\n') || '  No tasks yet'}

NOTES: ${job.notes.length} note${job.notes.length !== 1 ? 's' : ''}
${job.notes.map((n, i) => `  ${i+1}. ${n}`).join('\n') || '  None'}
    `.trim()

    alert(details)
  }

  function handleDeleteJob(id: string) {
    deleteJob(id)
    setJobs(getJobs())
  }

  function handleWireCalc() {
    const result = calculateWireSizing(wireInputs)
    setWireResult(result)
  }

  function handleSaveWireCalc() {
    if (!wireResult || !selectedJobForCalc) return
    const calc: SavedCalculation = {
      id: generateId(),
      type: 'Wire Sizing',
      label: `${wireInputs.loadAmps}A ${wireInputs.distance}ft ${wireInputs.systemVoltage}V`,
      inputs: wireInputs as unknown as Record<string, unknown>,
      result: `#${wireResult.recommendedSize} (${wireResult.dropPercent}%)`,
      timestamp: new Date().toISOString(),
    }
    addCalculationToJob(selectedJobForCalc.id, calc)
    toast.success('Calculation saved to job')
    setShowCalcModal(false)
    setWireResult(null)
  }

  function toggleFieldMode() {
    const next = !fieldMode
    setFieldMode(next)
    localStorage.setItem('sparky_field_mode', JSON.stringify(next))
    window.dispatchEvent(new Event('sparky_field_mode_changed'))
  }

  const displayName = profile?.name || email?.split('@')[0] || 'Electrician'
  const roleLabel = profile?.role
    ? `${profile.role}${profile.years_exp ? ` · ${profile.years_exp} yrs` : ''}`
    : null

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">

      {/* Profile Card */}
      <div className="rounded border border-[#222] bg-[#13161a] p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-[#ff6b00]/10 border border-[#ff6b00]/30">
            <User className="h-6 w-6 text-[#ff6b00]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-[#f0f0f0] truncate">{displayName}</span>
            {roleLabel && (
              <span className="text-xs text-[#ff6b00] uppercase tracking-wider mt-0.5">{roleLabel}</span>
            )}
            <span className="text-[11px] text-[#555] truncate mt-0.5">{email}</span>
          </div>
        </div>
      </div>

      {/* Credential Wallet */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-medium uppercase tracking-widest text-[#444] px-1 mb-1">
          Wallet
        </span>
        <button
          onClick={() => setShowWallet(!showWallet)}
          className="flex items-center justify-between rounded border border-[#222] bg-[#13161a] px-4 py-3 text-left w-full"
        >
          <div className="flex items-center gap-3">
            <Wallet className="h-4 w-4 text-[#ff6b00]" />
            <div className="flex flex-col">
              <span className="text-sm text-[#ccc]">Credential Wallet</span>
              <span className="text-[10px] text-[#444] uppercase tracking-wider">Licenses · Certs · Cards</span>
            </div>
          </div>
          <ChevronRight
            className={`h-4 w-4 text-[#555] transition-transform duration-200 ${showWallet ? 'rotate-90' : ''}`}
          />
        </button>

        {showWallet && (
          <div className="rounded border border-[#222] bg-[#0d1014] px-3 py-4">
            <CredentialsTab />
          </div>
        )}
      </div>

      {/* Jobs */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between px-1 mb-1">
          <span className="text-[10px] font-medium uppercase tracking-widest text-[#444]">
            Jobs
          </span>
          <span className="text-[10px] text-[#666]">{jobs.length} job{jobs.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex flex-col gap-2">
          {jobs.map(job => (
            <div key={job.id} className="group relative rounded border border-[#222] bg-[#13161a] px-4 py-3 hover:border-[#ff6b00]/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: job.color }} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm text-[#ccc] truncate">{job.name}</span>
                    {job.address && <span className="text-[10px] text-[#444] truncate">{job.address}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button 
                    onClick={() => handleShareJob(job)}
                    className="p-1 text-[#444] hover:text-[#00d4ff] transition-colors opacity-0 group-hover:opacity-100"
                    title="Share job"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => { setSelectedJobForCalc(job); setShowCalcModal(true); }}
                    className="p-1 text-[#444] hover:text-[#ff6b00] transition-colors opacity-0 group-hover:opacity-100"
                    title="Add calculation"
                  >
                    <Calculator className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleViewJob(job)}
                    className="p-1 text-[#444] hover:text-[#00ff88] transition-colors opacity-0 group-hover:opacity-100"
                    title="View job details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-1 text-[#444] hover:text-red-400 transition-colors"
                    title="Delete job"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Job status and info */}
              <div className="flex items-center gap-3 mt-2 text-[10px]">
                <span className={`px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  job.status === 'complete' ? 'bg-[#00ff88]/20 text-[#00ff88]' :
                  job.status === 'at-risk' ? 'bg-[#ff3333]/20 text-[#ff3333]' :
                  'bg-[#ffaa00]/20 text-[#ffaa00]'
                }`}>
                  {job.status === 'complete' ? 'Complete' : job.status === 'at-risk' ? 'At Risk' : 'On Track'}
                </span>
                {job.tasks.length > 0 && (
                  <span className="text-[#666]">
                    {job.tasks.filter(t => t.status === 'completed').length}/{job.tasks.length} tasks
                  </span>
                )}
                {job.crew.length > 0 && (
                  <span className="text-[#666]">
                    {job.crew.length} crew
                  </span>
                )}
              </div>
            </div>
          ))}

          {showNewJob ? (
            <div className="flex flex-col gap-2 rounded border border-[#ff6b00]/20 bg-[#13161a] p-3">
              <input
                placeholder="Job name (e.g. 123 Main St Panel Upgrade)"
                value={newJobName}
                onChange={e => setNewJobName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateJob()}
                autoFocus
                className="w-full rounded border border-[#222] bg-[#0d1014] px-3 py-2 text-sm text-[#f0f0f0] placeholder-[#444] focus:outline-none focus:border-[#ff6b00]/40"
              />
              <input
                placeholder="Address (optional)"
                value={newJobAddress}
                onChange={e => setNewJobAddress(e.target.value)}
                className="w-full rounded border border-[#222] bg-[#0d1014] px-3 py-2 text-sm text-[#f0f0f0] placeholder-[#444] focus:outline-none focus:border-[#ff6b00]/40"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateJob}
                  disabled={!newJobName.trim()}
                  className="flex-1 rounded bg-[#ff6b00] px-3 py-2 text-xs font-bold uppercase tracking-wider text-black disabled:opacity-40"
                >
                  Create Job
                </button>
                <button
                  onClick={() => { setShowNewJob(false); setNewJobName(''); setNewJobAddress('') }}
                  className="px-3 py-2 text-xs text-[#555] hover:text-[#888] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowNewJob(true)}
              className="flex items-center gap-2 rounded border border-dashed border-[#333] bg-[#13161a] px-4 py-3 text-sm text-[#555] hover:border-[#ff6b00]/30 hover:text-[#ff6b00] transition-colors w-full"
            >
              <Plus className="h-4 w-4" />
              New Job
            </button>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-medium uppercase tracking-widest text-[#444] px-1 mb-1">
          Settings
        </span>

        {/* Field Mode */}
        <div className={`flex items-center justify-between rounded border px-4 py-3 transition-colors ${
          fieldMode ? 'border-[#ffaa00]/40 bg-[#ffaa0008]' : 'border-[#222] bg-[#13161a]'
        }`}>
          <div className="flex items-center gap-3">
            <Sun className={`h-4 w-4 ${fieldMode ? 'text-[#ffaa00]' : 'text-[#888]'}`} />
            <div className="flex flex-col">
              <span className={`text-sm ${fieldMode ? 'text-[#ffaa00]' : 'text-[#ccc]'}`}>Field Mode</span>
              <span className="text-[10px] text-[#444] uppercase tracking-wider">High-vis · Glove-safe</span>
            </div>
          </div>
          <button
            onClick={toggleFieldMode}
            className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
              fieldMode ? 'bg-[#ffaa00]' : 'bg-[#333]'
            }`}
            aria-label="Toggle field mode"
          >
            <span
              className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                fieldMode ? 'translate-x-[22px]' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Dark Mode */}
        <div className="flex items-center justify-between rounded border border-[#222] bg-[#13161a] px-4 py-3">
          <div className="flex items-center gap-3">
            {darkMode
              ? <Moon className="h-4 w-4 text-[#888]" />
              : <Sun className="h-4 w-4 text-[#888]" />
            }
            <span className="text-sm text-[#ccc]">Dark Mode</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
              darkMode ? 'bg-[#ff6b00]' : 'bg-[#333]'
            }`}
            aria-label="Toggle dark mode"
          >
            <span
              className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                darkMode ? 'translate-x-[22px]' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between rounded border border-[#222] bg-[#13161a] px-4 py-3">
          <div className="flex items-center gap-3">
            <Bell className="h-4 w-4 text-[#888]" />
            <span className="text-sm text-[#ccc]">Notifications</span>
          </div>
          <button
            onClick={toggleNotifications}
            className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
              notifications ? 'bg-[#ff6b00]' : 'bg-[#333]'
            }`}
            aria-label="Toggle notifications"
          >
            <span
              className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                notifications ? 'translate-x-[22px]' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* About */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-medium uppercase tracking-widest text-[#444] px-1 mb-1">
          About
        </span>
        <button
          onClick={() => setShowAbout(!showAbout)}
          className="flex items-center justify-between rounded border border-[#222] bg-[#13161a] px-4 py-3 text-left w-full"
        >
          <div className="flex items-center gap-3">
            <Zap className="h-4 w-4 text-[#ff6b00]" />
            <span className="text-sm text-[#ccc]">About Sparky</span>
          </div>
          <ChevronRight
            className={`h-4 w-4 text-[#555] transition-transform duration-200 ${showAbout ? 'rotate-90' : ''}`}
          />
        </button>

        {showAbout && (
          <div className="rounded border border-[#222] bg-[#0d1014] px-4 py-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#ff6b00]">
                <Zap className="h-4 w-4 text-black" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#ff6b00]">Sparky</div>
                <div className="text-[10px] text-[#555] uppercase tracking-wider">Field Electrical Assistant</div>
              </div>
            </div>
            <p className="text-xs text-[#777] leading-relaxed">
              Built by an 11-year Silicon Valley electrician for apprentices and journeymen in the field.
              Fast NEC lookups, load calculations, conduit math, and an AI assistant that speaks your language.
            </p>
            <div className="flex items-center gap-2 pt-1 border-t border-[#1a1d22]">
              <Info className="h-3 w-3 text-[#444]" />
              <span className="text-[10px] text-[#444] uppercase tracking-wider">Version 1.0 · Built with ⚡ in California</span>
            </div>
          </div>
        )}
      </div>

      {/* Calculator Modal */}
      {showCalcModal && selectedJobForCalc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md border border-[#333] bg-[#0a0a0a] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#f0f0f0]">Add Calculation to {selectedJobForCalc.name}</h3>
              <button onClick={() => { setShowCalcModal(false); setWireResult(null); }} className="text-[#888] hover:text-[#f0f0f0]">
                ✕
              </button>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-[11px] uppercase tracking-wider text-[#888]">Calculator</label>
              <select
                value={calcType}
                onChange={e => setCalcType(e.target.value)}
                className="w-full border border-[#333] bg-[#111] p-3 text-sm text-[#f0f0f0] focus:border-[#ff6b00] focus:outline-none"
              >
                <option value="wire-sizing">Wire Sizing</option>
                {/* other calculators can be added here */}
              </select>
            </div>

            {calcType === 'wire-sizing' && (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#888]">Load (A)</span>
                    <input
                      type="number"
                      value={wireInputs.loadAmps || ''}
                      onChange={e => setWireInputs(p => ({ ...p, loadAmps: Number(e.target.value) }))}
                      className="border border-[#333] bg-[#111] p-2 text-sm text-[#f0f0f0] focus:border-[#ff6b00] focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#888]">Distance (ft)</span>
                    <input
                      type="number"
                      value={wireInputs.distance || ''}
                      onChange={e => setWireInputs(p => ({ ...p, distance: Number(e.target.value) }))}
                      className="border border-[#333] bg-[#111] p-2 text-sm text-[#f0f0f0] focus:border-[#ff6b00] focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#888]">Voltage</span>
                    <select
                      value={wireInputs.systemVoltage}
                      onChange={e => setWireInputs(p => ({ ...p, systemVoltage: Number(e.target.value) }))}
                      className="border border-[#333] bg-[#111] p-2 text-sm text-[#f0f0f0] focus:border-[#ff6b00] focus:outline-none"
                    >
                      {SYSTEM_VOLTAGES.map(v => <option key={v} value={v}>{v}V</option>)}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#888]">Material</span>
                    <select
                      value={wireInputs.material}
                      onChange={e => setWireInputs(p => ({ ...p, material: e.target.value as 'copper' | 'aluminum' }))}
                      className="border border-[#333] bg-[#111] p-2 text-sm text-[#f0f0f0] focus:border-[#ff6b00] focus:outline-none"
                    >
                      <option value="copper">Copper</option>
                      <option value="aluminum">Aluminum</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#888]">Insulation</span>
                    <select
                      value={wireInputs.insulationType}
                      onChange={e => setWireInputs(p => ({ ...p, insulationType: e.target.value }))}
                      className="border border-[#333] bg-[#111] p-2 text-sm text-[#f0f0f0] focus:border-[#ff6b00] focus:outline-none"
                    >
                      {INSULATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#888]">Max Drop %</span>
                    <select
                      value={wireInputs.maxDropPercent}
                      onChange={e => setWireInputs(p => ({ ...p, maxDropPercent: Number(e.target.value) }))}
                      className="border border-[#333] bg-[#111] p-2 text-sm text-[#f0f0f0] focus:border-[#ff6b00] focus:outline-none"
                    >
                      <option value={3}>3% (Branch)</option>
                      <option value={5}>5% (Total)</option>
                    </select>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#888]">Ambient Temp (°C)</span>
                    <input
                      type="number"
                      value={wireInputs.ambientTemp ?? 30}
                      onChange={e => setWireInputs(p => ({ ...p, ambientTemp: Number(e.target.value) }))}
                      className="border border-[#333] bg-[#111] p-2 text-sm text-[#f0f0f0] focus:border-[#ff6b00] focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#888]">Conductors in Raceway</span>
                    <input
                      type="number"
                      value={wireInputs.conductorsInRaceway ?? 3}
                      onChange={e => setWireInputs(p => ({ ...p, conductorsInRaceway: Number(e.target.value) }))}
                      className="border border-[#333] bg-[#111] p-2 text-sm text-[#f0f0f0] focus:border-[#ff6b00] focus:outline-none"
                    />
                  </label>
                </div>

                <button
                  onClick={handleWireCalc}
                  className="mb-4 w-full border border-[#333] bg-[#1a1a1a] py-3 text-sm font-medium uppercase tracking-wider text-[#f0f0f0] hover:bg-[#222]"
                >
                  Calculate
                </button>

                {wireResult && (
                  <div className="mb-4 border border-[#333] bg-[#111] p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider text-[#888]">Recommended Wire</span>
                      <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${wireResult.pass ? 'bg-[#00ff88]/10 text-[#00ff88]' : 'bg-[#ff3333]/10 text-[#ff3333]'}`}>
                        {wireResult.pass ? 'PASS' : 'FAIL'}
                      </span>
                    </div>
                    <div className="mb-2 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-[#ff6b00]">#{wireResult.recommendedSize}</span>
                      <span className="text-sm text-[#888]">AWG</span>
                    </div>
                    <div className="text-sm">
                      <div className="flex justify-between"><span className="text-[#888]">Ampacity</span><span className="font-mono">{wireResult.ampacity}A</span></div>
                      <div className="flex justify-between"><span className="text-[#888]">Voltage drop</span><span className="font-mono">{wireResult.voltageDrop}V ({wireResult.dropPercent}%)</span></div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowCalcModal(false); setWireResult(null); }}
                    className="flex-1 border border-[#333] bg-[#1a1a1a] py-3 text-sm font-medium uppercase tracking-wider text-[#f0f0f0] hover:bg-[#222]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveWireCalc}
                    disabled={!wireResult}
                    className="flex-1 border border-[#ff6b00] bg-[#ff6b00]/10 py-3 text-sm font-medium uppercase tracking-wider text-[#ff6b00] hover:bg-[#ff6b00]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save to Job
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

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

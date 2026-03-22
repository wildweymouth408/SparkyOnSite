'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  X, Save, Copy, Settings, LayoutGrid, BarChart3, Trash2,
  Plus, ChevronRight, AlertTriangle, CheckCircle, Zap,
} from 'lucide-react'
import { CalculatorDisclaimer } from '@/components/calculator-disclaimer'

// ─── Supabase client (client-side only) ──────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// ─── Types ────────────────────────────────────────────────────────────────────
type VoltageSystem = '120/240-1ph' | '120/208-3ph' | '277/480-3ph'
type Phase = 'A' | 'B' | 'C'
type LoadStatus = 'over' | 'warn' | 'ok' | 'empty'

interface Circuit {
  id: string
  circuitNumber: number   // starting slot (1, 3, 5... for left; 2, 4, 6... for right)
  breakerSize: number
  poles: 1 | 2 | 3
  description: string
  watts: number           // normalized watts for display/calc
  rawLoad: string         // user-entered value
  loadUnit: 'W' | 'A'
  isContinuous: boolean
}

interface PanelConfig {
  name: string
  mainBreakerSize: number
  voltageSystem: VoltageSystem
  spaces: number
}

// ─── Constants ────────────────────────────────────────────────────────────────
const BREAKER_SIZES = [
  15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200,
]
const MAIN_SIZES = [
  100, 125, 150, 200, 225, 400, 600, 800, 1000, 1200, 1600, 2000, 2500, 3000, 4000,
]
const SPACE_OPTIONS = [12, 24, 30, 42, 54, 84]
const VOLTAGE_SYSTEMS: { value: VoltageSystem; label: string }[] = [
  { value: '120/240-1ph', label: '120/240V 1Ø' },
  { value: '120/208-3ph', label: '120/208V 3Ø' },
  { value: '277/480-3ph', label: '277/480V 3Ø' },
]

// ─── Electrical helpers ───────────────────────────────────────────────────────

/**
 * Returns the phase for a given circuit slot number.
 * Standard panel layout:
 *   1Ø: Left (odd)  1=A 3=B 5=A 7=B ...
 *       Right (even) 2=B 4=A 6=B 8=A ...
 *   3Ø: Left  1=A 3=B 5=C 7=A ...
 *       Right 2=B 4=C 6=A 8=B ...
 */
function getPhaseForSlot(slotNumber: number, voltageSystem: VoltageSystem): Phase {
  const row = Math.ceil(slotNumber / 2) - 1 // 0-indexed row
  const isLeft = slotNumber % 2 === 1
  if (voltageSystem === '120/240-1ph') {
    const phases: Phase[] = ['A', 'B']
    return isLeft ? phases[row % 2] : phases[(row + 1) % 2]
  }
  // 3-phase
  const phases3: Phase[] = ['A', 'B', 'C']
  return isLeft ? phases3[row % 3] : phases3[(row + 1) % 3]
}

/** Line-to-line or line-to-neutral voltage for load calc */
function getVoltageForCircuit(poles: number, voltageSystem: VoltageSystem): number {
  if (poles === 1) return voltageSystem === '277/480-3ph' ? 277 : 120
  if (poles === 2) {
    if (voltageSystem === '120/240-1ph') return 240
    if (voltageSystem === '120/208-3ph') return 208
    return 480
  }
  // 3-pole
  if (voltageSystem === '120/208-3ph') return 208
  return 480
}

function ampsToWatts(amps: number, poles: number, voltageSystem: VoltageSystem): number {
  const v = getVoltageForCircuit(poles, voltageSystem)
  if (poles === 3) return amps * v * 1.732
  return amps * v
}

function getLoadStatus(
  watts: number,
  breakerSize: number,
  poles: number,
  voltageSystem: VoltageSystem
): LoadStatus {
  if (watts === 0) return 'empty'
  const maxW = ampsToWatts(breakerSize, poles, voltageSystem)
  const pct = watts / maxW
  if (pct > 1) return 'over'
  if (pct > 0.8) return 'warn'
  return 'ok'
}

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

// ─── CircuitSlot ─────────────────────────────────────────────────────────────
interface CircuitSlotProps {
  slot: number
  circuit?: Circuit
  isBlocked: boolean
  voltageSystem: VoltageSystem
  onClick: () => void
}

function CircuitSlot({ slot, circuit, isBlocked, voltageSystem, onClick }: CircuitSlotProps) {
  const phase = getPhaseForSlot(slot, voltageSystem)

  if (isBlocked) {
    return (
      <div className="flex items-center gap-1 bg-[#0a0b0e] border border-[#1a1a24] border-dashed rounded px-2 py-1.5 opacity-40">
        <span className="text-[9px] text-[#2a2a35] font-mono w-5">{slot}</span>
        <span className="text-[9px] text-[#2a2a35] italic flex-1">↑ multi-pole</span>
      </div>
    )
  }

  const status: LoadStatus = circuit
    ? getLoadStatus(circuit.watts, circuit.breakerSize, circuit.poles, voltageSystem)
    : 'empty'

  const borderBg: Record<LoadStatus, string> = {
    over:  'border-red-800 bg-red-950/30',
    warn:  'border-yellow-700 bg-yellow-950/20',
    ok:    'border-[#1a3025] bg-[#0a120e]',
    empty: 'border-[#1e2028] bg-[#0a0b0e]',
  }
  const dotColor: Record<LoadStatus, string> = {
    over: 'bg-red-500', warn: 'bg-yellow-500', ok: 'bg-emerald-500', empty: 'bg-[#2a2a35]',
  }
  const phaseColor: Record<Phase, string> = {
    A: 'text-blue-400', B: 'text-red-400', C: 'text-yellow-400',
  }

  const maxW = circuit ? ampsToWatts(circuit.breakerSize, circuit.poles, voltageSystem) : 1
  const loadPct = circuit && circuit.watts > 0 ? (circuit.watts / maxW) * 100 : 0

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 border rounded px-2 py-1.5 text-left w-full transition-all active:scale-[0.98] hover:border-[#3a3a48] ${borderBg[status]}`}
    >
      {/* Circuit number */}
      <span className="text-[9px] font-mono text-[#52525b] w-5 shrink-0">{slot}</span>

      {/* Phase indicator */}
      <span className={`text-[8px] font-bold w-3 shrink-0 ${phaseColor[phase]}`}>{phase}</span>

      {/* Description */}
      <span className="flex-1 text-[10px] truncate min-w-0">
        {circuit ? (
          <span className={circuit.description ? 'text-[#d0d0d0]' : 'text-[#52525b] italic'}>
            {circuit.description || `${circuit.poles}P/${circuit.breakerSize}A`}
          </span>
        ) : (
          <span className="text-[#2a2a35]">tap to add</span>
        )}
      </span>

      {/* Load info */}
      {circuit && circuit.watts > 0 && (
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          <span className="text-[9px] font-mono text-[#888]">
            {circuit.watts >= 1000 ? `${(circuit.watts / 1000).toFixed(1)}k` : Math.round(circuit.watts)}W
          </span>
          <div className="w-10 h-1 bg-[#1e2028] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${dotColor[status]}`}
              style={{ width: `${Math.min(loadPct, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Breaker badge */}
      {circuit && (
        <span className="text-[8px] font-mono shrink-0 px-1 py-0.5 rounded bg-[#0a0b0e] text-[#52525b]">
          {circuit.poles}P/{circuit.breakerSize}A
        </span>
      )}

      {/* Status dot */}
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor[status]}`} />
    </button>
  )
}

// ─── CircuitEditor (bottom sheet) ────────────────────────────────────────────
interface CircuitEditorProps {
  circuit: Partial<Circuit> & { circuitNumber: number }
  voltageSystem: VoltageSystem
  onSave: (c: Circuit) => void
  onDelete?: () => void
  onClose: () => void
}

function CircuitEditor({ circuit, voltageSystem, onSave, onDelete, onClose }: CircuitEditorProps) {
  const [breakerSize, setBreakerSize] = useState(circuit.breakerSize ?? 20)
  const [poles, setPoles] = useState<1 | 2 | 3>(circuit.poles ?? 1)
  const [description, setDescription] = useState(circuit.description ?? '')
  const [rawLoad, setRawLoad] = useState(circuit.rawLoad ?? '')
  const [loadUnit, setLoadUnit] = useState<'W' | 'A'>(circuit.loadUnit ?? 'W')
  const [isContinuous, setIsContinuous] = useState(circuit.isContinuous ?? false)

  const inp =
    'w-full bg-[#0a0b0e] border border-[#2a2a35] px-3 py-2.5 text-sm text-[#f0f0f0] focus:border-[#f97316] focus:outline-none rounded'
  const lbl = 'block text-[10px] uppercase tracking-wider text-[#52525b] mb-1'
  const phase = getPhaseForSlot(circuit.circuitNumber, voltageSystem)
  const phaseColor: Record<Phase, string> = {
    A: 'text-blue-400', B: 'text-red-400', C: 'text-yellow-400',
  }

  function handleSave() {
    const rawNum = parseFloat(rawLoad) || 0
    let watts = 0
    if (rawNum > 0) {
      watts =
        loadUnit === 'W'
          ? rawNum
          : ampsToWatts(rawNum, poles, voltageSystem)
    }
    onSave({
      id: circuit.id ?? generateId(),
      circuitNumber: circuit.circuitNumber,
      breakerSize,
      poles,
      description,
      watts,
      rawLoad,
      loadUnit,
      isContinuous,
    })
    onClose()
  }

  // Max poles for this voltage system
  const maxPoles = voltageSystem === '120/240-1ph' ? 2 : 3

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#111318] border border-[#2a2a35] rounded-t-2xl p-5 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-sm font-bold text-[#f97316]">Circuit {circuit.circuitNumber}</div>
            <div className="text-[10px] text-[#52525b]">
              {circuit.circuitNumber % 2 === 1 ? 'Left side (odd)' : 'Right side (even)'}
              {' · '}
              <span className={phaseColor[phase]}>Phase {phase}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-[#52525b] hover:text-[#f0f0f0] p-1">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Description */}
          <div>
            <label className={lbl}>Description</label>
            <input
              type="text"
              className={inp}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kitchen Recepts, HVAC-1, Washer…"
              maxLength={40}
              autoFocus
            />
          </div>

          {/* Breaker + Poles */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Breaker Size</label>
              <select
                className={`${inp} appearance-none`}
                value={breakerSize}
                onChange={(e) => setBreakerSize(parseInt(e.target.value))}
              >
                {BREAKER_SIZES.map((s) => (
                  <option key={s} value={s}>{s}A</option>
                ))}
              </select>
            </div>
            <div>
              <label className={lbl}>Poles</label>
              <select
                className={`${inp} appearance-none`}
                value={poles}
                onChange={(e) => setPoles(parseInt(e.target.value) as 1 | 2 | 3)}
              >
                <option value={1}>1P — 120V</option>
                <option value={2}>2P — {voltageSystem === '120/240-1ph' ? '240' : '208'}V</option>
                {maxPoles === 3 && <option value={3}>3P — 3Ø</option>}
              </select>
            </div>
          </div>

          {/* Load input */}
          <div>
            <label className={lbl}>Connected Load</label>
            <div className="flex gap-2">
              <input
                type="number"
                className={`${inp} flex-1`}
                value={rawLoad}
                onChange={(e) => setRawLoad(e.target.value)}
                placeholder="0"
                min="0"
              />
              <select
                className={`${inp} w-20 appearance-none`}
                value={loadUnit}
                onChange={(e) => setLoadUnit(e.target.value as 'W' | 'A')}
              >
                <option value="W">W</option>
                <option value="A">A</option>
              </select>
            </div>
            {rawLoad && parseFloat(rawLoad) > 0 && loadUnit === 'A' && (
              <div className="text-[10px] text-[#52525b] mt-1">
                = {Math.round(ampsToWatts(parseFloat(rawLoad), poles, voltageSystem))}W
              </div>
            )}
          </div>

          {/* Continuous load toggle */}
          <label className="flex items-center gap-3 cursor-pointer py-1">
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                isContinuous ? 'bg-[#f97316] border-[#f97316]' : 'border-[#2a2a35] bg-[#0a0b0e]'
              }`}
              onClick={() => setIsContinuous(!isContinuous)}
            >
              {isContinuous && <span className="text-black text-[11px] font-bold leading-none">✓</span>}
            </div>
            <div>
              <div className="text-xs text-[#d0d0d0]">Continuous load</div>
              <div className="text-[10px] text-[#52525b]">Applies 125% demand factor (NEC 210.20)</div>
            </div>
          </label>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-[#f97316] text-black font-bold text-sm rounded hover:bg-[#ea6c0a] transition-colors"
            >
              Save Circuit
            </button>
            {onDelete && (
              <button
                onClick={() => {
                  onDelete()
                  onClose()
                }}
                className="px-4 py-3 bg-[#1a1a24] text-red-400 border border-[#3a2020] rounded hover:bg-[#2a1a1a] transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function PanelScheduleBuilder() {
  type ViewTab = 'setup' | 'schedule' | 'summary'
  const [view, setView] = useState<ViewTab>('setup')
  const [config, setConfig] = useState<PanelConfig>({
    name: 'MDP',
    mainBreakerSize: 200,
    voltageSystem: '120/240-1ph',
    spaces: 42,
  })
  const [circuits, setCircuits] = useState<Circuit[]>([])
  const [editingSlot, setEditingSlot] = useState<number | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle')

  // Shared style tokens
  const inp =
    'w-full bg-[#0a0b0e] border border-[#2a2a35] px-3 py-2.5 text-sm text-[#f0f0f0] focus:border-[#f97316] focus:outline-none rounded'
  const sel = `${inp} appearance-none`
  const lbl = 'block text-[10px] uppercase tracking-wider text-[#52525b] mb-1'

  // Get current user
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null)
    })
  }, [])

  // ── Derived calculations ───────────────────────────────────────────────────
  const is3Phase = config.voltageSystem !== '120/240-1ph'

  // Phase totals (connected + demand)
  const phaseTotals: Record<Phase, number> = { A: 0, B: 0, C: 0 }
  const demandTotals: Record<Phase, number> = { A: 0, B: 0, C: 0 }

  circuits.forEach((c) => {
    if (c.watts <= 0) return
    const demand = c.isContinuous ? c.watts * 1.25 : c.watts
    const ph = getPhaseForSlot(c.circuitNumber, config.voltageSystem)

    if (c.poles === 1) {
      phaseTotals[ph] += c.watts
      demandTotals[ph] += demand
    } else if (c.poles === 2) {
      // Split across two adjacent phases
      const phList: Phase[] = ['A', 'B', 'C']
      const nextPh = phList[(phList.indexOf(ph) + 1) % (is3Phase ? 3 : 2)] as Phase
      phaseTotals[ph] += c.watts / 2
      phaseTotals[nextPh] += c.watts / 2
      demandTotals[ph] += demand / 2
      demandTotals[nextPh] += demand / 2
    } else {
      // 3-pole: equal split A/B/C
      phaseTotals.A += c.watts / 3
      phaseTotals.B += c.watts / 3
      phaseTotals.C += c.watts / 3
      demandTotals.A += demand / 3
      demandTotals.B += demand / 3
      demandTotals.C += demand / 3
    }
  })

  const activePhases: Phase[] = is3Phase ? ['A', 'B', 'C'] : ['A', 'B']
  const totalConnectedW = activePhases.reduce((s, p) => s + phaseTotals[p], 0)
  const totalDemandW = activePhases.reduce((s, p) => s + demandTotals[p], 0)

  // Panel kVA capacity
  const mainLineV =
    config.voltageSystem === '120/240-1ph' ? 240
    : config.voltageSystem === '120/208-3ph' ? 208
    : 480
  const mainKVA = is3Phase
    ? (config.mainBreakerSize * mainLineV * 1.732) / 1000
    : (config.mainBreakerSize * mainLineV) / 1000
  const loadPct = mainKVA > 0 ? (totalDemandW / 1000 / mainKVA) * 100 : 0

  // Phase balance score (100 = perfectly balanced, 0 = all on one phase)
  const phVals = activePhases.map((p) => phaseTotals[p])
  const maxPh = Math.max(...phVals, 0)
  const minPh = Math.min(...phVals, 0)
  const avgPh = phVals.reduce((a, b) => a + b, 0) / phVals.length
  const balanceScore = avgPh > 0 ? Math.max(0, 100 - ((maxPh - minPh) / avgPh) * 50) : 100

  // Slots used by multi-pole circuits
  function getOccupiedSlots(c: Circuit): number[] {
    const slots = [c.circuitNumber]
    for (let i = 1; i < c.poles; i++) slots.push(c.circuitNumber + 2 * i)
    return slots
  }
  function getCircuitAtSlot(slot: number): Circuit | undefined {
    return circuits.find((c) => getOccupiedSlots(c).includes(slot))
  }
  function isSlotBlocked(slot: number): boolean {
    return circuits.some((c) => {
      const occ = getOccupiedSlots(c)
      return occ.includes(slot) && occ[0] !== slot
    })
  }

  // Build display rows [leftSlot, rightSlot]
  const totalRows = config.spaces / 2
  const rows: [number, number][] = Array.from({ length: totalRows }, (_, r) => [
    r * 2 + 1,
    r * 2 + 2,
  ])

  // ── Circuit CRUD ──────────────────────────────────────────────────────────
  function saveCircuit(c: Circuit) {
    setCircuits((prev) => {
      const idx = prev.findIndex((x) => x.id === c.id)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = c
        return updated
      }
      return [...prev, c]
    })
  }

  function deleteCircuit(id: string) {
    setCircuits((prev) => prev.filter((c) => c.id !== id))
  }

  // ── Save to Supabase ──────────────────────────────────────────────────────
  async function handleSave() {
    if (!userId) return
    setSaveStatus('saving')
    try {
      const { error } = await supabase.from('panel_schedules').insert({
        user_id: userId,
        name: config.name,
        data: { config, circuits },
      })
      if (error) throw error
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  // ── Copy schedule as text ─────────────────────────────────────────────────
  function handleCopy() {
    const sys = VOLTAGE_SYSTEMS.find((v) => v.value === config.voltageSystem)?.label ?? ''
    const divider = '─'.repeat(80)
    const lines: string[] = [
      `PANEL SCHEDULE — ${config.name}`,
      `Main: ${config.mainBreakerSize}A  |  ${sys}  |  ${config.spaces} Spaces  |  Capacity: ${mainKVA.toFixed(1)} kVA`,
      divider,
      `${'CKT'.padEnd(5)}${'DESCRIPTION'.padEnd(32)}${'LOAD(W)'.padStart(8)}  ${'BKR'.padEnd(9)}  |  ${'CKT'.padEnd(5)}${'DESCRIPTION'.padEnd(32)}${'LOAD(W)'.padStart(8)}  BKR`,
      divider,
    ]

    for (let r = 0; r < totalRows; r++) {
      const ls = r * 2 + 1
      const rs = r * 2 + 2
      const lc = getCircuitAtSlot(ls)
      const rc = getCircuitAtSlot(rs)
      const lb = isSlotBlocked(ls)
      const rb = isSlotBlocked(rs)

      const fmt = (c: Circuit | undefined, blocked: boolean) => {
        if (blocked) return `${''.padEnd(5)}${'── continued ──'.padEnd(32)}${''.padStart(8)}  ${''.padEnd(9)}`
        if (!c) return `${''.padEnd(5)}${''.padEnd(32)}${''.padStart(8)}  ${''.padEnd(9)}`
        return `${String(c.circuitNumber).padEnd(5)}${(c.description || '').padEnd(32)}${String(Math.round(c.watts)).padStart(8)}  ${`${c.poles}P/${c.breakerSize}A`.padEnd(9)}`
      }

      lines.push(`${fmt(lc, lb)}  |  ${fmt(rc, rb)}`)
    }

    lines.push(divider)
    lines.push(`Connected: ${(totalConnectedW / 1000).toFixed(2)} kW   Demand (125%): ${(totalDemandW / 1000).toFixed(2)} kW   Loading: ${loadPct.toFixed(1)}%   Balance: ${balanceScore.toFixed(0)}%`)
    if (is3Phase) {
      lines.push(`Phase A: ${(phaseTotals.A / 1000).toFixed(2)} kW   Phase B: ${(phaseTotals.B / 1000).toFixed(2)} kW   Phase C: ${(phaseTotals.C / 1000).toFixed(2)} kW`)
    } else {
      lines.push(`Phase A (L1): ${(phaseTotals.A / 1000).toFixed(2)} kW   Phase B (L2): ${(phaseTotals.B / 1000).toFixed(2)} kW`)
    }

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopyStatus('copied')
      setTimeout(() => setCopyStatus('idle'), 2000)
    })
  }

  // ── Render: Setup ─────────────────────────────────────────────────────────
  function renderSetup() {
    return (
      <div className="flex flex-col gap-4">
        {/* Panel name */}
        <div>
          <label className={lbl}>Panel Name</label>
          <input
            type="text"
            className={inp}
            value={config.name}
            onChange={(e) => setConfig((c) => ({ ...c, name: e.target.value }))}
            placeholder="MDP, Panel A, Kitchen Sub…"
          />
        </div>

        {/* Main breaker + spaces */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Main Breaker</label>
            <select
              className={sel}
              value={config.mainBreakerSize}
              onChange={(e) =>
                setConfig((c) => ({ ...c, mainBreakerSize: parseInt(e.target.value) }))
              }
            >
              {MAIN_SIZES.map((s) => (
                <option key={s} value={s}>{s}A</option>
              ))}
            </select>
          </div>
          <div>
            <label className={lbl}>Spaces</label>
            <select
              className={sel}
              value={config.spaces}
              onChange={(e) => setConfig((c) => ({ ...c, spaces: parseInt(e.target.value) }))}
            >
              {SPACE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}-space</option>
              ))}
            </select>
          </div>
        </div>

        {/* Voltage system */}
        <div>
          <label className={lbl}>Voltage System</label>
          <select
            className={sel}
            value={config.voltageSystem}
            onChange={(e) =>
              setConfig((c) => ({ ...c, voltageSystem: e.target.value as VoltageSystem }))
            }
          >
            {VOLTAGE_SYSTEMS.map((v) => (
              <option key={v.value} value={v.value}>{v.label}</option>
            ))}
          </select>
        </div>

        {/* Panel info card */}
        <div className="bg-[#0a0b0e] border border-[#1e2028] border-l-4 border-l-[#f97316] rounded p-3 space-y-2">
          {[
            ['Panel Capacity', `${mainKVA.toFixed(1)} kVA`],
            ['Circuit Slots', `${config.spaces} (${totalRows} rows)`],
            ['Phase Config', is3Phase ? '3Ø — A / B / C' : '1Ø — L1(A) / L2(B)'],
            ['Line Voltage', `${mainLineV}V`],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between text-xs">
              <span className="text-[#52525b]">{label}</span>
              <span className="font-mono text-[#f97316]">{val}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setView('schedule')}
          className="w-full py-3 bg-[#f97316] text-black font-bold text-sm rounded hover:bg-[#ea6c0a] transition-colors"
        >
          Build Schedule →
        </button>

        {circuits.length > 0 && (
          <div className="text-[10px] text-center text-[#52525b]">
            {circuits.length} circuit{circuits.length !== 1 ? 's' : ''} entered
          </div>
        )}
      </div>
    )
  }

  // ── Render: Schedule grid ─────────────────────────────────────────────────
  function renderSchedule() {
    const loadColor =
      loadPct > 100 ? 'text-red-400' : loadPct > 80 ? 'text-yellow-400' : 'text-emerald-400'

    return (
      <div className="flex flex-col gap-2">
        {/* Panel header strip */}
        <div className="bg-[#0a0b0e] border border-[#2a2a35] rounded p-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-[#f0f0f0]">{config.name}</div>
            <div className="text-[10px] text-[#52525b]">
              {config.mainBreakerSize}A ·{' '}
              {VOLTAGE_SYSTEMS.find((v) => v.value === config.voltageSystem)?.label} ·{' '}
              {config.spaces} spaces
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold font-mono ${loadColor}`}>
              {loadPct.toFixed(1)}%
            </div>
            <div className="text-[9px] text-[#52525b]">loading</div>
          </div>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[1fr_6px_1fr] gap-1 px-0.5">
          {[0, 1].map((side) => (
            <div key={side} className="grid grid-cols-[20px_10px_1fr_44px_28px_8px] gap-0.5 items-center px-1">
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#52525b]">CKT</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#52525b]">Ø</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#52525b]">DESCRIPTION</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#52525b] text-right">LOAD</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#52525b] text-right">BKR</span>
              <span />
            </div>
          ))}
          <div />
        </div>

        {/* Circuit rows */}
        <div className="flex flex-col gap-0.5">
          {rows.map(([ls, rs]) => (
            <div key={ls} className="grid grid-cols-[1fr_4px_1fr] gap-1 items-stretch">
              <CircuitSlot
                slot={ls}
                circuit={getCircuitAtSlot(ls)}
                isBlocked={isSlotBlocked(ls)}
                voltageSystem={config.voltageSystem}
                onClick={() => !isSlotBlocked(ls) && setEditingSlot(ls)}
              />
              <div className="bg-[#1e2028] rounded-full w-1 self-stretch mx-auto" />
              <CircuitSlot
                slot={rs}
                circuit={getCircuitAtSlot(rs)}
                isBlocked={isSlotBlocked(rs)}
                voltageSystem={config.voltageSystem}
                onClick={() => !isSlotBlocked(rs) && setEditingSlot(rs)}
              />
            </div>
          ))}
        </div>

        {/* Phase totals footer */}
        <div className={`grid gap-2 mt-2 ${is3Phase ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {activePhases.map((ph) => {
            const phaseColor: Record<Phase, string> = {
              A: 'border-blue-800 text-blue-400',
              B: 'border-red-800 text-red-400',
              C: 'border-yellow-800 text-yellow-400',
            }
            return (
              <div
                key={ph}
                className={`bg-[#0a0b0e] border rounded p-2 text-center ${phaseColor[ph]}`}
              >
                <div className="text-[9px] uppercase tracking-wider mb-0.5 opacity-70">
                  Phase {ph}
                </div>
                <div className="text-xs font-bold font-mono">
                  {(phaseTotals[ph] / 1000).toFixed(2)} kW
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick tip */}
        <div className="text-[10px] text-center text-[#2a2a35] mt-1">
          Tap any slot to add or edit a circuit
        </div>
      </div>
    )
  }

  // ── Render: Summary ───────────────────────────────────────────────────────
  function renderSummary() {
    const circuitCount = circuits.filter((c) => c.watts > 0).length
    const slotsUsed = circuits.reduce((a, c) => a + c.poles, 0)
    const loadColor =
      loadPct > 100 ? 'text-red-400 bg-red-950' : loadPct > 80 ? 'text-yellow-400 bg-yellow-950' : 'text-emerald-400 bg-emerald-950'
    const phaseColor: Record<Phase, string> = {
      A: 'bg-blue-500', B: 'bg-red-500', C: 'bg-yellow-500',
    }

    return (
      <div className="flex flex-col gap-4">
        {/* Load summary */}
        <div className="bg-[#0a0b0e] border border-[#1e2028] border-l-4 border-l-[#f97316] rounded p-4">
          <div className="text-[10px] uppercase tracking-wider text-[#52525b] mb-3">
            Load Summary
          </div>
          <div className="space-y-2">
            {[
              ['Connected Load', `${(totalConnectedW / 1000).toFixed(2)} kW`, 'text-[#f97316]'],
              ['Demand Load (×1.25 cont.)', `${(totalDemandW / 1000).toFixed(2)} kW`, 'text-[#f0f0f0]'],
              ['Panel Capacity', `${mainKVA.toFixed(2)} kVA`, 'text-[#888]'],
            ].map(([label, val, color]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-[#888]">{label}</span>
                <span className={`font-bold font-mono ${color}`}>{val}</span>
              </div>
            ))}
            <div className="h-px bg-[#1e2028]" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#888]">% Loading (demand / capacity)</span>
              <span className={`text-sm font-bold font-mono px-2 py-0.5 rounded ${loadColor}`}>
                {loadPct.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Load bar */}
          <div className="mt-3 h-2 bg-[#1e2028] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                loadPct > 100 ? 'bg-red-500' : loadPct > 80 ? 'bg-yellow-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(loadPct, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-[#2a2a35] mt-1">
            <span>0%</span>
            <span className="text-yellow-700">80%</span>
            <span className="text-red-700">100%</span>
          </div>

          {loadPct > 80 && (
            <div
              className={`mt-3 text-[10px] rounded px-3 py-2 flex items-start gap-2 ${
                loadPct > 100 ? 'bg-red-950 text-red-400' : 'bg-yellow-950 text-yellow-400'
              }`}
            >
              <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
              <span>
                {loadPct > 100
                  ? 'OVERLOADED — upgrade main breaker or shed load before energizing'
                  : 'Above 80% — verify demand factors per NEC 220.87 before adding load'}
              </span>
            </div>
          )}
          <CalculatorDisclaimer />
        </div>

        {/* Phase balance */}
        <div className="bg-[#0a0b0e] border border-[#1e2028] rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] uppercase tracking-wider text-[#52525b]">
              Phase Balance
            </div>
            <div
              className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                balanceScore > 90
                  ? 'text-emerald-400 bg-emerald-950'
                  : balanceScore > 70
                  ? 'text-yellow-400 bg-yellow-950'
                  : 'text-red-400 bg-red-950'
              }`}
            >
              {balanceScore.toFixed(0)}% balanced
            </div>
          </div>
          {activePhases.map((ph) => {
            const pct = maxPh > 0 ? (phaseTotals[ph] / maxPh) * 100 : 0
            return (
              <div key={ph} className="mb-2.5">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#888]">Phase {ph}</span>
                  <span className="font-mono text-[#f0f0f0]">
                    {(phaseTotals[ph] / 1000).toFixed(2)} kW
                    {totalConnectedW > 0 && (
                      <span className="text-[#52525b] ml-1">
                        ({((phaseTotals[ph] / totalConnectedW) * 100).toFixed(0)}%)
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-2 bg-[#1e2028] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${phaseColor[ph]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
          {balanceScore < 80 && (
            <div className="text-[10px] text-yellow-400 bg-yellow-950 rounded px-3 py-2 mt-2 flex items-start gap-2">
              <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
              <span>
                Phases are unbalanced — redistribute single-pole loads for better efficiency and
                reduced neutral current
              </span>
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Circuits', value: `${circuitCount}/${config.spaces}` },
            { label: 'Slots Used', value: `${slotsUsed}/${config.spaces}` },
            {
              label: 'Avg / Ckt',
              value:
                circuitCount > 0
                  ? `${((totalConnectedW / circuitCount) / 1000).toFixed(2)} kW`
                  : '—',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#0a0b0e] border border-[#1e2028] rounded p-2.5 text-center"
            >
              <div className="text-[9px] uppercase tracking-wider text-[#52525b] mb-0.5">
                {stat.label}
              </div>
              <div className="text-xs font-bold font-mono text-[#f0f0f0]">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#1a1a24] border border-[#2a2a35] text-[#f0f0f0] text-sm font-medium rounded hover:bg-[#22222e] transition-colors"
          >
            <Copy className="h-4 w-4" />
            {copyStatus === 'copied' ? '✓ Copied to clipboard!' : 'Copy Schedule (Text Table)'}
          </button>

          {userId && (
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`flex items-center justify-center gap-2 w-full py-3 text-sm font-bold rounded transition-colors ${
                saveStatus === 'saved'
                  ? 'bg-emerald-800 text-white'
                  : saveStatus === 'error'
                  ? 'bg-red-900 text-white'
                  : 'bg-[#f97316] text-black hover:bg-[#ea6c0a]'
              }`}
            >
              <Save className="h-4 w-4" />
              {saveStatus === 'saving'
                ? 'Saving…'
                : saveStatus === 'saved'
                ? '✓ Saved to Sparky'
                : saveStatus === 'error'
                ? 'Save failed — tap to retry'
                : 'Save to Sparky'}
            </button>
          )}

          <div className="text-[10px] text-center text-[#2a2a35]">
            PDF export — coming soon
          </div>
        </div>
      </div>
    )
  }

  // ── Shell ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Tab nav */}
      <div className="flex gap-1 bg-[#0a0b0e] border border-[#1e2028] rounded-lg p-1">
        {(
          [
            { id: 'setup' as const, label: 'Setup', Icon: Settings },
            { id: 'schedule' as const, label: 'Schedule', Icon: LayoutGrid },
            { id: 'summary' as const, label: 'Summary', Icon: BarChart3 },
          ] as const
        ).map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded transition-colors ${
              view === id
                ? 'bg-[#f97316] text-black'
                : 'text-[#888] hover:text-[#f0f0f0]'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* View content */}
      {view === 'setup' && renderSetup()}
      {view === 'schedule' && renderSchedule()}
      {view === 'summary' && renderSummary()}

      {/* Circuit editor modal */}
      {editingSlot !== null && (
        <CircuitEditor
          circuit={
            getCircuitAtSlot(editingSlot) ?? { circuitNumber: editingSlot }
          }
          voltageSystem={config.voltageSystem}
          onSave={saveCircuit}
          onDelete={
            getCircuitAtSlot(editingSlot)
              ? () => deleteCircuit(getCircuitAtSlot(editingSlot)!.id)
              : undefined
          }
          onClose={() => setEditingSlot(null)}
        />
      )}
    </div>
  )
}

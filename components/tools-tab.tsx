'use client'

import { useState, useEffect } from 'react'
import { getRecentCalculations, type SavedCalculation, saveCalculation, generateId } from '@/lib/storage'
import { recordToolOpen } from '@/lib/usage'
import { CalculatorModal } from '@/components/tools/calculator-modal'
import { VoltageDropCalculator } from '@/components/tools/voltage-drop'
import { ConduitFillCalculator } from '@/components/tools/conduit-fill'
import { OhmsLawCalculator } from '@/components/tools/ohms-law'
import { ConduitBendingChart } from '@/components/tools/conduit-bending-chart'
import { WireSizingCalculator } from '@/components/tools/wire-sizing'
import { AmpacityCalculator } from '@/components/tools/ampacity'
import { BoxFillCalculator } from '@/components/tools/box-fill'
import { MaterialTakeoffCalculator } from '@/components/tools/material-takeoff-calculator'
import { PanelScheduleBuilder } from '@/components/panel-schedule-builder'
import {
  Zap,
  Cylinder,
  Triangle,
  Ruler,
  Cable,
  Gauge,
  Box,
  Settings,
  HardHat,
  Clock,
  ClipboardList,
  LayoutGrid,
} from 'lucide-react'
import { Swipeable } from '@/components/ui/swipeable'

type CalculatorId =
  | 'voltage-drop'
  | 'conduit-fill'
  | 'ohms-law'
  | 'pipe-bending'
  | 'wire-sizing'
  | 'ampacity'
  | 'box-fill'
  | 'motor-fla'
  | 'construction'
  | 'material-takeoff'
  | 'panel-schedule'
  | null

const CALCULATORS = [
  { id: 'voltage-drop' as const,  label: 'Voltage Drop',  desc: 'V, A, length, wire',       icon: Zap,      color: 'var(--color-accent)' },
  { id: 'conduit-fill' as const,  label: 'Conduit Fill',  desc: 'Type, size, wire count',    icon: Cylinder, color: 'var(--color-accent)' },
  { id: 'ohms-law' as const,      label: "Ohm's Law",     desc: 'V, I, R triangle',          icon: Triangle, color: 'var(--color-accent)' },
  { id: 'pipe-bending' as const,  label: 'Conduit Bending', desc: 'Chart, brands, step-by-step', icon: Ruler, color: 'var(--color-accent)' },
  { id: 'wire-sizing' as const,   label: 'Wire Sizing',   desc: 'Load, distance, NEC',       icon: Cable,    color: 'var(--color-accent)' },
  { id: 'ampacity' as const,      label: 'Ampacity',      desc: 'Derating & correction',     icon: Gauge,    color: 'var(--color-accent)' },
  { id: 'box-fill' as const,      label: 'Box Fill',      desc: 'NEC 314.16 volumes',        icon: Box,      color: 'var(--color-accent)' },
  { id: 'motor-fla' as const,     label: 'Motor FLA',     desc: '430.248/250 tables',        icon: Settings, color: 'var(--color-accent)' },
  { id: 'construction' as const,  label: 'Construction',  desc: 'Material & labor estimator', icon: HardHat,  color: 'var(--color-accent)' },
  { id: 'material-takeoff' as const,  label: 'Material Takeoff',  desc: 'Wire, conduit & labor est.',  icon: ClipboardList, color: 'var(--color-accent)' },
  { id: 'panel-schedule' as const,    label: 'Panel Schedule',    desc: 'Load center builder',         icon: LayoutGrid,    color: 'var(--color-accent)' },
] as const

// ── Inline Motor FLA Calculator ───────────────────────────────────────────────

const MOTOR_FLA_1PH: Record<string, Record<number, number>> = {
  "0.5":  { 115: 9.8,  200: 5.6,  208: 5.4,  230: 4.9 },
  "0.75": { 115: 13.8, 200: 7.9,  208: 7.6,  230: 6.9 },
  "1":    { 115: 16.0, 200: 9.2,  208: 8.8,  230: 8.0 },
  "1.5":  { 115: 20.0, 200: 11.5, 208: 11.0, 230: 10.0 },
  "2":    { 115: 24.0, 200: 13.8, 208: 13.2, 230: 12.0 },
  "3":    { 115: 34.0, 200: 19.6, 208: 18.7, 230: 17.0 },
  "5":    { 115: 56.0, 200: 32.2, 208: 30.8, 230: 28.0 },
  "7.5":  { 200: 46.0, 208: 44.0, 230: 40.0 },
  "10":   { 200: 64.0, 208: 61.0, 230: 50.0 },
}

const MOTOR_FLA_3PH: Record<string, Record<number, number>> = {
  "0.5":  { 200: 2.5,  208: 2.4,  230: 2.2,  460: 1.1,  575: 0.9 },
  "0.75": { 200: 3.7,  208: 3.5,  230: 3.2,  460: 1.6,  575: 1.3 },
  "1":    { 200: 4.8,  208: 4.6,  230: 4.2,  460: 2.1,  575: 1.7 },
  "1.5":  { 200: 6.9,  208: 6.6,  230: 6.0,  460: 3.0,  575: 2.4 },
  "2":    { 200: 7.8,  208: 7.5,  230: 6.8,  460: 3.4,  575: 2.7 },
  "3":    { 200: 11.0, 208: 10.6, 230: 9.6,  460: 4.8,  575: 3.9 },
  "5":    { 200: 17.5, 208: 16.7, 230: 15.2, 460: 7.6,  575: 6.1 },
  "7.5":  { 200: 25.3, 208: 24.2, 230: 22.0, 460: 11.0, 575: 9.0 },
  "10":   { 200: 32.2, 208: 30.8, 230: 28.0, 460: 14.0, 575: 11.0 },
  "15":   { 200: 48.3, 208: 46.2, 230: 42.0, 460: 21.0, 575: 17.0 },
  "20":   { 200: 62.1, 208: 59.4, 230: 54.0, 460: 27.0, 575: 22.0 },
  "25":   { 200: 78.2, 208: 74.8, 230: 68.0, 460: 34.0, 575: 27.0 },
  "30":   { 200: 92.0, 208: 88.0, 230: 80.0, 460: 40.0, 575: 32.0 },
  "40":   { 200: 120,  208: 114,  230: 104,  460: 52.0, 575: 41.0 },
  "50":   { 200: 150,  208: 143,  230: 130,  460: 65.0, 575: 52.0 },
  "60":   { 200: 177,  208: 169,  230: 154,  460: 77.0, 575: 62.0 },
  "75":   { 200: 221,  208: 211,  230: 192,  460: 96.0, 575: 77.0 },
  "100":  { 200: 285,  208: 273,  230: 248,  460: 124,  575: 99.0 },
}

function MotorFLACalculator() {
  const [phase, setPhase] = useState('3')
  const [hp, setHp] = useState('5')
  const [voltage, setVoltage] = useState('460')

  const table = phase === '1' ? MOTOR_FLA_1PH : MOTOR_FLA_3PH
  const hpOptions = Object.keys(table)
  const voltageOptions = phase === '1'
    ? ['115', '200', '208', '230']
    : ['200', '208', '230', '460', '575']
  const safeVoltage = voltageOptions.includes(voltage) ? voltage : voltageOptions[voltageOptions.length - 2]
  const fla = table[hp]?.[parseInt(safeVoltage)] || 0

  const sel = 'w-full bg-[#0a0b0e] border border-[#27272a] px-3 py-2.5 text-sm text-[#fafafa] focus:border-[var(--color-accent)] focus:outline-none appearance-none'
  const lbl = 'block text-[10px] uppercase tracking-wider text-[#a1a1aa] mb-1'

  return (
    <div className="flex flex-col gap-4 p-1">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={lbl}>Phase</label>
          <select className={sel} value={phase} onChange={e => { setPhase(e.target.value); setVoltage(e.target.value === '1' ? '230' : '460') }}>
            <option value="1">1Ø</option>
            <option value="3">3Ø</option>
          </select>
        </div>
        <div>
          <label className={lbl}>HP</label>
          <select className={sel} value={hp} onChange={e => setHp(e.target.value)}>
            {hpOptions.map(h => <option key={h} value={h}>{h} HP</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>Voltage</label>
          <select className={sel} value={safeVoltage} onChange={e => setVoltage(e.target.value)}>
            {voltageOptions.map(v => <option key={v} value={v}>{v}V</option>)}
          </select>
        </div>
      </div>

      {fla > 0 ? (
        <div className="bg-[#0a0b0e] border border-[#1a3025] border-l-4 border-l-(--color-accent) p-4 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-[#a1a1aa]">Full Load Amps</span><span className="font-bold text-(--color-accent) font-mono">{fla} A</span></div>
          <div className="flex justify-between text-sm"><span className="text-[#a1a1aa]">Wire (125% FLA)</span><span className="font-bold text-(--color-accent) font-mono">{(fla * 1.25).toFixed(1)} A min</span></div>
          <div className="flex justify-between text-sm"><span className="text-[#a1a1aa]">Breaker (250% FLA)</span><span className="font-bold text-(--color-accent) font-mono">{(fla * 2.5).toFixed(1)} A max</span></div>
          <div className="flex justify-between text-sm"><span className="text-[#a1a1aa]">Overload (115%)</span><span className="font-mono text-[#fafafa]">{(fla * 1.15).toFixed(2)} A</span></div>
          <div className="text-[10px] text-[#71717a] pt-1">NEC 430.22 (wire) · 430.52 (breaker) · 430.32 (overload)</div>
        </div>
      ) : (
        <div className="text-sm text-[#a1a1aa] text-center py-4">No NEC table data for this combination</div>
      )}
    </div>
  )
}

// ── Inline Construction Calculator ───────────────────────────────────────────

interface LineItem {
  id: number
  description: string
  qty: string
  unitCost: string
  laborHrs: string
}

let nextId = 1

function emptyLine(): LineItem {
  return { id: nextId++, description: '', qty: '', unitCost: '', laborHrs: '' }
}

function ConstructionCalculator() {
  const [items, setItems] = useState<LineItem[]>([emptyLine()])
  const [laborRate, setLaborRate] = useState('85')
  const [taxRate, setTaxRate] = useState('8')

  const inp = 'w-full bg-[#0a0b0e] border border-[#27272a] px-2 py-2 text-sm text-[#fafafa] focus:border-[var(--color-primary)] focus:outline-none'
  const lbl = 'block text-[10px] uppercase tracking-wider text-[#a1a1aa] mb-1'

  function updateItem(id: number, field: keyof LineItem, value: string) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it))
  }

  function removeItem(id: number) {
    setItems(prev => prev.length > 1 ? prev.filter(it => it.id !== id) : prev)
  }

  const itemTotals = items.map(it => {
    const mat = parseFloat(it.qty || '0') * parseFloat(it.unitCost || '0')
    const lab = parseFloat(it.laborHrs || '0') * parseFloat(laborRate || '0')
    return { mat, lab, total: mat + lab }
  })

  const materialTotal = itemTotals.reduce((s, t) => s + t.mat, 0)
  const laborTotal    = itemTotals.reduce((s, t) => s + t.lab, 0)
  const subtotal      = materialTotal + laborTotal
  const tax           = subtotal * (parseFloat(taxRate || '0') / 100)
  const grandTotal    = subtotal + tax

  return (
    <div className="flex flex-col gap-4 p-1">

      {/* Global settings */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lbl}>Labor Rate ($/hr)</label>
          <input type="number" className={inp} value={laborRate} onChange={e => setLaborRate(e.target.value)} min="0" step="1" />
        </div>
        <div>
          <label className={lbl}>Tax Rate (%)</label>
          <input type="number" className={inp} value={taxRate} onChange={e => setTaxRate(e.target.value)} min="0" max="30" step="0.1" />
        </div>
      </div>

      {/* Line items */}
      <div>
        <div className="grid grid-cols-[1fr_52px_64px_52px_28px] gap-1.5 mb-1.5">
          <span className={lbl}>Description</span>
          <span className={lbl}>Qty</span>
          <span className={lbl}>Unit $</span>
          <span className={lbl}>Hrs</span>
          <span />
        </div>

        <div className="flex flex-col gap-1.5">
          {items.map((item, idx) => (
            <div key={item.id} className="grid grid-cols-[1fr_52px_64px_52px_28px] gap-1.5 items-center">
              <input
                type="text"
                className={inp}
                value={item.description}
                onChange={e => updateItem(item.id, 'description', e.target.value)}
                placeholder={`Item ${idx + 1}`}
              />
              <input type="number" className={inp} value={item.qty} onChange={e => updateItem(item.id, 'qty', e.target.value)} placeholder="1" min="0" />
              <input type="number" className={inp} value={item.unitCost} onChange={e => updateItem(item.id, 'unitCost', e.target.value)} placeholder="0.00" min="0" step="0.01" />
              <input type="number" className={inp} value={item.laborHrs} onChange={e => updateItem(item.id, 'laborHrs', e.target.value)} placeholder="0" min="0" step="0.5" />
              <button
                onClick={() => removeItem(item.id)}
                className="flex items-center justify-center text-[#52525b] hover:text-[#ef4444] transition-colors text-lg leading-none"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => setItems(prev => [...prev, emptyLine()])}
          className="mt-2 flex items-center gap-1.5 text-(--color-primary) text-xs font-semibold hover:opacity-80 transition-opacity"
        >
          <span className="text-base leading-none">+</span> Add Line Item
        </button>
      </div>

      {/* Running total */}
      <div className="bg-[#0a0b0e] border border-[#27272a] border-l-2 border-l-(--color-primary)">
        <div className="px-4 py-2 border-b border-[#27272a]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-(--color-primary)">Estimate Summary</span>
        </div>
        <div className="px-4 py-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#a1a1aa]">Materials</span>
            <span className="font-mono text-[#fafafa]">${materialTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#a1a1aa]">Labor ({laborRate}/hr)</span>
            <span className="font-mono text-[#fafafa]">${laborTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-[#27272a] pt-2">
            <span className="text-[#a1a1aa]">Subtotal</span>
            <span className="font-mono text-[#fafafa]">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#a1a1aa]">Tax ({taxRate}%)</span>
            <span className="font-mono text-[#fafafa]">${tax.toFixed(2)}</span>
          </div>
        </div>
        <div className="px-4 py-3 border-t border-[#27272a] bg-[#0d0e11]">
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-bold text-(--color-primary) uppercase tracking-wider">Total</span>
            <span className="font-mono text-2xl font-bold text-(--color-primary)">${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => { setItems([emptyLine()]); setLaborRate('85'); setTaxRate('8') }}
        className="w-full py-2.5 bg-[#27272a] text-[#fafafa] text-sm font-semibold hover:bg-[#3f3f46] transition-colors"
      >
        Clear All
      </button>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

interface ToolsTabProps {
  initialToolId?: string | null
}

export function ToolsTab({ initialToolId }: ToolsTabProps) {
  const [activeCalc, setActiveCalc] = useState<CalculatorId>(null)
  const [recentCalcs, setRecentCalcs] = useState<SavedCalculation[]>([])

  useEffect(() => {
    setRecentCalcs(getRecentCalculations(5))
  }, [])

  // Support deep-linking from Home tab Quick Actions
  useEffect(() => {
    if (initialToolId && CALCULATORS.find(c => c.id === initialToolId)) {
      openCalc(initialToolId as CalculatorId)
    }
  }, [initialToolId])

  useEffect(() => {
    if (activeCalc === null) setRecentCalcs(getRecentCalculations(5))
  }, [activeCalc])

  function openCalc(id: CalculatorId) {
    if (id) recordToolOpen(id)
    setActiveCalc(id)
  }

  function handleDuplicateCalculation(calc: SavedCalculation) {
    const duplicated = { ...calc, id: generateId(), timestamp: new Date().toISOString() }
    saveCalculation(duplicated)
    setRecentCalcs(getRecentCalculations(5))
  }

  function handleDeleteCalculation(id: string) {
    // TODO: implement deleteCalculation in storage
    setRecentCalcs(prev => prev.filter(c => c.id !== id))
  }

  function renderCalculator() {
    switch (activeCalc) {
      case 'voltage-drop':  return <VoltageDropCalculator />
      case 'conduit-fill':  return <ConduitFillCalculator />
      case 'ohms-law':      return <OhmsLawCalculator />
      case 'pipe-bending':  return <ConduitBendingChart />
      case 'wire-sizing':   return <WireSizingCalculator />
      case 'ampacity':      return <AmpacityCalculator />
      case 'box-fill':      return <BoxFillCalculator />
      case 'motor-fla':     return <MotorFLACalculator />
      case 'construction':     return <ConstructionCalculator />
      case 'material-takeoff': return <MaterialTakeoffCalculator />
      case 'panel-schedule':   return <PanelScheduleBuilder />
      default:              return null
    }
  }

  const getCalcTitle = () => CALCULATORS.find(c => c.id === activeCalc)?.label || ''

  return (
    <div className="flex flex-col gap-6">
      {/* Calculators grid — 2 col mobile, 3 tablet, 4 desktop */}
      <div>
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-zinc-500 field-mode:text-yellow-300">Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CALCULATORS.map(calc => {
            const Icon = calc.icon
            return (
              <button
                key={calc.id}
                onClick={() => openCalc(calc.id)}
                className="electric-card flex flex-col gap-3 p-5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-left transition-all duration-300 hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] active:scale-[0.97] field-mode:border-yellow-400/30 field-mode:min-h-[80px]"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white leading-tight field-mode:text-yellow-100">{calc.label}</div>
                  <div className="text-xs text-zinc-500 mt-0.5 field-mode:text-yellow-400/60">{calc.desc}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Recent Calculations */}
      {recentCalcs.length > 0 && (
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500 field-mode:text-yellow-300">
            <Clock className="h-3.5 w-3.5" /> Recent
          </h2>
          <div className="flex flex-col gap-2">
            {recentCalcs.map(calc => (
              <Swipeable
                key={calc.id}
                onSwipeLeft={() => handleDuplicateCalculation(calc)}
                onSwipeRight={() => handleDeleteCalculation(calc.id)}
              >
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl transition-colors hover:border-zinc-700 field-mode:bg-black field-mode:border-yellow-400/20">
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-medium uppercase tracking-widest text-zinc-600 field-mode:text-yellow-400/60">{calc.type}</div>
                    <div className="text-xs text-zinc-300 truncate field-mode:text-yellow-100">{calc.label}</div>
                  </div>
                  <div className="text-right font-mono text-xs text-orange-400 ml-3 field-mode:text-yellow-300">{calc.result}</div>
                </div>
              </Swipeable>
            ))}
          </div>
        </div>
      )}

      {/* Calculator Modal */}
      {activeCalc && (
        <CalculatorModal title={getCalcTitle()} onClose={() => setActiveCalc(null)}>
          {renderCalculator()}
        </CalculatorModal>
      )}
    </div>
  )
}


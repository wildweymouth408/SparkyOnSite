'use client'

import { useState, useCallback } from 'react'
import { saveCalculation, generateId, type SavedCalculation } from '@/lib/storage'
import { AttachToJob } from '@/components/tools/attach-to-job'
import { CalculatorDisclaimer } from '@/components/calculator-disclaimer'
import { toast } from 'sonner'
import { Save, Copy, Check } from 'lucide-react'

// ── NEC Chapter 9, Table 5 — THHN compact area approximations (sq in)
const WIRE_AREAS_SQ_IN: Record<string, number> = {
  '14':  0.0097,
  '12':  0.0133,
  '10':  0.0211,
  '8':   0.0366,
  '6':   0.0507,
  '4':   0.0824,
  '2':   0.1158,
  '1/0': 0.1855,
  '2/0': 0.2223,
  '3/0': 0.2679,
  '4/0': 0.3237,
}

// NEC 250.122 — minimum EGC size based on phase conductor
const MIN_EGC: Record<string, string> = {
  '14':  '14',
  '12':  '14',
  '10':  '10',
  '8':   '10',
  '6':   '10',
  '4':   '8',
  '2':   '6',
  '1/0': '6',
  '2/0': '4',
  '3/0': '2',
  '4/0': '2',
}

// Conduit internal areas — NEC Chapter 9 Table 4, 40% fill limit
const CONDUIT_AREAS: Record<string, Record<string, { total: number; at40: number }>> = {
  EMT: {
    '1/2':   { total: 0.304,  at40: 0.122 },
    '3/4':   { total: 0.533,  at40: 0.213 },
    '1':     { total: 0.864,  at40: 0.346 },
    '1-1/4': { total: 1.496,  at40: 0.598 },
    '1-1/2': { total: 2.036,  at40: 0.814 },
    '2':     { total: 3.356,  at40: 1.342 },
  },
  RMC: {
    '1/2':   { total: 0.314,  at40: 0.126 },
    '3/4':   { total: 0.549,  at40: 0.220 },
    '1':     { total: 0.887,  at40: 0.355 },
    '1-1/4': { total: 1.526,  at40: 0.610 },
    '1-1/2': { total: 2.071,  at40: 0.828 },
    '2':     { total: 3.408,  at40: 1.363 },
  },
  PVC: {
    '1/2':   { total: 0.285,  at40: 0.114 },
    '3/4':   { total: 0.508,  at40: 0.203 },
    '1':     { total: 0.832,  at40: 0.333 },
    '1-1/4': { total: 1.453,  at40: 0.581 },
    '1-1/2': { total: 1.986,  at40: 0.794 },
    '2':     { total: 3.291,  at40: 1.316 },
  },
  Flex: {
    '1/2':   { total: 0.304,  at40: 0.122 },
    '3/4':   { total: 0.533,  at40: 0.213 },
    '1':     { total: 0.864,  at40: 0.346 },
    '1-1/4': { total: 1.496,  at40: 0.598 },
    '1-1/2': { total: 2.036,  at40: 0.814 },
    '2':     { total: 3.356,  at40: 1.342 },
  },
}

const CONDUIT_SIZES = ['1/2', '3/4', '1', '1-1/4', '1-1/2', '2'] as const
const WIRE_SIZES = ['14', '12', '10', '8', '6', '4', '2', '1/0', '2/0', '3/0', '4/0'] as const
const WIRE_TYPES = ['THHN', 'THWN', 'NM-B', 'MC Cable', 'SO Cord'] as const
const CONDUIT_TYPES = ['EMT', 'RMC', 'PVC', 'Flex', 'MC'] as const

type WireSize = typeof WIRE_SIZES[number]
type WireType = typeof WIRE_TYPES[number]
type ConduitType = typeof CONDUIT_TYPES[number]
type NumConductors = '2' | '3' | '4'

interface MTOInputs {
  circuits: number
  avgRunLength: number
  wireSize: WireSize
  wireType: WireType
  numConductors: NumConductors
  conduitType: ConduitType
  conduitSizeAuto: boolean
  conduitSizeManual: string
  includeHomeRun: boolean
  homeRunLength: number
  laborRate: number
}

function suggestConduitSize(
  wireSize: string,
  conductorCount: number,
  conduitType: ConduitType
): string | null {
  if (conduitType === 'MC') return null
  const wireArea = WIRE_AREAS_SQ_IN[wireSize] ?? 0
  const totalWireArea = wireArea * conductorCount
  const areas = CONDUIT_AREAS[conduitType] ?? CONDUIT_AREAS.EMT
  for (const size of CONDUIT_SIZES) {
    if (areas[size].at40 >= totalWireArea) return size
  }
  return '>2"'
}

export function MaterialTakeoffCalculator() {
  const [inputs, setInputs] = useState<MTOInputs>({
    circuits: 4,
    avgRunLength: 50,
    wireSize: '12',
    wireType: 'THHN',
    numConductors: '3',
    conduitType: 'EMT',
    conduitSizeAuto: true,
    conduitSizeManual: '3/4',
    includeHomeRun: false,
    homeRunLength: 0,
    laborRate: 85,
  })

  const [copied, setCopied] = useState(false)

  const set = useCallback(<K extends keyof MTOInputs>(key: K, value: MTOInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }))
  }, [])

  // ── Core calculations ────────────────────────────────────────────────────
  const numCond = parseInt(inputs.numConductors) // current-carrying: 1, 2, or 3 hots + neutral
  // Field interpretation:
  //   2-wire = 1 hot + 1 neutral  (+ bare ground)
  //   3-wire = 2 hots + 1 neutral (+ bare ground) — MWBC or multiphase
  //   4-wire = 3 hots + 1 neutral (+ bare ground) — 3Ø
  const phaseCount = numCond - 1  // hot conductors only (neutral counted separately)

  const totalRunFt =
    inputs.circuits *
    (inputs.avgRunLength + (inputs.includeHomeRun ? inputs.homeRunLength : 0))

  const phaseFootage   = phaseCount * totalRunFt
  const neutralFootage = totalRunFt
  const groundFootage  = totalRunFt
  const groundSize     = MIN_EGC[inputs.wireSize] ?? inputs.wireSize
  const totalAllConductors = phaseFootage + neutralFootage + groundFootage

  // Conduit
  const useConduit = inputs.conduitType !== 'MC'
  const totalConduitFt = useConduit ? totalRunFt : 0

  // Conductors in conduit = current-carrying + 1 ground
  const conductorsInConduit = numCond + 1
  const autoConduitSize = suggestConduitSize(inputs.wireSize, conductorsInConduit, inputs.conduitType)
  const conduitSize = inputs.conduitSizeAuto ? autoConduitSize : inputs.conduitSizeManual

  // Wire connectors: (numCond + 1) per end × 2 ends × circuits
  // Each conductor gets capped at panel and at load end
  const wireNutsPerCircuit = (numCond + 1) * 2
  const totalWireNuts = wireNutsPerCircuit * inputs.circuits

  // Pull time estimate
  // Conduit run: 1 hr/100ft | MC/NM: 0.5 hr/100ft
  const isCableAssembly =
    inputs.conduitType === 'MC' ||
    inputs.wireType === 'NM-B' ||
    inputs.wireType === 'MC Cable'
  const pullRate    = isCableAssembly ? 0.5 : 1.0
  const pullHours   = (totalRunFt / 100) * pullRate
  const laborCost   = pullHours * inputs.laborRate

  // ── Summary text for clipboard ─────────────────────────────────────────
  const getSummaryText = () => {
    const lines = [
      '=== MATERIAL TAKEOFF ===',
      `Circuits: ${inputs.circuits} @ ${inputs.avgRunLength}ft avg${inputs.includeHomeRun ? ` + ${inputs.homeRunLength}ft home run` : ''}`,
      `Wire: #${inputs.wireSize} ${inputs.wireType} (${inputs.numConductors}-wire + ground)`,
      '',
      '--- WIRE ---',
      `Phase (${phaseCount}x #${inputs.wireSize}): ${phaseFootage.toLocaleString()} ft`,
      `Neutral (#${inputs.wireSize}): ${neutralFootage.toLocaleString()} ft`,
      `Ground (#${groundSize}): ${groundFootage.toLocaleString()} ft`,
      `TOTAL conductors: ${totalAllConductors.toLocaleString()} ft`,
      '',
    ]
    if (useConduit) {
      lines.push('--- CONDUIT ---')
      lines.push(`${inputs.conduitType} ${conduitSize}": ${totalConduitFt.toLocaleString()} ft`)
      lines.push('')
    }
    lines.push(
      '--- HARDWARE & LABOR ---',
      `Wire connectors: ${totalWireNuts} ea`,
      `Est. pull time: ${pullHours.toFixed(1)} hrs`,
      `Est. labor @ $${inputs.laborRate}/hr: $${laborCost.toFixed(0)}`,
    )
    return lines.join('\n')
  }

  function handleCopy() {
    navigator.clipboard.writeText(getSummaryText()).then(() => {
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 2500)
    })
  }

  function handleSave() {
    const calc: SavedCalculation = {
      id: generateId(),
      type: 'Material Takeoff',
      label: `${inputs.circuits} ckts · #${inputs.wireSize} ${inputs.wireType} · ${inputs.numConductors}-wire`,
      inputs: inputs as unknown as Record<string, unknown>,
      result: `${totalAllConductors.toLocaleString()} ft · $${laborCost.toFixed(0)} labor`,
      timestamp: new Date().toISOString(),
    }
    saveCalculation(calc)
    toast.success('Calculation saved')
  }

  const jobNote = `[MTO] ${inputs.circuits} ckts #${inputs.wireSize} ${inputs.wireType} ${inputs.numConductors}-wire — ${totalAllConductors.toLocaleString()} ft total${useConduit ? `, ${totalConduitFt} ft ${inputs.conduitType} ${conduitSize}"` : ''} — est. $${laborCost.toFixed(0)} labor`

  // ── Styles ─────────────────────────────────────────────────────────────
  const INP  = 'h-12 border border-[#333] bg-[#111] px-3 font-mono text-sm text-[#f0f0f0] focus:border-[#f97316] focus:outline-none w-full'
  const SEL  = 'h-12 border border-[#333] bg-[#111] px-3 font-mono text-sm text-[#f0f0f0] focus:border-[#f97316] focus:outline-none w-full appearance-none'
  const LBL  = 'text-[11px] uppercase tracking-wider text-[#888]'
  const FLD  = 'flex flex-col gap-1'

  const hasResult = inputs.circuits > 0 && inputs.avgRunLength > 0

  return (
    <div className="flex flex-col gap-5">

      {/* ── INPUTS ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">

        {/* Row 1 — Circuits + Avg Run */}
        <div className="flex gap-3">
          <label className={`${FLD} flex-1`}>
            <span className={LBL}>Circuits</span>
            <input
              type="number" min={1} max={500}
              value={inputs.circuits || ''}
              onChange={e => set('circuits', Number(e.target.value))}
              className={INP}
              placeholder="4"
            />
          </label>
          <label className={`${FLD} flex-1`}>
            <span className={LBL}>Avg Run (ft)</span>
            <input
              type="number" min={1}
              value={inputs.avgRunLength || ''}
              onChange={e => set('avgRunLength', Number(e.target.value))}
              className={INP}
              placeholder="50"
            />
          </label>
        </div>

        {/* Row 2 — Wire Size + Wire Type */}
        <div className="flex gap-3">
          <label className={`${FLD} flex-1`}>
            <span className={LBL}>Wire Size</span>
            <select
              value={inputs.wireSize}
              onChange={e => set('wireSize', e.target.value as WireSize)}
              className={SEL}
            >
              {WIRE_SIZES.map(s => (
                <option key={s} value={s}>#{s}</option>
              ))}
            </select>
          </label>
          <label className={`${FLD} flex-1`}>
            <span className={LBL}>Wire Type</span>
            <select
              value={inputs.wireType}
              onChange={e => set('wireType', e.target.value as WireType)}
              className={SEL}
            >
              {WIRE_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Row 3 — Conductors + Conduit Type */}
        <div className="flex gap-3">
          <label className={`${FLD} flex-1`}>
            <span className={LBL}>Conductors</span>
            <select
              value={inputs.numConductors}
              onChange={e => set('numConductors', e.target.value as NumConductors)}
              className={SEL}
            >
              <option value="2">2-wire</option>
              <option value="3">3-wire</option>
              <option value="4">4-wire</option>
            </select>
          </label>
          <label className={`${FLD} flex-1`}>
            <span className={LBL}>Conduit Type</span>
            <select
              value={inputs.conduitType}
              onChange={e => set('conduitType', e.target.value as ConduitType)}
              className={SEL}
            >
              <option value="EMT">EMT</option>
              <option value="RMC">RMC</option>
              <option value="PVC">PVC Sch.40</option>
              <option value="Flex">Flex</option>
              <option value="MC">MC – no conduit</option>
            </select>
          </label>
        </div>

        {/* Conduit Size (only when using conduit) */}
        {useConduit && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className={LBL}>Conduit Size</span>
              <button
                type="button"
                onClick={() => set('conduitSizeAuto', !inputs.conduitSizeAuto)}
                className={`text-[10px] uppercase tracking-wider px-2 py-1 border transition-colors ${
                  inputs.conduitSizeAuto
                    ? 'border-[#f97316]/50 bg-[#f97316]/10 text-[#f97316]'
                    : 'border-[#333] bg-[#1a1a1a] text-[#888]'
                }`}
              >
                {inputs.conduitSizeAuto ? 'AUTO (NEC 40%)' : 'MANUAL'}
              </button>
            </div>
            {inputs.conduitSizeAuto ? (
              <div className="h-12 border border-[#f97316]/30 bg-[#f97316]/5 flex items-center px-3 font-mono text-sm text-[#f97316]">
                {autoConduitSize ? `${autoConduitSize}"` : 'N/A'} — NEC Ch.9 Table 4, 40% fill
              </div>
            ) : (
              <select
                value={inputs.conduitSizeManual}
                onChange={e => set('conduitSizeManual', e.target.value)}
                className={SEL}
              >
                {CONDUIT_SIZES.map(s => (
                  <option key={s} value={s}>{s}"</option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Home Run toggle */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className={LBL}>Include Home Run</span>
            <button
              type="button"
              onClick={() => set('includeHomeRun', !inputs.includeHomeRun)}
              className={`text-[10px] uppercase tracking-wider px-2 py-1 border transition-colors ${
                inputs.includeHomeRun
                  ? 'border-[#f97316]/50 bg-[#f97316]/10 text-[#f97316]'
                  : 'border-[#333] bg-[#1a1a1a] text-[#888]'
              }`}
            >
              {inputs.includeHomeRun ? 'YES' : 'NO'}
            </button>
          </div>
          {inputs.includeHomeRun && (
            <label className={FLD}>
              <span className={LBL}>Home Run Length (ft)</span>
              <input
                type="number" min={0}
                value={inputs.homeRunLength || ''}
                onChange={e => set('homeRunLength', Number(e.target.value))}
                className={INP}
                placeholder="25"
              />
            </label>
          )}
        </div>

        {/* Labor Rate */}
        <label className={FLD}>
          <span className={LBL}>Labor Rate ($/hr)</span>
          <input
            type="number" min={0}
            value={inputs.laborRate || ''}
            onChange={e => set('laborRate', Number(e.target.value))}
            className={INP}
            placeholder="85"
          />
        </label>
      </div>

      {/* ── RESULTS ────────────────────────────────────────────────────── */}
      {hasResult && (
        <>
          {/* Wire Footage card */}
          <div className="border border-[#333] bg-[#111] p-4">
            <div className="mb-3 text-[11px] uppercase tracking-wider text-[#888]">Wire Footage</div>
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#888]">Phase ({phaseCount}× #{inputs.wireSize})</span>
                <span className="font-mono text-[#f0f0f0]">{phaseFootage.toLocaleString()} ft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888]">Neutral (#{inputs.wireSize})</span>
                <span className="font-mono text-[#f0f0f0]">{neutralFootage.toLocaleString()} ft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888]">Ground (#{groundSize} EGC)</span>
                <span className="font-mono text-[#f0f0f0]">{groundFootage.toLocaleString()} ft</span>
              </div>
              <div className="mt-1.5 flex justify-between border-t border-[#222] pt-2">
                <span className="font-medium text-[#ccc]">Total all conductors</span>
                <span className="font-mono font-bold text-[#f97316]">{totalAllConductors.toLocaleString()} ft</span>
              </div>
            </div>
            <CalculatorDisclaimer />
          </div>

          {/* Conduit card */}
          {useConduit && (
            <div className="border border-[#333] bg-[#111] p-4">
              <div className="mb-3 text-[11px] uppercase tracking-wider text-[#888]">Conduit</div>
              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#888]">Type</span>
                  <span className="font-mono text-[#f0f0f0]">{inputs.conduitType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Size (NEC 40% fill)</span>
                  <span className="font-mono text-[#f0f0f0]">{conduitSize}"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Conductors in conduit</span>
                  <span className="font-mono text-[#f0f0f0]">{conductorsInConduit}</span>
                </div>
                <div className="mt-1.5 flex justify-between border-t border-[#222] pt-2">
                  <span className="font-medium text-[#ccc]">Total footage</span>
                  <span className="font-mono font-bold text-[#f97316]">{totalConduitFt.toLocaleString()} ft</span>
                </div>
              </div>
              <CalculatorDisclaimer />
            </div>
          )}

          {/* Hardware + Labor card */}
          <div className="border border-[#333] bg-[#111] p-4">
            <div className="mb-3 text-[11px] uppercase tracking-wider text-[#888]">Hardware & Labor</div>
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#888]">Wire connectors (est.)</span>
                <span className="font-mono text-[#f0f0f0]">{totalWireNuts} ea</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888]">
                  Pull time ({isCableAssembly ? '0.5 hr/100ft' : '1 hr/100ft'})
                </span>
                <span className="font-mono text-[#f0f0f0]">{pullHours.toFixed(1)} hrs</span>
              </div>
              <div className="mt-1.5 flex justify-between border-t border-[#222] pt-2">
                <span className="font-medium text-[#ccc]">Est. labor cost</span>
                <span className="font-mono font-bold text-[#f97316]">${laborCost.toFixed(0)}</span>
              </div>
            </div>
            <CalculatorDisclaimer />
          </div>

          {/* Materials List summary box */}
          <div className="border border-[#f97316]/25 bg-[#f97316]/5 p-4">
            <div className="mb-3 text-[11px] uppercase tracking-wider text-[#f97316]">
              Materials List
            </div>
            <div className="flex flex-col gap-1 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[#888]">#{inputs.wireSize} {inputs.wireType} phase ({phaseCount}×)</span>
                <span className="text-[#f0f0f0] font-bold">{phaseFootage.toLocaleString()} ft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888]">#{inputs.wireSize} {inputs.wireType} neutral</span>
                <span className="text-[#f0f0f0] font-bold">{neutralFootage.toLocaleString()} ft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888]">#{groundSize} bare ground</span>
                <span className="text-[#f0f0f0] font-bold">{groundFootage.toLocaleString()} ft</span>
              </div>
              {useConduit && (
                <div className="flex justify-between">
                  <span className="text-[#888]">{inputs.conduitType} {conduitSize}" conduit</span>
                  <span className="text-[#f0f0f0] font-bold">{totalConduitFt.toLocaleString()} ft</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#888]">Wire connectors</span>
                <span className="text-[#f0f0f0] font-bold">{totalWireNuts} ea</span>
              </div>
              <div className="mt-2 border-t border-[#f97316]/20 pt-2 flex justify-between">
                <span className="text-[#888]">
                  Labor est. ({pullHours.toFixed(1)} hrs @ ${inputs.laborRate}/hr)
                </span>
                <span className="text-[#f97316] font-bold">${laborCost.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 border border-[#f97316]/40 bg-[#f97316]/10 py-3 text-xs font-medium uppercase tracking-wider text-[#f97316] hover:bg-[#f97316]/20 transition-colors"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy Summary'}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 border border-[#333] bg-[#1a1a1a] py-3 text-xs font-medium uppercase tracking-wider text-[#f0f0f0] hover:bg-[#222]"
            >
              <Save className="h-4 w-4" /> Save Calculation
            </button>
            <AttachToJob note={jobNote} />
          </div>
        </>
      )}
    </div>
  )
}

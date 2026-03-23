'use client'

import { useState } from 'react'
import { calculateBoxFill, type BoxFillInputs } from '@/lib/calculations'
import { STANDARD_BOXES, COMMON_WIRE_SIZES } from '@/lib/calculator-data'
import { saveCalculation, generateId, type SavedCalculation } from '@/lib/storage'
import { AttachToJob } from '@/components/tools/attach-to-job'
import { CalculatorDisclaimer } from '@/components/calculator-disclaimer'
import { ShareCard } from '@/components/share-card'
import { useShareCard } from '@/hooks/useShareCard'
import { toast } from 'sonner'
import { Check, X, Save, Plus, Minus, Share2 } from 'lucide-react'

export function BoxFillCalculator({ compact = false }: { compact?: boolean }) {
  const [boxType, setBoxType] = useState('4x2.125-sq')
  const [customVolume, setCustomVolume] = useState(30)
  const [conductors, setConductors] = useState([{ size: '14', count: 4 }])
  const [clamps, setClamps] = useState(1)
  const [supportFittings, setSupportFittings] = useState(0)
  const [devices, setDevices] = useState(1)
  const [equipmentGrounds, setEquipmentGrounds] = useState(2)
  const [largestGroundSize, setLargestGroundSize] = useState('14')

  // Share card functionality
  const { cardRef, shareCard, isGenerating } = useShareCard()

  const inputs: BoxFillInputs = {
    boxType,
    customVolume: boxType === 'custom' ? customVolume : undefined,
    conductors,
    clamps,
    supportFittings,
    devices,
    equipmentGrounds,
    largestGroundSize,
  }

  const result = calculateBoxFill(inputs)

  function addConductorRow() {
    setConductors(p => [...p, { size: '14', count: 1 }])
  }

  function removeConductorRow(idx: number) {
    setConductors(p => p.filter((_, i) => i !== idx))
  }

  function updateConductor(idx: number, key: 'size' | 'count', value: string | number) {
    setConductors(p => p.map((c, i) => i === idx ? { ...c, [key]: value } : c))
  }

  function handleSave() {
    const calc: SavedCalculation = {
      id: generateId(),
      type: 'Box Fill',
      label: `${STANDARD_BOXES[boxType]?.description || 'Custom'} box`,
      inputs: inputs as unknown as Record<string, unknown>,
      result: `${result.totalRequired} / ${result.boxCapacity} cu.in. (${result.pass ? 'PASS' : 'FAIL'})`,
      timestamp: new Date().toISOString(),
    }
    saveCalculation(calc)
    toast.success('Calculation saved')
  }

  // Prepare data for ShareCard
  const shareCardData = result ? {
    calculatorName: 'Box Fill',
    inputs: [
      { label: 'Box Type', value: STANDARD_BOXES[boxType]?.description || 'Custom' },
      { label: 'Box Volume', value: `${result.boxCapacity} cu.in.` },
      { label: 'Conductors', value: `${conductors.reduce((sum, c) => sum + c.count, 0)} total` },
      { label: 'Devices', value: `${devices}` },
      { label: 'Clamps', value: `${clamps}` },
      { label: 'Grounds', value: `${equipmentGrounds}` },
    ],
    results: [
      { label: 'Required Volume', value: `${result.totalRequired} cu.in.`, highlight: true },
      { label: 'Available Volume', value: `${result.boxCapacity} cu.in.` },
      { label: 'Remaining', value: `${result.remainingCapacity} cu.in.` },
      { label: 'NEC Status', value: result.pass ? 'PASS' : 'FAIL' },
    ],
    passFailBadge: result.pass ? 'PASS' : 'FAIL' as 'PASS' | 'FAIL',
  } : null

  return (
    <div className={`flex flex-col ${compact ? 'gap-3' : 'gap-5'}`}>
      {/* Hidden ShareCard for PNG generation */}
      <div className="fixed left-[-9999px] top-[-9999px] overflow-hidden" style={{ width: 540 }}>
        {shareCardData && (
          <ShareCard
            ref={cardRef}
            calculatorName={shareCardData.calculatorName}
            inputs={shareCardData.inputs}
            results={shareCardData.results}
            passFailBadge={shareCardData.passFailBadge}
          />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Box Type</span>
          <select
            value={boxType}
            onChange={e => setBoxType(e.target.value)}
            className="h-12 border border-[#27272a] bg-[#18181b] px-3 text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none"
          >
            {Object.entries(STANDARD_BOXES).map(([key, box]) => (
              <option key={key} value={key}>{box.description} ({box.volume} cu.in.)</option>
            ))}
            <option value="custom">Custom Volume</option>
          </select>
        </label>

        {boxType === 'custom' && (
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Custom Volume (cu.in.)</span>
            <input
              type="number"
              value={customVolume || ''}
              onChange={e => setCustomVolume(Number(e.target.value))}
              className="h-12 border border-[#27272a] bg-[#18181b] px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none"
            />
          </label>
        )}

        {/* Conductors */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Conductors</span>
            <button onClick={addConductorRow} className="flex items-center gap-1 text-xs text-[#f97316] hover:text-[#fb923c]">
              <Plus className="h-3 w-3" /> Add Size
            </button>
          </div>
          {conductors.map((c, i) => (
            <div key={i} className="mb-2 flex items-center gap-2">
              <select
                value={c.size}
                onChange={e => updateConductor(i, 'size', e.target.value)}
                className="h-10 flex-1 border border-[#27272a] bg-[#18181b] px-2 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none"
              >
                {COMMON_WIRE_SIZES.slice(0, 8).map(s => <option key={s} value={s}>#{s}</option>)}
              </select>
              <input
                type="number"
                value={c.count || ''}
                onChange={e => updateConductor(i, 'count', Number(e.target.value))}
                min={0}
                placeholder="Qty"
                className="h-10 w-16 border border-[#27272a] bg-[#18181b] px-2 text-center font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none"
              />
              {conductors.length > 1 && (
                <button onClick={() => removeConductorRow(i)} className="text-[#71717a] hover:text-[#ef4444]">
                  <Minus className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Other fills */}
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Clamps</span>
            <input
              type="number"
              value={clamps}
              onChange={e => setClamps(Number(e.target.value))}
              min={0}
              className="h-10 border border-[#27272a] bg-[#18181b] px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Devices</span>
            <input
              type="number"
              value={devices}
              onChange={e => setDevices(Number(e.target.value))}
              min={0}
              className="h-10 border border-[#27272a] bg-[#18181b] px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Support Fittings</span>
            <input
              type="number"
              value={supportFittings}
              onChange={e => setSupportFittings(Number(e.target.value))}
              min={0}
              className="h-10 border border-[#27272a] bg-[#18181b] px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">EGC Count</span>
            <input
              type="number"
              value={equipmentGrounds}
              onChange={e => setEquipmentGrounds(Number(e.target.value))}
              min={0}
              className="h-10 border border-[#27272a] bg-[#18181b] px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Largest Ground Size</span>
          <select
            value={largestGroundSize}
            onChange={e => setLargestGroundSize(e.target.value)}
            className="h-10 border border-[#27272a] bg-[#18181b] px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none"
          >
            {COMMON_WIRE_SIZES.slice(0, 8).map(s => <option key={s} value={s}>#{s}</option>)}
          </select>
        </label>
      </div>

      {/* Results */}
      <div className="border border-[#27272a] bg-[#18181b] p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Box Fill Result</span>
          <span className={`flex items-center gap-1.5 border px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
            result.pass
              ? 'border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]'
              : 'border-[#ef4444]/30 bg-[#ef4444]/10 text-[#ef4444]'
          }`}>
            {result.pass ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            {result.pass ? 'PASS' : 'FAIL'}
          </span>
        </div>

        <div className="mb-3 flex items-baseline gap-2">
          <span className="font-mono text-2xl font-bold text-[#f97316]">{result.totalRequired}</span>
          <span className="text-sm text-[#a1a1aa]">of {result.boxCapacity} cu.in.</span>
        </div>

        {/* Volume fill bar */}
        <div className="mb-3 h-3 w-full border border-[#27272a] bg-[#0a0b0d]">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${Math.min((result.totalRequired / result.boxCapacity) * 100, 100)}%`,
              backgroundColor: result.pass ? '#f97316' : '#ef4444',
            }}
          />
        </div>

        <div className="flex flex-col gap-1 text-xs">
          <div className="flex justify-between"><span className="text-[#a1a1aa]">Conductors</span><span className="font-mono text-[#fafafa]">{result.conductorVolume} cu.in.</span></div>
          <div className="flex justify-between"><span className="text-[#a1a1aa]">Clamps</span><span className="font-mono text-[#fafafa]">{result.clampVolume} cu.in.</span></div>
          <div className="flex justify-between"><span className="text-[#a1a1aa]">Devices</span><span className="font-mono text-[#fafafa]">{result.deviceVolume} cu.in.</span></div>
          <div className="flex justify-between"><span className="text-[#a1a1aa]">Grounds</span><span className="font-mono text-[#fafafa]">{result.groundVolume} cu.in.</span></div>
          <div className="flex justify-between"><span className="text-[#a1a1aa]">Remaining</span><span className={`font-mono ${result.remainingVolume >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>{result.remainingVolume} cu.in.</span></div>
        </div>
        <CalculatorDisclaimer />
      </div>

      {!compact && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex flex-1 items-center justify-center gap-2 border border-[#27272a] bg-[#1a1a1a] py-3 text-xs font-medium uppercase tracking-wider text-[#fafafa] hover:bg-[#18181b]">
              <Save className="h-4 w-4" /> Save
            </button>
            <button
              onClick={() => shareCard(`box-fill-${result.totalRequired}-${result.boxCapacity}-${result.pass ? 'pass' : 'fail'}`)}
              disabled={isGenerating || !shareCardData}
              className="flex flex-1 items-center justify-center gap-2 border border-[#27272a] bg-[#1a1a1a] py-3 text-xs font-medium uppercase tracking-wider text-[#fafafa] hover:bg-[#18181b] disabled:opacity-50"
            >
              <Share2 className="h-4 w-4" /> {isGenerating ? 'Generating...' : 'Share'}
            </button>
          </div>
          <AttachToJob note={`[Box Fill] ${STANDARD_BOXES[boxType]?.description || 'Custom'}: ${result.totalRequired} / ${result.boxCapacity} cu.in. (${result.pass ? 'PASS' : 'FAIL'})`} />
        </div>
      )}
    </div>
  )
}

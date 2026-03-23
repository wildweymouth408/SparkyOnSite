'use client'

import { useState } from 'react'
import { calculateVoltageDrop, type VoltageDropInputs } from '@/lib/calculations'
import { WIRE_SIZES, SYSTEM_VOLTAGES } from '@/lib/calculator-data'
import { saveCalculation, generateId, type SavedCalculation } from '@/lib/storage'
import { AttachToJob } from '@/components/tools/attach-to-job'
import { CalculatorDisclaimer } from '@/components/calculator-disclaimer'
import { ShareCard } from '@/components/share-card'
import { useShareCard } from '@/hooks/useShareCard'
import { toast } from 'sonner'
import { Check, X, Save, Share2 } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export function VoltageDropCalculator() {
  const [inputs, setInputs] = useState<VoltageDropInputs>({
    systemVoltage: 120,
    current: 20,
    distance: 100,
    wireSize: '12',
    material: 'copper',
    phase: 'single',
  })

  const [currentMode, setCurrentMode] = useState<'load' | 'circuit'>('load')
  const displayedValue = currentMode === 'load' 
    ? inputs.current 
    : Math.round(inputs.current / 0.8 * 100) / 100

  // Share card functionality
  const { cardRef, shareCard, isGenerating } = useShareCard()

  const handleDisplayedCurrentChange = (value: number) => {
    if (currentMode === 'load') {
      setInputs(p => ({ ...p, current: value }))
    } else {
      const loadAmps = value * 0.8
      setInputs(p => ({ ...p, current: Math.round(loadAmps * 100) / 100 }))
    }
  }

  const currentLabel = currentMode === 'load' ? 'Load (A)' : 'Circuit (A)'
  const currentHelperText = currentMode === 'load' 
    ? 'Actual load current' 
    : 'Circuit size × 0.8 (80% rule for continuous loads per NEC 210.20(A))'

  // Input validation — NEC calculations are meaningless with negative or zero values
  const currentError = inputs.current <= 0 ? 'Current must be greater than 0A' : inputs.current > 6000 ? 'Exceeds 6000A maximum' : null
  const distanceError = inputs.distance <= 0 ? 'Distance must be greater than 0 ft' : inputs.distance > 10000 ? 'Exceeds 10,000 ft maximum' : null
  const hasErrors = currentError !== null || distanceError !== null
  const hasResult = !hasErrors && inputs.current > 0 && inputs.distance > 0

  const result = hasResult ? calculateVoltageDrop(inputs) : null

  function handleSave() {
    if (!result) return
    const calc: SavedCalculation = {
      id: generateId(),
      type: 'Voltage Drop',
      label: `${inputs.systemVoltage}V ${inputs.current}A ${inputs.distance}ft #${inputs.wireSize} ${inputs.material}`,
      inputs: inputs as unknown as Record<string, unknown>,
      result: `${result.dropPercent}% (${result.pass ? 'PASS' : 'FAIL'})`,
      timestamp: new Date().toISOString(),
    }
    saveCalculation(calc)
    toast.success('Calculation saved')
  }

  const jobNote = result
    ? `[Voltage Drop] ${inputs.systemVoltage}V, ${inputs.current}A, ${inputs.distance}ft, #${inputs.wireSize} ${inputs.material === 'copper' ? 'Cu' : 'Al'} = ${result.voltageDrop}V / ${result.dropPercent}% (${result.pass ? 'PASS' : 'FAIL'})`
    : ''

  // Prepare data for ShareCard
  const shareCardData = result ? {
    calculatorName: 'Voltage Drop',
    inputs: [
      { label: 'Voltage', value: `${inputs.systemVoltage}V` },
      { label: 'Current', value: `${inputs.current}A` },
      { label: 'Distance', value: `${inputs.distance} ft` },
      { label: 'Wire Size', value: `#${inputs.wireSize} AWG` },
      { label: 'Material', value: inputs.material === 'copper' ? 'Copper' : 'Aluminum' },
      { label: 'Phase', value: inputs.phase === 'single' ? '1-Phase' : '3-Phase' },
    ],
    results: [
      { label: 'Voltage Drop', value: `${result.voltageDrop}V`, highlight: true },
      { label: 'Drop Percentage', value: `${result.dropPercent}%` },
      { label: 'NEC Status', value: result.pass ? 'PASS' : 'FAIL' },
    ],
    passFailBadge: result.pass ? 'PASS' : 'FAIL' as 'PASS' | 'FAIL',
  } : null

  return (
    <div className="flex flex-col gap-5">
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

      {/* Animated wire SVG */}
      <div className="relative h-12 w-full overflow-hidden">
        <svg viewBox="0 0 400 48" className="h-full w-full" preserveAspectRatio="none">
          <line x1="0" y1="24" x2="400" y2="24" stroke="#27272a" strokeWidth="2" />
          <line
            x1="0" y1="24" x2="400" y2="24"
            stroke="#f97316"
            strokeWidth="2"
            strokeDasharray="4 8"
            style={{ animation: 'electron-flow 0.8s linear infinite' }}
          />
          {hasResult && result && (
            <text x="200" y="14" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="var(--font-mono)">
              {result.voltageDrop}V drop over {inputs.distance}ft
            </text>
          )}
        </svg>
      </div>

      {/* Inputs */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Voltage</span>
            <select
              value={inputs.systemVoltage}
              onChange={e => setInputs(p => ({ ...p, systemVoltage: Number(e.target.value) }))}
              className="h-12 border border-[#27272a] bg-[#18181b] px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none"
            >
              {SYSTEM_VOLTAGES.map(v => <option key={v} value={v}>{v}V</option>)}
            </select>
          </label>
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Phase</span>
            <select
              value={inputs.phase}
              onChange={e => setInputs(p => ({ ...p, phase: e.target.value as 'single' | 'three' }))}
              className="h-12 border border-[#27272a] bg-[#18181b] px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none"
            >
              <option value="single">1-Phase</option>
              <option value="three">3-Phase</option>
            </select>
          </label>
        </div>

        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">{currentLabel}</span>
              <ToggleGroup
                type="single"
                value={currentMode}
                onValueChange={(value) => value && setCurrentMode(value as 'load' | 'circuit')}
                className="h-6"
                variant="outline"
                disableDeactivation
              >
                <ToggleGroupItem value="load" className="px-2 py-0.5 text-[10px] h-6">Load</ToggleGroupItem>
                <ToggleGroupItem value="circuit" className="px-2 py-0.5 text-[10px] h-6">Circuit</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <input
              type="number"
              value={displayedValue || ''}
              min={0.1}
              max={currentMode === 'load' ? 6000 : 7500}
              onChange={e => handleDisplayedCurrentChange(Number(e.target.value))}
              placeholder={currentMode === 'load' ? '20' : '25'}
              className={`h-12 border bg-[#18181b] px-3 font-mono text-sm text-[#fafafa] focus:outline-none ${currentError ? 'border-red-500 focus:border-red-500' : 'border-[#27272a] focus:border-[#f97316]'}`}
            />
            <div className="flex flex-col gap-0.5">
              {!currentError && (
                <span className="text-[10px] text-[#a1a1aa]">{currentHelperText}</span>
              )}
              {currentError && <span className="text-[10px] text-red-400">{currentError}</span>}
            </div>
          </label>
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Distance (ft)</span>
            <input
              type="number"
              value={inputs.distance || ''}
              min={1}
              max={10000}
              onChange={e => setInputs(p => ({ ...p, distance: Number(e.target.value) }))}
              placeholder="100"
              className={`h-12 border bg-[#18181b] px-3 font-mono text-sm text-[#fafafa] focus:outline-none ${distanceError ? 'border-red-500 focus:border-red-500' : 'border-[#27272a] focus:border-[#f97316]'}`}
            />
            {distanceError && <span className="text-[10px] text-red-400">{distanceError}</span>}
          </label>
        </div>

        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Wire Size</span>
            <select
              value={inputs.wireSize}
              onChange={e => setInputs(p => ({ ...p, wireSize: e.target.value }))}
              className="h-12 border border-[#27272a] bg-[#18181b] px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none"
            >
              {WIRE_SIZES.map(s => <option key={s} value={s}>#{s} AWG</option>)}
            </select>
          </label>
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Material</span>
            <select
              value={inputs.material}
              onChange={e => setInputs(p => ({ ...p, material: e.target.value as 'copper' | 'aluminum' }))}
              className="h-12 border border-[#27272a] bg-[#18181b] px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none"
            >
              <option value="copper">Copper</option>
              <option value="aluminum">Aluminum</option>
            </select>
          </label>
        </div>
      </div>

      {/* Results */}
      {hasResult && result && (
        <div className="border border-[#27272a] bg-[#18181b] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Result</span>
            <span className={`flex items-center gap-1.5 border px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
              result.pass
                ? 'border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]'
                : 'border-[#ef4444]/30 bg-[#ef4444]/10 text-[#ef4444]'
            }`}>
              {result.pass ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              {result.pass ? 'PASS' : 'FAIL'}
            </span>
          </div>

          <div className="mb-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-[#f97316]">{result.dropPercent}%</span>
            <span className="text-sm text-[#a1a1aa]">voltage drop</span>
          </div>
          <div className="mb-3 flex items-baseline gap-2">
            <span className="font-mono text-xl text-[#fafafa]">{result.voltageDrop}V</span>
            <span className="text-sm text-[#a1a1aa]">of {inputs.systemVoltage}V</span>
          </div>
          <p className="text-xs text-[#a1a1aa]">{result.recommendation}</p>
          {/* NEC citation — NEC 215.2(A)(1)(b): 3% max for branch/feeder; 5% max total */}
          <p className="text-[10px] text-[#71717a] mt-2">NEC 215.2(A)(1)(b) · NEC 310.15 · Formula: VD = ({inputs.phase === 'three' ? '√3' : '2'} × K × I × D) / CM</p>
          <CalculatorDisclaimer />
        </div>
      )}

      {/* Actions */}
      {hasResult && result && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex flex-1 items-center justify-center gap-2 border border-[#27272a] bg-[#1a1a1a] py-3 text-xs font-medium uppercase tracking-wider text-[#fafafa] transition-colors hover:bg-[#18181b]"
            >
              <Save className="h-4 w-4" /> Save
            </button>
            <button
              onClick={() => shareCard(`voltage-drop-${inputs.systemVoltage}v-${inputs.current}a-${inputs.distance}ft`)}
              disabled={isGenerating || !shareCardData}
              className="flex flex-1 items-center justify-center gap-2 border border-[#27272a] bg-[#1a1a1a] py-3 text-xs font-medium uppercase tracking-wider text-[#fafafa] transition-colors hover:bg-[#18181b] disabled:opacity-50"
            >
              <Share2 className="h-4 w-4" /> {isGenerating ? 'Generating...' : 'Share'}
            </button>
          </div>
          <AttachToJob note={jobNote} />
        </div>
      )}
    </div>
  )
}

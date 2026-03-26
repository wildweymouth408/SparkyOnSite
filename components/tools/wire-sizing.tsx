'use client'

import { useState } from 'react'
import { calculateWireSizing, type WireSizingInputs } from '@/lib/calculations'
import { SYSTEM_VOLTAGES, INSULATION_TYPES } from '@/lib/calculator-data'
import { saveCalculation, generateId, type SavedCalculation } from '@/lib/storage'
import { AttachToJob } from '@/components/tools/attach-to-job'
import { CalculatorDisclaimer } from '@/components/calculator-disclaimer'
import { ShareCard } from '@/components/share-card'
import { useShareCard } from '@/hooks/useShareCard'
import { toast } from 'sonner'
import { Check, X, Save, AlertTriangle, Share2 } from 'lucide-react'

export function WireSizingCalculator({ compact = false }: { compact?: boolean }) {
  const [inputs, setInputs] = useState<WireSizingInputs>({
    loadAmps: 20,
    distance: 100,
    systemVoltage: 120,
    material: 'copper',
    insulationType: 'THHN',
    maxDropPercent: 3,
    ambientTemp: 30,
    conductorsInRaceway: 3,
  })

  const { cardRef, shareCard, isGenerating } = useShareCard()

  const loadError = inputs.loadAmps <= 0 ? 'Load must be greater than 0A' : inputs.loadAmps > 6000 ? 'Exceeds 6000A maximum' : null
  const distanceError = inputs.distance <= 0 ? 'Distance must be greater than 0 ft' : inputs.distance > 10000 ? 'Exceeds 10,000 ft maximum' : null
  const ambientError = inputs.ambientTemp < -50 || inputs.ambientTemp > 150 ? 'Temperature out of range (-50°C to 150°C)' : null
  const conductorsError = inputs.conductorsInRaceway < 1 ? 'At least 1 conductor required' : inputs.conductorsInRaceway > 100 ? 'Exceeds 100 conductors' : null
  const hasErrors = loadError !== null || distanceError !== null || ambientError !== null || conductorsError !== null

  const result = hasErrors ? null : calculateWireSizing(inputs)
  const voltageDropExceedsRecommendation = result && result.dropPercent > inputs.maxDropPercent

  function handleSave() {
    if (!result) return
    const calc: SavedCalculation = {
      id: generateId(),
      type: 'Wire Sizing',
      label: `${inputs.loadAmps}A ${inputs.distance}ft ${inputs.systemVoltage}V`,
      inputs: inputs as unknown as Record<string, unknown>,
      result: `#${result.recommendedSize} (${result.dropPercent}%)`,
      timestamp: new Date().toISOString(),
    }
    saveCalculation(calc)
    toast.success('Calculation saved')
  }

  const shareCardData = result ? {
    calculatorName: 'Wire Sizing',
    inputs: [
      { label: 'Load', value: `${inputs.loadAmps}A` },
      { label: 'Distance', value: `${inputs.distance} ft` },
      { label: 'Voltage', value: `${inputs.systemVoltage}V` },
      { label: 'Material', value: inputs.material === 'copper' ? 'Copper' : 'Aluminum' },
      { label: 'Insulation', value: inputs.insulationType },
      { label: 'Max Drop', value: `${inputs.maxDropPercent}%` },
    ],
    results: [
      { label: 'Recommended Size', value: `#${result.recommendedSize} AWG`, highlight: true },
      { label: 'Voltage Drop', value: `${result.dropPercent}%` },
      { label: 'Ampacity', value: `${result.ampacity}A` },
      { label: 'NEC Status', value: result.pass ? 'PASS' : 'FAIL' },
    ],
    passFailBadge: result.pass ? 'PASS' : 'FAIL' as 'PASS' | 'FAIL',
  } : null

  const inp = (err: string | null) =>
    `h-12 border bg-[#18181b] rounded-lg px-3 font-mono text-sm text-[#fafafa] focus:outline-none focus:ring-1 focus:ring-orange-500/20 ${err ? 'border-[#ef4444]' : 'border-[#27272a] focus:border-[#f97316]'}`
  const sel = 'h-12 border border-[#27272a] bg-[#18181b] rounded-lg px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-orange-500/20'
  const lbl = 'text-[11px] uppercase tracking-wider text-[#a1a1aa]'

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
        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1">
            <span className={lbl}>Load (A)</span>
            <input
              type="number"
              value={inputs.loadAmps || ''}
              min={0.1}
              max={6000}
              onChange={e => setInputs(p => ({ ...p, loadAmps: Number(e.target.value) }))}
              className={inp(loadError)}
            />
            {loadError && <span className="text-[10px] text-[#ef4444] mt-1">{loadError}</span>}
          </label>
          <label className="flex flex-1 flex-col gap-1">
            <span className={lbl}>Distance (ft)</span>
            <input
              type="number"
              value={inputs.distance || ''}
              min={1}
              max={10000}
              onChange={e => setInputs(p => ({ ...p, distance: Number(e.target.value) }))}
              className={inp(distanceError)}
            />
            {distanceError && <span className="text-[10px] text-[#ef4444] mt-1">{distanceError}</span>}
          </label>
        </div>

        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1">
            <span className={lbl}>Voltage</span>
            <select
              value={inputs.systemVoltage}
              onChange={e => setInputs(p => ({ ...p, systemVoltage: Number(e.target.value) }))}
              className={sel}
            >
              {SYSTEM_VOLTAGES.map(v => <option key={v} value={v}>{v}V</option>)}
            </select>
          </label>
          <label className="flex flex-1 flex-col gap-1">
            <span className={lbl}>Material</span>
            <select
              value={inputs.material}
              onChange={e => setInputs(p => ({ ...p, material: e.target.value as 'copper' | 'aluminum' }))}
              className={sel}
            >
              <option value="copper">Copper</option>
              <option value="aluminum">Aluminum</option>
            </select>
          </label>
        </div>

        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1">
            <span className={lbl}>Insulation</span>
            <select
              value={inputs.insulationType}
              onChange={e => setInputs(p => ({ ...p, insulationType: e.target.value }))}
              className={sel}
            >
              {INSULATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="flex flex-1 flex-col gap-1">
            <span className={lbl}>Max Drop %</span>
            <select
              value={inputs.maxDropPercent}
              onChange={e => setInputs(p => ({ ...p, maxDropPercent: Number(e.target.value) }))}
              className={sel}
            >
              <option value={3}>3% (Branch)</option>
              <option value={5}>5% (Total)</option>
            </select>
          </label>
        </div>

        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1">
            <span className={lbl}>Ambient Temp (°C)</span>
            <input
              type="number"
              value={inputs.ambientTemp ?? 30}
              min={-50}
              max={150}
              onChange={e => setInputs(p => ({ ...p, ambientTemp: Number(e.target.value) }))}
              className={inp(ambientError)}
            />
            {ambientError && <span className="text-[10px] text-[#ef4444] mt-1">{ambientError}</span>}
          </label>
          <label className="flex flex-1 flex-col gap-1">
            <span className={lbl}>Conductors in Raceway</span>
            <input
              type="number"
              value={inputs.conductorsInRaceway ?? 3}
              min={1}
              max={100}
              onChange={e => setInputs(p => ({ ...p, conductorsInRaceway: Number(e.target.value) }))}
              className={inp(conductorsError)}
            />
            {conductorsError && <span className="text-[10px] text-[#ef4444] mt-1">{conductorsError}</span>}
          </label>
        </div>
      </div>

      {result && (
        <div className="border border-[#27272a] bg-[#18181b] p-4 rounded-xl">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Recommended Wire</span>
            <div className="flex items-center gap-2">
              {voltageDropExceedsRecommendation && (
                <span className="flex items-center gap-1.5 border border-[#fbbf24]/30 bg-[#fbbf24]/10 px-2 py-0.5 text-xs font-medium text-[#fbbf24]">
                  <AlertTriangle className="h-3 w-3" />
                  Voltage Drop
                </span>
              )}
              <span className={`flex items-center gap-1.5 border px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
                result.pass
                  ? 'border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]'
                  : 'border-[#ef4444]/30 bg-[#ef4444]/10 text-[#ef4444]'
              }`}>
                {result.pass ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                {result.pass ? 'NEC Compliant' : 'Check Requirements'}
              </span>
            </div>
          </div>

          <div className="mb-4 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-[#f97316]">#{result.recommendedSize}</span>
            <span className="text-sm text-[#a1a1aa]">AWG</span>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between bg-[#0a0b0e] p-3">
              <span className="text-[#a1a1aa]">Ampacity</span>
              <span className="font-mono font-medium text-[#fafafa]">{result.ampacity}A</span>
            </div>
            <div className="flex justify-between bg-[#0a0b0e] p-3">
              <div className="flex flex-col">
                <span className="text-[#a1a1aa]">Voltage drop</span>
                {voltageDropExceedsRecommendation && (
                  <span className="text-xs text-[#fbbf24] mt-0.5">
                    Exceeds {inputs.maxDropPercent}% recommendation
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="font-mono font-medium text-[#fafafa]">{result.voltageDrop}V</span>
                <div className={`font-mono text-xs ${voltageDropExceedsRecommendation ? 'text-[#fbbf24]' : 'text-[#a1a1aa]'}`}>
                  ({result.dropPercent}%)
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#27272a]">
            <p className="text-[11px] text-[#a1a1aa]">
              NEC 310.16 (ampacity) · NEC 240.4(D) (OCPD limit) · NEC 215.2(A)(1)(b) (voltage drop recommendation)
            </p>
            <CalculatorDisclaimer />
          </div>
        </div>
      )}

      {result && !compact && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex flex-1 items-center justify-center gap-2 border border-[#27272a] bg-[#1a1a1a] py-3 rounded-lg text-xs font-medium uppercase tracking-wider text-[#fafafa] hover:bg-[#18181b]"
            >
              <Save className="h-4 w-4" /> Save
            </button>
            <button
              onClick={() => shareCard(`wire-sizing-${inputs.loadAmps}a-${inputs.distance}ft-${result.recommendedSize}awg`)}
              disabled={isGenerating || !shareCardData}
              className="flex flex-1 items-center justify-center gap-2 border border-[#27272a] bg-[#1a1a1a] py-3 rounded-lg text-xs font-medium uppercase tracking-wider text-[#fafafa] hover:bg-[#18181b] disabled:opacity-50"
            >
              <Share2 className="h-4 w-4" /> {isGenerating ? 'Generating...' : 'Share'}
            </button>
          </div>
          <AttachToJob note={`[Wire Sizing] ${inputs.loadAmps}A, ${inputs.distance}ft, ${inputs.systemVoltage}V = #${result.recommendedSize} AWG (${result.dropPercent}% drop)`} />
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { calculateAmpacity, type AmpacityInputs } from '@/lib/calculations'
import { COMMON_WIRE_SIZES, INSULATION_TYPES } from '@/lib/calculator-data'
import { saveCalculation, generateId, type SavedCalculation } from '@/lib/storage'
import { AttachToJob } from '@/components/tools/attach-to-job'
import { CalculatorDisclaimer } from '@/components/calculator-disclaimer'
import { ShareCard } from '@/components/share-card'
import { useShareCard } from '@/hooks/useShareCard'
import { toast } from 'sonner'
import { Save, Share2 } from 'lucide-react'

export function AmpacityCalculator({ compact = false }: { compact?: boolean }) {
  const [inputs, setInputs] = useState<AmpacityInputs>({
    wireSize: '12',
    insulationType: 'THHN',
    material: 'copper',
    ambientTemp: 30,
    conductorsInRaceway: 3,
  })

  // Share card functionality
  const { cardRef, shareCard, isGenerating } = useShareCard()

  const result = calculateAmpacity(inputs)

  function handleSave() {
    if (!result) return
    const calc: SavedCalculation = {
      id: generateId(),
      type: 'Ampacity',
      label: `#${inputs.wireSize} ${inputs.insulationType} ${inputs.material}`,
      inputs: inputs as unknown as Record<string, unknown>,
      result: `${result.correctedAmpacity}A (corrected)`,
      timestamp: new Date().toISOString(),
    }
    saveCalculation(calc)
    toast.success('Calculation saved')
  }

  // Prepare data for ShareCard
  const shareCardData = result ? {
    calculatorName: 'Ampacity',
    inputs: [
      { label: 'Wire Size', value: `#${inputs.wireSize} AWG` },
      { label: 'Insulation', value: inputs.insulationType },
      { label: 'Material', value: inputs.material === 'copper' ? 'Copper' : 'Aluminum' },
      { label: 'Ambient Temp', value: `${inputs.ambientTemp}°C` },
      { label: 'Conductors', value: `${inputs.conductorsInRaceway} in raceway` },
    ],
    results: [
      { label: 'Corrected Ampacity', value: `${result.correctedAmpacity}A`, highlight: true },
      { label: 'Base Ampacity', value: `${result.baseAmpacity}A` },
      { label: 'Temp Correction', value: `${result.tempCorrectionFactor}` },
      { label: 'Conduit Derating', value: `${result.conduitDeratingFactor}` },
    ],
    passFailBadge: null,
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
        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Wire Size</span>
            <select
              value={inputs.wireSize}
              onChange={e => setInputs(p => ({ ...p, wireSize: e.target.value }))}
              className="h-12 rounded-lg border border-input bg-card px-4 font-mono text-sm text-card-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring/50 hover:border-primary/50"
            >
              {COMMON_WIRE_SIZES.map(s => <option key={s} value={s}>#{s}</option>)}
            </select>
          </label>
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Insulation</span>
            <select
              value={inputs.insulationType}
              onChange={e => setInputs(p => ({ ...p, insulationType: e.target.value }))}
              className="h-12 rounded-lg border border-input bg-card px-4 font-mono text-sm text-card-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring/50 hover:border-primary/50"
            >
              {INSULATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
        </div>

        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Material</span>
            <select
              value={inputs.material}
              onChange={e => setInputs(p => ({ ...p, material: e.target.value as 'copper' | 'aluminum' }))}
              className="h-12 rounded-lg border border-input bg-card px-4 font-mono text-sm text-card-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring/50 hover:border-primary/50"
            >
              <option value="copper">Copper</option>
              <option value="aluminum">Aluminum</option>
            </select>
          </label>
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Ambient Temp (°C)</span>
            <input
              type="number"
              value={inputs.ambientTemp || ''}
              onChange={e => setInputs(p => ({ ...p, ambientTemp: Number(e.target.value) }))}
              className="h-12 rounded-lg border border-input bg-card px-4 font-mono text-sm text-card-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring/50 hover:border-primary/50"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Conductors in Raceway</span>
          <input
            type="number"
            value={inputs.conductorsInRaceway || ''}
            onChange={e => setInputs(p => ({ ...p, conductorsInRaceway: Number(e.target.value) }))}
            min={1}
            className="h-12 rounded-lg border border-input bg-card px-4 font-mono text-sm text-card-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring/50 hover:border-primary/50"
          />
        </label>
      </div>

      {result && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Ampacity Result</span>
          </div>

          <div className="mb-4 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-primary">{result.correctedAmpacity}A</span>
            <span className="text-sm text-muted-foreground">corrected</span>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between rounded-lg bg-muted/30 p-3">
              <span className="text-muted-foreground">Base ampacity ({result.tempRating}°C)</span>
              <span className="font-mono font-medium text-card-foreground">{result.baseAmpacity}A</span>
            </div>
            <div className="flex justify-between rounded-lg bg-muted/30 p-3">
              <span className="text-muted-foreground">Temp correction</span>
              <span className="font-mono font-medium text-card-foreground">×{result.tempCorrectionFactor}</span>
            </div>
            <div className="flex justify-between rounded-lg bg-muted/30 p-3">
              <span className="text-muted-foreground">Conduit derating</span>
              <span className="font-mono font-medium text-card-foreground">×{result.conduitDerating}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <CalculatorDisclaimer />
          </div>
        </div>
      )}

      {result && !compact && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <button 
              onClick={handleSave} 
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-input bg-secondary py-3.5 text-sm font-medium text-secondary-foreground transition-all hover:bg-secondary/80 hover:border-primary/30 active:scale-[0.98]"
            >
              <Save className="h-4 w-4" /> Save
            </button>
            <button
              onClick={() => shareCard(`ampacity-${inputs.wireSize}awg-${result.correctedAmpacity}a`)}
              disabled={isGenerating || !shareCardData}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-input bg-secondary py-3.5 text-sm font-medium text-secondary-foreground transition-all hover:bg-secondary/80 hover:border-primary/30 active:scale-[0.98] disabled:opacity-50"
            >
              <Share2 className="h-4 w-4" /> {isGenerating ? 'Generating...' : 'Share'}
            </button>
          </div>
          <AttachToJob note={`[Ampacity] #${inputs.wireSize} ${inputs.insulationType} ${inputs.material} = ${result.correctedAmpacity}A corrected (${result.baseAmpacity}A base)`} />
        </div>
      )}
    </div>
  )
}
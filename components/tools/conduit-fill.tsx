'use client'

import { useState } from 'react'
import { calculateConduitFill, type ConduitFillInputs } from '@/lib/calculations'
import { CONDUIT_TYPES, CONDUIT_TRADE_SIZES, INSULATION_TYPES, COMMON_WIRE_SIZES } from '@/lib/calculator-data'
import { saveCalculation, generateId, type SavedCalculation } from '@/lib/storage'
import { AttachToJob } from '@/components/tools/attach-to-job'
import { CalculatorDisclaimer } from '@/components/calculator-disclaimer'
import { ShareCard } from '@/components/share-card'
import { useShareCard } from '@/hooks/useShareCard'
import { toast } from 'sonner'
import { Check, X, Save, Share2 } from 'lucide-react'

export function ConduitFillCalculator() {
  const [inputs, setInputs] = useState<ConduitFillInputs>({
    conduitType: 'EMT',
    tradeSize: '3/4',
    wireType: 'THHN',
    wireSize: '12',
    wireCount: 3,
  })

  // Share card functionality
  const { cardRef, shareCard, isGenerating } = useShareCard()

  const result = calculateConduitFill(inputs)
  const hasResult = inputs.wireCount > 0

  function handleSave() {
    const calc: SavedCalculation = {
      id: generateId(),
      type: 'Conduit Fill',
      label: `${inputs.conduitType} ${inputs.tradeSize}" ${inputs.wireCount}x #${inputs.wireSize} ${inputs.wireType}`,
      inputs: inputs as unknown as Record<string, unknown>,
      result: `${result.fillPercent}% (${result.pass ? 'PASS' : 'FAIL'})`,
      timestamp: new Date().toISOString(),
    }
    saveCalculation(calc)
    toast.success('Calculation saved')
  }

  const jobNote = `[Conduit Fill] ${inputs.conduitType} ${inputs.tradeSize}", ${inputs.wireCount}x #${inputs.wireSize} ${inputs.wireType} = ${result.fillPercent}% fill (${result.pass ? 'PASS' : 'FAIL'})`

  // Prepare data for ShareCard
  const shareCardData = hasResult && result.totalWireArea > 0 ? {
    calculatorName: 'Conduit Fill',
    inputs: [
      { label: 'Conduit Type', value: inputs.conduitType },
      { label: 'Trade Size', value: `${inputs.tradeSize}"` },
      { label: 'Wire Type', value: inputs.wireType },
      { label: 'Wire Size', value: `#${inputs.wireSize} AWG` },
      { label: 'Wire Count', value: `${inputs.wireCount} conductors` },
    ],
    results: [
      { label: 'Fill Percentage', value: `${result.fillPercent}%`, highlight: true },
      { label: 'Total Wire Area', value: `${result.totalWireArea} sq.in.` },
      { label: 'Allowable Area', value: `${result.allowableArea} sq.in.` },
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

      {/* Visual conduit fill bar */}
      {hasResult && (
        <div className="relative h-16 border border-[#27272a] bg-[#18181b]">
          <div
            className="absolute inset-y-0 left-0 transition-all duration-500"
            style={{
              width: `${Math.min(result.fillPercent / (result.fillLimit || 40) * 100, 100)}%`,
              backgroundColor: result.pass ? '#f97316' : '#ef4444',
              opacity: 0.3,
            }}
          />
          <div className="relative flex h-full items-center justify-center">
            <span className="font-mono text-2xl font-bold text-[#fafafa]">{result.fillPercent}%</span>
            <span className="ml-2 text-xs text-[#a1a1aa]">of {result.fillLimit}% limit</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Conduit Type</span>
            <select
              value={inputs.conduitType}
              onChange={e => setInputs(p => ({ ...p, conduitType: e.target.value as typeof inputs.conduitType }))}
              className="h-12 border border-[#27272a] bg-[#18181b] rounded-lg px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-orange-500/20"
            >
              {CONDUIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Trade Size</span>
            <select
              value={inputs.tradeSize}
              onChange={e => setInputs(p => ({ ...p, tradeSize: e.target.value }))}
              className="h-12 border border-[#27272a] bg-[#18181b] rounded-lg px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-orange-500/20"
            >
              {CONDUIT_TRADE_SIZES.map(s => <option key={s} value={s}>{s}"</option>)}
            </select>
          </label>
        </div>

        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Wire Type</span>
            <select
              value={inputs.wireType}
              onChange={e => setInputs(p => ({ ...p, wireType: e.target.value }))}
              className="h-12 border border-[#27272a] bg-[#18181b] rounded-lg px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-orange-500/20"
            >
              {INSULATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Wire Size</span>
            <select
              value={inputs.wireSize}
              onChange={e => setInputs(p => ({ ...p, wireSize: e.target.value }))}
              className="h-12 border border-[#27272a] bg-[#18181b] rounded-lg px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-orange-500/20"
            >
              {COMMON_WIRE_SIZES.map(s => <option key={s} value={s}>#{s}</option>)}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Wire Count</span>
          <input
            type="number"
            value={inputs.wireCount || ''}
            onChange={e => setInputs(p => ({ ...p, wireCount: Number(e.target.value) }))}
            min={1}
            placeholder="3"
            className="h-12 border border-[#27272a] bg-[#18181b] rounded-lg px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-orange-500/20"
          />
        </label>
      </div>

      {hasResult && result.totalWireArea > 0 && (
        <div className="border border-[#27272a] bg-[#18181b] p-4 rounded-xl">
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

          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between">
              <span className="text-[#a1a1aa]">Total wire area</span>
              <span className="font-mono text-[#fafafa]">{result.totalWireArea} sq.in.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a1a1aa]">Allowable area ({result.fillLimit}%)</span>
              <span className="font-mono text-[#fafafa]">{result.allowableArea} sq.in.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a1a1aa]">Remaining capacity</span>
              <span className="font-mono text-[#fafafa]">{result.remainingArea} sq.in.</span>
            </div>
          </div>
          <CalculatorDisclaimer />
        </div>
      )}

      {hasResult && result.totalWireArea > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex flex-1 items-center justify-center gap-2 border border-[#27272a] bg-[#1a1a1a] py-3 rounded-lg text-xs font-medium uppercase tracking-wider text-[#fafafa] hover:bg-[#18181b]">
              <Save className="h-4 w-4" /> Save
            </button>
            <button
              onClick={() => shareCard(`conduit-fill-${inputs.conduitType}-${inputs.tradeSize.replace('/', '-')}-${inputs.wireCount}x${inputs.wireSize}`)}
              disabled={isGenerating || !shareCardData}
              className="flex flex-1 items-center justify-center gap-2 border border-[#27272a] bg-[#1a1a1a] py-3 rounded-lg text-xs font-medium uppercase tracking-wider text-[#fafafa] hover:bg-[#18181b] disabled:opacity-50"
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

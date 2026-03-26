'use client'

import { useState, useMemo } from 'react'
import { calculateAmpacity, type AmpacityInputs } from '@/lib/calculations'
import { COMMON_WIRE_SIZES, INSULATION_TYPES, AMPACITY_TABLE, INSULATION_TEMP } from '@/lib/calculator-data'
import { saveCalculation, generateId, type SavedCalculation } from '@/lib/storage'
import { AttachToJob } from '@/components/tools/attach-to-job'
import { CalculatorDisclaimer } from '@/components/calculator-disclaimer'
import { ShareCard } from '@/components/share-card'
import { useShareCard } from '@/hooks/useShareCard'
import { toast } from 'sonner'
import { Save, Share2, BarChart3, Info } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export function AmpacityCalculator({ compact = false }: { compact?: boolean }) {
  const [inputs, setInputs] = useState<AmpacityInputs>({
    wireSize: '12',
    insulationType: 'THHN',
    material: 'copper',
    ambientTemp: 30,
    conductorsInRaceway: 3,
  })

  const [showChart, setShowChart] = useState(!compact)
  const [chartType, setChartType] = useState<'wireSize' | 'temperature' | 'conductors'>('wireSize')

  const { cardRef, shareCard, isGenerating } = useShareCard()

  const result = calculateAmpacity(inputs)

  const chartData = useMemo(() => {
    if (chartType === 'wireSize') {
      return COMMON_WIRE_SIZES.map(size => {
        const tempRating = INSULATION_TEMP[inputs.insulationType] || 75
        const ampKey = inputs.material === 'copper'
          ? (tempRating === 60 ? 'cu60' : tempRating === 90 ? 'cu90' : 'cu75')
          : (tempRating === 60 ? 'al60' : tempRating === 90 ? 'al90' : 'al75')
        const baseAmp = AMPACITY_TABLE[size]?.[ampKey as keyof typeof AMPACITY_TABLE[string]] || 0
        const correctedResult = calculateAmpacity({ ...inputs, wireSize: size })
        return {
          name: `#${size}`,
          base: baseAmp,
          corrected: correctedResult?.correctedAmpacity || 0,
          isSelected: size === inputs.wireSize,
        }
      })
    } else if (chartType === 'temperature') {
      return [10, 20, 30, 40, 50, 60, 70].map(temp => {
        const correctedResult = calculateAmpacity({ ...inputs, ambientTemp: temp })
        return {
          name: `${temp}°C`,
          base: result?.baseAmpacity || 0,
          corrected: correctedResult?.correctedAmpacity || 0,
          isSelected: temp === inputs.ambientTemp,
        }
      })
    } else {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(count => {
        const correctedResult = calculateAmpacity({ ...inputs, conductorsInRaceway: count })
        return {
          name: `${count}`,
          base: result?.baseAmpacity || 0,
          corrected: correctedResult?.correctedAmpacity || 0,
          isSelected: count === inputs.conductorsInRaceway,
        }
      })
    }
  }, [inputs, chartType, result])

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
      { label: 'Conduit Derating', value: `${result.conduitDerating}` },
    ],
    passFailBadge: null,
  } : null

  const sel = 'h-12 border border-[#27272a] bg-[#18181b] px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none'
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
            <span className={lbl}>Wire Size</span>
            <select
              value={inputs.wireSize}
              onChange={e => setInputs(p => ({ ...p, wireSize: e.target.value }))}
              className={sel}
            >
              {COMMON_WIRE_SIZES.map(s => <option key={s} value={s}>#{s}</option>)}
            </select>
          </label>
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
        </div>

        <div className="flex gap-3">
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
          <label className="flex flex-1 flex-col gap-1">
            <span className={lbl}>Ambient Temp (°C)</span>
            <input
              type="number"
              value={inputs.ambientTemp || ''}
              onChange={e => setInputs(p => ({ ...p, ambientTemp: Number(e.target.value) }))}
              min={-50}
              max={150}
              className="h-12 border border-[#27272a] bg-[#18181b] px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className={lbl}>Conductors in Raceway</span>
          <input
            type="number"
            value={inputs.conductorsInRaceway || ''}
            onChange={e => setInputs(p => ({ ...p, conductorsInRaceway: Number(e.target.value) }))}
            min={1}
            max={100}
            className="h-12 border border-[#27272a] bg-[#18181b] px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none"
          />
        </label>
      </div>

      {result && (
        <div className="border border-[#27272a] bg-[#18181b] p-4">
          <div className="mb-4">
            <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Ampacity Result</span>
          </div>

          <div className="mb-4 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-[#f97316]">{result.correctedAmpacity}A</span>
            <span className="text-sm text-[#a1a1aa]">corrected</span>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between bg-[#0a0b0e] p-3">
              <span className="text-[#a1a1aa]">Base ampacity ({result.tempRating}°C)</span>
              <span className="font-mono font-medium text-[#fafafa]">{result.baseAmpacity}A</span>
            </div>
            <div className="flex justify-between bg-[#0a0b0e] p-3">
              <span className="text-[#a1a1aa]">Temp correction</span>
              <span className="font-mono font-medium text-[#fafafa]">×{result.tempCorrectionFactor.toFixed(3)}</span>
            </div>
            <div className="flex justify-between bg-[#0a0b0e] p-3">
              <span className="text-[#a1a1aa]">Conduit derating</span>
              <span className="font-mono font-medium text-[#fafafa]">×{result.conduitDerating}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#27272a]">
            <CalculatorDisclaimer />
          </div>
        </div>
      )}

      {/* Chart Visualization */}
      {result && !compact && (
        <div className="border border-[#27272a] bg-[#18181b] p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#f97316]" />
              <span className="text-sm font-medium text-[#fafafa]">Ampacity Visualization</span>
            </div>
            <button
              onClick={() => setShowChart(!showChart)}
              className="text-xs px-3 py-1.5 border border-[#27272a] text-[#a1a1aa] hover:bg-[#0a0b0e]"
            >
              {showChart ? 'Hide Chart' : 'Show Chart'}
            </button>
          </div>

          {showChart && (
            <>
              <div className="flex gap-2 mb-4">
                {(['wireSize', 'temperature', 'conductors'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`text-xs px-3 py-1.5 border ${chartType === type ? 'bg-[#f97316] text-black border-[#f97316]' : 'border-[#27272a] text-[#a1a1aa] hover:bg-[#0a0b0e]'}`}
                  >
                    {type === 'wireSize' ? 'By Wire Size' : type === 'temperature' ? 'By Temperature' : 'By Conductors'}
                  </button>
                ))}
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis
                      dataKey="name"
                      stroke="#a1a1aa"
                      fontSize={12}
                      label={{
                        value: chartType === 'wireSize' ? 'Wire Size (AWG)' :
                               chartType === 'temperature' ? 'Ambient Temperature (°C)' :
                               'Number of Conductors',
                        position: 'insideBottom',
                        offset: -5,
                        style: { textAnchor: 'middle', fontSize: 11, fill: '#a1a1aa' },
                      }}
                    />
                    <YAxis
                      stroke="#a1a1aa"
                      fontSize={12}
                      label={{
                        value: 'Amperes (A)',
                        angle: -90,
                        position: 'insideLeft',
                        offset: 10,
                        style: { textAnchor: 'middle', fontSize: 12, fill: '#a1a1aa' },
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#09090b',
                        borderColor: '#27272a',
                        borderRadius: '0',
                        fontSize: '12px',
                        color: '#fafafa',
                      }}
                      formatter={(value) => [`${value}A`, '']}
                      labelFormatter={(label) => {
                        if (chartType === 'wireSize') return `Wire Size: #${label}`
                        if (chartType === 'temperature') return `Temperature: ${label}`
                        return `Conductors: ${label}`
                      }}
                    />
                    <Bar dataKey="base" name="Base Ampacity" fill="#f97316" radius={[2, 2, 0, 0]} opacity={0.5} />
                    <Bar dataKey="corrected" name="Corrected Ampacity" fill="#f97316" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 p-3 bg-[#0a0b0e]">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-[#a1a1aa] mt-0.5 shrink-0" />
                  <p className="text-xs text-[#a1a1aa]">
                    {chartType === 'wireSize'
                      ? 'Shows how ampacity increases with larger wire sizes. Base ampacity (lighter) is from NEC Table 310.16. Corrected ampacity (darker) includes temperature and conduit derating.'
                      : chartType === 'temperature'
                      ? 'Shows how ampacity decreases as ambient temperature increases. Higher temperatures reduce conductor cooling, requiring derating.'
                      : 'Shows how ampacity decreases with more conductors in the raceway due to reduced heat dissipation (conduit derating).'}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {result && !compact && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex flex-1 items-center justify-center gap-2 border border-[#27272a] bg-[#1a1a1a] py-3 text-xs font-medium uppercase tracking-wider text-[#fafafa] hover:bg-[#18181b]"
            >
              <Save className="h-4 w-4" /> Save
            </button>
            <button
              onClick={() => shareCard(`ampacity-${inputs.wireSize}awg-${result.correctedAmpacity}a`)}
              disabled={isGenerating || !shareCardData}
              className="flex flex-1 items-center justify-center gap-2 border border-[#27272a] bg-[#1a1a1a] py-3 text-xs font-medium uppercase tracking-wider text-[#fafafa] hover:bg-[#18181b] disabled:opacity-50"
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

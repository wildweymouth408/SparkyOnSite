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
import { Save, Share2, BarChart3, TrendingUp } from 'lucide-react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  Legend,
} from 'recharts'

// Chart configuration
const chartConfig = {
  base: {
    label: 'Base Ampacity',
    color: '#f97316', // orange
  },
  corrected: {
    label: 'Corrected Ampacity',
    color: '#10b981', // green
  },
  copper: {
    label: 'Copper',
    color: '#f59e0b', // amber
  },
  aluminum: {
    label: 'Aluminum',
    color: '#fbbf24', // amber
  },
}

export function AmpacityChart({ compact = false }: { compact?: boolean }) {
  const [inputs, setInputs] = useState<AmpacityInputs>({
    wireSize: '12',
    insulationType: 'THHN',
    material: 'copper',
    ambientTemp: 30,
    conductorsInRaceway: 3,
  })

  const [showChart, setShowChart] = useState(true)
  const [chartType, setChartType] = useState<'wireSize' | 'temperature' | 'conductors'>('wireSize')

  // Share card functionality
  const { cardRef, shareCard, isGenerating } = useShareCard()

  const result = calculateAmpacity(inputs)

  // Generate chart data based on current inputs
  const chartData = useMemo(() => {
    if (chartType === 'wireSize') {
      // Show ampacity across different wire sizes
      return COMMON_WIRE_SIZES.map(size => {
        const tempRating = INSULATION_TEMP[inputs.insulationType] || 75
        const ampKey = inputs.material === 'copper'
          ? (tempRating === 60 ? 'cu60' : tempRating === 90 ? 'cu90' : 'cu75')
          : (tempRating === 60 ? 'al60' : tempRating === 90 ? 'al90' : 'al75')
        
        const baseAmp = AMPACITY_TABLE[size]?.[ampKey as keyof typeof AMPACITY_TABLE[string]] || 0
        
        // Calculate corrected ampacity for this wire size
        const correctedResult = calculateAmpacity({
          ...inputs,
          wireSize: size,
        })
        
        return {
          wireSize: `#${size}`,
          baseAmpacity: baseAmp,
          correctedAmpacity: correctedResult?.correctedAmpacity || 0,
          isSelected: size === inputs.wireSize,
        }
      })
    } else if (chartType === 'temperature') {
      // Show ampacity across different ambient temperatures
      return [10, 20, 30, 40, 50, 60, 70].map(temp => {
        const correctedResult = calculateAmpacity({
          ...inputs,
          ambientTemp: temp,
        })
        
        return {
          temperature: `${temp}°C`,
          baseAmpacity: result?.baseAmpacity || 0,
          correctedAmpacity: correctedResult?.correctedAmpacity || 0,
          isSelected: temp === inputs.ambientTemp,
        }
      })
    } else {
      // Show ampacity across different number of conductors
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(count => {
        const correctedResult = calculateAmpacity({
          ...inputs,
          conductorsInRaceway: count,
        })
        
        return {
          conductors: `${count}`,
          baseAmpacity: result?.baseAmpacity || 0,
          correctedAmpacity: correctedResult?.correctedAmpacity || 0,
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
      { label: 'Conduit Derating', value: `${result.conduitDerating}` },
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
              min={-50}
              max={150}
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
            max={100}
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

      {/* Chart Visualization */}
      {result && !compact && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Ampacity Visualization</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowChart(!showChart)}
                className="text-xs px-3 py-1.5 rounded-lg border border-input hover:bg-accent"
              >
                {showChart ? 'Hide Chart' : 'Show Chart'}
              </button>
            </div>
          </div>

          {showChart && (
            <>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setChartType('wireSize')}
                  className={`text-xs px-3 py-1.5 rounded-lg border ${chartType === 'wireSize' ? 'bg-primary text-primary-foreground border-primary' : 'border-input hover:bg-accent'}`}
                >
                  By Wire Size
                </button>
                <button
                  onClick={() => setChartType('temperature')}
                  className={`text-xs px-3 py-1.5 rounded-lg border ${chartType === 'temperature' ? 'bg-primary text-primary-foreground border-primary' : 'border-input hover:bg-accent'}`}
                >
                  By Temperature
                </button>
                <button
                  onClick={() => setChartType('conductors')}
                  className={`text-xs px-3 py-1.5 rounded-lg border ${chartType === 'conductors' ? 'bg-primary text-primary-foreground border-primary' : 'border-input hover:bg-accent'}`}
                >
                  By Conductors
                </button>
              </div>

              <div className="h-64">
                <ChartContainer
                  config={chartConfig}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey={chartType === 'wireSize' ? 'wireSize' : chartType === 'temperature' ? 'temperature' : 'conductors'}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        label={{
                          value: 'Amperes (A)',
                          angle: -90,
                          position: 'insideLeft',
                          offset: 10,
                          style: { textAnchor: 'middle', fontSize: 12 }
                        }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null
                          return (
                            <div className="rounded-lg border bg-background p-3 shadow-lg">
                              <p className="font-medium">
                                {chartType === 'wireSize' ? payload[0].payload.wireSize :
                                 chartType === 'temperature' ? payload[0].payload.temperature :
                                 `${payload[0].payload.conductors} conductors`}
                              </p>
                              {payload.map((entry, index) => (
                                <div key={index} className="flex items-center justify-between gap-4 mt-1">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="h-2 w-2 rounded-full"
                                      style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-sm">{entry.name}</span>
                                  </div>
                                  <span className="font-mono font-bold">{entry.value}A</span>
                                </div>
                              ))}
                            </div>
                          )
                        }}
                      />
                      <Bar
                        dataKey="baseAmpacity"
                        name="Base Ampacity"
                        fill="var(--color-base)"
                        radius={[2, 2, 0, 0]}
                      />
                      <Bar
                        dataKey="correctedAmpacity"
                        name="Corrected Ampacity"
                        fill="var(--color-corrected)"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="mt-4 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3" />
                  {chartType === 'wireSize' 
                    ? 'Shows ampacity values across different wire sizes. Larger wires have higher ampacity.'
                    : chartType === 'temperature'
                    ? 'Shows how ampacity decreases as ambient temperature increases.'
                    : 'Shows how ampacity decreases with more conductors in the raceway due to derating.'}
                </p>
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
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-input bg-secondary py-3 text-xs font-medium uppercase tracking-wider transition-colors hover:bg-accent"
            >
              <Save className="h-4 w-4" /> Save
            </button>
            <button
              onClick={() => shareCard(`ampacity-${inputs.wireSize}awg-${inputs.material}-${inputs.insulationType}`)}
              disabled={isGenerating || !shareCardData}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-input bg-secondary py-3 text-xs font-medium uppercase tracking-wider transition-colors hover:bg-accent disabled:opacity-50"
            >
              <Share2 className="h-4 w-4" /> {isGenerating ? 'Generating...' : 'Share'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
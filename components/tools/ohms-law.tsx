'use client'

import { useState, useEffect } from 'react'
import { calculateOhmsLaw } from '@/lib/calculations'
import { saveCalculation, generateId, type SavedCalculation } from '@/lib/storage'
import { AttachToJob } from '@/components/tools/attach-to-job'
import { CalculatorDisclaimer } from '@/components/calculator-disclaimer'
import { ShareCard } from '@/components/share-card'
import { useShareCard } from '@/hooks/useShareCard'
import { toast } from 'sonner'
import { Save, Share2 } from 'lucide-react'

export function OhmsLawCalculator() {
  const [voltage, setVoltage] = useState<string>('')
  const [current, setCurrent] = useState<string>('')
  const [resistance, setResistance] = useState<string>('')

  // Share card functionality
  const { cardRef, shareCard, isGenerating } = useShareCard()

  const inputs = {
    voltage: voltage !== '' ? Number(voltage) : null,
    current: current !== '' ? Number(current) : null,
    resistance: resistance !== '' ? Number(resistance) : null,
  }

  const result = calculateOhmsLaw(inputs)

  // Auto-fill the solved value
  useEffect(() => {
    if (result) {
      if (result.solvedFor === 'voltage' && voltage === '') {
        // Don't auto-fill the input field, just show in results
      }
    }
  }, [result, voltage])

  function handleClear() {
    setVoltage('')
    setCurrent('')
    setResistance('')
  }

  function handleSave() {
    if (!result) return
    const calc: SavedCalculation = {
      id: generateId(),
      type: "Ohm's Law",
      label: `V=${result.voltage} I=${result.current} R=${result.resistance}`,
      inputs: inputs as unknown as Record<string, unknown>,
      result: `P=${result.power}W (solved ${result.solvedFor})`,
      timestamp: new Date().toISOString(),
    }
    saveCalculation(calc)
    toast.success('Calculation saved')
  }

  const jobNote = result ? `[Ohm's Law] V=${result.voltage}V, I=${result.current}A, R=${result.resistance}\u03A9, P=${result.power}W` : ''

  // Prepare data for ShareCard
  const shareCardData = result ? {
    calculatorName: "Ohm's Law",
    inputs: [
      { label: 'Voltage', value: voltage !== '' ? `${voltage}V` : 'Solved' },
      { label: 'Current', value: current !== '' ? `${current}A` : 'Solved' },
      { label: 'Resistance', value: resistance !== '' ? `${resistance}Ω` : 'Solved' },
    ],
    results: [
      { label: 'Voltage', value: `${result.voltage}V`, highlight: result.solvedFor === 'voltage' },
      { label: 'Current', value: `${result.current}A`, highlight: result.solvedFor === 'current' },
      { label: 'Resistance', value: `${result.resistance}Ω`, highlight: result.solvedFor === 'resistance' },
      { label: 'Power', value: `${result.power}W` },
    ],
    passFailBadge: null,
  } : null

  // Triangle SVG
  const triangleHighlight = result?.solvedFor || ''

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

      {/* Ohm's Law Triangle */}
      <div className="flex justify-center py-2">
        <svg viewBox="0 0 200 180" className="h-36 w-36">
          {/* Triangle */}
          <line x1="100" y1="20" x2="20" y2="160" stroke="#27272a" strokeWidth="2" />
          <line x1="100" y1="20" x2="180" y2="160" stroke="#27272a" strokeWidth="2" />
          <line x1="20" y1="160" x2="180" y2="160" stroke="#27272a" strokeWidth="2" />
          <line x1="20" y1="100" x2="180" y2="100" stroke="#27272a" strokeWidth="1" strokeDasharray="4" />

          {/* V at top */}
          <text x="100" y="72" textAnchor="middle" fontSize="22" fontWeight="bold" fontFamily="var(--font-mono)"
            fill={triangleHighlight === 'voltage' ? '#f97316' : '#fafafa'}>
            V
          </text>
          {/* I at bottom-left */}
          <text x="65" y="140" textAnchor="middle" fontSize="22" fontWeight="bold" fontFamily="var(--font-mono)"
            fill={triangleHighlight === 'current' ? '#f97316' : '#fafafa'}>
            I
          </text>
          {/* R at bottom-right */}
          <text x="135" y="140" textAnchor="middle" fontSize="22" fontWeight="bold" fontFamily="var(--font-mono)"
            fill={triangleHighlight === 'resistance' ? '#f97316' : '#fafafa'}>
            R
          </text>
          {/* Multiply sign */}
          <text x="100" y="142" textAnchor="middle" fontSize="14" fill="#71717a" fontFamily="var(--font-mono)">
            {'x'}
          </text>
        </svg>
      </div>

      <p className="text-center text-xs text-[#a1a1aa]">Enter any 2 values to solve for the third</p>

      {/* Inputs */}
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">
            Voltage (V) {result?.solvedFor === 'voltage' && <span className="text-[#f97316]">= {result.voltage}</span>}
          </span>
          <input
            type="number"
            value={voltage}
            onChange={e => setVoltage(e.target.value)}
            placeholder={result?.solvedFor === 'voltage' ? String(result.voltage) : 'Enter voltage'}
            className="h-12 border border-[#27272a] bg-[#18181b] px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">
            Current (A) {result?.solvedFor === 'current' && <span className="text-[#f97316]">= {result.current}</span>}
          </span>
          <input
            type="number"
            value={current}
            onChange={e => setCurrent(e.target.value)}
            placeholder={result?.solvedFor === 'current' ? String(result.current) : 'Enter current'}
            className="h-12 border border-[#27272a] bg-[#18181b] px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">
            Resistance ({'ohms'}) {result?.solvedFor === 'resistance' && <span className="text-[#f97316]">= {result.resistance}</span>}
          </span>
          <input
            type="number"
            value={resistance}
            onChange={e => setResistance(e.target.value)}
            placeholder={result?.solvedFor === 'resistance' ? String(result.resistance) : 'Enter resistance'}
            className="h-12 border border-[#27272a] bg-[#18181b] px-3 font-mono text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none"
          />
        </label>
      </div>

      {/* Results */}
      {result && (
        <div className="border border-[#27272a] bg-[#18181b] p-4">
          <div className="mb-2 text-[11px] uppercase tracking-wider text-[#a1a1aa]">Result</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-[#a1a1aa]">Voltage</div>
              <div className={`font-mono text-lg font-bold ${result.solvedFor === 'voltage' ? 'text-[#f97316]' : 'text-[#fafafa]'}`}>
                {result.voltage}V
              </div>
            </div>
            <div>
              <div className="text-xs text-[#a1a1aa]">Current</div>
              <div className={`font-mono text-lg font-bold ${result.solvedFor === 'current' ? 'text-[#f97316]' : 'text-[#fafafa]'}`}>
                {result.current}A
              </div>
            </div>
            <div>
              <div className="text-xs text-[#a1a1aa]">Resistance</div>
              <div className={`font-mono text-lg font-bold ${result.solvedFor === 'resistance' ? 'text-[#f97316]' : 'text-[#fafafa]'}`}>
                {result.resistance}{'\u03A9'}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#a1a1aa]">Power</div>
              <div className="font-mono text-lg font-bold text-[#ffaa00]">
                {result.power}W
              </div>
            </div>
          </div>
          <CalculatorDisclaimer />
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button onClick={handleClear} className="flex flex-1 items-center justify-center border border-[#27272a] bg-[#1a1a1a] py-3 text-xs font-medium uppercase tracking-wider text-[#a1a1aa] hover:bg-[#18181b]">
            Clear
          </button>
          {result && (
            <>
              <button onClick={handleSave} className="flex flex-1 items-center justify-center gap-2 border border-[#27272a] bg-[#1a1a1a] py-3 text-xs font-medium uppercase tracking-wider text-[#fafafa] hover:bg-[#18181b]">
                <Save className="h-4 w-4" /> Save
              </button>
              <button
                onClick={() => shareCard(`ohms-law-v${result.voltage}-i${result.current}-r${result.resistance}`)}
                disabled={isGenerating || !shareCardData}
                className="flex flex-1 items-center justify-center gap-2 border border-[#27272a] bg-[#1a1a1a] py-3 text-xs font-medium uppercase tracking-wider text-[#fafafa] hover:bg-[#18181b] disabled:opacity-50"
              >
                <Share2 className="h-4 w-4" /> {isGenerating ? 'Generating...' : 'Share'}
              </button>
            </>
          )}
        </div>
        {result && <AttachToJob note={jobNote} />}
      </div>
    </div>
  )
}


'use client'

import { useState } from 'react'
import { Calculator, Zap, AlertTriangle, Check } from 'lucide-react'

const wireResistances: Record<string, { copper: number; aluminum: number }> = {
  "14": { copper: 3.07, aluminum: 5.06 },
  "12": { copper: 1.93, aluminum: 3.18 },
  "10": { copper: 1.21, aluminum: 2.00 },
  "8": { copper: 0.764, aluminum: 1.26 },
  "6": { copper: 0.491, aluminum: 0.808 },
  "4": { copper: 0.308, aluminum: 0.508 },
  "3": { copper: 0.245, aluminum: 0.403 },
  "2": { copper: 0.194, aluminum: 0.319 },
  "1": { copper: 0.154, aluminum: 0.253 },
  "1/0": { copper: 0.122, aluminum: 0.201 },
  "2/0": { copper: 0.0967, aluminum: 0.159 },
  "3/0": { copper: 0.0766, aluminum: 0.126 },
  "4/0": { copper: 0.0608, aluminum: 0.100 },
}

export function CalcsTab() {
  const [voltage, setVoltage] = useState(120)
  const [phase, setPhase] = useState<1 | 3>(1)
  const [wireSize, setWireSize] = useState("12")
  const [wireType, setWireType] = useState<"copper" | "aluminum">("copper")
  const [length, setLength] = useState(100)
  const [amps, setAmps] = useState(20)

  const calculateVoltageDrop = () => {
    const resistance = wireResistances[wireSize]?.[wireType] || 1.93
    const distance = length
    
    const drop = (2 * resistance * amps * distance) / 1000
    
    if (phase === 3) {
      const drop3Phase = drop * 0.866
      const percentDrop = (drop3Phase / voltage) * 100
      return { 
        volts: drop3Phase, 
        percent: percentDrop,
        recommended: percentDrop > 3 ? "Wire too small" : "OK"
      }
    }
    
    const percentDrop = (drop / voltage) * 100
    return { 
      volts: drop, 
      percent: percentDrop,
      recommended: percentDrop > 3 ? "Wire too small" : "OK"
    }
  }

  const result = calculateVoltageDrop()
  const recommendedWire = result.percent > 3 
    ? Object.entries(wireResistances).find(([size, res]) => {
        const r = res[wireType]
        const drop = (2 * r * amps * length) / 1000
        return (drop / voltage) * 100 <= 3
      })
    : null

  return (
    <div className="h-full overflow-y-auto pb-20 px-4 pt-4">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-[#00d4ff]" />
        <span className="text-sm font-bold text-[#00d4ff] uppercase tracking-wider">Calculators</span>
      </div>

      {/* Voltage Drop Calculator */}
      <div className="bg-[#1a1f2e] border border-[#333] rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-4 w-4 text-[#ff6b00]" />
          <h2 className="font-bold text-white">Voltage Drop</h2>
          <span className="text-xs text-[#555] ml-auto">210.19(A)(1)</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs text-[#555] block mb-1">System</label>
            <select 
              value={voltage} 
              onChange={(e) => setVoltage(Number(e.target.value))}
              className="w-full bg-[#0f1115] border border-[#333] rounded px-3 py-2 text-sm text-white"
            >
              <option value={120}>120V</option>
              <option value={240}>240V</option>
              <option value={208}>208V</option>
              <option value={277}>277V</option>
              <option value={480}>480V</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[#555] block mb-1">Phase</label>
            <select 
              value={phase} 
              onChange={(e) => setPhase(Number(e.target.value) as 1 | 3)}
              className="w-full bg-[#0f1115] border border-[#333] rounded px-3 py-2 text-sm text-white"
            >
              <option value={1}>Single Phase</option>
              <option value={3}>Three Phase</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[#555] block mb-1">Wire Size</label>
            <select 
              value={wireSize} 
              onChange={(e) => setWireSize(e.target.value)}
              className="w-full bg-[#0f1115] border border-[#333] rounded px-3 py-2 text-sm text-white"
            >
              {Object.keys(wireResistances).map(size => (
                <option key={size} value={size}>{size} AWG</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#555] block mb-1">Type</label>
            <select 
              value={wireType} 
              onChange={(e) => setWireType(e.target.value as "copper" | "aluminum")}
              className="w-full bg-[#0f1115] border border-[#333] rounded px-3 py-2 text-sm text-white"
            >
              <option value="copper">Copper</option>
              <option value="aluminum">Aluminum</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[#555] block mb-1">One-Way Length (ft)</label>
            <input 
              type="number" 
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full bg-[#0f1115] border border-[#333] rounded px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs text-[#555] block mb-1">Load (Amps)</label>
            <input 
              type="number" 
              value={amps}
              onChange={(e) => setAmps(Number(e.target.value))}
              className="w-full bg-[#0f1115] border border-[#333] rounded px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-[#0f1115] rounded p-3 border border-[#333]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[#888]">Voltage Drop:</span>
            <span className={`text-lg font-bold ${result.percent > 3 ? 'text-red-400' : 'text-[#00ff88]'}`}>
              {result.volts.toFixed(2)}V ({result.percent.toFixed(2)}%)
            </span>
          </div>
          
          {result.percent > 3 ? (
            <div className="flex items-start gap-2 text-red-400 text-sm">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p>Exceeds 3% limit for branch circuits</p>
                {recommendedWire && (
                  <p className="text-[#00ff88] mt-1">→ Use {recommendedWire[0]} AWG {wireType}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[#00ff88] text-sm">
              <Check className="h-4 w-4" />
              <p>Within 3% limit - compliant</p>
            </div>
          )}
        </div>

        <div className="mt-3 text-xs text-[#555]">
          <p>• 3% max for branch circuits (210.19)</p>
          <p>• 5% max total for feeder + branch (215.2)</p>
          <p>• Length is one-way distance from panel</p>
        </div>
      </div>
    </div>
  )
}

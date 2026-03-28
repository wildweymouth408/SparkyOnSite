'use client'

import { useState, useMemo } from 'react'
import { BendVisualization, BendVizType } from '@/components/bend-visualization'
import { BEND_MULTIPLIERS, TAKEUP } from '@/lib/calculator-data'
import { CalculatorDisclaimer } from '@/components/calculator-disclaimer'

// ── Types ─────────────────────────────────────────────────────────────────────

type BendType = 'offset' | '90' | 'saddle3' | 'saddle4' | 'back2back' | 'rollingOffset' | 'kickWith90'
type ConduitSize = '1/2"' | '3/4"' | '1"' | '1-1/4"' | '1-1/2"' | '2"'

// ── Constants ────────────────────────────────────────────────────────────────

const CONDUIT_SIZES: ConduitSize[] = ['1/2"', '3/4"', '1"', '1-1/4"', '1-1/2"', '2"']
const CONDUIT_SIZE_TO_KEY: Record<ConduitSize, string> = {
  '1/2"': '0.5',
  '3/4"': '0.75',
  '1"': '1',
  '1-1/4"': '1.25',
  '1-1/2"': '1.5',
  '2"': '2',
}

const STANDARD_ANGLES = Object.keys(BEND_MULTIPLIERS).map(Number).sort((a, b) => a - b)

// ── Helper Functions ─────────────────────────────────────────────────────────

function getTakeup(size: ConduitSize): number {
  return TAKEUP[CONDUIT_SIZE_TO_KEY[size]] ?? 6
}

function getMultiplier(angle: number): { multiplier: number; shrinkage: number } {
  return BEND_MULTIPLIERS[angle] || { multiplier: 2.0, shrinkage: 0.25 }
}

// ── Main Component ───────────────────────────────────────────────────────────

export function BendCalculator() {
  // State
  const [bendType, setBendType] = useState<BendType>('offset')
  const [conduitSize, setConduitSize] = useState<ConduitSize>('3/4"')
  const [offsetHeight, setOffsetHeight] = useState<number>(4)
  const [angle, setAngle] = useState<number>(30)
  const [stubLength, setStubLength] = useState<number>(12)
  const [saddleHeight, setSaddleHeight] = useState<number>(2)
  const [saddle3Angle, setSaddle3Angle] = useState<number>(22.5)
  const [saddle4Angle, setSaddle4Angle] = useState<number>(45)
  const [backToBackDistance, setBackToBackDistance] = useState<number>(24)
  const [rollingRise, setRollingRise] = useState<number>(6)
  const [rollingRun, setRollingRun] = useState<number>(8)
  const [kickOffset, setKickOffset] = useState<number>(2)
  const [kickAngle, setKickAngle] = useState<number>(10)

  // Derived calculations
  const takeup = useMemo(() => getTakeup(conduitSize), [conduitSize])
  const { multiplier, shrinkage } = useMemo(() => getMultiplier(angle), [angle])
  const { multiplier: kickMultiplier, shrinkage: kickShrinkage } = useMemo(() => getMultiplier(kickAngle), [kickAngle])

  const calculations = useMemo(() => {
    switch (bendType) {
      case 'offset':
        return {
          distanceBetweenBends: (offsetHeight * multiplier).toFixed(2),
          totalShrinkage: (offsetHeight * shrinkage).toFixed(3),
        }
      case '90':
        return {
          markPosition: Math.max(0, stubLength - takeup).toFixed(1),
          takeup,
        }
      case 'saddle3': {
        const s3 = BEND_MULTIPLIERS[saddle3Angle] ?? { multiplier: 2.6, shrinkage: 3 / 16 }
        return {
          outerDistance: (saddleHeight * s3.multiplier).toFixed(2),
          shrinkage: (saddleHeight * s3.shrinkage).toFixed(3),
        }
      }
      case 'saddle4': {
        const s4 = BEND_MULTIPLIERS[saddle4Angle] ?? { multiplier: 1.414, shrinkage: 3 / 8 }
        return {
          distanceBetweenBends: (saddleHeight * s4.multiplier).toFixed(2),
          shrinkage: (saddleHeight * s4.shrinkage).toFixed(3),
        }
      }
      case 'back2back':
        return {
          backToBackDistance,
        }
      case 'rollingOffset':
        const travel = Math.sqrt(rollingRise * rollingRise + rollingRun * rollingRun)
        return {
          travel: travel.toFixed(2),
          distanceBetweenBends: (travel * multiplier).toFixed(2),
          totalShrinkage: (travel * shrinkage).toFixed(3),
        }
      case 'kickWith90':
        return {
          kickDistance: (kickOffset * kickMultiplier).toFixed(2),
          kickShrinkage: (kickOffset * kickShrinkage).toFixed(3),
        }
      default:
        return {}
    }
  }, [bendType, offsetHeight, multiplier, shrinkage, stubLength, takeup, saddleHeight, saddle3Angle, saddle4Angle, backToBackDistance, rollingRise, rollingRun, kickOffset, kickMultiplier, kickShrinkage])

  // Map bend type to visualization type
  const vizType: BendVizType = useMemo(() => {
    switch (bendType) {
      case 'offset': return 'offset'
      case '90': return '90'
      case 'saddle3': return 'saddle3'
      case 'saddle4': return 'saddle4'
      case 'back2back': return 'back2back'
      case 'rollingOffset': return 'rollingOffset'
      case 'kickWith90': return 'kickWith90'
      default: return 'offset'
    }
  }, [bendType])

  // Prepare values for visualization
  const vizValues = useMemo(() => {
    const base: Record<string, string | number> = {}
    switch (bendType) {
      case 'offset':
        base.height = offsetHeight
        base.distance = calculations.distanceBetweenBends ?? ''
        base.shrinkage = calculations.totalShrinkage ?? ''
        base.angle = angle
        break
      case '90':
        base.stub = stubLength
        base.takeup = takeup
        base.mark = calculations.markPosition ?? ''
        break
      case 'saddle3':
        base.height = saddleHeight
        base.outerDistance = calculations.outerDistance ?? ''
        base.angle = saddle3Angle
        break
      case 'saddle4':
        base.height = saddleHeight
        base.distance = calculations.distanceBetweenBends ?? ''
        base.angle = saddle4Angle
        break
      case 'back2back':
        base.b2bDistance = backToBackDistance
        break
      case 'rollingOffset':
        base.rise = rollingRise
        base.run = rollingRun
        base.travel = calculations.travel ?? ''
        base.distance = calculations.distanceBetweenBends ?? ''
        base.shrinkage = calculations.totalShrinkage ?? ''
        base.angle = angle
        break
      case 'kickWith90':
        base.kickOffset = kickOffset
        base.kickAngle = kickAngle
        base.kickDistance = calculations.kickDistance ?? ''
        base.kickShrinkage = calculations.kickShrinkage ?? ''
        break
    }
    return base
  }, [bendType, calculations, offsetHeight, angle, stubLength, takeup, saddleHeight, saddle3Angle, saddle4Angle, backToBackDistance, rollingRise, rollingRun, kickOffset, kickAngle])

  // ── UI ──────────────────────────────────────────────────────────────────────

  const inputCls = 'h-11 w-full rounded-lg border border-[#374151] bg-[#18181b] px-3 font-mono text-sm text-[#F9FAFB] focus:border-[#F97316] focus:outline-none transition-colors'
  const labelCls = 'text-xs text-[#9CA3AF] mb-1 block'
  const cardCls = 'rounded-xl border border-[#1F2937] bg-[#18181b] p-4'
  const buttonCls = (active: boolean) => `rounded-lg px-3 py-2 text-xs font-medium transition-all ${active ? 'bg-[#F97316] text-[#0D1117]' : 'border border-[#1F2937] text-[#a1a1aa] hover:text-[#9CA3AF] hover:border-[#374151]'}`

  return (
    <div className="flex flex-col gap-6">
      <CalculatorDisclaimer />

      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-[#F9FAFB]">Conduit Bend Calculator</h2>
        <p className="text-sm text-[#9CA3AF] mt-1">Precise bend calculations matching industry standards</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Inputs */}
        <div className="space-y-6">
          {/* Bend Type Selection */}
          <div>
            <label className={labelCls}>Bend Type</label>
            <div className="flex flex-wrap gap-2">
              {(['offset', '90', 'saddle3', 'saddle4', 'back2back', 'rollingOffset', 'kickWith90'] as BendType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setBendType(type)}
                  className={buttonCls(bendType === type)}
                >
                  {type === 'offset' && 'Offset'}
                  {type === '90' && '90° Stub-up'}
                  {type === 'saddle3' && '3-Point Saddle'}
                  {type === 'saddle4' && '4-Point Saddle'}
                  {type === 'back2back' && 'Back-to-Back'}
                  {type === 'rollingOffset' && 'Rolling Offset'}
                  {type === 'kickWith90' && 'Kick with 90°'}
                </button>
              ))}
            </div>
          </div>

          {/* Conduit Size */}
          <div>
            <label className={labelCls}>Conduit Size</label>
            <div className="flex flex-wrap gap-2">
              {CONDUIT_SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => setConduitSize(size)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-all ${conduitSize === size ? 'bg-[#374151] text-[#F9FAFB]' : 'border border-[#1F2937] text-[#a1a1aa] hover:border-[#374151]'}`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-[#4B5563]">
              Take‑up: {takeup}" · Gain: {takeup * 0.6}" (approx)
            </p>
          </div>

          {/* Dynamic Inputs based on Bend Type */}
          {bendType === 'offset' && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Offset Height (inches)</label>
                <input
                  type="number"
                  value={offsetHeight}
                  onChange={e => setOffsetHeight(Number(e.target.value))}
                  className={inputCls}
                  step={0.25}
                  min={0.5}
                  max={24}
                />
              </div>
              <div>
                <label className={labelCls}>Bend Angle</label>
                <select
                  value={angle}
                  onChange={e => setAngle(Number(e.target.value))}
                  className={inputCls}
                >
                  {STANDARD_ANGLES.map(a => (
                    <option key={a} value={a}>{a}°</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {bendType === '90' && (
            <div>
              <label className={labelCls}>Stub Length (inches)</label>
              <input
                type="number"
                value={stubLength}
                onChange={e => setStubLength(Number(e.target.value))}
                className={inputCls}
                step={0.5}
                min={takeup + 1}
                max={120}
              />
              <p className="mt-1 text-xs text-[#4B5563]">
                Minimum stub: {takeup + 1}" (must exceed take‑up)
              </p>
            </div>
          )}

          {bendType === 'saddle3' && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Obstacle Height (inches)</label>
                <input
                  type="number"
                  value={saddleHeight}
                  onChange={e => setSaddleHeight(Number(e.target.value))}
                  className={inputCls}
                  step={0.25}
                  min={0.5}
                  max={12}
                />
              </div>
              <div>
                <label className={labelCls}>Bend Angle</label>
                <select
                  value={saddle3Angle}
                  onChange={e => setSaddle3Angle(Number(e.target.value))}
                  className={inputCls}
                >
                  <option value={22.5}>22.5° / 45° / 22.5° (standard)</option>
                  <option value={30}>30° / 60° / 30°</option>
                </select>
              </div>
            </div>
          )}

          {bendType === 'saddle4' && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Obstacle Height (inches)</label>
                <input
                  type="number"
                  value={saddleHeight}
                  onChange={e => setSaddleHeight(Number(e.target.value))}
                  className={inputCls}
                  step={0.25}
                  min={0.5}
                  max={12}
                />
              </div>
              <div>
                <label className={labelCls}>Bend Angle</label>
                <select
                  value={saddle4Angle}
                  onChange={e => setSaddle4Angle(Number(e.target.value))}
                  className={inputCls}
                >
                  <option value={45}>45° (standard)</option>
                  <option value={30}>30°</option>
                </select>
              </div>
            </div>
          )}

          {bendType === 'back2back' && (
            <div>
              <label className={labelCls}>Back‑to‑Back Distance (inches)</label>
              <input
                type="number"
                value={backToBackDistance}
                onChange={e => setBackToBackDistance(Number(e.target.value))}
                className={inputCls}
                step={0.5}
                min={2}
                max={120}
              />
            </div>
          )}

          {bendType === 'rollingOffset' && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Vertical Rise (inches)</label>
                <input
                  type="number"
                  value={rollingRise}
                  onChange={e => setRollingRise(Number(e.target.value))}
                  className={inputCls}
                  step={0.25}
                  min={0.5}
                  max={48}
                />
              </div>
              <div>
                <label className={labelCls}>Horizontal Run (inches)</label>
                <input
                  type="number"
                  value={rollingRun}
                  onChange={e => setRollingRun(Number(e.target.value))}
                  className={inputCls}
                  step={0.25}
                  min={0.5}
                  max={48}
                />
              </div>
              <div>
                <label className={labelCls}>Bend Angle</label>
                <select
                  value={angle}
                  onChange={e => setAngle(Number(e.target.value))}
                  className={inputCls}
                >
                  {STANDARD_ANGLES.map(a => (
                    <option key={a} value={a}>{a}°</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {bendType === 'kickWith90' && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Kick Offset from Wall (inches)</label>
                <input
                  type="number"
                  value={kickOffset}
                  onChange={e => setKickOffset(Number(e.target.value))}
                  className={inputCls}
                  step={0.25}
                  min={0.5}
                  max={12}
                />
              </div>
              <div>
                <label className={labelCls}>Kick Angle</label>
                <select
                  value={kickAngle}
                  onChange={e => setKickAngle(Number(e.target.value))}
                  className={inputCls}
                >
                  {[5, 10, 15, 20, 22.5, 30].map(a => (
                    <option key={a} value={a}>{a}°</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Results Card */}
          <div className={cardCls}>
            <h3 className="text-sm font-semibold text-[#F9FAFB] mb-3">Calculation Results</h3>
            <div className="space-y-3">
              {bendType === 'offset' && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9CA3AF]">Distance between bends</span>
                    <span className="font-mono text-lg font-bold text-[#F9FAFB]">{calculations.distanceBetweenBends}"</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9CA3AF]">Total shrinkage</span>
                    <span className="font-mono text-[#F97316]">{calculations.totalShrinkage}"</span>
                  </div>
                  <p className="text-xs text-[#4B5563] pt-2 border-t border-[#1F2937]">
                    Deduct shrinkage from total run length before marking bends.
                  </p>
                </>
              )}
              {bendType === '90' && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9CA3AF]">Mark position (from end)</span>
                    <span className="font-mono text-lg font-bold text-[#F9FAFB]">{calculations.markPosition}"</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9CA3AF]">Take‑up</span>
                    <span className="font-mono text-[#F9FAFB]">{takeup}"</span>
                  </div>
                  <p className="text-xs text-[#4B5563] pt-2 border-t border-[#1F2937]">
                    Place bender arrow at mark, pull to 90°.
                  </p>
                </>
              )}
              {bendType === 'saddle3' && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9CA3AF]">Outer marks from center</span>
                    <span className="font-mono text-lg font-bold text-[#F9FAFB]">{calculations.outerDistance}"</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9CA3AF]">Total shrinkage</span>
                    <span className="font-mono text-[#F97316]">{calculations.shrinkage}"</span>
                  </div>
                  <p className="text-xs text-[#4B5563] pt-2 border-t border-[#1F2937]">
                    Center bend: 45°, outer bends: 22.5° each.
                  </p>
                </>
              )}
              {bendType === 'saddle4' && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9CA3AF]">Distance between bends</span>
                    <span className="font-mono text-lg font-bold text-[#F9FAFB]">{calculations.distanceBetweenBends}"</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9CA3AF]">Shrinkage per bend pair</span>
                    <span className="font-mono text-[#F97316]">{calculations.shrinkage}"</span>
                  </div>
                  <p className="text-xs text-[#4B5563] pt-2 border-t border-[#1F2937]">
                    All four bends at 45°, two pairs in opposite directions.
                  </p>
                </>
              )}
              {bendType === 'back2back' && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9CA3AF]">Place star mark at</span>
                    <span className="font-mono text-lg font-bold text-[#F9FAFB]">{backToBackDistance}"</span>
                  </div>
                  <p className="text-xs text-[#4B5563] pt-2 border-t border-[#1F2937]">
                    From back of first 90°, align bender star to this mark for second bend.
                  </p>
                </>
              )}
              {bendType === 'rollingOffset' && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9CA3AF]">Travel distance</span>
                    <span className="font-mono text-[#9CA3AF]">{calculations.travel}"</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9CA3AF]">Distance between bends</span>
                    <span className="font-mono text-lg font-bold text-[#F9FAFB]">{calculations.distanceBetweenBends}"</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9CA3AF]">Total shrinkage</span>
                    <span className="font-mono text-[#F97316]">{calculations.totalShrinkage}"</span>
                  </div>
                </>
              )}
              {bendType === 'kickWith90' && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9CA3AF]">Distance from 90° to kick</span>
                    <span className="font-mono text-lg font-bold text-[#F9FAFB]">{calculations.kickDistance}"</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#9CA3AF]">Kick shrinkage</span>
                    <span className="font-mono text-[#F97316]">{calculations.kickShrinkage}"</span>
                  </div>
                  <p className="text-xs text-[#4B5563] pt-2 border-t border-[#1F2937]">
                    Make 90° first, then measure from back of 90° for kick bend.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Visualization */}
        <div className="space-y-6">
          <div className={cardCls}>
            <h3 className="text-sm font-semibold text-[#F9FAFB] mb-3">Visualization</h3>
            <BendVisualization
              type={vizType}
              frontMark="Arrow"
              backMark="Star"
              calcValues={vizValues}
            />
          </div>

          {/* Multiplier Reference Table */}
          <div className={cardCls}>
            <h3 className="text-sm font-semibold text-[#F9FAFB] mb-2">Bend Multiplier Reference</h3>
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-[#4B5563]">
                  <th className="py-1.5 text-left font-normal">Angle</th>
                  <th className="py-1.5 text-center font-normal">Multiplier</th>
                  <th className="py-1.5 text-right font-normal">Shrink/inch</th>
                </tr>
              </thead>
              <tbody>
                {STANDARD_ANGLES.map(angleDeg => {
                  const mult = BEND_MULTIPLIERS[angleDeg]
                  if (!mult) return null
                  const isSelected = angle === angleDeg
                  return (
                    <tr
                      key={angleDeg}
                      onClick={() => setAngle(angleDeg)}
                      className={`border-t border-[#1F2937] cursor-pointer transition-colors ${isSelected ? 'bg-[#F97316]/5' : 'hover:bg-[#1F2937]/50'}`}
                    >
                      <td className="py-2">
                        <span className={isSelected ? 'text-[#F9FAFB] font-bold' : 'text-[#9CA3AF]'}>{angleDeg}°</span>
                      </td>
                      <td className="py-2 text-center">
                        <span className={isSelected ? 'text-[#F9FAFB]' : 'text-[#a1a1aa]'}>{mult.multiplier.toFixed(3)}</span>
                      </td>
                      <td className="py-2 text-right">
                        <span className={isSelected ? 'text-[#F97316]' : 'text-[#4B5563]'}>{(mult.shrinkage * 16).toFixed(0)}/16"</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Take‑up Reference */}
          <div className={cardCls}>
            <h3 className="text-sm font-semibold text-[#F9FAFB] mb-2">90° Take‑up Reference</h3>
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-[#4B5563]">
                  <th className="py-1.5 text-left font-normal">EMT size</th>
                  <th className="py-1.5 text-right font-normal">Take‑up</th>
                </tr>
              </thead>
              <tbody>
                {CONDUIT_SIZES.map(size => {
                  const takeupVal = getTakeup(size)
                  const isSelected = size === conduitSize
                  return (
                    <tr
                      key={size}
                      onClick={() => setConduitSize(size)}
                      className={`border-t border-[#1F2937] cursor-pointer transition-colors ${isSelected ? 'bg-[#374151]/30' : 'hover:bg-[#1F2937]/50'}`}
                    >
                      <td className="py-2">
                        <span className={isSelected ? 'text-[#F9FAFB] font-bold' : 'text-[#9CA3AF]'}>{size}</span>
                      </td>
                      <td className="py-2 text-right">
                        <span className={isSelected ? 'text-[#F9FAFB]' : 'text-[#a1a1aa]'}>{takeupVal}"</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* NEC Warning */}
      <div className="rounded-lg border border-[#DC2626]/20 bg-[#DC2626]/5 px-4 py-3">
        <p className="text-xs text-[#FCA5A5] leading-relaxed">
          <span className="font-bold">NEC 358.24:</span> Minimum bending radius for EMT is 4× conduit diameter for sizes ½″–1¼″, and 5× diameter for sizes 1½″–2″. Sharp bends (radius &lt; minimum) are not permitted.
        </p>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-[#4B5563]">
        This calculator uses industry‑standard bend multipliers. Always verify with a physical bender before cutting conduit.
      </p>
    </div>
  )
}
'use client'

import { useState, useMemo } from 'react'
import { CalculatorDisclaimer } from '@/components/calculator-disclaimer'
import { BendVisualization } from '../bend-visualization'

// ── Types ─────────────────────────────────────────────────────────────────────

type Brand = 'klein' | 'ideal' | 'greenlee' | 'milwaukee'
type BendType = '90' | 'offset' | 'saddle3' | 'saddle4' | 'back2back' | 'rollingOffset' | 'kickWith90' | 'parallel' | 'corner'
type ConduitSize = '1/2"' | '3/4"' | '1"' | '1-1/4"' | '1-1/2"' | '2"'

// ── Reference Data ────────────────────────────────────────────────────────────

const MULTIPLIERS = [
  { angle: 10,   mult: 6.0,   shrink: '1/16"', shrinkDec: 0.0625 },
  { angle: 22.5, mult: 2.6,   shrink: '3/16"', shrinkDec: 0.1875 },
  { angle: 30,   mult: 2.0,   shrink: '1/4"',  shrinkDec: 0.25   },
  { angle: 45,   mult: 1.414, shrink: '3/8"',  shrinkDec: 0.375  },
  { angle: 60,   mult: 1.154, shrink: '1/2"',  shrinkDec: 0.5    },
]

const TAKEUP: Record<ConduitSize, number> = {
  '1/2"':   5,
  '3/4"':   6,
  '1"':     8,
  '1-1/4"': 11,
  '1-1/2"': 13,
  '2"':     16,
}

const GAIN: Record<ConduitSize, number> = {
  '1/2"':   3,
  '3/4"':   3.625,
  '1"':     5,
  '1-1/4"': 6.875,
  '1-1/2"': 8.125,
  '2"':     10,
}

const CONDUIT_SIZES: ConduitSize[] = ['1/2"', '3/4"', '1"', '1-1/4"', '1-1/2"', '2"']

// ── Brand Config ──────────────────────────────────────────────────────────────

const BRANDS: Record<Brand, {
  name: string
  model: string
  marks: { front: string; back: string; center: string }
  tip: string
}> = {
  klein: {
    name: 'Klein Tools',
    model: '51600 Series',
    marks: { front: 'Arrow ▶', back: 'Star ★', center: 'Rim Notch' },
    tip: 'Most common bender. Arrow is your primary mark for 90s and offsets.',
  },
  ideal: {
    name: 'Ideal Industries',
    model: '74-028 / 74-036',
    marks: { front: 'Hook Mark', back: 'Center Notch', center: 'Degree Marks' },
    tip: 'Hook Mark = same concept as Klein Arrow. Degree marks engraved on shoe side.',
  },
  greenlee: {
    name: 'Greenlee',
    model: '840 / 851 / 852',
    marks: { front: 'Arrow Mark', back: 'Star Notch', center: 'Degree Notches' },
    tip: 'Degree notches (10°, 22.5°, 30°, 45°) clearly engraved on shoe edge.',
  },
  milwaukee: {
    name: 'Milwaukee',
    model: '48-22-4001 / 4002',
    marks: { front: 'Arrow ▶', back: 'Star ★', center: 'Degree Marks' },
    tip: 'Same mark layout as Klein. Some models have built-in angle sight window.',
  },
}

// ── Brand Instructions ────────────────────────────────────────────────────────

const INSTRUCTIONS: Record<Brand, Record<BendType, { steps: string[]; pro?: string }>> = {
  klein: {
    '90': {
      steps: [
        'Measure your stub-up length from the end of the conduit.',
        'Subtract the take-up for your conduit size (see chart).',
        'Mark that point on the conduit with a pencil.',
        'Place conduit in bender. Slide until ARROW (▶) lines up with your pencil mark.',
        'Foot on pedal. Pull handle back smoothly to 90°.',
        'Check with torpedo level. Correct any twist before releasing.',
      ],
      pro: '3/4" EMT, 12" stub: Mark at 12" − 6" = 6" from end. Arrow to 6" mark, pull to 90°.',
    },
    'offset': {
      steps: [
        'Measure the obstacle height you need to clear.',
        'Pick your angle (30° is standard). Find the multiplier from the chart.',
        'Distance between bends = height × multiplier.',
        'Shrinkage = height × shrink-per-inch. Deduct from your overall run.',
        'Mark first bend point on conduit.',
        'Align ARROW (▶) to first mark. Bend to chosen angle.',
        'Measure the calculated distance from first mark. Mark second bend point.',
        'Flip conduit 180°. Align ARROW to second mark. Bend same angle.',
      ],
      pro: '4" offset at 30°: Distance = 4 × 2.0 = 8". Shrink = 4 × 0.25 = 1". Mark at first point, Arrow to mark, bend 30°. Flip, mark 8" away, Arrow to mark, bend 30°.',
    },
    'saddle3': {
      steps: [
        'Measure from end of run to center of obstacle.',
        'Mark the CENTER of the obstacle on the conduit.',
        'Mark equal distances on each side (based on obstacle height × multiplier for outer bends).',
        'Center bend first: Align ARROW to center mark. Bend to 45°.',
        'Outer bends: Flip conduit. Align ARROW to each outer mark. Bend to 22.5° each.',
      ],
      pro: 'Obstacle height 2": Center mark at obstacle center, bend 45°. Outer marks 2 × 2.6 = 5.2" from center each side (Ugly\'s uses 2.5× multiplier, no explicit shrinkage).',
    },
    'saddle4': {
      steps: [
        'Measure the obstacle height and width.',
        'Calculate distance between bends using 45° multiplier (height × 1.414).',
        'Mark 4 bend points on conduit.',
        'Bends 1 & 4: 45° bends at outer marks.',
        'Bends 2 & 3: 45° bends at inner marks (opposite direction).',
      ],
    },
    'back2back': {
      steps: [
        'Make the first 90° bend using standard stub-up method.',
        'Measure the back-to-back distance (outside to outside of the two stubs).',
        'Place the first bend on the floor. From the back of the first 90°, measure the back-to-back distance.',
        'Place the STAR (★) mark on the measured point.',
        'Bend the second 90° by pulling the handle.',
      ],
      pro: 'Back-to-back distance 24": Make first 90°. Measure 24" from back of first bend. Star to that mark. Pull second 90°.',
    },
    'rollingOffset': {
      steps: [
        'Measure the rise (vertical offset) and run (horizontal offset).',
        'Calculate travel (hypotenuse): √(rise² + run²).',
        'Use travel as your "offset height" with chosen multiplier.',
        'Distance between bends = travel × multiplier.',
        'Shrinkage = travel × shrink-per-inch.',
        'Make first bend. Rotate conduit to match both planes. Make second bend.',
      ],
      pro: 'Rise 6", Run 8": Travel = √(36+64) = 10". At 30°: Distance = 10 × 2.0 = 20". Shrink = 10 × 0.25 = 2.5".',
    },
    'kickWith90': {
      steps: [
        'Make the 90° bend first using standard stub-up method.',
        'Determine the kick offset needed (distance from wall/surface).',
        'From the back of the 90°, measure and mark the kick distance.',
        'Place conduit in bender with ARROW at mark.',
        'Bend a small angle (typically 10-15°) for the kick.',
        'Check that the stub sits at the correct distance from the surface.',
      ],
    },
  },
  ideal: {
    '90': { steps: ['Same as Klein method. Hook Mark = Arrow. Align Hook Mark to your pencil mark.', 'Pull to 90°. Check with level.'] },
    'offset': { steps: ['Same offset method. Hook Mark = Arrow for alignment.'] },
    'saddle3': { steps: ['Same 3-point saddle method. Use Hook Mark for alignment.'] },
    'saddle4': { steps: ['Same 4-point saddle method.'] },
    'back2back': { steps: ['Same back-to-back method. Use Center Notch = Star for second bend alignment.'] },
    'rollingOffset': { steps: ['Same rolling offset method.'] },
    'kickWith90': { steps: ['Same kick with 90° method. Use Hook Mark.'] },
  },
  greenlee: {
    '90': { steps: ['Same as Klein method. Arrow Mark = Arrow.', 'Degree notches on shoe edge let you verify angle precisely.'] },
    'offset': { steps: ['Same offset method. Arrow Mark for alignment. Use degree notches to verify angle.'] },
    'saddle3': { steps: ['Same 3-point saddle method. Degree notches help nail exact angles.'] },
    'saddle4': { steps: ['Same 4-point saddle method.'] },
    'back2back': { steps: ['Same back-to-back method. Star Notch for second bend.'] },
    'rollingOffset': { steps: ['Same rolling offset method.'] },
    'kickWith90': { steps: ['Same kick with 90° method.'] },
  },
  milwaukee: {
    '90': { steps: ['Same as Klein method. Same mark layout.', 'Some models have angle sight window for precise bends.'] },
    'offset': { steps: ['Same offset method. Arrow for alignment.'] },
    'saddle3': { steps: ['Same 3-point saddle method.'] },
    'saddle4': { steps: ['Same 4-point saddle method.'] },
    'back2back': { steps: ['Same back-to-back method. Star for second bend.'] },
    'rollingOffset': { steps: ['Same rolling offset method.'] },
    'kickWith90': { steps: ['Same kick with 90° method.'] },
  },
}

// ── Realistic Bend Diagrams ──────────────────────────────────────────────────

// ── NEC 358.24 Minimum Bending Radius ───────────────────────────────────────

/**
 * Returns the minimum bending radius for EMT per NEC 358.24
 * - 4× conduit diameter for ½″–1¼″ EMT
 * - 5× conduit diameter for 1½″–2″ EMT
 */
function getNECMinimumRadius(conduitSize: ConduitSize): number {
  const conduitDiameterMap: Record<ConduitSize, number> = {
    '1/2"': 0.5,
    '3/4"': 0.75,
    '1"': 1.0,
    '1-1/4"': 1.25,
    '1-1/2"': 1.5,
    '2"': 2.0
  }
  
  const diameter = conduitDiameterMap[conduitSize]
  if (diameter <= 1.25) {
    return 4 * diameter  // 4× for ½″–1¼″ EMT
  } else {
    return 5 * diameter  // 5× for 1½″–2″ EMT
  }
}

// ── Impossible Bend Detection ────────────────────────────────────────────────

function getBendWarning(type: BendType, values: Record<string, number>, conduitSize?: ConduitSize): string | null {
  if (type === '90') {
    if (values.stub && values.takeup && values.stub <= values.takeup) {
      return `Stub length (${values.stub}") must be greater than take-up (${values.takeup}"). Your mark would be at 0" or negative.`
    }
    if (values.stub && values.stub < 4) {
      return `Stub under 4" is extremely difficult with a hand bender. Minimum practical stub is ~5".`
    }
  }
  if (type === 'offset') {
    if (values.height && values.height > 12) {
      return `Offset height over 12" is impractical with a hand bender. Consider using a hydraulic bender or coupling.`
    }
  }
  if (type === 'saddle3') {
    if (values.height && values.height > 6) {
      return `3-point saddle over 6" height is very difficult. Consider a 4-point saddle instead.`
    }
  }
  if (type === 'kickWith90') {
    if (values.kickOffset && values.kickOffset > 6) {
      return `Kick offset over 6" may require multiple bends or a different approach.`
    }
    if (values.kickAngle && (values.kickAngle < 5 || values.kickAngle > 20)) {
      return `Kick angle should be between 5° and 20° for best results.`
    }
  }
  if (type === 'parallel') {
    if (values.parallelCount && values.parallelCount > 6) {
      return `More than 6 parallel conduits may require special bender setups.`
    }
    if (values.parallelSpacing && values.parallelSpacing < 2) {
      return `Spacing under 2" may not leave enough room for couplings and fittings.`
    }
  }
  if (type === 'corner') {
    if (values.cornerAngle && (values.cornerAngle < 45 || values.cornerAngle > 135)) {
      return `Corner angles outside 45°-135° range are uncommon and may require special techniques.`
    }
    if (values.cornerRadius && values.cornerRadius > 24) {
      return `Radius over 24" may require segmented bends or factory elbows.`
    }
    // NEC 358.24 radius validation
    if (conduitSize && values.cornerRadius !== undefined) {
      const minRadius = getNECMinimumRadius(conduitSize)
      if (values.cornerRadius === 0) {
        return `Radius must be at least ${minRadius.toFixed(1)}" for ${conduitSize} EMT per NEC 358.24. Sharp corners (radius=0) are not permitted.`
      }
      if (values.cornerRadius < minRadius) {
        return `Radius (${values.cornerRadius}") is below NEC 358.24 minimum of ${minRadius.toFixed(1)}" for ${conduitSize} EMT.`
      }
    }
  }
  return null
}

// ── Main Component ────────────────────────────────────────────────────────────

export function ConduitBendingChart() {
  const [brand, setBrand] = useState<Brand>('klein')
  const [bendType, setBendType] = useState<BendType>('90')
  const [conduitSize, setConduitSize] = useState<ConduitSize>('3/4"')
  const [stubLength, setStubLength] = useState<number>(12)
  const [offsetHeight, setOffsetHeight] = useState<number>(4)
  const [offsetAngle, setOffsetAngle] = useState<number>(30)
  const [rollingRise, setRollingRise] = useState<number>(6)
  const [rollingRun, setRollingRun] = useState<number>(8)
  const [rollingAngle, setRollingAngle] = useState<number>(30)
  const [saddleHeight, setSaddleHeight] = useState<number>(2)
  const [b2bDistance, setB2bDistance] = useState<number>(24)
  const [kickOffset, setKickOffset] = useState<number>(2)
  const [kickAngle, setKickAngle] = useState<number>(10)
  const [parallelCount, setParallelCount] = useState<number>(2)
  const [parallelSpacing, setParallelSpacing] = useState<number>(6)
  const [cornerAngle, setCornerAngle] = useState<number>(90)
  const [cornerRadius, setCornerRadius] = useState<number>(getNECMinimumRadius('3/4"'))

  const b = BRANDS[brand]
  const instructions = INSTRUCTIONS[brand][bendType]

  // ── Calculations ──

  const stubCalc = useMemo(() => ({
    mark: Math.max(0, stubLength - TAKEUP[conduitSize]).toFixed(1),
    takeup: TAKEUP[conduitSize],
    gain: GAIN[conduitSize],
  }), [stubLength, conduitSize])

  const mult = MULTIPLIERS.find(m => m.angle === offsetAngle)
  const offsetCalc = useMemo(() => mult ? {
    distance: (offsetHeight * mult.mult).toFixed(2),
    shrinkage: (offsetHeight * mult.shrinkDec).toFixed(3),
  } : null, [offsetHeight, mult])

  const rollingMult = MULTIPLIERS.find(m => m.angle === rollingAngle)
  const rollingCalc = useMemo(() => {
    if (!rollingMult) return null
    const travel = Math.sqrt(rollingRise * rollingRise + rollingRun * rollingRun)
    return {
      travel: travel.toFixed(2),
      distance: (travel * rollingMult.mult).toFixed(2),
      shrinkage: (travel * rollingMult.shrinkDec).toFixed(3),
    }
  }, [rollingRise, rollingRun, rollingMult])

  const saddleCalc = useMemo(() => {
    const outerMult = MULTIPLIERS.find(m => m.angle === 22.5)
    return outerMult ? {
      outerDistance: (saddleHeight * outerMult.mult).toFixed(2),
      shrinkage: (saddleHeight * 3 / 16).toFixed(3),
    } : null
  }, [saddleHeight])

  // Kick with 90° calculations
  const kickCalc = useMemo(() => {
    const kickMult = MULTIPLIERS.find(m => m.angle === kickAngle)
    return kickMult ? {
      kickDistance: (kickOffset * kickMult.mult).toFixed(2),
      kickShrinkage: (kickOffset * kickMult.shrinkDec).toFixed(3),
    } : null
  }, [kickOffset, kickAngle])

  // Parallel bends calculations
  const parallelCalc = useMemo(() => {
    const marks = []
    for (let i = 0; i < parallelCount; i++) {
      const offset = i * parallelSpacing
      marks.push({
        conduit: i + 1,
        offset: offset.toFixed(1),
        markPosition: (stubLength - TAKEUP[conduitSize] + offset).toFixed(1)
      })
    }
    return { marks }
  }, [parallelCount, parallelSpacing, stubLength, conduitSize])

  // Corner bend calculations
  const cornerCalc = useMemo(() => {
    const angleRad = (cornerAngle * Math.PI) / 180
    const halfAngleRad = angleRad / 2
    
    // For radiused corners: shrinkage = R × (θ - 2 sin(θ/2))
    // For sharp corners: use take-up based formula (approximation for hand bender)
    const shrinkage = cornerRadius > 0 
      ? cornerRadius * (angleRad - 2 * Math.sin(halfAngleRad))
      : 0.5 * (1 - Math.cos(halfAngleRad)) / Math.sin(halfAngleRad) * TAKEUP[conduitSize]
    
    return {
      shrinkage: shrinkage.toFixed(3),
      arcLength: cornerRadius > 0 ? (cornerRadius * angleRad).toFixed(2) : '0',
      bendAngle: (cornerAngle / 2).toFixed(1)
    }
  }, [cornerAngle, cornerRadius, conduitSize])

  // ── Bend Warning ──
  const warningValues: Record<string, number> = {}
  if (bendType === '90') { warningValues.stub = stubLength; warningValues.takeup = TAKEUP[conduitSize] }
  if (bendType === 'offset') { warningValues.height = offsetHeight }
  if (bendType === 'saddle3') { warningValues.height = saddleHeight }
  if (bendType === 'kickWith90') { warningValues.kickOffset = kickOffset; warningValues.kickAngle = kickAngle }
  if (bendType === 'parallel') { warningValues.parallelCount = parallelCount; warningValues.parallelSpacing = parallelSpacing }
  if (bendType === 'corner') { warningValues.cornerAngle = cornerAngle; warningValues.cornerRadius = cornerRadius }
  const warning = getBendWarning(bendType, warningValues, bendType === 'corner' ? conduitSize : undefined)

  // ── Calc values for diagram ──
  const calcValues: Record<string, string | number> = {}
  if (bendType === '90') {
    calcValues.mark   = stubCalc.mark
    calcValues.stub   = stubLength
    calcValues.takeup = stubCalc.takeup
  }
  if (bendType === 'offset') {
    calcValues.height    = offsetHeight
    calcValues.distance  = offsetCalc?.distance  || '?'
    calcValues.shrinkage = offsetCalc?.shrinkage || '?'
    calcValues.angle     = offsetAngle
  }
  if (bendType === 'saddle3') {
    calcValues.height        = saddleHeight
    calcValues.outerDistance = saddleCalc?.outerDistance || '?'
  }
  if (bendType === 'back2back') {
    calcValues.b2bDistance = b2bDistance
  }
  if (bendType === 'rollingOffset') {
    calcValues.rise   = rollingRise
    calcValues.run    = rollingRun
    calcValues.travel = rollingCalc?.travel || '?'
  }
  if (bendType === 'kickWith90') {
    calcValues.kickOffset = kickOffset
    calcValues.kickAngle = kickAngle
    calcValues.kickDistance = kickCalc?.kickDistance || '?'
    calcValues.kickShrinkage = kickCalc?.kickShrinkage || '?'
  }
  if (bendType === 'parallel') {
    calcValues.parallelCount = parallelCount
    calcValues.parallelSpacing = parallelSpacing
    calcValues.stub = stubLength
    calcValues.takeup = TAKEUP[conduitSize]
    calcValues.mark = stubCalc.mark
  }
  if (bendType === 'corner') {
    calcValues.cornerAngle = cornerAngle
    calcValues.cornerRadius = cornerRadius
    calcValues.shrinkage = cornerCalc?.shrinkage || '?'
    calcValues.arcLength = cornerCalc?.arcLength || '?'
    calcValues.bendAngle = cornerCalc?.bendAngle || '?'
  }

  const BEND_TYPES: { id: BendType; label: string }[] = [
    { id: '90',            label: '90°' },
    { id: 'offset',        label: 'Offset' },
    { id: 'saddle3',       label: '3-Pt Saddle' },
    { id: 'saddle4',       label: '4-Pt Saddle' },
    { id: 'back2back',     label: 'Back-to-Back' },
    { id: 'rollingOffset', label: 'Rolling Offset' },
    { id: 'kickWith90',    label: 'Kick w/ 90°' },
    { id: 'parallel',      label: 'Parallel Bends' },
    { id: 'corner',        label: 'Corner Bends' },
  ]

  const inputCls = 'h-11 w-full rounded-lg border border-[#374151] bg-[#18181b] px-3 font-mono text-sm text-[#F9FAFB] focus:border-[#F97316] focus:outline-none transition-colors'
  const labelCls = 'text-xs text-[#9CA3AF] mb-1 block'
  const cardCls = 'rounded-xl border border-[#1F2937] bg-[#18181b] p-4'

  return (
    <div className="flex flex-col gap-4">

      {/* ── Bender Selection ── */}
      <div>
        <label className={labelCls}>Your bender</label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(BRANDS) as Brand[]).map(key => {
            const brd = BRANDS[key]
            const isActive = brand === key
            return (
              <button
                key={key}
                onClick={() => setBrand(key)}
                className={`rounded-lg border px-3 py-2 text-left transition-all ${
                  isActive
                    ? 'border-[#F97316]/40 bg-[#F97316]/5'
                    : 'border-[#1F2937] bg-[#0D1117] hover:border-[#374151]'
                }`}
              >
                <span className={`text-xs font-medium ${isActive ? 'text-[#F9FAFB]' : 'text-[#a1a1aa]'}`}>
                  {brd.name}
                </span>
                <span className="block text-[10px] text-[#4B5563]">{brd.model}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Bender Marks Reference ── */}
      <div className={cardCls}>
        <p className="text-xs text-[#a1a1aa] mb-2">{b.name} — mark reference</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-[10px] text-[#4B5563] mb-0.5">Front</div>
            <div className="text-sm font-mono text-[#F9FAFB]">{b.marks.front}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#4B5563] mb-0.5">Center</div>
            <div className="text-sm font-mono text-[#9CA3AF]">{b.marks.center}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#4B5563] mb-0.5">Back</div>
            <div className="text-sm font-mono text-[#a1a1aa]">{b.marks.back}</div>
          </div>
        </div>
        <p className="mt-2 text-[10px] text-[#4B5563] leading-relaxed">{b.tip}</p>
      </div>

      {/* ── Bend Type Selector ── */}
      <div>
        <label className={labelCls}>Bend type</label>
        <div className="flex gap-1.5 flex-wrap">
          {BEND_TYPES.map(bt => (
            <button
              key={bt.id}
              onClick={() => setBendType(bt.id)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                bendType === bt.id
                  ? 'bg-[#F97316] text-[#0D1117]'
                  : 'border border-[#1F2937] text-[#a1a1aa] hover:text-[#9CA3AF] hover:border-[#374151]'
              }`}
            >
              {bt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Conduit Size ── */}
      <div>
        <label className={labelCls}>Conduit size</label>
        <div className="flex gap-1.5 flex-wrap">
          {CONDUIT_SIZES.map(size => (
            <button
              key={size}
              onClick={() => setConduitSize(size)}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-all ${
                conduitSize === size
                  ? 'bg-[#374151] text-[#F9FAFB]'
                  : 'border border-[#1F2937] text-[#a1a1aa] hover:border-[#374151]'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        <p className="mt-1 text-[10px] text-[#4B5563]">
          Take-up: {TAKEUP[conduitSize]}" · Gain: {GAIN[conduitSize]}"
        </p>
      </div>

      {/* ── Diagram ── */}
            <div className={`${cardCls} !p-0 overflow-hidden`}>
        <BendVisualization
          type={bendType}
          frontMark={b.marks.front}
          backMark={b.marks.back}
          calcValues={calcValues}
        />
      </div>

      {/* ── Warning ── */}
      {warning && (
        <div className="rounded-lg border border-[#DC2626]/20 bg-[#DC2626]/5 px-4 py-3">
          <p className="text-xs text-[#FCA5A5] leading-relaxed">{warning}</p>
        </div>
      )}

      {/* ── Quick Calcs ── */}

      {bendType === '90' && (
        <div className={cardCls}>
          <p className="text-xs text-[#a1a1aa] mb-3">90° stub-up calculator</p>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className={labelCls}>Stub length (in)</label>
              <input type="number" value={stubLength} onChange={e => setStubLength(Number(e.target.value))} className={inputCls} step={0.5} />
            </div>
            <div className="flex-1">
              <label className={labelCls}>Conduit</label>
              <select value={conduitSize} onChange={e => setConduitSize(e.target.value as ConduitSize)} className={inputCls}>
                {CONDUIT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="rounded-lg bg-[#0D1117] p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#a1a1aa]">Take-up</span>
              <span className="font-mono text-[#9CA3AF]">{stubCalc.takeup}"</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#a1a1aa]">Place {b.marks.front} at</span>
              <span className="font-mono font-bold text-[#F9FAFB] text-lg">{stubCalc.mark}"</span>
            </div>
            <p className="text-[10px] text-[#4B5563]">from the end of conduit · then pull to 90°</p>
          </div>
        </div>
      )}

      {bendType === 'offset' && (
        <div className={cardCls}>
          <p className="text-xs text-[#a1a1aa] mb-3">Offset calculator</p>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className={labelCls}>Offset height (in)</label>
              <input type="number" value={offsetHeight} onChange={e => setOffsetHeight(Number(e.target.value))} className={inputCls} step={0.25} />
            </div>
            <div className="flex-1">
              <label className={labelCls}>Angle</label>
              <select value={offsetAngle} onChange={e => setOffsetAngle(Number(e.target.value))} className={inputCls}>
                {MULTIPLIERS.map(m => <option key={m.angle} value={m.angle}>{m.angle}°</option>)}
              </select>
            </div>
          </div>
          {offsetCalc && (
            <div className="rounded-lg bg-[#0D1117] p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#a1a1aa]">Distance between bends</span>
                <span className="font-mono font-bold text-[#F9FAFB] text-lg">{offsetCalc.distance}"</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#a1a1aa]">Shrinkage (deduct from run)</span>
                <span className="font-mono text-[#F97316]">{offsetCalc.shrinkage}"</span>
              </div>
              <p className="text-[10px] text-[#4B5563]">
                {b.marks.front} to first mark → bend {offsetAngle}° → flip 180° → {b.marks.front} to second mark → bend {offsetAngle}°
              </p>
            </div>
          )}
        </div>
      )}

      {bendType === 'saddle3' && (
        <div className={cardCls}>
          <p className="text-xs text-[#a1a1aa] mb-3">3-point saddle calculator</p>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className={labelCls}>Obstacle height (in)</label>
              <input type="number" value={saddleHeight} onChange={e => setSaddleHeight(Number(e.target.value))} className={inputCls} step={0.25} />
            </div>
          </div>
          {saddleCalc && (
            <div className="rounded-lg bg-[#0D1117] p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#a1a1aa]">Outer marks from center</span>
                <span className="font-mono font-bold text-[#F9FAFB] text-lg">{saddleCalc.outerDistance}"</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#a1a1aa]">Total shrinkage</span>
                <span className="font-mono text-[#F97316]">{saddleCalc.shrinkage}"</span>
              </div>
              <p className="text-[10px] text-[#4B5563]">
                Center bend: 45° · Outer bends: 22.5° each · {b.marks.front} for alignment
              </p>
              <p className="text-[9px] text-[#3f3f46] mt-1">
                Note: Ugly's recommends 2.5× multiplier (no explicit shrinkage).
              </p>
            </div>
          )}
        </div>
      )}

      {bendType === 'saddle4' && (
        <div className={cardCls}>
          <p className="text-xs text-[#a1a1aa] mb-3">4-point saddle calculator</p>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className={labelCls}>Obstacle height (in)</label>
              <input type="number" value={saddleHeight} onChange={e => setSaddleHeight(Number(e.target.value))} className={inputCls} step={0.25} />
            </div>
          </div>
          <div className="rounded-lg bg-[#0D1117] p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#a1a1aa]">Distance between bends</span>
              <span className="font-mono font-bold text-[#F9FAFB] text-lg">{(saddleHeight * 1.414).toFixed(2)}"</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#a1a1aa]">Shrinkage per bend pair</span>
              <span className="font-mono text-[#F97316]">{(saddleHeight * 0.375).toFixed(3)}"</span>
            </div>
            <p className="text-[10px] text-[#4B5563]">
              All 4 bends at 45° · Two pairs in opposite directions
            </p>
          </div>
        </div>
      )}

      {bendType === 'back2back' && (
        <div className={cardCls}>
          <p className="text-xs text-[#a1a1aa] mb-3">Back-to-back calculator</p>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className={labelCls}>Back-to-back distance (in)</label>
              <input type="number" value={b2bDistance} onChange={e => setB2bDistance(Number(e.target.value))} className={inputCls} step={0.5} />
            </div>
            <div className="flex-1">
              <label className={labelCls}>Conduit</label>
              <select value={conduitSize} onChange={e => setConduitSize(e.target.value as ConduitSize)} className={inputCls}>
                {CONDUIT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="rounded-lg bg-[#0D1117] p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#a1a1aa]">Make first 90° stub</span>
              <span className="font-mono text-[#9CA3AF]">standard method</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#a1a1aa]">Place {b.marks.back} at</span>
              <span className="font-mono font-bold text-[#F9FAFB] text-lg">{b2bDistance}"</span>
            </div>
            <p className="text-[10px] text-[#4B5563]">
              from back of first 90° · then pull second 90°
            </p>
          </div>
        </div>
      )}

      {bendType === 'rollingOffset' && (
        <div className={cardCls}>
          <p className="text-xs text-[#a1a1aa] mb-3">Rolling offset calculator</p>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className={labelCls}>Rise / vertical (in)</label>
              <input type="number" value={rollingRise} onChange={e => setRollingRise(Number(e.target.value))} className={inputCls} step={0.25} />
            </div>
            <div className="flex-1">
              <label className={labelCls}>Run / horizontal (in)</label>
              <input type="number" value={rollingRun} onChange={e => setRollingRun(Number(e.target.value))} className={inputCls} step={0.25} />
            </div>
          </div>
          <div className="mb-3">
            <label className={labelCls}>Angle</label>
            <select value={rollingAngle} onChange={e => setRollingAngle(Number(e.target.value))} className={inputCls}>
              {MULTIPLIERS.map(m => <option key={m.angle} value={m.angle}>{m.angle}°</option>)}
            </select>
          </div>
          {rollingCalc && (
            <div className="rounded-lg bg-[#0D1117] p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#a1a1aa]">Travel (hypotenuse)</span>
                <span className="font-mono text-[#9CA3AF]">{rollingCalc.travel}"</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#a1a1aa]">Distance between bends</span>
                <span className="font-mono font-bold text-[#F9FAFB] text-lg">{rollingCalc.distance}"</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#a1a1aa]">Shrinkage</span>
                <span className="font-mono text-[#F97316]">{rollingCalc.shrinkage}"</span>
              </div>
              <p className="text-[10px] text-[#4B5563]">
                Bend 1 → rotate conduit to match planes → Bend 2 at same angle
              </p>
            </div>
          )}
        </div>
      )}

      {bendType === 'kickWith90' && (
        <div className={cardCls}>
          <p className="text-xs text-[#a1a1aa] mb-3">Kick with 90° calculator</p>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className={labelCls}>Kick offset from wall (in)</label>
              <input type="number" value={kickOffset} onChange={e => setKickOffset(Number(e.target.value))} className={inputCls} step={0.25} min={0.5} max={12} />
            </div>
            <div className="flex-1">
              <label className={labelCls}>Kick angle</label>
              <select value={kickAngle} onChange={e => setKickAngle(Number(e.target.value))} className={inputCls}>
                <option value={5}>5°</option>
                <option value={10}>10°</option>
                <option value={15}>15°</option>
                <option value={20}>20°</option>
              </select>
            </div>
          </div>
          {kickCalc && (
            <div className="rounded-lg bg-[#0D1117] p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#a1a1aa]">Distance from 90° to kick</span>
                <span className="font-mono font-bold text-[#F9FAFB] text-lg">{kickCalc.kickDistance}"</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#a1a1aa]">Shrinkage (deduct from run)</span>
                <span className="font-mono text-[#F97316]">{kickCalc.kickShrinkage}"</span>
              </div>
              <p className="text-[10px] text-[#4B5563]">
                Make 90° first using standard stub-up method. Then measure {kickCalc.kickDistance}" from back of 90°, place {b.marks.front} at mark, bend {kickAngle}° kick.
              </p>
            </div>
          )}
        </div>
      )}

      {bendType === 'parallel' && (
        <div className={cardCls}>
          <p className="text-xs text-[#a1a1aa] mb-3">Parallel bends calculator</p>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className={labelCls}>Number of conduits</label>
              <input type="number" value={parallelCount} onChange={e => setParallelCount(Number(e.target.value))} className={inputCls} step={1} min={2} max={10} />
            </div>
            <div className="flex-1">
              <label className={labelCls}>Spacing between centers (in)</label>
              <input type="number" value={parallelSpacing} onChange={e => setParallelSpacing(Number(e.target.value))} className={inputCls} step={0.5} min={2} max={24} />
            </div>
          </div>
          <div className="mb-3">
            <label className={labelCls}>Stub length (in)</label>
            <input type="number" value={stubLength} onChange={e => setStubLength(Number(e.target.value))} className={inputCls} step={0.5} />
          </div>
          <div className="mb-3">
            <label className={labelCls}>Conduit size</label>
            <select value={conduitSize} onChange={e => setConduitSize(e.target.value as ConduitSize)} className={inputCls}>
              {CONDUIT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {parallelCalc && (
            <div className="rounded-lg bg-[#0D1117] p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#a1a1aa]">Take-up for {conduitSize}</span>
                <span className="font-mono text-[#9CA3AF]">{TAKEUP[conduitSize]}"</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#a1a1aa]">Base mark position</span>
                <span className="font-mono font-bold text-[#F9FAFB] text-lg">{stubCalc.mark}"</span>
              </div>
              <div className="mt-2 pt-2 border-t border-[#1F2937]">
                <p className="text-xs text-[#a1a1aa] mb-2">Individual conduit marks:</p>
                <div className="grid grid-cols-2 gap-2">
                  {parallelCalc.marks.map(mark => (
                    <div key={mark.conduit} className="flex justify-between text-xs">
                      <span className="text-[#9CA3AF]">Conduit #{mark.conduit}</span>
                      <span className="font-mono text-[#F9FAFB]">{mark.markPosition}"</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-[#4B5563] mt-2">
                Place {b.marks.front} at calculated mark for each conduit. All bends at same angle ({offsetAngle}° recommended).
              </p>
            </div>
          )}
        </div>
      )}

      {bendType === 'corner' && (
        <div className={cardCls}>
          <p className="text-xs text-[#a1a1aa] mb-3">Corner bend calculator</p>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className={labelCls}>Corner angle</label>
              <input type="number" value={cornerAngle} onChange={e => setCornerAngle(Number(e.target.value))} className={inputCls} step={5} min={45} max={135} />
            </div>
            <div className="flex-1">
              <label className={labelCls}>Radius (in)</label>
              <input 
                type="number" 
                value={cornerRadius} 
                onChange={e => setCornerRadius(Number(e.target.value))} 
                className={inputCls} 
                step={0.5} 
                min={getNECMinimumRadius(conduitSize)} 
                max={24} 
              />
            </div>
          </div>
          <div className="mb-3">
            <label className={labelCls}>Conduit size</label>
            <select value={conduitSize} onChange={e => setConduitSize(e.target.value as ConduitSize)} className={inputCls}>
              {CONDUIT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {cornerCalc && (
            <div className="rounded-lg bg-[#0D1117] p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#a1a1aa]">Each bend angle</span>
                <span className="font-mono font-bold text-[#F9FAFB] text-lg">{cornerCalc.bendAngle}°</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#a1a1aa]">Total shrinkage</span>
                <span className="font-mono text-[#F97316]">{cornerCalc.shrinkage}"</span>
              </div>
              {cornerRadius > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#a1a1aa]">Arc length</span>
                  <span className="font-mono text-[#9CA3AF]">{cornerCalc.arcLength}"</span>
                </div>
              )}
              <p className="text-[10px] text-[#4B5563]">
                {cornerRadius > 0 
                  ? `Use segmented bends or factory elbow for ${cornerRadius}" radius.`
                  : `Make two ${cornerCalc.bendAngle}° bends with ${b.marks.front} alignment.`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Multiplier Reference ── */}
      <div className={cardCls}>
        <p className="text-xs text-[#a1a1aa] mb-2">Offset multiplier reference</p>
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="text-[#4B5563]">
              <th className="py-1.5 text-left font-normal">Angle</th>
              <th className="py-1.5 text-center font-normal">Multiplier</th>
              <th className="py-1.5 text-right font-normal">Shrink/inch</th>
            </tr>
          </thead>
          <tbody>
            {MULTIPLIERS.map((row, i) => {
              const isSelected = (bendType === 'offset' && row.angle === offsetAngle) ||
                                 (bendType === 'rollingOffset' && row.angle === rollingAngle)
              return (
                <tr
                  key={i}
                  onClick={() => {
                    if (bendType === 'offset') setOffsetAngle(row.angle)
                    if (bendType === 'rollingOffset') setRollingAngle(row.angle)
                  }}
                  className={`border-t border-[#1F2937] cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#F97316]/5' : 'hover:bg-[#1F2937]/50'
                  }`}
                >
                  <td className="py-2">
                    <span className={isSelected ? 'text-[#F9FAFB] font-bold' : 'text-[#9CA3AF]'}>{row.angle}°</span>
                  </td>
                  <td className="py-2 text-center">
                    <span className={isSelected ? 'text-[#F9FAFB]' : 'text-[#a1a1aa]'}>{row.mult}</span>
                  </td>
                  <td className="py-2 text-right">
                    <span className={isSelected ? 'text-[#F97316]' : 'text-[#4B5563]'}>{row.shrink}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── 90° Take-Up Reference ── */}
      <div className={cardCls}>
        <p className="text-xs text-[#a1a1aa] mb-2">90° take-up / deduct reference</p>
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="text-[#4B5563]">
              <th className="py-1.5 text-left font-normal">EMT size</th>
              <th className="py-1.5 text-center font-normal">Take-up</th>
              <th className="py-1.5 text-right font-normal">Gain</th>
            </tr>
          </thead>
          <tbody>
            {CONDUIT_SIZES.map((size, i) => {
              const isSelected = size === conduitSize
              return (
                <tr
                  key={i}
                  onClick={() => setConduitSize(size)}
                  className={`border-t border-[#1F2937] cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#374151]/30' : 'hover:bg-[#1F2937]/50'
                  }`}
                >
                  <td className="py-2">
                    <span className={isSelected ? 'text-[#F9FAFB] font-bold' : 'text-[#9CA3AF]'}>{size}</span>
                  </td>
                  <td className="py-2 text-center">
                    <span className={isSelected ? 'text-[#F9FAFB]' : 'text-[#a1a1aa]'}>{TAKEUP[size]}"</span>
                  </td>
                  <td className="py-2 text-right">
                    <span className={isSelected ? 'text-[#F9FAFB]' : 'text-[#4B5563]'}>{GAIN[size]}"</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── Step-by-Step Instructions ── */}
      <div>
        <p className="text-xs text-[#a1a1aa] mb-3">
          {b.name} — {BEND_TYPES.find(bt => bt.id === bendType)?.label} steps
        </p>
        <div className="flex flex-col gap-2">
          {(instructions?.steps ?? []).map((step, i) => (
            <div key={i} className="flex gap-3 rounded-lg bg-[#18181b] border border-[#1F2937] p-3">
              <span className="shrink-0 w-6 h-6 flex items-center justify-center text-[11px] font-bold font-mono rounded-md bg-[#F97316]/10 text-[#F97316]">
                {i + 1}
              </span>
              <p className="text-xs text-[#D1D5DB] leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
        {instructions?.pro && (
          <div className="mt-2 rounded-lg border-l-2 border-[#F97316] bg-[#F97316]/5 px-4 py-3">
            <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
              <span className="font-bold text-[#F97316]">Example: </span>
              {instructions.pro}
            </p>
          </div>
        )}
      </div>

    </div>
  )
}


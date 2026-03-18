'use client'

import { useState, useMemo } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

type Brand = 'klein' | 'ideal' | 'greenlee' | 'milwaukee'
type BendType = '90' | 'offset' | 'saddle3' | 'saddle4' | 'back2back' | 'rollingOffset' | 'kickWith90'
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
      pro: 'Obstacle height 2": Center mark at obstacle center, bend 45°. Outer marks 2 × 2.6 = 5.2" from center each side, bend 22.5° each.',
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

const PIPE = '#9CA3AF'       // metallic gray
const PIPE_DARK = '#6B7280'  // darker edge
const MARK_RED = '#DC2626'   // pencil mark red
const DIM_LINE = '#6B7280'   // dimension lines
const DIM_TEXT = '#9CA3AF'   // dimension text
const BG_SURFACE = '#1F2937' // work surface

function BendDiagram({ type, brand, calcValues }: {
  type: BendType
  brand: Brand
  calcValues?: Record<string, string | number>
}) {
  const b = BRANDS[brand]

  if (type === '90') return (
    <svg viewBox="0 0 320 200" className="w-full" style={{ maxHeight: '180px' }}>
      {/* Floor line */}
      <line x1="0" y1="170" x2="320" y2="170" stroke={BG_SURFACE} strokeWidth="1" />
      {/* Horizontal run */}
      <line x1="20" y1="155" x2="140" y2="155" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <line x1="20" y1="155" x2="140" y2="155" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Bend arc */}
      <path d="M 140 155 Q 140 60 180 45" fill="none" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <path d="M 140 155 Q 140 60 180 45" fill="none" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Vertical stub */}
      <line x1="180" y1="45" x2="180" y2="15" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <line x1="180" y1="45" x2="180" y2="15" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Pencil mark on pipe */}
      <line x1="100" y1="147" x2="100" y2="163" stroke={MARK_RED} strokeWidth="2" />
      <text x="100" y="178" fill={MARK_RED} fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)">
        {calcValues?.mark ? `${calcValues.mark}"` : 'mark'}
      </text>
      {/* Arrow callout */}
      <line x1="100" y1="140" x2="100" y2="125" stroke={DIM_LINE} strokeWidth="0.5" strokeDasharray="2,2" />
      <text x="100" y="120" fill={DIM_TEXT} fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">
        {b.marks.front} here
      </text>
      {/* Stub dimension */}
      <line x1="200" y1="15" x2="200" y2="155" stroke={DIM_LINE} strokeWidth="0.5" strokeDasharray="3,2" />
      <line x1="195" y1="15" x2="205" y2="15" stroke={DIM_LINE} strokeWidth="0.5" />
      <line x1="195" y1="155" x2="205" y2="155" stroke={DIM_LINE} strokeWidth="0.5" />
      <text x="215" y="88" fill={DIM_TEXT} fontSize="9" fontFamily="var(--font-mono)" dominantBaseline="middle">
        {calcValues?.stub ? `${calcValues.stub}"` : 'stub'}
      </text>
      {/* Take-up label */}
      <text x="25" y="145" fill={DIM_TEXT} fontSize="8" fontFamily="var(--font-mono)">
        take-up: {calcValues?.takeup || '—'}"
      </text>
    </svg>
  )

  if (type === 'offset') return (
    <svg viewBox="0 0 320 180" className="w-full" style={{ maxHeight: '160px' }}>
      {/* Floor */}
      <line x1="0" y1="160" x2="320" y2="160" stroke={BG_SURFACE} strokeWidth="1" />
      {/* Lower run */}
      <line x1="20" y1="130" x2="90" y2="130" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <line x1="20" y1="130" x2="90" y2="130" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* First bend (up) */}
      <line x1="90" y1="130" x2="155" y2="60" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <line x1="90" y1="130" x2="155" y2="60" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Upper run */}
      <line x1="155" y1="60" x2="300" y2="60" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <line x1="155" y1="60" x2="300" y2="60" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Pencil marks */}
      <line x1="90" y1="122" x2="90" y2="138" stroke={MARK_RED} strokeWidth="2" />
      <line x1="155" y1="52" x2="155" y2="68" stroke={MARK_RED} strokeWidth="2" />
      {/* Mark labels */}
      <text x="90" y="150" fill={MARK_RED} fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">bend 1</text>
      <text x="155" y="45" fill={MARK_RED} fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">bend 2</text>
      {/* Distance dimension */}
      <line x1="90" y1="25" x2="155" y2="25" stroke={DIM_LINE} strokeWidth="0.5" />
      <line x1="90" y1="20" x2="90" y2="30" stroke={DIM_LINE} strokeWidth="0.5" />
      <line x1="155" y1="20" x2="155" y2="30" stroke={DIM_LINE} strokeWidth="0.5" />
      <text x="122" y="20" fill={DIM_TEXT} fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)">
        {calcValues?.distance ? `${calcValues.distance}"` : 'dist'}
      </text>
      {/* Height dimension */}
      <line x1="40" y1="60" x2="40" y2="130" stroke={DIM_LINE} strokeWidth="0.5" strokeDasharray="3,2" />
      <line x1="35" y1="60" x2="45" y2="60" stroke={DIM_LINE} strokeWidth="0.5" />
      <line x1="35" y1="130" x2="45" y2="130" stroke={DIM_LINE} strokeWidth="0.5" />
      <text x="30" y="98" fill={DIM_TEXT} fontSize="8" fontFamily="var(--font-mono)" textAnchor="end" dominantBaseline="middle">
        {calcValues?.height || '—'}"
      </text>
      {/* Arrow callout */}
      <text x="80" y="115" fill={DIM_TEXT} fontSize="7" textAnchor="end" fontFamily="var(--font-mono)">
        {b.marks.front} →
      </text>
    </svg>
  )

  if (type === 'saddle3') return (
    <svg viewBox="0 0 340 180" className="w-full" style={{ maxHeight: '160px' }}>
      <line x1="0" y1="160" x2="340" y2="160" stroke={BG_SURFACE} strokeWidth="1" />
      {/* Obstacle */}
      <rect x="130" y="100" width="80" height="30" fill={BG_SURFACE} stroke="#374151" strokeWidth="1" rx="2" />
      <text x="170" y="119" fill="#4B5563" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">obstacle</text>
      {/* Left run */}
      <line x1="20" y1="125" x2="100" y2="125" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <line x1="20" y1="125" x2="100" y2="125" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Up to center */}
      <line x1="100" y1="125" x2="170" y2="65" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <line x1="100" y1="125" x2="170" y2="65" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Down from center */}
      <line x1="170" y1="65" x2="240" y2="125" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <line x1="170" y1="65" x2="240" y2="125" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Right run */}
      <line x1="240" y1="125" x2="320" y2="125" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <line x1="240" y1="125" x2="320" y2="125" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Marks */}
      <line x1="100" y1="117" x2="100" y2="133" stroke={MARK_RED} strokeWidth="2" />
      <line x1="170" y1="57" x2="170" y2="73" stroke={MARK_RED} strokeWidth="2" />
      <line x1="240" y1="117" x2="240" y2="133" stroke={MARK_RED} strokeWidth="2" />
      {/* Labels */}
      <text x="100" y="145" fill={MARK_RED} fontSize="7" textAnchor="middle" fontFamily="var(--font-mono)">22.5°</text>
      <text x="170" y="52" fill={MARK_RED} fontSize="7" textAnchor="middle" fontFamily="var(--font-mono)">45° center</text>
      <text x="240" y="145" fill={MARK_RED} fontSize="7" textAnchor="middle" fontFamily="var(--font-mono)">22.5°</text>
    </svg>
  )

  if (type === 'saddle4') return (
    <svg viewBox="0 0 360 180" className="w-full" style={{ maxHeight: '160px' }}>
      <line x1="0" y1="160" x2="360" y2="160" stroke={BG_SURFACE} strokeWidth="1" />
      {/* Obstacle (wider) */}
      <rect x="100" y="100" width="160" height="30" fill={BG_SURFACE} stroke="#374151" strokeWidth="1" rx="2" />
      <text x="180" y="119" fill="#4B5563" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">obstacle</text>
      {/* Left run */}
      <line x1="20" y1="125" x2="80" y2="125" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <line x1="20" y1="125" x2="80" y2="125" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Up bend 1 */}
      <line x1="80" y1="125" x2="120" y2="65" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <line x1="80" y1="125" x2="120" y2="65" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Flat top */}
      <line x1="120" y1="65" x2="240" y2="65" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <line x1="120" y1="65" x2="240" y2="65" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Down bend 2 */}
      <line x1="240" y1="65" x2="280" y2="125" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <line x1="240" y1="65" x2="280" y2="125" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Right run */}
      <line x1="280" y1="125" x2="340" y2="125" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <line x1="280" y1="125" x2="340" y2="125" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Marks */}
      {[80, 120, 240, 280].map(x => (
        <line key={x} x1={x} y1={x > 200 ? (x === 240 ? 57 : 117) : (x === 120 ? 57 : 117)} x2={x} y2={x > 200 ? (x === 240 ? 73 : 133) : (x === 120 ? 73 : 133)} stroke={MARK_RED} strokeWidth="2" />
      ))}
      <text x="80" y="145" fill={MARK_RED} fontSize="7" textAnchor="middle" fontFamily="var(--font-mono)">45°</text>
      <text x="120" y="52" fill={MARK_RED} fontSize="7" textAnchor="middle" fontFamily="var(--font-mono)">45°</text>
      <text x="240" y="52" fill={MARK_RED} fontSize="7" textAnchor="middle" fontFamily="var(--font-mono)">45°</text>
      <text x="280" y="145" fill={MARK_RED} fontSize="7" textAnchor="middle" fontFamily="var(--font-mono)">45°</text>
    </svg>
  )

  if (type === 'back2back') return (
    <svg viewBox="0 0 300 200" className="w-full" style={{ maxHeight: '180px' }}>
      <line x1="0" y1="185" x2="300" y2="185" stroke={BG_SURFACE} strokeWidth="1" />
      {/* First stub */}
      <line x1="80" y1="170" x2="80" y2="70" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <line x1="80" y1="170" x2="80" y2="70" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* First arc */}
      <path d="M 80 70 Q 80 35 110 35" fill="none" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <path d="M 80 70 Q 80 35 110 35" fill="none" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Horizontal */}
      <line x1="110" y1="35" x2="190" y2="35" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <line x1="110" y1="35" x2="190" y2="35" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Second arc */}
      <path d="M 190 35 Q 220 35 220 70" fill="none" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <path d="M 190 35 Q 220 35 220 70" fill="none" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Second stub */}
      <line x1="220" y1="70" x2="220" y2="170" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <line x1="220" y1="70" x2="220" y2="170" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Star mark callout for second bend */}
      <circle cx="220" cy="110" r="3" fill="none" stroke={MARK_RED} strokeWidth="1.5" />
      <text x="235" y="113" fill={MARK_RED} fontSize="8" fontFamily="var(--font-mono)">{b.marks.back}</text>
      {/* Back-to-back dimension */}
      <line x1="80" y1="180" x2="220" y2="180" stroke={DIM_LINE} strokeWidth="0.5" />
      <line x1="80" y1="175" x2="80" y2="185" stroke={DIM_LINE} strokeWidth="0.5" />
      <line x1="220" y1="175" x2="220" y2="185" stroke={DIM_LINE} strokeWidth="0.5" />
      <text x="150" y="178" fill={DIM_TEXT} fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)">
        {calcValues?.b2bDistance ? `${calcValues.b2bDistance}"` : 'back-to-back'}
      </text>
    </svg>
  )

  if (type === 'rollingOffset') return (
    <svg viewBox="0 0 300 180" className="w-full" style={{ maxHeight: '160px' }}>
      <line x1="0" y1="160" x2="300" y2="160" stroke={BG_SURFACE} strokeWidth="1" />
      {/* Right triangle */}
      <line x1="60" y1="130" x2="180" y2="130" stroke={DIM_LINE} strokeWidth="0.5" strokeDasharray="3,2" />
      <line x1="180" y1="130" x2="180" y2="50" stroke={DIM_LINE} strokeWidth="0.5" strokeDasharray="3,2" />
      {/* Travel (hypotenuse) = the actual pipe */}
      <line x1="60" y1="130" x2="180" y2="50" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <line x1="60" y1="130" x2="180" y2="50" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Marks */}
      <circle cx="60" cy="130" r="4" fill="none" stroke={MARK_RED} strokeWidth="1.5" />
      <circle cx="180" cy="50" r="4" fill="none" stroke={MARK_RED} strokeWidth="1.5" />
      {/* Labels */}
      <text x="120" y="148" fill={DIM_TEXT} fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)">
        run {calcValues?.run || '—'}"
      </text>
      <text x="195" y="93" fill={DIM_TEXT} fontSize="9" fontFamily="var(--font-mono)">
        rise {calcValues?.rise || '—'}"
      </text>
      <text x="105" y="82" fill={PIPE} fontSize="9" fontFamily="var(--font-mono)">
        travel {calcValues?.travel || '—'}"
      </text>
      <text x="55" y="150" fill={MARK_RED} fontSize="7" textAnchor="middle" fontFamily="var(--font-mono)">bend 1</text>
      <text x="185" y="42" fill={MARK_RED} fontSize="7" fontFamily="var(--font-mono)">bend 2</text>
    </svg>
  )

  // kickWith90
  return (
    <svg viewBox="0 0 300 200" className="w-full" style={{ maxHeight: '180px' }}>
      <line x1="0" y1="185" x2="300" y2="185" stroke={BG_SURFACE} strokeWidth="1" />
      {/* Wall */}
      <rect x="245" y="10" width="10" height="175" fill={BG_SURFACE} />
      <text x="260" y="100" fill="#4B5563" fontSize="8" fontFamily="var(--font-mono)" transform="rotate(90,260,100)">wall</text>
      {/* Horizontal run */}
      <line x1="20" y1="150" x2="130" y2="150" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <line x1="20" y1="150" x2="130" y2="150" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Bend arc to vertical */}
      <path d="M 130 150 Q 130 80 160 55" fill="none" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <path d="M 130 150 Q 130 80 160 55" fill="none" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Vertical with slight kick */}
      <line x1="160" y1="55" x2="170" y2="20" stroke={PIPE_DARK} strokeWidth="8" strokeLinecap="round" />
      <line x1="160" y1="55" x2="170" y2="20" stroke={PIPE} strokeWidth="5" strokeLinecap="round" />
      {/* Kick dimension */}
      <line x1="170" y1="20" x2="245" y2="20" stroke={DIM_LINE} strokeWidth="0.5" strokeDasharray="3,2" />
      <text x="207" y="15" fill={DIM_TEXT} fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">kick offset</text>
    </svg>
  )
}

// ── Impossible Bend Detection ────────────────────────────────────────────────

function getBendWarning(type: BendType, values: Record<string, number>): string | null {
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

  // ── Bend Warning ──
  const warningValues: Record<string, number> = {}
  if (bendType === '90') { warningValues.stub = stubLength; warningValues.takeup = TAKEUP[conduitSize] }
  if (bendType === 'offset') { warningValues.height = offsetHeight }
  if (bendType === 'saddle3') { warningValues.height = saddleHeight }
  const warning = getBendWarning(bendType, warningValues)

  // ── Calc values for diagram ──
  const calcValues: Record<string, string | number> = {}
  if (bendType === '90') { calcValues.mark = stubCalc.mark; calcValues.stub = stubLength; calcValues.takeup = stubCalc.takeup }
  if (bendType === 'offset') { calcValues.distance = offsetCalc?.distance || ''; calcValues.height = offsetHeight }
  if (bendType === 'back2back') { calcValues.b2bDistance = b2bDistance }
  if (bendType === 'rollingOffset') { calcValues.rise = rollingRise; calcValues.run = rollingRun; calcValues.travel = rollingCalc?.travel || '' }

  const BEND_TYPES: { id: BendType; label: string }[] = [
    { id: '90',            label: '90°' },
    { id: 'offset',        label: 'Offset' },
    { id: 'saddle3',       label: '3-Pt Saddle' },
    { id: 'saddle4',       label: '4-Pt Saddle' },
    { id: 'back2back',     label: 'Back-to-Back' },
    { id: 'rollingOffset', label: 'Rolling Offset' },
    { id: 'kickWith90',    label: 'Kick w/ 90°' },
  ]

  const inputCls = 'h-11 w-full rounded-lg border border-[#374151] bg-[#111827] px-3 font-mono text-sm text-[#F9FAFB] focus:border-[#F97316] focus:outline-none transition-colors'
  const labelCls = 'text-xs text-[#9CA3AF] mb-1 block'
  const cardCls = 'rounded-xl border border-[#1F2937] bg-[#111827] p-4'

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
                <span className={`text-xs font-medium ${isActive ? 'text-[#F9FAFB]' : 'text-[#6B7280]'}`}>
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
        <p className="text-xs text-[#6B7280] mb-2">{b.name} — mark reference</p>
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
            <div className="text-sm font-mono text-[#6B7280]">{b.marks.back}</div>
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
                  : 'border border-[#1F2937] text-[#6B7280] hover:text-[#9CA3AF] hover:border-[#374151]'
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
                  : 'border border-[#1F2937] text-[#6B7280] hover:border-[#374151]'
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
      <div className={`${cardCls} !p-3`}>
        <BendDiagram type={bendType} brand={brand} calcValues={calcValues} />
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
          <p className="text-xs text-[#6B7280] mb-3">90° stub-up calculator</p>
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
              <span className="text-[#6B7280]">Take-up</span>
              <span className="font-mono text-[#9CA3AF]">{stubCalc.takeup}"</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Place {b.marks.front} at</span>
              <span className="font-mono font-bold text-[#F9FAFB] text-lg">{stubCalc.mark}"</span>
            </div>
            <p className="text-[10px] text-[#4B5563]">from the end of conduit · then pull to 90°</p>
          </div>
        </div>
      )}

      {bendType === 'offset' && (
        <div className={cardCls}>
          <p className="text-xs text-[#6B7280] mb-3">Offset calculator</p>
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
                <span className="text-[#6B7280]">Distance between bends</span>
                <span className="font-mono font-bold text-[#F9FAFB] text-lg">{offsetCalc.distance}"</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Shrinkage (deduct from run)</span>
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
          <p className="text-xs text-[#6B7280] mb-3">3-point saddle calculator</p>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className={labelCls}>Obstacle height (in)</label>
              <input type="number" value={saddleHeight} onChange={e => setSaddleHeight(Number(e.target.value))} className={inputCls} step={0.25} />
            </div>
          </div>
          {saddleCalc && (
            <div className="rounded-lg bg-[#0D1117] p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Outer marks from center</span>
                <span className="font-mono font-bold text-[#F9FAFB] text-lg">{saddleCalc.outerDistance}"</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Total shrinkage</span>
                <span className="font-mono text-[#F97316]">{saddleCalc.shrinkage}"</span>
              </div>
              <p className="text-[10px] text-[#4B5563]">
                Center bend: 45° · Outer bends: 22.5° each · {b.marks.front} for alignment
              </p>
            </div>
          )}
        </div>
      )}

      {bendType === 'saddle4' && (
        <div className={cardCls}>
          <p className="text-xs text-[#6B7280] mb-3">4-point saddle calculator</p>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className={labelCls}>Obstacle height (in)</label>
              <input type="number" value={saddleHeight} onChange={e => setSaddleHeight(Number(e.target.value))} className={inputCls} step={0.25} />
            </div>
          </div>
          <div className="rounded-lg bg-[#0D1117] p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Distance between bends</span>
              <span className="font-mono font-bold text-[#F9FAFB] text-lg">{(saddleHeight * 1.414).toFixed(2)}"</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Shrinkage per bend pair</span>
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
          <p className="text-xs text-[#6B7280] mb-3">Back-to-back calculator</p>
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
              <span className="text-[#6B7280]">Make first 90° stub</span>
              <span className="font-mono text-[#9CA3AF]">standard method</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Place {b.marks.back} at</span>
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
          <p className="text-xs text-[#6B7280] mb-3">Rolling offset calculator</p>
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
                <span className="text-[#6B7280]">Travel (hypotenuse)</span>
                <span className="font-mono text-[#9CA3AF]">{rollingCalc.travel}"</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Distance between bends</span>
                <span className="font-mono font-bold text-[#F9FAFB] text-lg">{rollingCalc.distance}"</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Shrinkage</span>
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
          <p className="text-xs text-[#6B7280] mb-3">Kick with 90° — method</p>
          <div className="rounded-lg bg-[#0D1117] p-3 space-y-2">
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Make the 90° first using standard stub-up method. Then add a small kick (10-15°) at the top to offset the stub from the wall/surface. Adjust by eye and check with a tape measure.
            </p>
          </div>
        </div>
      )}

      {/* ── Multiplier Reference ── */}
      <div className={cardCls}>
        <p className="text-xs text-[#6B7280] mb-2">Offset multiplier reference</p>
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
                    <span className={isSelected ? 'text-[#F9FAFB]' : 'text-[#6B7280]'}>{row.mult}</span>
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
        <p className="text-xs text-[#6B7280] mb-2">90° take-up / deduct reference</p>
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
                    <span className={isSelected ? 'text-[#F9FAFB]' : 'text-[#6B7280]'}>{TAKEUP[size]}"</span>
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
        <p className="text-xs text-[#6B7280] mb-3">
          {b.name} — {BEND_TYPES.find(bt => bt.id === bendType)?.label} steps
        </p>
        <div className="flex flex-col gap-2">
          {instructions.steps.map((step, i) => (
            <div key={i} className="flex gap-3 rounded-lg bg-[#111827] border border-[#1F2937] p-3">
              <span className="shrink-0 w-6 h-6 flex items-center justify-center text-[11px] font-bold font-mono rounded-md bg-[#F97316]/10 text-[#F97316]">
                {i + 1}
              </span>
              <p className="text-xs text-[#D1D5DB] leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
        {instructions.pro && (
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

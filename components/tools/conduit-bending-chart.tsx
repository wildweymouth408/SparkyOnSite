'use client'

import { useState } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

type Brand = 'klein' | 'ideal' | 'greenlee' | 'milwaukee'
type BendType = '90' | 'offset' | 'saddle3' | 'saddle4' | 'back2back' | 'rollingOffset' | 'parallel'
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

const CONDUIT_SIZES: ConduitSize[] = ['1/2"', '3/4"', '1"', '1-1/4"', '1-1/2"', '2"']

// ── Brand Config ──────────────────────────────────────────────────────────────

const BRANDS: Record<Brand, {
  name: string
  model: string
  color: string
  handleColor: string
  marks: { front: string; back: string; center: string }
  tip: string
}> = {
  klein: {
    name: 'Klein Tools',
    model: '51600 Series',
    color: '#e65c00',
    handleColor: '#cc5200',
    marks: { front: 'Arrow ▶', back: 'Star ★', center: 'Rim Notch' },
    tip: 'Most common bender. Orange handle. Arrow is your primary mark for 90s and offsets.',
  },
  ideal: {
    name: 'Ideal Industries',
    model: '74-028 / 74-036',
    color: '#007acc',
    handleColor: '#005a9c',
    marks: { front: 'Hook Mark', back: 'Center Notch', center: 'Degree Marks' },
    tip: 'Blue/grey handles. "Hook Mark" = same concept as Klein Arrow. Degree marks engraved on shoe side.',
  },
  greenlee: {
    name: 'Greenlee',
    model: '840 / 851 / 852',
    color: '#009966',
    handleColor: '#007a4d',
    marks: { front: 'Arrow Mark', back: 'Star Notch', center: 'Degree Notches' },
    tip: 'Green handles. Degree notches (10°, 22.5°, 30°, 45°) clearly engraved on shoe edge.',
  },
  milwaukee: {
    name: 'Milwaukee',
    model: '48-22-4001 / 4002',
    color: '#c62828',
    handleColor: '#a32020',
    marks: { front: 'Arrow ▶', back: 'Star ★', center: 'Degree Marks' },
    tip: 'Red handles. Same mark layout as Klein. Some models have built-in angle sight window.',
  },
}

// ── Brand Instructions ────────────────────────────────────────────────────────

const INSTRUCTIONS: Record<Brand, Record<BendType, { steps: string[]; pro?: string }>> = {
  klein: {
    '90': {
      steps: [
        'Measure your required stub-up length from the end of the conduit.',
        'Find your conduit size in the Take-Up chart — subtract that amount from your stub length.',
        'Mark that calculated point on the conduit with a pencil or marker.',
        'Lay the conduit in the bender groove and slide until the ARROW (▶) lines up exactly with your mark.',
        'Place your foot firmly on the foot pedal to hold the bender steady.',
        'Pull the handle back smoothly until the bender reads 90°.',
        'Check with a torpedo level — a slight twist is common; correct before the conduit cools.',
      ],
      pro: 'For a 3/4" EMT stub of 12": mark at 12" − 6" = 6" from end. Arrow to the 6" mark, pull to 90°.',
    },
    'offset': {
      steps: [
        'Measure the obstacle height you need to clear.',
        'Pick your angle — 30° works for most offsets. 45° for tighter spaces.',
        'Distance between bends = obstacle height × multiplier from the chart above.',
        'Shrinkage = obstacle height × shrink-per-inch from the chart. Deduct this from your overall run.',
        'Mark the first bend point on the conduit.',
        'Align ARROW (▶) to first mark. Bend to your chosen angle.',
        'Measure the calculated distance from the first mark toward the second end. Mark it.',
        'Roll the conduit 180° and flip the bender 180°.',
        'Align ARROW (▶) to second mark. Bend to the exact same angle.',
        'Both legs should be parallel. If not, tweak the second bend slightly.',
      ],
      pro: 'For a 6" offset at 30°: distance = 6 × 2.0 = 12" between marks. Shrinkage = 6 × 0.25" = 1.5".',
    },
    'saddle3': {
      steps: [
        'Locate and mark the center of the obstacle on the conduit.',
        'Align the RIM NOTCH (center of shoe) directly to your center mark.',
        'Bend the center to 45°.',
        'For obstacles up to 1" high: mark 2.5" each side of center for outer bends.',
        'For larger obstacles: outer marks = obstacle diameter/2 each side.',
        'Flip the bender. Align ARROW (▶) to first outer mark. Bend to 22.5°.',
        'Repeat on the other outer mark in the same direction. Conduit saddles over obstacle.',
      ],
      pro: '3-point saddle = center 45°, two outer 22.5° bends. Middle bend absorbs the saddle height.',
    },
    'saddle4': {
      steps: [
        'Mark all four bend points before starting any bends.',
        'Bend 1 and 4 (outer bends): 45° each, at the outer edges of the obstacle.',
        'Bend 2 and 3 (inner bends): 45° each, at the inner edges of the obstacle width.',
        'Align ARROW (▶) to each mark in sequence.',
        'All four bends are 45°. Result: conduit rises over one side, flat across top, drops other side.',
      ],
      pro: '4-point gives a flat top across the obstacle — useful for wider obstructions like pipes.',
    },
    'back2back': {
      steps: [
        'Make first 90°: align ARROW (▶) to (stub length − take-up), pull to 90°.',
        'Measure from the outside of the first 90° bend to where the second 90° needs to land.',
        'Align STAR (★) to that measurement from the back of the first bend.',
        'Make second 90° in the same direction as the first.',
        'Result: U-shape or L-shape with a straight run between the two 90s.',
      ],
      pro: 'The STAR mark on Klein accounts for the developed length through the bend. Use it — don\'t guess.',
    },
    'rollingOffset': {
      steps: [
        'Measure the vertical rise and horizontal run of the obstacle.',
        'Calculate travel = sqrt(rise² + run²).',
        'Choose bend angle (typically 30° or 45°).',
        'Distance between bends = travel × multiplier for chosen angle.',
        'Shrinkage = travel × shrink per inch (same as offset).',
        'Mark first bend point on conduit.',
        'Align front mark (Arrow) to first mark, bend to chosen angle.',
        'Rotate conduit 90° around its axis (quarter turn).',
        'Measure distance between bends along conduit from first mark, mark second bend.',
        'Align front mark to second mark, bend to same angle in opposite direction.',
        'Check that conduit clears obstacle in both dimensions.',
      ],
      pro: 'For a 6" rise and 8" run: travel = √(6² + 8²) = 10". At 30°, distance = 10 × 2.0 = 20".',
    },
    'parallel': {
      steps: [
        'Determine center-to-center spacing between conduits.',
        'Choose bend angle (typically 30° or 45°).',
        'Calculate offset distance for primary conduit using standard offset formula.',
        'For parallel conduit, add spacing multiplied by cosecant of bend angle to offset distance.',
        'Mark bend points on both conduits accordingly.',
        'Bend each conduit individually using the same technique as a standard offset.',
        'Ensure both conduits remain parallel throughout the run.',
      ],
      pro: 'For 4" spacing and 30° offset, add 4 × 2.0 = 8" to the offset distance.',
    },
  },
  ideal: {
    '90': {
      steps: [
        'Measure stub-up length from end of conduit.',
        'Subtract take-up for your conduit size from the chart.',
        'Mark the conduit at the calculated point.',
        'Place conduit in bender, slide until the HOOK MARK aligns with your pencil mark.',
        'Foot on pedal, pull handle to 90°.',
        'Verify square with torpedo level.',
      ],
      pro: 'Ideal\'s Hook Mark is the front-of-shoe reference — functionally the same as Klein\'s Arrow.',
    },
    'offset': {
      steps: [
        'Measure obstacle height.',
        'Choose angle and pull distance/shrinkage from the chart above.',
        'Mark first bend point. Align HOOK MARK to mark. Bend to angle.',
        'Measure the distance-between-bends from first mark toward the second end.',
        'Roll conduit 180°, flip bender 180°.',
        'Align HOOK MARK to second mark. Bend to same angle.',
        'Verify legs are parallel.',
      ],
      pro: 'Ideal has degree marks visibly stamped on the side of the shoe — easy to confirm angle mid-bend.',
    },
    'saddle3': {
      steps: [
        'Mark center of obstacle on conduit.',
        'Align the CENTER NOTCH of the Ideal shoe to your center mark.',
        'Bend center to 45°.',
        'Mark outer bends at equal distance each side of center.',
        'Flip bender. Align HOOK MARK to each outer mark. Bend to 22.5°.',
      ],
      pro: '',
    },
    'saddle4': {
      steps: [
        'Mark all four bend points.',
        'All bends are 45°. Align HOOK MARK to each mark in sequence.',
        'First two bends raise conduit over obstacle; last two lower it back to level.',
      ],
      pro: '',
    },
    'back2back': {
      steps: [
        'Make first 90° with HOOK MARK at (stub − take-up).',
        'Measure center-to-center distance needed for the second 90°.',
        'Align CENTER NOTCH to that measurement from the back of first bend.',
        'Make second 90° in same direction.',
      ],
      pro: '',
    },
    'rollingOffset': {
      steps: [
        'Measure the vertical rise and horizontal run of the obstacle.',
        'Calculate travel = sqrt(rise² + run²).',
        'Choose bend angle (typically 30° or 45°).',
        'Distance between bends = travel × multiplier for chosen angle.',
        'Shrinkage = travel × shrink per inch (same as offset).',
        'Mark first bend point on conduit.',
        'Align front mark (Hook Mark) to first mark, bend to chosen angle.',
        'Rotate conduit 90° around its axis (quarter turn).',
        'Measure distance between bends along conduit from first mark, mark second bend.',
        'Align front mark to second mark, bend to same angle in opposite direction.',
        'Check that conduit clears obstacle in both dimensions.',
      ],
      pro: 'For a 6" rise and 8" run: travel = √(6² + 8²) = 10". At 30°, distance = 10 × 2.0 = 20".',
    },
    'parallel': {
      steps: [
        'Determine center-to-center spacing between conduits.',
        'Choose bend angle (typically 30° or 45°).',
        'Calculate offset distance for primary conduit using standard offset formula.',
        'For parallel conduit, add spacing multiplied by cosecant of bend angle to offset distance.',
        'Mark bend points on both conduits accordingly.',
        'Bend each conduit individually using the same technique as a standard offset.',
        'Ensure both conduits remain parallel throughout the run.',
      ],
      pro: 'For 4" spacing and 30° offset, add 4 × 2.0 = 8" to the offset distance.',
    },
  },
  greenlee: {
    '90': {
      steps: [
        'Measure stub-up length from end of conduit.',
        'Subtract take-up for your conduit size from the chart.',
        'Mark the conduit at the calculated point.',
        'Slide conduit in bender until the ARROW MARK aligns to your pencil mark.',
        'Step on foot pedal, pull handle to 90°.',
        'Verify with torpedo level. Adjust if needed.',
      ],
      pro: 'Greenlee shoes have degree notches engraved on the side edge — very visible during the pull.',
    },
    'offset': {
      steps: [
        'Measure obstacle height.',
        'Pick angle — Greenlee shoes show 10°, 22.5°, 30°, 45° notches clearly on shoe edge.',
        'Calculate distance = height × multiplier. Calculate shrinkage = height × shrink-per-inch.',
        'Mark first bend point. Align ARROW MARK to first mark. Bend to your angle using the degree notch.',
        'Measure distance forward from first mark. Mark second bend.',
        'Roll conduit 180°, flip bender 180°.',
        'Align ARROW MARK to second mark. Bend to same angle.',
        'Legs should be parallel.',
      ],
      pro: 'The engraved degree notches on Greenlee make it easier to nail your offset angle consistently.',
    },
    'saddle3': {
      steps: [
        'Mark center of obstacle on conduit.',
        'Align center of Greenlee shoe to center mark. Bend to 45°.',
        'Mark outer bends at equal distance from center.',
        'Flip bender. Align ARROW MARK to each outer mark. Bend to 22.5°.',
      ],
      pro: '',
    },
    'saddle4': {
      steps: [
        'Mark all four bend points.',
        'All bends are 45°. Use ARROW MARK for alignment on each.',
        'Bends 1 & 2 raise conduit. Bends 3 & 4 lower it back to level.',
      ],
      pro: '',
    },
    'back2back': {
      steps: [
        'Make first 90° with ARROW MARK at (stub − take-up).',
        'Measure back-to-back distance from the outside of first bend.',
        'Align STAR NOTCH to that distance from back of first bend.',
        'Make second 90° in same direction.',
      ],
      pro: '',
    },
  },
  milwaukee: {
    '90': {
      steps: [
        'Measure stub-up length from end of conduit.',
        'Subtract take-up for your conduit size from the chart.',
        'Mark the conduit at the calculated point.',
        'Slide conduit into Milwaukee bender until ARROW (▶) aligns with your mark.',
        'Step on foot pedal, pull handle to 90°.',
        'If your model has a built-in angle sight window, use it to confirm 90° before releasing.',
        'Verify with torpedo level.',
      ],
      pro: 'Same layout as Klein. Milwaukee and Klein benders are interchangeable in method — just different colors.',
    },
    'offset': {
      steps: [
        'Measure obstacle height.',
        'Choose angle and get distance/shrinkage from the chart above.',
        'Mark first bend point. Align ARROW (▶) to first mark. Bend to angle.',
        'Measure the calculated distance forward. Mark second bend.',
        'Roll conduit 180°, flip bender 180°.',
        'Align ARROW (▶) to second mark. Bend to same angle.',
        'Check that legs are parallel.',
      ],
      pro: '',
    },
    'saddle3': {
      steps: [
        'Mark center of obstacle on conduit.',
        'Align center of Milwaukee shoe to center mark. Bend to 45°.',
        'Mark outer bends at equal distance from center.',
        'Flip bender. Align ARROW (▶) to each outer mark. Bend to 22.5°.',
      ],
      pro: '',
    },
    'saddle4': {
      steps: [
        'Mark all four bend points.',
        'All bends are 45°. Use ARROW (▶) for alignment on each.',
        'First pair raises conduit; second pair returns it to level.',
      ],
      pro: '',
    },
    'back2back': {
      steps: [
        'Make first 90° with ARROW (▶) at (stub − take-up).',
        'From back of first bend, measure to second wall.',
        'Align STAR (★) to that measurement.',
        'Make second 90° in same direction.',
      ],
      pro: '',
    },
  },
}

// ── Bend Diagrams ─────────────────────────────────────────────────────────────

function BendDiagram({ type, brand }: { type: BendType; brand: Brand }) {
  const color = BRANDS[brand].color
  const dim = '#555'
  const lbl = '#888'

  if (type === '90') return (
    <svg viewBox="0 0 260 130" className="h-28 w-full">
      {/* Conduit vertical leg */}
      <line x1="80" y1="115" x2="80" y2="45" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Bend arc */}
      <path d="M 80 45 Q 80 22 103 22" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Conduit horizontal run */}
      <line x1="103" y1="22" x2="200" y2="22" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Stub dimension */}
      <line x1="55" y1="115" x2="55" y2="45" stroke={dim} strokeWidth="1" strokeDasharray="3,2" />
      <line x1="50" y1="115" x2="60" y2="115" stroke={dim} strokeWidth="1" />
      <line x1="50" y1="45" x2="60" y2="45" stroke={dim} strokeWidth="1" />
      <text x="43" y="82" fill={lbl} fontSize="9" textAnchor="middle" fontFamily="monospace">stub</text>
      {/* Arrow mark indicator */}
      <circle cx="80" cy="72" r="4" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="2,1" />
      <text x="92" y="75" fill={color} fontSize="8" fontFamily="monospace">▶ mark here</text>
      {/* Take-up bracket */}
      <line x1="80" y1="115" x2="80" y2="72" stroke="#ff6b00" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.5" />
      <text x="155" y="105" fill={lbl} fontSize="8" fontFamily="monospace">stub − take-up = mark</text>
    </svg>
  )

  if (type === 'offset') return (
    <svg viewBox="0 0 280 130" className="h-28 w-full">
      {/* First leg */}
      <line x1="20" y1="100" x2="85" y2="100" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* First bend */}
      <line x1="85" y1="100" x2="145" y2="40" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Second leg */}
      <line x1="145" y1="40" x2="240" y2="40" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Height dimension */}
      <line x1="260" y1="100" x2="260" y2="40" stroke={dim} strokeWidth="1" strokeDasharray="3,2" />
      <line x1="255" y1="100" x2="265" y2="100" stroke={dim} strokeWidth="1" />
      <line x1="255" y1="40" x2="265" y2="40" stroke={dim} strokeWidth="1" />
      <text x="271" y="73" fill={lbl} fontSize="9" fontFamily="monospace">height</text>
      {/* Distance label */}
      <line x1="85" y1="115" x2="145" y2="115" stroke={dim} strokeWidth="1" strokeDasharray="2,2" />
      <line x1="85" y1="110" x2="85" y2="120" stroke={dim} strokeWidth="1" />
      <line x1="145" y1="110" x2="145" y2="120" stroke={dim} strokeWidth="1" />
      <text x="115" y="127" fill={lbl} fontSize="8" textAnchor="middle" fontFamily="monospace">dist = h × mult</text>
      {/* Mark indicators */}
      <circle cx="85" cy="100" r="4" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="2,1" />
      <circle cx="145" cy="40" r="4" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="2,1" />
    </svg>
  )

  if (type === 'saddle3') return (
    <svg viewBox="0 0 280 140" className="h-28 w-full">
      {/* Left run */}
      <line x1="15" y1="85" x2="75" y2="85" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Up-bend */}
      <line x1="75" y1="85" x2="105" y2="40" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Over obstacle */}
      <line x1="105" y1="40" x2="170" y2="40" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Down-bend */}
      <line x1="170" y1="40" x2="200" y2="85" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Right run */}
      <line x1="200" y1="85" x2="260" y2="85" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Obstacle */}
      <rect x="95" y="60" width="85" height="25" fill="#1a1a1a" stroke="#444" strokeWidth="1" rx="2" />
      <text x="137" y="76" fill="#555" fontSize="8" textAnchor="middle" fontFamily="monospace">obstacle</text>
      {/* Center mark */}
      <line x1="137" y1="40" x2="137" y2="30" stroke={dim} strokeWidth="1" strokeDasharray="2,1" />
      <text x="137" y="26" fill={lbl} fontSize="8" textAnchor="middle" fontFamily="monospace">center 45°</text>
      {/* Outer marks */}
      <text x="75" y="102" fill={lbl} fontSize="8" textAnchor="middle" fontFamily="monospace">22.5°</text>
      <text x="200" y="102" fill={lbl} fontSize="8" textAnchor="middle" fontFamily="monospace">22.5°</text>
    </svg>
  )

  if (type === 'saddle4') return (
    <svg viewBox="0 0 300 140" className="h-28 w-full">
      {/* Left run */}
      <line x1="15" y1="90" x2="60" y2="90" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Up-bend 1 */}
      <line x1="60" y1="90" x2="90" y2="40" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Flat top */}
      <line x1="90" y1="40" x2="200" y2="40" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Down-bend 2 */}
      <line x1="200" y1="40" x2="230" y2="90" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Right run */}
      <line x1="230" y1="90" x2="275" y2="90" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Obstacle */}
      <rect x="50" y="65" width="190" height="25" fill="#1a1a1a" stroke="#444" strokeWidth="1" rx="2" />
      <text x="145" y="81" fill="#555" fontSize="8" textAnchor="middle" fontFamily="monospace">obstacle</text>
      {/* Labels */}
      <text x="60" y="108" fill={lbl} fontSize="8" textAnchor="middle" fontFamily="monospace">45°</text>
      <text x="90" y="30" fill={lbl} fontSize="8" textAnchor="middle" fontFamily="monospace">45°</text>
      <text x="200" y="30" fill={lbl} fontSize="8" textAnchor="middle" fontFamily="monospace">45°</text>
      <text x="230" y="108" fill={lbl} fontSize="8" textAnchor="middle" fontFamily="monospace">45°</text>
    </svg>
  )

  if (type === 'rollingOffset') return (
    <svg viewBox="0 0 300 150" className="h-28 w-full">
      {/* Right triangle representing rise and run */}
      <line x1="50" y1="100" x2="150" y2="100" stroke={dim} strokeWidth="1" strokeDasharray="3,2" />
      <line x1="150" y1="100" x2="150" y2="40" stroke={dim} strokeWidth="1" strokeDasharray="3,2" />
      <line x1="50" y1="100" x2="150" y2="40" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Labels */}
      <text x="100" y="105" fill={lbl} fontSize="8" textAnchor="middle" fontFamily="monospace">Run</text>
      <text x="160" y="70" fill={lbl} fontSize="8" textAnchor="middle" fontFamily="monospace">Rise</text>
      <text x="90" y="60" fill={lbl} fontSize="8" textAnchor="middle" fontFamily="monospace">Travel</text>
      {/* Bend points */}
      <circle cx="50" cy="100" r="4" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="2,1" />
      <circle cx="150" cy="40" r="4" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="2,1" />
      <text x="50" y="115" fill={color} fontSize="8" fontFamily="monospace">Bend 1</text>
      <text x="150" y="30" fill={color} fontSize="8" fontFamily="monospace">Bend 2</text>
    </svg>
  )

  if (type === 'parallel') return (
    <svg viewBox="0 0 300 150" className="h-28 w-full">
      {/* Two parallel conduits with offset bends */}
      <line x1="30" y1="80" x2="100" y2="80" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <line x1="30" y1="100" x2="100" y2="100" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* First bends */}
      <line x1="100" y1="80" x2="160" y2="40" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <line x1="100" y1="100" x2="160" y2="60" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Parallel legs */}
      <line x1="160" y1="40" x2="240" y2="40" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <line x1="160" y1="60" x2="240" y2="60" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Spacing dimension */}
      <line x1="270" y1="40" x2="270" y2="60" stroke={dim} strokeWidth="1" strokeDasharray="3,2" />
      <line x1="265" y1="40" x2="275" y2="40" stroke={dim} strokeWidth="1" />
      <line x1="265" y1="60" x2="275" y2="60" stroke={dim} strokeWidth="1" />
      <text x="280" y="50" fill={lbl} fontSize="8" fontFamily="monospace">Spacing</text>
      {/* Labels */}
      <text x="120" y="95" fill={lbl} fontSize="8" textAnchor="middle" fontFamily="monospace">Conduit 1</text>
      <text x="120" y="115" fill={lbl} fontSize="8" textAnchor="middle" fontFamily="monospace">Conduit 2</text>
    </svg>
  )

  // back2back
  return (
    <svg viewBox="0 0 260 140" className="h-28 w-full">
      {/* First stub vertical */}
      <line x1="70" y1="120" x2="70" y2="55" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* First bend arc */}
      <path d="M 70 55 Q 70 32 93 32" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Horizontal run */}
      <line x1="93" y1="32" x2="167" y2="32" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Second bend arc */}
      <path d="M 167 32 Q 190 32 190 55" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Second stub vertical */}
      <line x1="190" y1="55" x2="190" y2="120" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Dimension */}
      <line x1="70" y1="130" x2="190" y2="130" stroke={dim} strokeWidth="1" strokeDasharray="2,2" />
      <line x1="70" y1="125" x2="70" y2="135" stroke={dim} strokeWidth="1" />
      <line x1="190" y1="125" x2="190" y2="135" stroke={dim} strokeWidth="1" />
      <text x="130" y="140" fill={lbl} fontSize="8" textAnchor="middle" fontFamily="monospace">back-to-back distance</text>
      {/* Star mark */}
      <circle cx="190" cy="80" r="4" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="2,1" />
      <text x="196" y="83" fill={color} fontSize="8" fontFamily="monospace">★ for 2nd bend</text>
    </svg>
  )
}

// ── Bender Shoe SVG ───────────────────────────────────────────────────────────

function BenderShoe({ brand }: { brand: Brand }) {
  const b = BRANDS[brand]
  return (
    <svg viewBox="0 0 240 110" className="h-24 w-full max-w-[280px] mx-auto">
      {/* Handle */}
      <rect x="108" y="2" width="14" height="42" rx="3" fill="#333" stroke="#555" strokeWidth="1" />
      <text x="115" y="52" fill="#444" fontSize="7" textAnchor="middle" fontFamily="monospace">handle</text>
      {/* Shoe body (arc) */}
      <path d="M 18 95 Q 115 18 212 95" fill="none" stroke="#555" strokeWidth="14" strokeLinecap="round" />
      {/* Conduit in groove */}
      <path d="M 18 95 Q 115 18 212 95" fill="none" stroke={b.color} strokeWidth="5" strokeLinecap="round" />
      {/* FRONT mark (Arrow / Hook) */}
      <circle cx="198" cy="80" r="5" fill={b.color} opacity="0.9" />
      <line x1="198" y1="75" x2="198" y2="65" stroke={b.color} strokeWidth="1.5" />
      <text x="210" y="62" fill={b.color} fontSize="8" fontFamily="monospace">{b.marks.front}</text>
      {/* BACK mark (Star / Center Notch) */}
      <circle cx="32" cy="80" r="5" fill="#888" opacity="0.9" />
      <line x1="32" y1="75" x2="32" y2="65" stroke="#888" strokeWidth="1.5" />
      <text x="2" y="58" fill="#888" fontSize="8" fontFamily="monospace">{b.marks.back}</text>
      {/* CENTER mark (Rim Notch) */}
      <circle cx="115" cy="22" r="4" fill="#555" stroke="#888" strokeWidth="1" />
      <text x="125" y="16" fill="#666" fontSize="8" fontFamily="monospace">{b.marks.center}</text>
      {/* Degree marks on shoe edge */}
      {[
        { angle: 45, label: '45°' },
        { angle: 30, label: '30°' },
        { angle: 22, label: '22°' },
      ].map(({ angle, label }, i) => {
        const rad = (angle / 90) * Math.PI / 2
        const cx = 115 + Math.cos(Math.PI - rad) * 85
        const cy = 18 + Math.sin(Math.PI - rad) * 85
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r="2" fill="#444" />
            <text x={cx + (cx < 115 ? -12 : 4)} y={cy + 3} fill="#444" fontSize="7" fontFamily="monospace">{label}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export function ConduitBendingChart() {
  const [brand, setBrand] = useState<Brand>('klein')
  const [bendType, setBendType] = useState<BendType>('90')
  const [conduitSize, setConduitSize] = useState<ConduitSize>('3/4"')
  const [offsetHeight, setOffsetHeight] = useState<number>(6)
  const [offsetAngle, setOffsetAngle] = useState<number>(30)
  const [stubLength, setStubLength] = useState<number>(12)
  const [rollingRise, setRollingRise] = useState<number>(6)
  const [rollingRun, setRollingRun] = useState<number>(8)
  const [rollingAngle, setRollingAngle] = useState<number>(30)

  const b = BRANDS[brand]
  const instructions = INSTRUCTIONS[brand][bendType]

  const mult = MULTIPLIERS.find(m => m.angle === offsetAngle)
  const offsetCalc = mult ? {
    distance: (offsetHeight * mult.mult).toFixed(2),
    shrinkage: (offsetHeight * mult.shrinkDec).toFixed(3),
  } : null

  const rollingMult = MULTIPLIERS.find(m => m.angle === rollingAngle)
  const rollingCalc = rollingMult ? {
    travel: Math.sqrt(rollingRise * rollingRise + rollingRun * rollingRun).toFixed(2),
    distance: (Math.sqrt(rollingRise * rollingRise + rollingRun * rollingRun) * rollingMult.mult).toFixed(2),
    shrinkage: (Math.sqrt(rollingRise * rollingRise + rollingRun * rollingRun) * rollingMult.shrinkDec).toFixed(3),
  } : null

  const stubCalc = {
    mark: Math.max(0, stubLength - TAKEUP[conduitSize]).toFixed(1),
    takeup: TAKEUP[conduitSize],
  }

  const BEND_TYPES: { id: BendType; label: string }[] = [
    { id: '90',       label: '90°' },
    { id: 'offset',   label: 'Offset' },
    { id: 'saddle3',  label: '3-Pt Saddle' },
    { id: 'saddle4',  label: '4-Pt Saddle' },
    { id: 'back2back',label: 'Back-to-Back' },
    { id: 'rollingOffset', label: 'Rolling Offset' },
    { id: 'parallel', label: 'Parallel Bends' },
  ]

  const inputCls = 'h-10 w-full border border-[#333] bg-[#111] px-3 font-mono text-sm text-[#f0f0f0] focus:border-[#ff6b00] focus:outline-none'
  const labelCls = 'text-[10px] uppercase tracking-wider text-[#555]'

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="border-b border-[#222] pb-4">
        <h1 className="text-base font-bold uppercase tracking-widest text-[#f0f0f0]">
          Conduit Bending Chart
        </h1>
        <p className="mt-0.5 text-[11px] text-[#555] uppercase tracking-wider">
          Reference · Tom Henry Style · EMT Hand Benders
        </p>
      </div>

      {/* ── Multiplier Table ── */}
      <div>
        <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#888]">
          Offset Multipliers
        </h2>
        <div className="overflow-hidden border border-[#222]">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="bg-[#1a1a1a]">
                <th className="py-2 px-3 text-left text-[10px] uppercase tracking-wider text-[#555]">Angle</th>
                <th className="py-2 px-3 text-center text-[10px] uppercase tracking-wider text-[#555]">Multiplier</th>
                <th className="py-2 px-3 text-right text-[10px] uppercase tracking-wider text-[#555]">Shrink / Inch</th>
              </tr>
            </thead>
            <tbody>
              {MULTIPLIERS.map((row, i) => {
                const isSelected = bendType === 'offset' && row.angle === offsetAngle
                return (
                  <tr
                    key={i}
                    onClick={() => { if (bendType === 'offset') setOffsetAngle(row.angle) }}
                    className={`border-t border-[#1e1e1e] transition-colors ${
                      isSelected
                        ? 'bg-[#1a1200] cursor-pointer'
                        : 'cursor-pointer hover:bg-[#141414]'
                    }`}
                  >
                    <td className="py-2 px-3">
                      <span className={`font-bold ${isSelected ? 'text-[#ff6b00]' : 'text-[#f0f0f0]'}`}>
                        {row.angle}°
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className={isSelected ? 'text-[#ff6b00]' : 'text-[#ccc]'}>
                        {row.mult}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span className={isSelected ? 'text-[#ff6b00]' : 'text-[#888]'}>
                        {row.shrink}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 90° Take-Up Table ── */}
      <div>
        <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#888]">
          90° Take-Up — Deduct From Stub Length
        </h2>
        <div className="overflow-hidden border border-[#222]">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="bg-[#1a1a1a]">
                <th className="py-2 px-3 text-left text-[10px] uppercase tracking-wider text-[#555]">EMT Size</th>
                <th className="py-2 px-3 text-right text-[10px] uppercase tracking-wider text-[#555]">Deduct</th>
              </tr>
            </thead>
            <tbody>
              {CONDUIT_SIZES.map((size, i) => {
                const isSelected = size === conduitSize
                return (
                  <tr
                    key={i}
                    onClick={() => setConduitSize(size)}
                    className={`border-t border-[#1e1e1e] cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#0a1a0a]' : 'hover:bg-[#141414]'
                    }`}
                  >
                    <td className="py-2 px-3">
                      <span className={`font-bold ${isSelected ? 'text-[#00ff88]' : 'text-[#f0f0f0]'}`}>
                        {size}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span className={`font-bold ${isSelected ? 'text-[#00ff88]' : 'text-[#888]'}`}>
                        {TAKEUP[size]}"
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-1 text-[10px] text-[#444]">Tap a size to select it for calculations below</p>
      </div>

      {/* ── Brand Selector ── */}
      <div>
        <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#888]">
          Select Your Bender
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(BRANDS) as Brand[]).map(key => {
            const brd = BRANDS[key]
            const isActive = brand === key
            return (
              <button
                key={key}
                onClick={() => setBrand(key)}
                className={`flex flex-col gap-0.5 border px-3 py-2.5 text-left transition-colors ${
                  isActive
                    ? 'border-[#333] bg-[#111]'
                    : 'border-[#1e1e1e] bg-[#0a0a0a] hover:border-[#2a2a2a]'
                }`}
                style={isActive ? { borderColor: brd.color + '60' } : {}}
              >
                <span
                  className="text-xs font-bold uppercase tracking-wide"
                  style={{ color: isActive ? brd.color : '#555' }}
                >
                  {brd.name}
                </span>
                <span className="text-[10px] text-[#444]">{brd.model}</span>
              </button>
            )
          })}
        </div>

        {/* Selected brand marks */}
        <div className="mt-3 border border-[#1e1e1e] bg-[#0a0a0a] p-3" style={{ borderColor: b.color + '30' }}>
          <p className="mb-2 text-[10px] uppercase tracking-wider" style={{ color: b.color }}>
            {b.name} — Shoe Marks
          </p>
          <BenderShoe brand={brand} />
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-[#444]">Front</div>
              <div className="text-[11px] font-mono font-bold" style={{ color: b.color }}>{b.marks.front}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-[#444]">Center</div>
              <div className="text-[11px] font-mono font-bold text-[#888]">{b.marks.center}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-[#444]">Back</div>
              <div className="text-[11px] font-mono font-bold text-[#666]">{b.marks.back}</div>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-[#555] italic">{b.tip}</p>
        </div>
      </div>

      {/* ── Bend Type Selector ── */}
      <div>
        <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#888]">
          Bend Type
        </h2>
        <div className="flex gap-1 flex-wrap">
          {BEND_TYPES.map(bt => (
            <button
              key={bt.id}
              onClick={() => setBendType(bt.id)}
              className={`px-3 py-2 text-[11px] font-medium uppercase tracking-wider transition-colors ${
                bendType === bt.id
                  ? 'text-[#0f1115]'
                  : 'border border-[#2a2a2a] bg-[#0a0a0a] text-[#555] hover:text-[#888]'
              }`}
              style={bendType === bt.id ? { backgroundColor: b.color } : {}}
            >
              {bt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Bend Diagram ── */}
      <div className="border border-[#1e1e1e] bg-[#0a0a0a] p-4" style={{ borderColor: b.color + '20' }}>
        <p className="mb-2 text-[10px] uppercase tracking-wider text-[#444]">Diagram</p>
        <BendDiagram type={bendType} brand={brand} />
      </div>

      {/* ── Quick Calculator ── */}
      {bendType === '90' && (
        <div className="border border-[#1e1e1e] bg-[#0a0a0a] p-4">
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-[#888]">
            90° Quick Calc
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className={labelCls}>Stub Length (in)</label>
                <input
                  type="number"
                  value={stubLength}
                  onChange={e => setStubLength(Number(e.target.value))}
                  className={inputCls}
                  step={0.5}
                />
              </div>
              <div className="flex-1">
                <label className={labelCls}>Conduit Size</label>
                <select
                  value={conduitSize}
                  onChange={e => setConduitSize(e.target.value as ConduitSize)}
                  className={inputCls}
                >
                  {CONDUIT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="border border-[#1a2a1a] bg-[#0a120a] p-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#888]">Take-Up</span>
                <span className="font-mono text-[#888]">{stubCalc.takeup}"</span>
              </div>
              <div className="mt-1 flex justify-between text-sm">
                <span className="text-[#888]">Place {b.marks.front} at</span>
                <span className="font-mono font-bold text-[#00ff88] text-base">{stubCalc.mark}"</span>
              </div>
              <p className="mt-1 text-[10px] text-[#444]">from the end of conduit</p>
            </div>
          </div>
        </div>
      )}

      {bendType === 'offset' && (
        <div className="border border-[#1e1e1e] bg-[#0a0a0a] p-4">
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-[#888]">
            Offset Quick Calc
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className={labelCls}>Offset Height (in)</label>
                <input
                  type="number"
                  value={offsetHeight}
                  onChange={e => setOffsetHeight(Number(e.target.value))}
                  className={inputCls}
                  step={0.25}
                />
              </div>
              <div className="flex-1">
                <label className={labelCls}>Angle</label>
                <select
                  value={offsetAngle}
                  onChange={e => setOffsetAngle(Number(e.target.value))}
                  className={inputCls}
                >
                  {MULTIPLIERS.map(m => (
                    <option key={m.angle} value={m.angle}>{m.angle}°</option>
                  ))}
                </select>
              </div>
            </div>
            {offsetCalc && (
              <div className="border border-[#1a1a2a] bg-[#0a0a12] p-3 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#888]">Distance Between Bends</span>
                  <span className="font-mono font-bold text-[#00d4ff] text-base">{offsetCalc.distance}"</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#888]">Shrinkage (deduct)</span>
                  <span className="font-mono font-bold text-[#ff6b00]">{offsetCalc.shrinkage}"</span>
                </div>
                <p className="text-[10px] text-[#444] pt-1">
                  Bend 1: {b.marks.front} to first mark · Roll 180° · Bend 2: same angle
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {bendType === 'rollingOffset' && (
        <div className="border border-[#1e1e1e] bg-[#0a0a0a] p-4">
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-[#888]">
            Rolling Offset Quick Calc
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className={labelCls}>Rise (vertical) (in)</label>
                <input
                  type="number"
                  value={rollingRise}
                  onChange={e => setRollingRise(Number(e.target.value))}
                  className={inputCls}
                  step={0.25}
                />
              </div>
              <div className="flex-1">
                <label className={labelCls}>Run (horizontal) (in)</label>
                <input
                  type="number"
                  value={rollingRun}
                  onChange={e => setRollingRun(Number(e.target.value))}
                  className={inputCls}
                  step={0.25}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className={labelCls}>Angle</label>
                <select
                  value={rollingAngle}
                  onChange={e => setRollingAngle(Number(e.target.value))}
                  className={inputCls}
                >
                  {MULTIPLIERS.map(m => (
                    <option key={m.angle} value={m.angle}>{m.angle}°</option>
                  ))}
                </select>
              </div>
            </div>
            {rollingCalc && (
              <div className="border border-[#1a1a2a] bg-[#0a0a12] p-3 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#888]">Travel (hypotenuse)</span>
                  <span className="font-mono font-bold text-[#00d4ff] text-base">{rollingCalc.travel}"</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#888]">Distance Between Bends</span>
                  <span className="font-mono font-bold text-[#00d4ff] text-base">{rollingCalc.distance}"</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#888]">Shrinkage (deduct)</span>
                  <span className="font-mono font-bold text-[#ff6b00]">{rollingCalc.shrinkage}"</span>
                </div>
                <p className="text-[10px] text-[#444] pt-1">
                  Bend 1: {b.marks.front} to first mark · Rotate conduit 90° · Bend 2: same angle
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Step-by-Step Instructions ── */}
      <div>
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-[#888]">
          {b.name} — {BEND_TYPES.find(bt => bt.id === bendType)?.label} Instructions
        </h2>
        <div className="flex flex-col gap-2">
          {instructions.steps.map((step, i) => (
            <div key={i} className="flex gap-3 border border-[#1e1e1e] bg-[#0a0a0a] p-3">
              <span
                className="shrink-0 w-5 h-5 flex items-center justify-center text-[10px] font-bold font-mono rounded-sm"
                style={{ backgroundColor: b.color + '20', color: b.color }}
              >
                {i + 1}
              </span>
              <p className="text-xs text-[#ccc] leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
        {instructions.pro && (
          <div className="mt-2 border-l-2 border-[#ff6b00] bg-[#0f0a00] px-3 py-2" style={{ borderColor: b.color }}>
            <p className="text-[10px] text-[#888]">
              <span className="font-bold uppercase tracking-wider" style={{ color: b.color }}>Example: </span>
              {instructions.pro}
            </p>
          </div>
        )}
      </div>

    </div>
  )
}

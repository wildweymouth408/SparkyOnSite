'use client'

import React from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────

export type BendVizType =
  | '90'
  | 'offset'
  | 'saddle3'
  | 'saddle4'
  | 'back2back'
  | 'rollingOffset'
  | 'kickWith90'
  | 'parallel'
  | 'corner'

export interface BendVisualizationProps {
  type: BendVizType
  frontMark?: string
  backMark?: string
  calcValues?: Record<string, string | number>
}

// ── Constants ──────────────────────────────────────────────────────────────────

// Cubic bezier constant for quarter-circle approximation (4*(√2-1)/3)
const K = 0.5523

// Design tokens — steel conduit palette
const C = {
  bg:         '#0f172a',
  grid:       '#1e293b',
  // Pipe layers (drawn outer → inner for 3-D cylinder look)
  p1:         '#060c14',   // outer shadow
  p2:         '#0d1a2e',   // deep body
  p3:         '#1e3347',   // dark body
  p4:         '#33506a',   // mid body
  p5:         '#4e7090',   // lighter mid
  p6:         '#8cb4d0',   // main steel (blued steel)
  pH:         '#dff0ff',   // specular highlight
  // Annotations
  dim:        '#334155',   // dimension lines
  dimTxt:     '#64748b',   // muted label text
  bright:     '#f1f5f9',   // bright label text
  mark:       '#f87171',   // arrow/star marks (red)
  tick:       '#fbbf24',   // bend tick marks (amber)
  // Obstacle
  obs:        '#1a2535',
  obsStroke:  '#2d4060',
}

// ── Reusable SVG primitives ────────────────────────────────────────────────────

/** Subtle dot-grid background */
function GridBG({ w, h }: { w: number; h: number }) {
  const lines: React.ReactElement[] = []
  for (let x = 0; x <= w; x += 20)
    lines.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={h} stroke={C.grid} strokeWidth="0.35" />)
  for (let y = 0; y <= h; y += 20)
    lines.push(<line key={`h${y}`} x1={0} y1={y} x2={w} y2={y} stroke={C.grid} strokeWidth="0.35" />)
  return (
    <>
      <rect width={w} height={h} fill={C.bg} />
      {lines}
    </>
  )
}

/** Cylindrical-looking conduit: layered strokes, dark outer → bright centre highlight */
function Pipe({ d }: { d: string }) {
  const base: React.SVGAttributes<SVGPathElement> = {
    fill: 'none',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  return (
    <>
      <path d={d} {...base} stroke={C.p1} strokeWidth={22} />
      <path d={d} {...base} stroke={C.p2} strokeWidth={18} />
      <path d={d} {...base} stroke={C.p3} strokeWidth={15} />
      <path d={d} {...base} stroke={C.p4} strokeWidth={12} />
      <path d={d} {...base} stroke={C.p5} strokeWidth={9}  />
      <path d={d} {...base} stroke={C.p6} strokeWidth={6}  />
      <path d={d} {...base} stroke={C.pH} strokeWidth={2}  />
    </>
  )
}

/** Perpendicular tick mark across the pipe at a given point */
function Tick({
  x, y, vertical = true, size = 11, color = C.tick,
}: {
  x: number; y: number; vertical?: boolean; size?: number; color?: string
}) {
  return vertical
    ? <line x1={x}        y1={y - size} x2={x}        y2={y + size} stroke={color} strokeWidth={2} />
    : <line x1={x - size} y1={y}        x2={x + size} y2={y}        stroke={color} strokeWidth={2} />
}

/**
 * Dimension annotation between two points.
 * Draws extension lines, a dim line offset to one side, end ticks, and a label.
 * `side`: 1 = right/down of the segment, -1 = left/up
 */
function Dim({
  x1, y1, x2, y2, label, offset = 20, side = 1, fontSize = 10,
}: {
  x1: number; y1: number; x2: number; y2: number
  label: string; offset?: number; side?: number; fontSize?: number
}) {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len < 1) return null
  const nx = (-dy / len) * side
  const ny = ( dx / len) * side
  const ox = nx * offset, oy = ny * offset
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
  const tl = 5

  return (
    <g>
      {/* Extension lines */}
      <line x1={x1} y1={y1} x2={x1 + ox} y2={y1 + oy}
        stroke={C.dim} strokeWidth={0.5} strokeDasharray="2,3" />
      <line x1={x2} y1={y2} x2={x2 + ox} y2={y2 + oy}
        stroke={C.dim} strokeWidth={0.5} strokeDasharray="2,3" />
      {/* Dimension line */}
      <line x1={x1 + ox} y1={y1 + oy} x2={x2 + ox} y2={y2 + oy}
        stroke={C.dim} strokeWidth={0.9} />
      {/* End ticks */}
      <line
        x1={x1 + ox - nx * tl} y1={y1 + oy - ny * tl}
        x2={x1 + ox + nx * tl} y2={y1 + oy + ny * tl}
        stroke={C.dim} strokeWidth={0.9} />
      <line
        x1={x2 + ox - nx * tl} y1={y2 + oy - ny * tl}
        x2={x2 + ox + nx * tl} y2={y2 + oy + ny * tl}
        stroke={C.dim} strokeWidth={0.9} />
      {/* Label */}
      <text
        x={mx + nx * (offset + 10)}
        y={my + ny * (offset + 10)}
        fill={C.bright}
        fontSize={fontSize}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="ui-monospace, monospace"
      >
        {label}
      </text>
    </g>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function BendVisualization({
  type,
  calcValues = {},
  frontMark = 'Arrow ▶',
  backMark  = 'Star ★',
}: BendVisualizationProps) {

  // ── 90° Stub-up ─────────────────────────────────────────────────────────────
  if (type === '90') {
    const vw = 300, vh = 210
    const R = 38             // visual bend radius
    const tailY = 168        // y of horizontal run
    const bendX = 72         // x where horizontal ends / arc begins
    const stubTopY = 16      // top of stub
    const tailStartX = 12

    // Quarter-circle: was going right → turns upward
    // from (bendX, tailY) → (bendX+R, tailY-R)
    const ex = bendX + R, ey = tailY - R
    const c1x = bendX + K * R, c1y = tailY         // cp1 continues rightward
    const c2x = ex,             c2y = tailY - K * R // cp2 approaches upward

    const d = `M ${tailStartX},${tailY} L ${bendX},${tailY} C ${c1x},${c1y} ${c2x},${c2y} ${ex},${ey} L ${ex},${stubTopY}`

    const stub   = Number(calcValues.stub   ?? 12)
    const takeup = Number(calcValues.takeup ?? 6)
    const mark   = Number((calcValues.mark  ?? Math.max(0, stub - takeup)).toString())

    // Place arrow mark proportionally along horizontal run
    const rawMx = tailStartX + (mark / stub) * (bendX - tailStartX)
    const mx    = Math.max(tailStartX + 8, Math.min(bendX - 8, rawMx))

    return (
      <svg viewBox={`0 0 ${vw} ${vh}`} className="w-full" style={{ maxHeight: '200px', display: 'block', borderRadius: '8px' }}>
        <GridBG w={vw} h={vh} />

        {/* Floor reference */}
        <line x1={0} y1={tailY + 15} x2={vw} y2={tailY + 15} stroke={C.grid} strokeWidth="1" />

        <Pipe d={d} />

        {/* Yellow tick at bend start */}
        <Tick x={bendX} y={tailY} vertical size={13} color={C.tick} />

        {/* Red arrow mark */}
        <line x1={mx} y1={tailY - 14} x2={mx} y2={tailY + 14} stroke={C.mark} strokeWidth={1.5} />
        <text x={mx} y={tailY + 24} fill={C.mark} fontSize="9" textAnchor="middle" fontFamily="ui-monospace, monospace">
          {frontMark}
        </text>
        <text x={mx} y={tailY + 36} fill={C.mark} fontSize="11" textAnchor="middle" fontFamily="ui-monospace, monospace" fontWeight="bold">
          {mark}"
        </text>

        {/* Stub height dimension (right of pipe) */}
        <Dim x1={ex} y1={stubTopY} x2={ex} y2={tailY} label={`${stub}"`} offset={30} side={-1} />

        {/* Take-up annotation above horizontal run */}
        <Dim x1={mx} y1={tailY} x2={bendX} y2={tailY} label={`take-up ${takeup}"`} offset={22} side={1} fontSize={9} />

        {/* Rotated "STUB HEIGHT" label */}
        <text
          x={ex + 62} y={(stubTopY + tailY) / 2}
          fill={C.dimTxt} fontSize="8"
          fontFamily="ui-monospace, monospace"
          textAnchor="middle"
          transform={`rotate(-90, ${ex + 62}, ${(stubTopY + tailY) / 2})`}
        >
          STUB HEIGHT
        </text>
      </svg>
    )
  }

  // ── Offset ──────────────────────────────────────────────────────────────────
  if (type === 'offset') {
    const vw = 380, vh = 192
    const yLow = 150, yHigh = 70
    const b1x = 85, b2x = 268
    const span = b2x - b1x      // 183
    const cpd  = span * 0.44    // 80.5 — controls S-curve tightness

    // Single cubic bezier entering horizontal at yLow, exiting horizontal at yHigh.
    // This naturally produces a smooth S-shape with an inflection at the midpoint.
    const d = [
      `M 12,${yLow}`,
      `L ${b1x},${yLow}`,
      `C ${b1x + cpd},${yLow} ${b2x - cpd},${yHigh} ${b2x},${yHigh}`,
      `L 368,${yHigh}`,
    ].join(' ')

    const height    = calcValues.height    ?? 4
    const distance  = calcValues.distance  ?? '—'
    const shrinkage = calcValues.shrinkage ?? '—'
    const angle     = calcValues.angle     ?? 30

    return (
      <svg viewBox={`0 0 ${vw} ${vh}`} className="w-full" style={{ maxHeight: '185px', display: 'block', borderRadius: '8px' }}>
        <GridBG w={vw} h={vh} />

        {/* Level reference lines */}
        <line x1={0} y1={yLow + 15} x2={vw} y2={yLow + 15} stroke={C.grid} strokeWidth="1" />
        <line x1={0} y1={yHigh - 15} x2={vw} y2={yHigh - 15} stroke={C.grid} strokeWidth="0.5" strokeDasharray="4,5" />

        <Pipe d={d} />

        {/* Bend marks at the two "knee" locations */}
        <Tick x={b1x} y={yLow} vertical size={12} color={C.tick} />
        <Tick x={b2x} y={yHigh} vertical size={12} color={C.tick} />

        {/* Labels: bend 1 below, bend 2 above */}
        <text x={b1x} y={yLow + 25} fill={C.tick} fontSize="9" textAnchor="middle" fontFamily="ui-monospace, monospace">{frontMark}</text>
        <text x={b1x} y={yLow + 36} fill={C.tick} fontSize="8"  textAnchor="middle" fontFamily="ui-monospace, monospace">bend 1</text>
        <text x={b2x} y={yHigh - 24} fill={C.tick} fontSize="9" textAnchor="middle" fontFamily="ui-monospace, monospace">{frontMark}</text>
        <text x={b2x} y={yHigh - 34} fill={C.tick} fontSize="8"  textAnchor="middle" fontFamily="ui-monospace, monospace">bend 2</text>

        {/* Rise dimension (left side) */}
        <Dim x1={28} y1={yHigh} x2={28} y2={yLow} label={`${height}"`} offset={14} side={-1} />

        {/* Distance between bends (above upper run) */}
        <Dim x1={b1x} y1={yHigh - 18} x2={b2x} y2={yHigh - 18}
          label={`${distance}"`} offset={14} side={-1} fontSize={9} />

        {/* Shrink + angle */}
        <text x={(b1x + b2x) / 2} y={vh - 6} fill={C.dimTxt} fontSize="9" textAnchor="middle" fontFamily="ui-monospace, monospace">
          shrink: {shrinkage}&quot; · angle: {angle}°
        </text>
      </svg>
    )
  }

  // ── 3-Bend Saddle ────────────────────────────────────────────────────────────
  if (type === 'saddle3') {
    const vw = 390, vh = 192
    const yRun    = 148
    const centerX = 195
    const outerSpan = 100      // px from center to each outer bend mark
    const humpH     = 62       // hump height in px
    const topY      = yRun - humpH   // = 86
    const b1x = centerX - outerSpan  // 95
    const b3x = centerX + outerSpan  // 295

    // Control points tuned to produce a smooth, symmetric saddle hump
    const cpL = (centerX - b1x) * 0.50  // 50
    const cpR = (b3x - centerX) * 0.50  // 50

    const d = [
      `M 12,${yRun}`,
      `L ${b1x},${yRun}`,
      // Left slope: horizontal → peak (arrives flat at top)
      `C ${b1x + cpL},${yRun} ${centerX - cpL * 0.28},${topY} ${centerX},${topY}`,
      // Right slope: peak → horizontal (leaves flat from top)
      `C ${centerX + cpR * 0.28},${topY} ${b3x - cpR},${yRun} ${b3x},${yRun}`,
      `L 378,${yRun}`,
    ].join(' ')

    const saddleH   = calcValues.height ?? calcValues.saddleHeight ?? 2
    const outerDist = calcValues.outerDistance ?? '—'

    return (
      <svg viewBox={`0 0 ${vw} ${vh}`} className="w-full" style={{ maxHeight: '185px', display: 'block', borderRadius: '8px' }}>
        <GridBG w={vw} h={vh} />

        {/* Round obstacle (pipe/conduit) rendered BEHIND conduit */}
        {/* Outer shadow layer */}
        <ellipse
          cx={centerX} cy={(topY + yRun) / 2 + 6}
          rx={(b3x - b1x) / 2 - 6} ry={(yRun - topY) / 2 - 2}
          fill={C.obs} stroke={C.obsStroke} strokeWidth="1.5"
        />
        {/* Mid sheen layer */}
        <ellipse
          cx={centerX} cy={(topY + yRun) / 2 + 6}
          rx={(b3x - b1x) / 2 - 10} ry={(yRun - topY) / 2 - 5}
          fill="none" stroke="#253545" strokeWidth="4"
        />
        {/* Top highlight — simulates curved surface */}
        <ellipse
          cx={centerX} cy={(topY + yRun) / 2 - 2}
          rx={(b3x - b1x) / 2 - 18} ry={5}
          fill="none" stroke="#3a5570" strokeWidth="2" opacity="0.7"
        />
        <text x={centerX} y={(topY + yRun) / 2 + 20} fill={C.dimTxt} fontSize="8" textAnchor="middle" fontFamily="ui-monospace, monospace">
          obstacle
        </text>

        <line x1={0} y1={yRun + 14} x2={vw} y2={yRun + 14} stroke={C.grid} strokeWidth="1" />

        <Pipe d={d} />

        {/* Outer bend marks */}
        <Tick x={b1x} y={yRun} vertical size={12} color={C.tick} />
        <Tick x={b3x} y={yRun} vertical size={12} color={C.tick} />
        {/* Center bend mark (horizontal, at hump apex) */}
        <Tick x={centerX} y={topY} vertical={false} size={12} color={C.tick} />

        {/* Angle labels */}
        <text x={b1x}    y={yRun + 25} fill={C.tick} fontSize="8" textAnchor="middle" fontFamily="ui-monospace, monospace">22.5°</text>
        <text x={centerX} y={topY - 14} fill={C.tick} fontSize="8" textAnchor="middle" fontFamily="ui-monospace, monospace">45° center</text>
        <text x={b3x}    y={yRun + 25} fill={C.tick} fontSize="8" textAnchor="middle" fontFamily="ui-monospace, monospace">22.5°</text>

        {/* Saddle height dim */}
        <Dim x1={centerX} y1={topY} x2={centerX} y2={yRun} label={`${saddleH}"`} offset={28} side={-1} />

        {/* Outer-marks distance dim */}
        <Dim x1={b1x} y1={yRun - 18} x2={b3x} y2={yRun - 18}
          label={`${outerDist}" ea. side`} offset={14} side={1} fontSize={9} />
      </svg>
    )
  }

  // ── 4-Bend Saddle ────────────────────────────────────────────────────────────
  if (type === 'saddle4') {
    const vw = 400, vh = 192
    const yRun = 148, yTop = 76
    const b1x = 68, b2x = 142, b3x = 258, b4x = 332

    // Arc control-point distance for each transition
    const cpd1 = (b2x - b1x) * 0.55  // 40.7
    const cpd2 = (b4x - b3x) * 0.55  // 40.7

    const d = [
      `M 12,${yRun}`,
      `L ${b1x},${yRun}`,
      // Arc up: b1x → b2x
      `C ${b1x + cpd1},${yRun} ${b2x - cpd1},${yTop} ${b2x},${yTop}`,
      // Flat top
      `L ${b3x},${yTop}`,
      // Arc down: b3x → b4x
      `C ${b3x + cpd2},${yTop} ${b4x - cpd2},${yRun} ${b4x},${yRun}`,
      `L 388,${yRun}`,
    ].join(' ')

    const height   = calcValues.height   ?? '—'
    const boxWidth = calcValues.distance ?? '—'

    // Obstacle: width = exactly b2→b3 span; height proportional to rise
    const riseH = yRun - yTop  // 72px = full conduit rise
    const heightNum = parseFloat(String(height))
    // Scale: the conduit rise visually equals riseH px; obstacle is same height
    const obsH = !isNaN(heightNum) ? Math.min(riseH, Math.max(12, heightNum * (riseH / Math.max(heightNum, 1)))) : riseH
    const obsY = yRun - obsH

    return (
      <svg viewBox={`0 0 ${vw} ${vh}`} className="w-full" style={{ maxHeight: '185px', display: 'block', borderRadius: '8px' }}>
        <GridBG w={vw} h={vh} />

        {/* Obstacle — width = b2→b3, height proportional to rise */}
        <rect
          x={b2x} y={obsY}
          width={b3x - b2x} height={obsH}
          fill={C.obs} stroke={C.obsStroke} strokeWidth="1" rx="2"
        />
        <text x={(b2x + b3x) / 2} y={obsY + obsH / 2 + 3} fill={C.dimTxt} fontSize="8" textAnchor="middle" fontFamily="ui-monospace, monospace">
          obstacle
        </text>

        <line x1={0} y1={yRun + 14} x2={vw} y2={yRun + 14} stroke={C.grid} strokeWidth="1" />

        <Pipe d={d} />

        {/* Bend marks */}
        {([
          { x: b1x, y: yRun, v: true  },
          { x: b2x, y: yTop, v: false },
          { x: b3x, y: yTop, v: false },
          { x: b4x, y: yRun, v: true  },
        ] as Array<{ x: number; y: number; v: boolean }>).map((pt, i) => (
          <Tick key={i} x={pt.x} y={pt.y} vertical={pt.v} size={11} color={C.tick} />
        ))}

        {/* Angle labels */}
        <text x={b1x} y={yRun + 24} fill={C.tick} fontSize="8" textAnchor="middle" fontFamily="ui-monospace, monospace">45°</text>
        <text x={b2x} y={yTop - 14} fill={C.tick} fontSize="8" textAnchor="middle" fontFamily="ui-monospace, monospace">45°</text>
        <text x={b3x} y={yTop - 14} fill={C.tick} fontSize="8" textAnchor="middle" fontFamily="ui-monospace, monospace">45°</text>
        <text x={b4x} y={yRun + 24} fill={C.tick} fontSize="8" textAnchor="middle" fontFamily="ui-monospace, monospace">45°</text>

        {/* Height dim */}
        <Dim x1={b1x - 16} y1={yTop} x2={b1x - 16} y2={yRun} label={`${height}"`} offset={14} side={-1} />

        {/* Box-width dim */}
        <Dim x1={b2x} y1={yTop - 14} x2={b3x} y2={yTop - 14}
          label={`${boxWidth}"`} offset={12} side={1} fontSize={9} />
      </svg>
    )
  }

  // ── Back-to-Back 90s ─────────────────────────────────────────────────────────
  if (type === 'back2back') {
    const vw = 320, vh = 225
    const R = 36
    const yBtm = 196, yTop = 44
    const s1x = 80, s2x = 240

    // Left 90°: stub goes up at s1x, arc turns right at top
    // Arc start: (s1x, yTop + R)  →  arc end: (s1x + R, yTop)
    // Direction: was going up (0,-1), becomes going right (1,0)
    const la_sy  = yTop + R
    const la_cp1x = s1x,         la_cp1y = yTop + R - K * R  // continues upward
    const la_cp2x = s1x + K * R, la_cp2y = yTop              // approaches rightward
    const la_ex   = s1x + R,     la_ey   = yTop

    // Right 90°: horizontal top arrives at s2x - R, arc turns down
    // Arc start: (s2x - R, yTop)  →  arc end: (s2x, yTop + R)
    // Direction: was going right (1,0), becomes going down (0,1)
    const ra_sx   = s2x - R,     ra_sy   = yTop
    const ra_cp1x = s2x - K * R, ra_cp1y = yTop              // continues rightward
    const ra_cp2x = s2x,         ra_cp2y = yTop + K * R      // approaches downward
    const ra_ey   = yTop + R

    const d = [
      `M ${s1x},${yBtm}`,
      `L ${s1x},${la_sy}`,
      `C ${la_cp1x},${la_cp1y} ${la_cp2x},${la_cp2y} ${la_ex},${la_ey}`,
      `L ${ra_sx},${ra_sy}`,
      `C ${ra_cp1x},${ra_cp1y} ${ra_cp2x},${ra_cp2y} ${s2x},${ra_ey}`,
      `L ${s2x},${yBtm}`,
    ].join(' ')

    const b2bDist = calcValues.b2bDistance ?? 24

    return (
      <svg viewBox={`0 0 ${vw} ${vh}`} className="w-full" style={{ maxHeight: '212px', display: 'block', borderRadius: '8px' }}>
        <GridBG w={vw} h={vh} />

        <line x1={0} y1={yBtm + 10} x2={vw} y2={yBtm + 10} stroke={C.grid} strokeWidth="1" />

        <Pipe d={d} />

        {/* Star mark on second stub for second-bend alignment */}
        <circle cx={s2x} cy={(yBtm + yTop) / 2 + 22} r={5} fill="none" stroke={C.mark} strokeWidth={1.5} />
        <text
          x={s2x + 14} y={(yBtm + yTop) / 2 + 25}
          fill={C.mark} fontSize="9" fontFamily="ui-monospace, monospace" dominantBaseline="middle"
        >
          {backMark}
        </text>

        {/* Bend tick marks at arc root points */}
        <Tick x={s1x} y={la_sy}  vertical={false} size={11} color={C.tick} />
        <Tick x={s2x} y={ra_ey}  vertical={false} size={11} color={C.tick} />

        {/* Back-to-back dimension */}
        <Dim x1={s1x} y1={yBtm} x2={s2x} y2={yBtm} label={`${b2bDist}"`} offset={18} side={-1} />
        <text x={(s1x + s2x) / 2} y={yBtm + 46} fill={C.dimTxt} fontSize="9" textAnchor="middle" fontFamily="ui-monospace, monospace">
          back-to-back distance
        </text>
      </svg>
    )
  }

  // ── Rolling Offset ───────────────────────────────────────────────────────────
  if (type === 'rollingOffset') {
    const vw = 320, vh = 188
    const xs = 44, ys = 152
    const xe = 258, ye = 52

    const rise   = Number(calcValues.rise ?? 6)
    const run    = Number(calcValues.run  ?? 8)
    const travel = calcValues.travel ?? Math.sqrt(rise * rise + run * run).toFixed(2)

    const tAngle = Math.atan2(ye - ys, xe - xs) * 180 / Math.PI  // negative (upward)
    const mx = (xs + xe) / 2, my = (ys + ye) / 2

    return (
      <svg viewBox={`0 0 ${vw} ${vh}`} className="w-full" style={{ maxHeight: '180px', display: 'block', borderRadius: '8px' }}>
        <GridBG w={vw} h={vh} />

        {/* Triangle helper lines */}
        <line x1={xs} y1={ys} x2={xe} y2={ys} stroke={C.dim} strokeWidth="0.8" strokeDasharray="4,3" />
        <line x1={xe} y1={ys} x2={xe} y2={ye} stroke={C.dim} strokeWidth="0.8" strokeDasharray="4,3" />
        {/* Right-angle box */}
        <path d={`M ${xe - 10},${ys} L ${xe - 10},${ys - 10} L ${xe},${ys - 10}`}
          fill="none" stroke={C.dim} strokeWidth="0.8" />

        {/* Conduit (the travel = hypotenuse) */}
        <Pipe d={`M ${xs},${ys} L ${xe},${ye}`} />

        {/* Bend marks at both ends */}
        <circle cx={xs} cy={ys} r={6}  fill="none" stroke={C.mark} strokeWidth={1.5} />
        <circle cx={xe} cy={ye} r={6}  fill="none" stroke={C.mark} strokeWidth={1.5} />
        <text x={xs - 14} y={ys + 16} fill={C.mark} fontSize="8" textAnchor="middle" fontFamily="ui-monospace, monospace">bend 1</text>
        <text x={xe + 16} y={ye - 8}  fill={C.mark} fontSize="8" fontFamily="ui-monospace, monospace">bend 2</text>

        {/* Dimension labels */}
        <text x={(xs + xe) / 2} y={ys + 16} fill={C.dimTxt} fontSize="10" textAnchor="middle" fontFamily="ui-monospace, monospace">
          run: {run}&quot;
        </text>
        <text x={xe + 16} y={(ys + ye) / 2} fill={C.dimTxt} fontSize="10" fontFamily="ui-monospace, monospace" dominantBaseline="middle">
          rise: {rise}&quot;
        </text>

        {/* "travel" label rotated along hypotenuse */}
        <text
          x={mx} y={my - 12}
          fill={C.p6} fontSize="10" textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          transform={`rotate(${tAngle}, ${mx}, ${my})`}
        >
          travel: {travel}&quot;
        </text>
      </svg>
    )
  }

  // ── Kick with 90° ────────────────────────────────────────────────────────────
  if (type === 'kickWith90') {
    const vw = 310, vh = 215
    const R = 36
    const tailY = 168, bendX = 76, tailStartX = 12, stubTopY = 18

    // Main 90° arc: horizontal → upward
    const ex = bendX + R, ey = tailY - R
    const c1x = bendX + K * R, c1y = tailY
    const c2x = ex,             c2y = tailY - K * R

    // Kick arc: from going-up (0,-1) to slightly tilted
    const kickDeg   = 10
    const kickRad   = kickDeg * Math.PI / 180
    const kdx       = Math.sin(kickRad)   // ~0.174  (rightward lean)
    const kdy       = -Math.cos(kickRad)  // ~-0.985 (still mostly upward)
    const kickArcR  = 20
    const kaStartY  = ey - 25             // a short vertical section before kick
    const kaEndX    = ex + kickArcR * kdx
    const kaEndY    = kaStartY + kickArcR * kdy
    // cp1: continues straight up, cp2: approaches kick direction
    const ka_cp1x   = ex,                    ka_cp1y = kaStartY - K * kickArcR
    const ka_cp2x   = kaEndX - K * kickArcR * kdx
    const ka_cp2y   = kaEndY - K * kickArcR * kdy
    // Tip of kick stub
    const kickLen   = 80
    const tipX      = kaEndX + kdx * kickLen
    const tipY      = kaEndY + kdy * kickLen

    const d = [
      `M ${tailStartX},${tailY}`,
      `L ${bendX},${tailY}`,
      `C ${c1x},${c1y} ${c2x},${c2y} ${ex},${ey}`,
      `L ${ex},${kaStartY}`,
      `C ${ka_cp1x},${ka_cp1y} ${ka_cp2x},${ka_cp2y} ${kaEndX},${kaEndY}`,
      `L ${tipX},${tipY}`,
    ].join(' ')

    const kickOffset = calcValues.kickOffset ?? '—'
    const wallX = vw - 18

    return (
      <svg viewBox={`0 0 ${vw} ${vh}`} className="w-full" style={{ maxHeight: '200px', display: 'block', borderRadius: '8px' }}>
        <GridBG w={vw} h={vh} />

        {/* Wall */}
        <rect x={wallX} y={0} width={18} height={vh} fill="#0d1829" />
        <text
          x={wallX + 9} y={vh / 2}
          fill={C.dimTxt} fontSize="8" textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          transform={`rotate(90, ${wallX + 9}, ${vh / 2})`}
        >
          WALL
        </text>

        <line x1={0} y1={tailY + 13} x2={vw} y2={tailY + 13} stroke={C.grid} strokeWidth="1" />

        <Pipe d={d} />

        {/* Bend ticks */}
        <Tick x={bendX}     y={tailY}   vertical size={12} color={C.tick} />
        <Tick x={ex}        y={kaStartY} vertical={false} size={10} color={C.tick} />

        {/* Kick offset dimension to wall */}
        <line x1={tipX}  y1={tipY - 6} x2={wallX} y2={tipY - 6} stroke={C.dim} strokeWidth="0.8" strokeDasharray="3,2" />
        <line x1={tipX}  y1={tipY - 11} x2={tipX}  y2={tipY - 1} stroke={C.dim} strokeWidth="0.8" />
        <line x1={wallX} y1={tipY - 11} x2={wallX} y2={tipY - 1} stroke={C.dim} strokeWidth="0.8" />
        <text x={(tipX + wallX) / 2} y={tipY - 13} fill={C.dimTxt} fontSize="9" textAnchor="middle" fontFamily="ui-monospace, monospace">
          kick: {kickOffset}&quot;
        </text>
      </svg>
    )
  }

  // ── Parallel Bends ───────────────────────────────────────────────────────────
  if (type === 'parallel') {
    const vw = 380, vh = 220
    const yRun = 160
    const startX = 60
    const spacing = Number(calcValues.parallelSpacing ?? 6)
    const count = Number(calcValues.parallelCount ?? 2)
    const stub = Number(calcValues.stub ?? 12)
    const takeup = Number(calcValues.takeup ?? 6)
    const mark = Number((calcValues.mark ?? Math.max(0, stub - takeup)).toString())

    return (
      <svg viewBox={`0 0 ${vw} ${vh}`} className="w-full" style={{ maxHeight: '210px', display: 'block', borderRadius: '8px' }}>
        <GridBG w={vw} h={vh} />

        <line x1={0} y1={yRun + 15} x2={vw} y2={yRun + 15} stroke={C.grid} strokeWidth="1" />

        {/* Draw parallel conduits */}
        {Array.from({ length: count }).map((_, i) => {
          const x = startX + i * spacing
          const d = `M ${x},${yRun} L ${x},${yRun - stub}`
          return <Pipe key={i} d={d} />
        })}

        {/* Mark positions */}
        {Array.from({ length: count }).map((_, i) => {
          const x = startX + i * spacing
          const markY = yRun - mark
          return (
            <g key={i}>
              <line x1={x} y1={markY - 10} x2={x} y2={markY + 10} stroke={C.mark} strokeWidth={1.5} />
              <text x={x} y={markY + 22} fill={C.mark} fontSize="8" textAnchor="middle" fontFamily="ui-monospace, monospace">
                {frontMark}
              </text>
              <text x={x} y={markY - 15} fill={C.dimTxt} fontSize="7" textAnchor="middle" fontFamily="ui-monospace, monospace">
                #{i + 1}
              </text>
            </g>
          )
        })}

        {/* Spacing dimensions */}
        {count > 1 && Array.from({ length: count - 1 }).map((_, i) => {
          const x1 = startX + i * spacing
          const x2 = startX + (i + 1) * spacing
          return (
            <Dim key={i} x1={x1} y1={yRun - 30} x2={x2} y2={yRun - 30} 
              label={`${spacing}"`} offset={12} side={1} fontSize={8} />
          )
        })}

        {/* Stub height dimension */}
        <Dim x1={startX - 20} y1={yRun} x2={startX - 20} y2={yRun - stub} 
          label={`${stub}"`} offset={14} side={-1} />

        <text x={vw / 2} y={vh - 10} fill={C.dimTxt} fontSize="9" textAnchor="middle" fontFamily="ui-monospace, monospace">
          {count} parallel conduits · {spacing}" spacing
        </text>
      </svg>
    )
  }

  // ── Corner Bend ──────────────────────────────────────────────────────────────
  if (type === 'corner') {
    const vw = 320, vh = 220
    const cornerX = 160, cornerY = 140
    const angle = Number(calcValues.cornerAngle ?? 90)
    const radius = Number(calcValues.cornerRadius ?? 0)
    const bendAngle = angle / 2
    const angleRad = (angle * Math.PI) / 180
    const bendRad = (bendAngle * Math.PI) / 180
    
    // Calculate points for the corner
    const legLength = 80
    const startX = cornerX - legLength * Math.cos(bendRad)
    const startY = cornerY + legLength * Math.sin(bendRad)
    const endX = cornerX + legLength * Math.cos(bendRad)
    const endY = cornerY + legLength * Math.sin(bendRad)

    let d = ''
    if (radius > 0) {
      // Arc for radiused corner
      const arcStartX = cornerX - radius * Math.cos(bendRad)
      const arcStartY = cornerY + radius * Math.sin(bendRad)
      const arcEndX = cornerX + radius * Math.cos(bendRad)
      const arcEndY = cornerY + radius * Math.sin(bendRad)
      
      d = `M ${startX},${startY} L ${arcStartX},${arcStartY} A ${radius},${radius} 0 0 1 ${arcEndX},${arcEndY} L ${endX},${endY}`
    } else {
      // Sharp corner with two straight segments
      d = `M ${startX},${startY} L ${cornerX},${cornerY} L ${endX},${endY}`
    }

    return (
      <svg viewBox={`0 0 ${vw} ${vh}`} className="w-full" style={{ maxHeight: '210px', display: 'block', borderRadius: '8px' }}>
        <GridBG w={vw} h={vh} />

        {/* Wall lines */}
        <line x1={cornerX - 100} y1={cornerY} x2={cornerX} y2={cornerY} stroke={C.grid} strokeWidth="1" strokeDasharray="4,3" />
        <line x1={cornerX} y1={cornerY} x2={cornerX} y2={cornerY - 100} stroke={C.grid} strokeWidth="1" strokeDasharray="4,3" />

        <Pipe d={d} />

        {/* Bend marks for sharp corner */}
        {radius === 0 && (
          <>
            <Tick x={cornerX} y={cornerY} vertical={false} size={12} color={C.tick} />
            <text x={cornerX} y={cornerY - 15} fill={C.tick} fontSize="8" textAnchor="middle" fontFamily="ui-monospace, monospace">
              {frontMark}
            </text>
          </>
        )}

        {/* Angle arc */}
        <path d={`M ${cornerX - 30},${cornerY} A 30,30 0 0 1 ${cornerX},${cornerY - 30}`} 
          fill="none" stroke={C.dim} strokeWidth="0.8" strokeDasharray="2,2" />
        <text x={cornerX - 20} y={cornerY - 20} fill={C.dimTxt} fontSize="9" textAnchor="middle" fontFamily="ui-monospace, monospace">
          {angle}°
        </text>

        {/* Radius dimension if applicable */}
        {radius > 0 && (
          <Dim x1={cornerX} y1={cornerY} x2={cornerX + radius * Math.cos(bendRad)} y2={cornerY - radius * Math.sin(bendRad)}
            label={`R${radius}"`} offset={8} side={1} fontSize={8} />
        )}

        {/* Bend angle labels */}
        <text x={cornerX - 40} y={cornerY + 40} fill={C.dimTxt} fontSize="8" textAnchor="middle" fontFamily="ui-monospace, monospace">
          {bendAngle}° bend
        </text>
        <text x={cornerX + 40} y={cornerY + 40} fill={C.dimTxt} fontSize="8" textAnchor="middle" fontFamily="ui-monospace, monospace">
          {bendAngle}° bend
        </text>

        <text x={vw / 2} y={vh - 10} fill={C.dimTxt} fontSize="9" textAnchor="middle" fontFamily="ui-monospace, monospace">
          {radius > 0 ? `${radius}" radius corner` : 'sharp corner'} · {angle}° total
        </text>
      </svg>
    )
  }

  return null
}

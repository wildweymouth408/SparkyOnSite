'use client'

import React from 'react'

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:   '#09090b',
  grid: '#1e1e23',
  // Pipe layers: outer shadow → specular highlight
  p1:   '#0d0d10', p2:   '#1c1c22', p3:   '#2e2e38',
  p4:   '#52525e', p5:   '#8e8e9e', p6:   '#c8c8d4', pH:   '#ffffff',
  // Annotations
  ora:  '#f97316',  // orange — dims, marks, angles
  amb:  '#fbbf24',  // amber — secondary
  dim:  'rgba(255,255,255,0.25)',
  wht:  '#e4e4e7',
  gnd:  '#292934',  // ground hatch fill
  gL:   '#3f3f50',  // ground line
} as const

// Bezier quarter-circle constant
const K = 0.5523

// ── Pipe: layered strokes for 3-D cylinder look ───────────────────────────────
function Pipe({ d, s = 1 }: { d: string; s?: number }) {
  const a: React.SVGAttributes<SVGPathElement> = {
    fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round',
  }
  return (
    <>
      <path d={d} {...a} stroke={C.p1} strokeWidth={16 * s} />
      <path d={d} {...a} stroke={C.p2} strokeWidth={13 * s} />
      <path d={d} {...a} stroke={C.p3} strokeWidth={10 * s} />
      <path d={d} {...a} stroke={C.p4} strokeWidth={7 * s}  />
      <path d={d} {...a} stroke={C.p5} strokeWidth={4.5*s}  />
      <path d={d} {...a} stroke={C.p6} strokeWidth={2.5*s}  />
      <path d={d} {...a} stroke={C.pH} strokeWidth={1 * s}  />
    </>
  )
}

// ── Hatched ground line ───────────────────────────────────────────────────────
function Ground({ x1, y, x2, uid }: { x1: number; y: number; x2: number; uid: string }) {
  return (
    <>
      <defs>
        <pattern id={uid} width="10" height="10" patternUnits="userSpaceOnUse">
          <line x1="0" y1="10" x2="10" y2="0" stroke={C.gnd} strokeWidth="1.4" />
        </pattern>
      </defs>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={C.gL} strokeWidth="1.5" />
      <rect x={x1} y={y} width={x2 - x1} height={10} fill={`url(#${uid})`} opacity="0.7" />
    </>
  )
}

// ── Orange mark rectangle ─────────────────────────────────────────────────────
// onHoriz: mark on a horizontal pipe run (stripe is vertical across pipe)
function Mark({ x, y, label, above = false, onHoriz = true }: {
  x: number; y: number; label: string; above?: boolean; onHoriz?: boolean
}) {
  const w = onHoriz ? 11 : 18
  const h = onHoriz ? 18 : 11
  const ly = above ? y - 26 : y + 26
  const lx = onHoriz ? x : (above ? x - 20 : x + 20)
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h}
        fill={C.ora} rx={1.5} opacity={0.92} />
      <text x={x} y={y + 0.5} fill="#000" fontSize="9" fontWeight="bold"
        textAnchor="middle" dominantBaseline="middle"
        fontFamily="ui-monospace,monospace">{label}</text>
      <text x={onHoriz ? x : lx} y={onHoriz ? ly : y}
        fill="#000" stroke={C.ora} strokeWidth="2.5" fontSize="11" fontWeight="700"
        textAnchor="middle" dominantBaseline="middle"
        fontFamily="ui-monospace,monospace" style={{ paintOrder: 'stroke' }}>{label}</text>
    </g>
  )
}

// ── Dimension line with tick ends and orange label ────────────────────────────
function Dim({ x1, y1, x2, y2, label, off = 22, side = 1, fs = 10 }: {
  x1: number; y1: number; x2: number; y2: number
  label: string; off?: number; side?: number; fs?: number
}) {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len < 1) return null
  const nx = (-dy / len) * side, ny = (dx / len) * side
  const ox = nx * off, oy = ny * off
  const lx = (x1 + x2) / 2 + nx * (off + 11)
  const ly = (y1 + y2) / 2 + ny * (off + 11)
  const tl = 4
  return (
    <g>
      <line x1={x1} y1={y1} x2={x1+ox} y2={y1+oy}
        stroke={C.dim} strokeWidth={0.6} strokeDasharray="2,3" />
      <line x1={x2} y1={y2} x2={x2+ox} y2={y2+oy}
        stroke={C.dim} strokeWidth={0.6} strokeDasharray="2,3" />
      <line x1={x1+ox} y1={y1+oy} x2={x2+ox} y2={y2+oy}
        stroke={C.dim} strokeWidth={1} />
      <line x1={x1+ox-nx*tl} y1={y1+oy-ny*tl} x2={x1+ox+nx*tl} y2={y1+oy+ny*tl}
        stroke={C.dim} strokeWidth={1} />
      <line x1={x2+ox-nx*tl} y1={y2+oy-ny*tl} x2={x2+ox+nx*tl} y2={y2+oy+ny*tl}
        stroke={C.dim} strokeWidth={1} />
      <text x={lx} y={ly} fill="#000" stroke={C.ora} strokeWidth="2.5" fontSize={fs}
        textAnchor="middle" dominantBaseline="middle"
        fontFamily="ui-monospace,monospace" fontWeight="700"
        style={{ paintOrder: 'stroke' }}>
        {label}
      </text>
    </g>
  )
}

// ── Angle arc with orange label ───────────────────────────────────────────────
// Angles in SVG degrees (x-right=0°, y-down=90°, measured clockwise)
function ArcLabel({ cx, cy, r, a1, a2, label }: {
  cx: number; cy: number; r: number; a1: number; a2: number; label: string
}) {
  const rad = (d: number) => (d * Math.PI) / 180
  const sx = cx + r * Math.cos(rad(a1)), sy = cy + r * Math.sin(rad(a1))
  const ex = cx + r * Math.cos(rad(a2)), ey = cy + r * Math.sin(rad(a2))
  const large = Math.abs(a2 - a1) > 180 ? 1 : 0
  const sweep = a2 > a1 ? 1 : 0
  const ma = (a1 + a2) / 2
  const tx = cx + (r + 16) * Math.cos(rad(ma))
  const ty = cy + (r + 16) * Math.sin(rad(ma))
  return (
    <g>
      <path d={`M ${sx},${sy} A ${r},${r} 0 ${large},${sweep} ${ex},${ey}`}
        fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1.2}
        strokeDasharray="3,2" />
      <text x={tx} y={ty} fill="#000" stroke={C.ora} strokeWidth="2.5" fontSize="10"
        fontWeight="700" textAnchor="middle" dominantBaseline="middle"
        fontFamily="ui-monospace,monospace" style={{ paintOrder: 'stroke' }}>{label}</text>
    </g>
  )
}

// ── Types ─────────────────────────────────────────────────────────────────────
export type BendDiagramType =
  | '90' | 'offset' | 'saddle3' | 'saddle4'
  | 'back2back' | 'rollingOffset' | 'kickWith90'
  | 'parallel' | 'corner'

export interface BendDiagramProps {
  type: BendDiagramType
  calcValues?: Record<string, string | number>
  frontMark?: string
  backMark?: string
}

// ── Main Component ────────────────────────────────────────────────────────────
export function BendDiagram({
  type,
  calcValues = {},
  frontMark = 'Arrow ▶',
}: BendDiagramProps) {
  const style: React.CSSProperties = { display: 'block', width: '100%', maxHeight: 220 }

  // ── 90° Stub-up ─────────────────────────────────────────────────────────────
  if (type === '90') {
    const W = 330, H = 215
    const R = 40, tailY = 168, bendX = 82, stubTopY = 20, x0 = 16
    const ex = bendX + R, ey = tailY - R
    const d = `M ${x0},${tailY} L ${bendX},${tailY} `
      + `C ${bendX+K*R},${tailY} ${ex},${tailY-K*R} ${ex},${ey} `
      + `L ${ex},${stubTopY}`

    const stub   = Number(calcValues.stub   ?? 12)
    const takeup = Number(calcValues.takeup ?? 6)
    const mark   = Number((calcValues.mark  ?? Math.max(0, stub - takeup)).toString())
    const rawMx  = x0 + (mark / Math.max(1, stub)) * (bendX - x0)
    const mx     = Math.max(x0 + 10, Math.min(bendX - 10, rawMx))

    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={style}>
        <rect width={W} height={H} fill={C.bg} />
        <Ground x1={0} y={tailY + 13} x2={W} uid="g90" />
        <Pipe d={d} />
        {/* Mark A on horizontal run */}
        <Mark x={mx} y={tailY} label="A" above={false} onHoriz />
        {/* 90° angle arc at the inside corner */}
        <ArcLabel cx={bendX} cy={tailY} r={28} a1={270} a2={360} label="90°" />
        {/* Stub height dimension */}
        <Dim x1={ex} y1={stubTopY} x2={ex} y2={tailY} label={`${stub}"`} off={40} side={-1} />
        {/* Take-up bracket below pipe */}
        <Dim x1={mx} y1={tailY} x2={bendX} y2={tailY} label={`-${takeup}"`} off={28} side={1} fs={9} />
        {/* Mark A annotation */}
        <text x={mx - 2} y={tailY - 32}
          fill="#000" stroke={C.ora} strokeWidth="2" fontSize="9" fontWeight="700"
          textAnchor="middle" fontFamily="ui-monospace,monospace" style={{ paintOrder: 'stroke' }}>place {frontMark}</text>
        <text x={mx - 2} y={tailY - 20}
          fill="#000" stroke={C.ora} strokeWidth="2.5" fontSize="10" fontWeight="700"
          textAnchor="middle" fontFamily="ui-monospace,monospace" style={{ paintOrder: 'stroke' }}>{mark}" from end</text>
        {/* Rotated stub label */}
        <text x={ex + 56} y={(stubTopY + tailY) / 2} fill={C.dim} fontSize="7"
          textAnchor="middle" fontFamily="ui-monospace,monospace"
          transform={`rotate(-90,${ex+56},${(stubTopY+tailY)/2})`}>STUB HEIGHT</text>
      </svg>
    )
  }

  // ── Offset ──────────────────────────────────────────────────────────────────
  if (type === 'offset') {
    const W = 420, H = 204
    const yL = 158, yH = 74
    const b1 = 95, b2 = 298
    const cpd = (b2 - b1) * 0.42
    const d = `M 14,${yL} L ${b1},${yL} C ${b1+cpd},${yL} ${b2-cpd},${yH} ${b2},${yH} L 406,${yH}`

    const h    = calcValues.height   ?? 4
    const dist = calcValues.distance ?? '—'
    const shk  = calcValues.shrinkage ?? '—'
    const ang  = Number(calcValues.angle ?? 30)

    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={style}>
        <rect width={W} height={H} fill={C.bg} />
        {/* Upper reference line */}
        <line x1={0} y1={yH} x2={W} y2={yH}
          stroke="rgba(255,255,255,0.07)" strokeWidth={0.8} strokeDasharray="4,5" />
        <Ground x1={0} y={yL + 13} x2={W} uid="gOff" />
        <Pipe d={d} />
        {/* Marks A and B */}
        <Mark x={b1} y={yL} label="A" above={false} onHoriz />
        <Mark x={b2} y={yH} label="B" above={true} onHoriz />
        {/* Height dim on left */}
        <Dim x1={34} y1={yH} x2={34} y2={yL} label={`${h}"`} off={14} side={-1} />
        {/* Distance between marks dim */}
        <Dim x1={b1} y1={yH - 24} x2={b2} y2={yH - 24}
          label={`${dist}"`} off={12} side={-1} fs={9} />
        {/* Angle arc at first bend — arc from 0° (right) upward by ang° (neg in SVG) */}
        <ArcLabel cx={b1} cy={yL} r={30} a1={-(ang)} a2={0} label={`${ang}°`} />
        {/* Shrinkage footer */}
        <text x={W / 2} y={H - 7}
          fill="#000" stroke={C.ora} strokeWidth="2" fontSize="9" fontWeight="700"
          textAnchor="middle" fontFamily="ui-monospace,monospace" style={{ paintOrder: 'stroke' }}>
          shrinkage ≈ {shk}"
        </text>
      </svg>
    )
  }

  // ── 3-Pt Saddle ─────────────────────────────────────────────────────────────
  if (type === 'saddle3') {
    const W = 400, H = 215
    const yR = 152, cx = 200, humpH = 68, topY = yR - humpH
    const b1 = cx - 102, b3 = cx + 102
    const cL = (cx - b1) * 0.5, cR = (b3 - cx) * 0.5
    const d = `M 12,${yR} L ${b1},${yR} `
      + `C ${b1+cL},${yR} ${cx-cL*0.62},${topY} ${cx},${topY} `
      + `C ${cx+cR*0.62},${topY} ${b3-cR},${yR} ${b3},${yR} `
      + `L 388,${yR}`

    const sH     = calcValues.height        ?? calcValues.saddleHeight ?? 2
    const oDst   = calcValues.outerDistance ?? '—'
    const outerAng = Number(calcValues.angle ?? 22.5)
    const centerAng = outerAng * 2

    const radius = 26
    const circleCy = yR - radius

    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={style}>
        <rect width={W} height={H} fill={C.bg} />
        {/* Obstacle circle */}
        <circle cx={cx} cy={circleCy} r={radius}
          fill="#374151" stroke="#4b5563" strokeWidth="1.2" />
        <text x={cx} y={yR + 25} fill={C.dim} fontSize="7"
          textAnchor="middle" fontFamily="ui-monospace,monospace">obstacle</text>
        <Ground x1={0} y={yR + 12} x2={W} uid="gS3" />
        <Pipe d={d} />
        <Mark x={b1} y={yR} label="A" above={false} onHoriz />
        <Mark x={cx} y={topY} label="B" above={true} onHoriz />
        <Mark x={b3} y={yR} label="C" above={false} onHoriz />
        {/* Saddle height — top of circle to ground */}
        <Dim x1={cx} y1={circleCy - radius} x2={cx} y2={yR} label={`${sH}"`} off={34} side={-1} />
        {/* Outer distances — raised to clear angle arcs */}
        <Dim x1={b1} y1={yR - 46} x2={cx} y2={yR - 46}
          label={`${oDst}"`} off={10} side={-1} fs={9} />
        <Dim x1={cx} y1={yR - 46} x2={b3} y2={yR - 46}
          label={`${oDst}"`} off={10} side={-1} fs={9} />
        {/* Angle arcs — A and C match offset style; B center text to the side */}
        <ArcLabel cx={b1} cy={yR} r={28} a1={-outerAng} a2={0} label={`${outerAng}°`} />
        <ArcLabel cx={b3} cy={yR} r={28} a1={180} a2={180 + outerAng} label={`${outerAng}°`} />
        <text x={cx + 44} y={topY + 4}
          fill="#000" stroke={C.ora} strokeWidth="2" fontSize="9" fontWeight="700"
          textAnchor="start" dominantBaseline="middle"
          fontFamily="ui-monospace,monospace" style={{ paintOrder: 'stroke' }}>{centerAng}°</text>
        {/* Footer tip */}
        <text x={W / 2} y={H - 5} fill={C.dim} fontSize="7" textAnchor="middle"
          fontFamily="ui-monospace,monospace">pipe bottom ≈ ¼" above obstacle height</text>
      </svg>
    )
  }

  // ── 4-Pt Saddle ─────────────────────────────────────────────────────────────
  if (type === 'saddle4') {
    const W = 400, H = 215
    const yR = 152, yT = 82
    const b1 = 70, b2 = 148, b3 = 252, b4 = 330
    const cpd1 = (b2 - b1) * 0.55, cpd2 = (b4 - b3) * 0.55
    const d = `M 12,${yR} L ${b1},${yR} `
      + `C ${b1+cpd1},${yR} ${b2-cpd1},${yT} ${b2},${yT} `
      + `L ${b3},${yT} `
      + `C ${b3+cpd2},${yT} ${b4-cpd2},${yR} ${b4},${yR} `
      + `L 388,${yR}`

    const sH     = calcValues.height   ?? '—'
    const bDst   = calcValues.distance ?? '—'
    const bendAng = Number(calcValues.angle ?? 45)

    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={style}>
        <rect width={W} height={H} fill={C.bg} />
        {/* Obstacle: exact width between marks B and C */}
        <rect x={b2} y={yR - 58} width={b3 - b2} height={62}
          fill="#16161c" stroke="#2a2a36" strokeWidth="1" rx="3" />
        <text x={(b2+b3)/2} y={yR - 28} fill={C.dim} fontSize="8"
          textAnchor="middle" fontFamily="ui-monospace,monospace">obstacle</text>
        <Ground x1={0} y={yR + 12} x2={W} uid="gS4" />
        <Pipe d={d} />
        <Mark x={b1} y={yR} label="A" above={false} onHoriz />
        <Mark x={b2} y={yT} label="B" above={true} onHoriz />
        <Mark x={b3} y={yT} label="C" above={true} onHoriz />
        <Mark x={b4} y={yR} label="D" above={false} onHoriz />
        {/* Height dim on left outside the bends */}
        <Dim x1={b1 - 14} y1={yT} x2={b1 - 14} y2={yR} label={`${sH}"`} off={12} side={-1} />
        {/* B-to-C distance dim — raised to clear B/C mark labels */}
        <Dim x1={b2} y1={yT - 32} x2={b3} y2={yT - 32}
          label={`${bDst}"`} off={10} side={-1} fs={9} />
        {/* Angle arcs: A and D like offset bends; B and C beside marks */}
        <ArcLabel cx={b1} cy={yR} r={24} a1={-bendAng} a2={0} label={`${bendAng}°`} />
        <ArcLabel cx={b4} cy={yR} r={24} a1={180} a2={180 + bendAng} label={`${bendAng}°`} />
        <text x={b2 - 30} y={yT}
          fill="#000" stroke={C.ora} strokeWidth="2" fontSize="9" fontWeight="700"
          textAnchor="end" dominantBaseline="middle"
          fontFamily="ui-monospace,monospace" style={{ paintOrder: 'stroke' }}>{bendAng}°</text>
        <text x={b3 + 30} y={yT}
          fill="#000" stroke={C.ora} strokeWidth="2" fontSize="9" fontWeight="700"
          textAnchor="start" dominantBaseline="middle"
          fontFamily="ui-monospace,monospace" style={{ paintOrder: 'stroke' }}>{bendAng}°</text>
        {/* Footer tip */}
        <text x={W / 2} y={H - 5} fill={C.dim} fontSize="7" textAnchor="middle"
          fontFamily="ui-monospace,monospace">pipe bottom ≈ ¼" above obstacle height</text>
      </svg>
    )
  }

  // ── Back-to-Back ─────────────────────────────────────────────────────────────
  if (type === 'back2back') {
    const W = 320, H = 232
    const R = 36, yB = 200, yT = 46
    const s1 = 82, s2 = 238
    const la_sy = yT + R, la_ex = s1 + R, la_ey = yT
    const ra_sx = s2 - R, ra_sy = yT, ra_ey = yT + R
    const d = `M ${s1},${yB} L ${s1},${la_sy} `
      + `C ${s1},${la_sy-K*R} ${s1+K*R},${yT} ${la_ex},${la_ey} `
      + `L ${ra_sx},${ra_sy} `
      + `C ${s2-K*R},${yT} ${s2},${yT+K*R} ${s2},${ra_ey} `
      + `L ${s2},${yB}`

    const b2bDist = calcValues.b2bDistance ?? 24

    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={style}>
        <rect width={W} height={H} fill={C.bg} />
        <Ground x1={0} y={yB + 10} x2={W} uid="gB2B" />
        <Pipe d={d} />
        {/* Marks on each stub */}
        <Mark x={s1} y={(yB + yT) / 2 + 20} label="A" onHoriz={false} above={false} />
        <Mark x={s2} y={(yB + yT) / 2 + 20} label="B" onHoriz={false} above={false} />
        {/* Back-to-back dimension */}
        <Dim x1={s1} y1={yB} x2={s2} y2={yB} label={`${b2bDist}"`} off={14} side={-1} />
        <text x={(s1+s2)/2} y={yB + 22} fill={C.dim} fontSize="9" textAnchor="middle"
          fontFamily="ui-monospace,monospace">back-to-back distance</text>
        {/* 90° labels */}
        <text x={s1 - 18} y={yT + 10}
          fill="#000" stroke={C.ora} strokeWidth="2" fontSize="9" fontWeight="700"
          fontFamily="ui-monospace,monospace" style={{ paintOrder: 'stroke' }}>90°</text>
        <text x={s2 + 6}  y={yT + 10}
          fill="#000" stroke={C.ora} strokeWidth="2" fontSize="9" fontWeight="700"
          fontFamily="ui-monospace,monospace" style={{ paintOrder: 'stroke' }}>90°</text>
      </svg>
    )
  }

  // ── Rolling Offset ─────────────────────────────────────────────────────────────
  if (type === 'rollingOffset') {
    const W = 400, H = 205
    const yLow = 158, yHigh = 62
    const xMarkA = 82, xMarkB = 292

    const rise   = Number(calcValues.rise ?? 6)
    const run    = Number(calcValues.run  ?? 8)
    const travel = calcValues.travel ?? Math.sqrt(rise * rise + run * run).toFixed(2)

    const tAngle = Math.atan2(yHigh - yLow, xMarkB - xMarkA) * 180 / Math.PI
    const mx = (xMarkA + xMarkB) / 2
    const my = (yLow + yHigh) / 2

    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={style}>
        <rect width={W} height={H} fill={C.bg} />
        {/* Dashed right-triangle: roll (horiz), rise (vert) */}
        <line x1={xMarkA} y1={yLow} x2={xMarkB} y2={yLow}
          stroke={C.dim} strokeWidth={0.8} strokeDasharray="4,3" />
        <line x1={xMarkB} y1={yLow} x2={xMarkB} y2={yHigh}
          stroke={C.dim} strokeWidth={0.8} strokeDasharray="4,3" />
        <path d={`M ${xMarkB-10},${yLow} L ${xMarkB-10},${yLow-10} L ${xMarkB},${yLow-10}`}
          fill="none" stroke={C.dim} strokeWidth={0.8} />
        <Ground x1={0} y={yLow + 12} x2={xMarkA + 24} uid="gRoll" />
        {/* Entry run → diagonal travel → exit run */}
        <Pipe d={`M 14,${yLow} L ${xMarkA},${yLow}`} />
        <Pipe d={`M ${xMarkA},${yLow} L ${xMarkB},${yHigh}`} />
        <Pipe d={`M ${xMarkB},${yHigh} L ${W - 14},${yHigh}`} />
        <Mark x={xMarkA} y={yLow} label="A" above={false} onHoriz />
        <Mark x={xMarkB} y={yHigh} label="B" above={true}  onHoriz />
        {/* Labels */}
        <text x={(xMarkA + xMarkB) / 2} y={yLow + 17}
          fill="#000" stroke={C.ora} strokeWidth="2" fontSize="10" fontWeight="700"
          textAnchor="middle" fontFamily="ui-monospace,monospace" style={{ paintOrder: 'stroke' }}>roll: {run}"</text>
        <text x={xMarkB + 22} y={(yLow + yHigh) / 2}
          fill="#000" stroke={C.ora} strokeWidth="2" fontSize="10" fontWeight="700"
          fontFamily="ui-monospace,monospace" dominantBaseline="middle" style={{ paintOrder: 'stroke' }}>rise: {rise}"</text>
        {/* Travel label along hypotenuse */}
        <text x={mx} y={my - 14}
          fill="#000" stroke={C.ora} strokeWidth="2" fontSize="10" fontWeight="700"
          textAnchor="middle" fontFamily="ui-monospace,monospace" style={{ paintOrder: 'stroke' }}
          transform={`rotate(${tAngle},${mx},${my})`}>travel: {travel}"</text>
      </svg>
    )
  }

  // ── Kick with 90° (horizontal → kick bend → 90° stub-up) ─────────────────────
  if (type === 'kickWith90') {
    const W = 360, H = 244
    const tailY = 186
    const kickDeg = Number(calcValues.kickAngle ?? 12)
    const kickRad = kickDeg * Math.PI / 180
    const cos_k = Math.cos(kickRad), sin_k = Math.sin(kickRad)

    // Mark A: kick bend starts on horizontal run
    const markAx = 70
    const kR = 16  // kick arc visual radius

    // End of kick arc (pipe now traveling at kickDeg above horizontal)
    const kEx = markAx + kR * cos_k
    const kEy = tailY  - kR * sin_k

    // Diagonal section after kick
    const diagLen = 54
    const markBx = Math.round(kEx + diagLen * cos_k)  // Mark B: 90° bend starts
    const markBy = Math.round(kEy - diagLen * sin_k)

    // 90° arc properties
    const R90 = 40
    const stubX    = markBx + R90
    const arc90EndY = markBy - R90
    const stubTopY = 28

    // Kick arc bezier control points (horizontal → kickDeg direction)
    const kCp1x = markAx + kR * K
    const kCp1y = tailY
    const kCp2x = kEx - kR * K * cos_k
    const kCp2y = kEy + kR * K * sin_k

    // 90° arc bezier (approximately horizontal → vertical)
    const a90Cp1x = markBx + K * R90
    const a90Cp1y = markBy
    const a90Cp2x = stubX
    const a90Cp2y = markBy - K * R90

    const d = `M 14,${tailY} L ${markAx},${tailY} `
      + `C ${kCp1x.toFixed(1)},${kCp1y} ${kCp2x.toFixed(1)},${kCp2y.toFixed(1)} ${kEx.toFixed(1)},${kEy.toFixed(1)} `
      + `L ${markBx},${markBy} `
      + `C ${a90Cp1x.toFixed(1)},${a90Cp1y} ${a90Cp2x},${a90Cp2y.toFixed(1)} ${stubX},${arc90EndY} `
      + `L ${stubX},${stubTopY}`

    const kOff  = calcValues.kickOffset    ?? '—'
    const kDist = calcValues.kickDistance  ?? '—'
    const shk   = calcValues.kickShrinkage ?? '—'

    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={style}>
        <rect width={W} height={H} fill={C.bg} />
        <Ground x1={0} y={tailY + 12} x2={W} uid="gKick" />
        <Pipe d={d} />
        {/* Mark A: kick bend */}
        <Mark x={markAx} y={tailY} label="A" above={false} onHoriz />
        {/* Mark B: 90° bend */}
        <Mark x={markBx} y={markBy} label="B" above={true} onHoriz />
        {/* Kick angle arc at A */}
        <ArcLabel cx={markAx} cy={tailY} r={24} a1={-kickDeg} a2={0} label={`${kickDeg}°`} />
        {/* 90° arc at B */}
        <ArcLabel cx={markBx} cy={markBy} r={26} a1={180} a2={270} label="90°" />
        {/* Stub height dimension */}
        <Dim x1={stubX} y1={stubTopY} x2={stubX} y2={arc90EndY}
          label="stub" off={36} side={-1} fs={8} />
        {/* Circle end cap at stub top */}
        <circle cx={stubX} cy={stubTopY} r={7} fill="none" stroke={C.pH} strokeWidth={1.5} />
        {/* Footer */}
        <text x={W / 2} y={H - 16}
          fill="#000" stroke={C.ora} strokeWidth="2" fontSize="9" fontWeight="700"
          textAnchor="middle" fontFamily="ui-monospace,monospace" style={{ paintOrder: 'stroke' }}>
          mark A: {kDist}" from end · {kickDeg}° kick
        </text>
        <text x={W / 2} y={H - 4}
          fill="#000" stroke={C.ora} strokeWidth="1.5" fontSize="8" fontWeight="700"
          textAnchor="middle" fontFamily="ui-monospace,monospace" style={{ paintOrder: 'stroke' }}>
          kick offset: {kOff}" · shrinkage: {shk}"
        </text>
      </svg>
    )
  }

  // ── Parallel Offset Bends ─────────────────────────────────────────────────────
  if (type === 'parallel') {
    const W = 440, H = 210
    const nCond  = Math.min(Number(calcValues.parallelCount   ?? 2), 4)
    const sp     = Number(calcValues.parallelSpacing ?? 6)
    const h      = Number(calcValues.height          ?? 4)
    const dist   = calcValues.distance  ?? '—'
    const adj    = calcValues.adjustment ?? '0'
    const ang    = Number(calcValues.angle ?? 30)

    // Visual scale: each conduit separated 32px vertically
    const rowH   = 32
    const yBase  = 168  // lowest conduit y
    const rise   = 60   // visual rise in pixels (schematic, not to scale)
    const b1Base = 90   // first mark base x for conduit #1
    const b2Base = 260  // second mark base x for conduit #1
    const cpd    = (b2Base - b1Base) * 0.42
    // Each successive conduit shifts marks slightly to the right (adj visualized as ~12px)
    const adjPx  = 12

    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={style}>
        <rect width={W} height={H} fill={C.bg} />
        <Ground x1={0} y={yBase + 13} x2={W} uid="gPar" />

        {Array.from({ length: nCond }, (_, i) => {
          const yR   = yBase - i * rowH          // conduit run y (decreasing = higher)
          const yH   = yR - rise                 // conduit upper level y
          const dx   = i * adjPx                 // visual shift for this conduit
          const ab1  = b1Base + dx               // mark A x
          const ab2  = b2Base + dx               // mark B x
          const lcpd = (ab2 - ab1) * 0.42

          const d = `M 14,${yR} L ${ab1},${yR} `
            + `C ${ab1+lcpd},${yR} ${ab2-lcpd},${yH} ${ab2},${yH} `
            + `L ${W-14},${yH}`

          return (
            <g key={i}>
              {/* Conduit label */}
              <text x={6} y={yR + 1} fill={C.dim} fontSize="7" dominantBaseline="middle"
                fontFamily="ui-monospace,monospace">#{i+1}</text>
              <Pipe d={d} s={0.72} />
              <Mark x={ab1} y={yR} label="A" above={i === nCond - 1} onHoriz />
              <Mark x={ab2} y={yH} label="B" above={true} onHoriz />
            </g>
          )
        })}

        {/* Center-to-center spacing dim between first two conduits */}
        {nCond > 1 && (
          <Dim x1={16} y1={yBase} x2={16} y2={yBase - rowH}
            label={`${sp}"`} off={10} side={-1} fs={8} />
        )}

        {/* Distance between marks (labeled on top conduit) */}
        <Dim
          x1={b1Base + (nCond - 1) * adjPx}
          y1={yBase - (nCond - 1) * rowH - rise - 16}
          x2={b2Base + (nCond - 1) * adjPx}
          y2={yBase - (nCond - 1) * rowH - rise - 16}
          label={`${dist}"`} off={10} side={-1} fs={9}
        />

        {/* Angle arc on first conduit */}
        <ArcLabel cx={b1Base} cy={yBase} r={26} a1={-ang} a2={0} label={`${ang}°`} />

        {/* Footer */}
        <text x={W / 2} y={H - 7}
          fill="#000" stroke={C.ora} strokeWidth="2" fontSize="9" fontWeight="700"
          textAnchor="middle" fontFamily="ui-monospace,monospace" style={{ paintOrder: 'stroke' }}>
          adj per conduit: {adj}" · {nCond} conduits · {sp}" ctc spacing
        </text>
      </svg>
    )
  }

  // ── Corner Bend ───────────────────────────────────────────────────────────────
  if (type === 'corner') {
    const W = 340, H = 238
    // L-shaped corner: horizontal run from left, turns upward at corner
    const cX = 155, cY = 148  // theoretical sharp corner
    const legH = 118           // horizontal leg length
    const legV = 108           // vertical leg length

    const R     = Number(calcValues.cornerRadius ?? 3)
    const ang   = Number(calcValues.cornerAngle  ?? 90)
    const arcLen = calcValues.arcLength  ?? '—'
    const shk    = calcValues.shrinkage  ?? '—'
    const bendAng = calcValues.bendAngle ?? (ang / 2).toFixed(1)

    // Visual radius: scale to pixels, clamped to reasonable display size
    const Rpx = Math.min(Math.max(R * 8, 52), 70)

    let d: string
    if (ang === 90) {
      if (Rpx > 0) {
        // Smooth arc corner: horizontal → arc → vertical
        d = `M ${cX - legH},${cY} L ${cX - Rpx},${cY} `
          + `A ${Rpx},${Rpx} 0 0 1 ${cX},${cY - Rpx} `
          + `L ${cX},${cY - legV}`
      } else {
        d = `M ${cX - legH},${cY} L ${cX},${cY} L ${cX},${cY - legV}`
      }
    } else {
      // Approximate non-90° corners
      const aRad = (ang * Math.PI) / 180
      const exitDx = Math.cos(Math.PI / 2 - aRad) // exit direction x
      const exitDy = -Math.sin(Math.PI / 2 - aRad) // exit direction y (up)
      const arcEndX = cX + exitDx * legV
      const arcEndY = cY + exitDy * legV
      if (Rpx > 0) {
        d = `M ${cX - legH},${cY} L ${cX - Rpx},${cY} `
          + `A ${Rpx},${Rpx} 0 0 1 ${cX + Rpx * exitDx},${cY + Rpx * exitDy} `
          + `L ${arcEndX},${arcEndY}`
      } else {
        d = `M ${cX - legH},${cY} L ${cX},${cY} L ${arcEndX},${arcEndY}`
      }
    }

    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={style}>
        <rect width={W} height={H} fill={C.bg} />
        {/* Wall reference lines (dashed) */}
        <line x1={cX - legH - 10} y1={cY} x2={cX + 20} y2={cY}
          stroke="rgba(255,255,255,0.08)" strokeWidth={0.8} strokeDasharray="4,4" />
        <line x1={cX} y1={cY + 20} x2={cX} y2={cY - legV - 10}
          stroke="rgba(255,255,255,0.08)" strokeWidth={0.8} strokeDasharray="4,4" />
        <Ground x1={cX - legH - 10} y={cY + 13} x2={cX + 20} uid="gCorn" />
        <Pipe d={d} />

        {/* Mark A: start of bend (on horizontal leg) */}
        <Mark x={cX - Rpx} y={cY} label="A" above={false} onHoriz />
        {/* Mark B: end of bend (on vertical leg) */}
        <Mark x={cX} y={cY - Rpx} label="B" above={true} onHoriz={false} />

        {/* Corner angle arc */}
        <ArcLabel cx={cX} cy={cY} r={34} a1={180} a2={270} label={`${ang}°`} />

        {/* Radius dimension */}
        {Rpx > 0 && (
          <>
            {/* Radius arc indicator */}
            <path d={`M ${cX},${cY} L ${cX - Rpx},${cY}`}
              stroke={C.dim} strokeWidth={0.7} strokeDasharray="2,2" />
            <path d={`M ${cX},${cY} L ${cX},${cY - Rpx}`}
              stroke={C.dim} strokeWidth={0.7} strokeDasharray="2,2" />
            <text x={cX - Rpx / 2 - 4} y={cY - Rpx / 2 - 4}
              fill="#000" stroke={C.ora} strokeWidth="2" fontSize="10" fontWeight="700"
              textAnchor="middle" fontFamily="ui-monospace,monospace" style={{ paintOrder: 'stroke' }}>R={R}"</text>
          </>
        )}

        {/* Distance to corner dim (horizontal leg) */}
        <Dim x1={cX - legH} y1={cY} x2={cX - Rpx} y2={cY}
          label="dist to corner" off={24} side={1} fs={8} />

        {/* Footer: arc length and shrinkage */}
        <text x={W / 2} y={H - 18}
          fill="#000" stroke={C.ora} strokeWidth="2" fontSize="9" fontWeight="700"
          textAnchor="middle" fontFamily="ui-monospace,monospace" style={{ paintOrder: 'stroke' }}>
          arc length: {arcLen}" · shrinkage: {shk}"
        </text>
        <text x={W / 2} y={H - 6}
          fill="#000" stroke={C.ora} strokeWidth="1.5" fontSize="8" fontWeight="700"
          textAnchor="middle" fontFamily="ui-monospace,monospace" style={{ paintOrder: 'stroke' }}>
          each bend: {bendAng}° · {ang}° total corner
        </text>
      </svg>
    )
  }

  return null
}

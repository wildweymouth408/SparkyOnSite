'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { BEND_MULTIPLIERS } from '@/lib/calculator-data'

interface InteractiveConduitCanvasProps {
  bendType: 'offset' | '90' | '3-point-saddle' | '4-point-saddle'
  offsetHeight: number // inches
  bendAngle: number // degrees (should be one of 10, 22.5, 30, 45, 60)
  conduitDiameter: number // inches (for visualization)
  onOffsetHeightChange: (height: number) => void
  onBendAngleChange: (angle: number) => void
}

const SCALE = 20 // pixels per inch
const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 200
const STANDARD_ANGLES = [10, 22.5, 30, 45, 60]

// Find nearest standard angle
function nearestStandardAngle(angle: number): number {
  return STANDARD_ANGLES.reduce((prev, curr) =>
    Math.abs(curr - angle) < Math.abs(prev - angle) ? curr : prev
  )
}

// Get multiplier and shrinkage for a given angle (fallback to cosec if not in table)
function getBendMultiplier(angle: number): { multiplier: number; shrinkage: number } {
  if (BEND_MULTIPLIERS[angle]) {
    return BEND_MULTIPLIERS[angle]
  }
  // Fallback: multiplier = cosec(angle), shrinkage = 0 (unknown)
  const rad = angle * Math.PI / 180
  const multiplier = 1 / Math.sin(rad)
  const shrinkage = 0
  return { multiplier, shrinkage }
}

// Colors matching Sparky UI theme (sunrise palette, dark background)
const PIPE_LIGHT = '#f97316' // sunrise primary
const PIPE_DARK = '#ea580c'   // darker orange for shadow
const MARK_RED = '#ef4444'    // destructive red
const DIM_LINE = '#a1a1aa'    // muted-foreground
const DIM_TEXT = '#d4d4d8'    // lighter foreground
const CONTROL_DRAGGABLE = '#22c55e' // green for draggable point
const CONTROL_FIXED = '#555'   // gray for fixed points
const OBSTACLE_FILL = '#27272a'    // secondary
const OBSTACLE_STROKE = '#374151'  // border

export function InteractiveConduitCanvas({
  bendType,
  offsetHeight,
  bendAngle,
  conduitDiameter,
  onOffsetHeightChange,
  onBendAngleChange,
}: InteractiveConduitCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragPointId, setDragPointId] = useState<string | null>(null)

  // Use nearest standard angle for calculations (except 90°)
  const standardAngle = bendType === '90' ? 90 : nearestStandardAngle(bendAngle)
  const { multiplier, shrinkage } = getBendMultiplier(standardAngle)
  const distanceBetweenBends = offsetHeight * multiplier
  const totalShrinkage = offsetHeight * shrinkage

  // Convert inches to pixels
  const offsetPx = offsetHeight * SCALE
  const distancePx = distanceBetweenBends * SCALE

  // Base coordinates
  const startX = 50
  const startY = CANVAS_HEIGHT - 50

  // Compute geometry based on bend type
  const geometry = useMemo(() => {
    const points: { x: number; y: number }[] = []
    const controlPoints: { x: number; y: number; id: string; color: string }[] = []
    const dimensions: { type: string; x1: number; y1: number; x2: number; y2: number; label: string }[] = []

    if (bendType === 'offset') {
      const vertexX = startX + distancePx / 2
      const vertexY = startY - offsetPx
      const endX = startX + distancePx
      const endY = startY
      points.push(
        { x: startX, y: startY },
        { x: vertexX, y: vertexY },
        { x: endX, y: endY }
      )
      controlPoints.push(
        { x: vertexX, y: vertexY, id: 'vertex', color: CONTROL_DRAGGABLE },
        { x: startX, y: startY, id: 'start', color: CONTROL_FIXED },
        { x: endX, y: endY, id: 'end', color: CONTROL_FIXED }
      )
      dimensions.push(
        {
          type: 'offsetHeight',
          x1: startX + 10,
          y1: startY,
          x2: startX + 10,
          y2: vertexY,
          label: `${offsetHeight.toFixed(2)}"`,
        },
        {
          type: 'distanceBetweenBends',
          x1: startX,
          y1: startY + 20,
          x2: endX,
          y2: startY + 20,
          label: `${distanceBetweenBends.toFixed(2)}"`,
        }
      )
    } else if (bendType === '90') {
      const horizontalRun = 100 // pixels fixed
      const bendX = startX + horizontalRun
      const bendY = startY
      const stubTopX = bendX
      const stubTopY = startY - offsetPx
      points.push(
        { x: startX, y: startY },
        { x: bendX, y: bendY },
        { x: stubTopX, y: stubTopY }
      )
      controlPoints.push(
        { x: stubTopX, y: stubTopY, id: 'stubTop', color: CONTROL_DRAGGABLE },
        { x: startX, y: startY, id: 'start', color: CONTROL_FIXED },
        { x: bendX, y: bendY, id: 'bend', color: CONTROL_FIXED }
      )
      dimensions.push({
        type: 'stubLength',
        x1: stubTopX + 10,
        y1: stubTopY,
        x2: stubTopX + 10,
        y2: startY,
        label: `${offsetHeight.toFixed(2)}"`,
      })
    } else if (bendType === '3-point-saddle') {
      // Three-point saddle: left outer, center peak, right outer
      const leftX = startX
      const leftY = startY
      const centerX = startX + distancePx / 2
      const centerY = startY - offsetPx
      const rightX = startX + distancePx
      const rightY = startY
      points.push(
        { x: leftX, y: leftY },
        { x: centerX, y: centerY },
        { x: rightX, y: rightY }
      )
      controlPoints.push(
        { x: centerX, y: centerY, id: 'center', color: CONTROL_DRAGGABLE },
        { x: leftX, y: leftY, id: 'start', color: CONTROL_FIXED },
        { x: rightX, y: rightY, id: 'end', color: CONTROL_FIXED }
      )
      // Obstacle rectangle
      const obstacleWidth = distancePx * 0.6
      const obstacleX = centerX - obstacleWidth / 2
      const obstacleY = centerY + 10 // offset below peak
      dimensions.push({
        type: 'obstacleHeight',
        x1: centerX + 10,
        y1: centerY,
        x2: centerX + 10,
        y2: startY,
        label: `${offsetHeight.toFixed(2)}"`,
      })
      // Additional geometry for obstacle (not drawn as dimension)
    } else if (bendType === '4-point-saddle') {
      // Four-point saddle: left outer, first peak, valley, second peak, right outer
      const segment = distancePx / 4
      const leftX = startX
      const leftY = startY
      const peak1X = startX + segment
      const peak1Y = startY - offsetPx
      const valleyX = startX + segment * 2
      const valleyY = startY
      const peak2X = startX + segment * 3
      const peak2Y = startY - offsetPx
      const rightX = startX + segment * 4
      const rightY = startY
      points.push(
        { x: leftX, y: leftY },
        { x: peak1X, y: peak1Y },
        { x: valleyX, y: valleyY },
        { x: peak2X, y: peak2Y },
        { x: rightX, y: rightY }
      )
      controlPoints.push(
        { x: peak1X, y: peak1Y, id: 'peak1', color: CONTROL_DRAGGABLE },
        { x: valleyX, y: valleyY, id: 'valley', color: CONTROL_FIXED },
        { x: peak2X, y: peak2Y, id: 'peak2', color: CONTROL_DRAGGABLE },
        { x: leftX, y: leftY, id: 'start', color: CONTROL_FIXED },
        { x: rightX, y: rightY, id: 'end', color: CONTROL_FIXED }
      )
      dimensions.push({
        type: 'obstacleHeight',
        x1: peak1X + 10,
        y1: peak1Y,
        x2: peak1X + 10,
        y2: startY,
        label: `${offsetHeight.toFixed(2)}"`,
      })
    }

    return { points, controlPoints, dimensions }
  }, [bendType, offsetHeight, bendAngle, conduitDiameter, distancePx, offsetPx, distanceBetweenBends, startX, startY])

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw conduit as rounded rectangle
    const conduitRadius = conduitDiameter * SCALE / 2
    ctx.strokeStyle = PIPE_DARK
    ctx.lineWidth = conduitRadius * 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    if (geometry.points.length > 0) {
      ctx.moveTo(geometry.points[0].x, geometry.points[0].y)
      for (let i = 1; i < geometry.points.length; i++) {
        ctx.lineTo(geometry.points[i].x, geometry.points[i].y)
      }
    }
    ctx.stroke()

    // Draw a second lighter stroke for visual depth
    ctx.strokeStyle = PIPE_LIGHT
    ctx.lineWidth = conduitRadius * 2 - 4
    ctx.beginPath()
    if (geometry.points.length > 0) {
      ctx.moveTo(geometry.points[0].x, geometry.points[0].y)
      for (let i = 1; i < geometry.points.length; i++) {
        ctx.lineTo(geometry.points[i].x, geometry.points[i].y)
      }
    }
    ctx.stroke()

    // Draw control points
    const drawControlPoint = (x: number, y: number, color: string) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    geometry.controlPoints.forEach(cp => drawControlPoint(cp.x, cp.y, cp.color))

    // Draw dimension lines
    ctx.strokeStyle = DIM_LINE
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.fillStyle = DIM_TEXT
    ctx.font = '12px monospace'
    geometry.dimensions.forEach(dim => {
      ctx.beginPath()
      ctx.moveTo(dim.x1, dim.y1)
      ctx.lineTo(dim.x2, dim.y2)
      ctx.stroke()
      // Label placement
      const midX = (dim.x1 + dim.x2) / 2
      const midY = (dim.y1 + dim.y2) / 2
      ctx.fillText(dim.label, midX + 5, midY)
    })

    // Bend angle label (for offset)
    if (bendType === 'offset') {
      const vertex = geometry.controlPoints.find(cp => cp.id === 'vertex')
      if (vertex) {
        ctx.fillText(`${standardAngle.toFixed(1)}°`, vertex.x + 10, vertex.y - 10)
      }
    }

    ctx.setLineDash([])
  }, [geometry, conduitDiameter, standardAngle, bendType])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Find closest draggable control point
    for (const cp of geometry.controlPoints) {
      if (cp.id === 'start' || cp.id === 'end' || cp.id === 'bend' || cp.id === 'valley') continue // not draggable
      const dx = x - cp.x
      const dy = y - cp.y
      if (Math.sqrt(dx * dx + dy * dy) < 15) {
        setIsDragging(true)
        setDragPointId(cp.id)
        return
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragPointId) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Determine new offset height based on drag point
    let newOffsetHeight = offsetHeight
    let newBendAngle = bendAngle

    if (dragPointId === 'vertex' || dragPointId === 'center' || dragPointId === 'peak1' || dragPointId === 'peak2' || dragPointId === 'stubTop') {
      // Vertical drag only (for now) - adjust offset height
      const maxY = startY - 10
      const minY = 10
      const newY = Math.max(minY, Math.min(y, maxY))
      newOffsetHeight = (startY - newY) / SCALE
      // For offset, also adjust angle based on horizontal position (if vertex)
      if (dragPointId === 'vertex') {
        // Allow horizontal drag to adjust distance between bends (and thus angle)
        const minX = startX + 10
        const maxX = startX + distancePx - 10
        const newX = Math.max(minX, Math.min(x, maxX))
        const newDistanceBetweenBends = (newX - startX) * 2 // because vertex is midpoint
        const adjacent = newDistanceBetweenBends / 2
        const opposite = newOffsetHeight
        if (adjacent > 0) {
          newBendAngle = Math.atan(opposite / adjacent) * 180 / Math.PI
          newBendAngle = nearestStandardAngle(newBendAngle)
        }
      }
    }

    // Update parent state
    if (newOffsetHeight !== offsetHeight) {
      onOffsetHeightChange(newOffsetHeight)
    }
    if (newBendAngle !== bendAngle) {
      onBendAngleChange(newBendAngle)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragPointId(null)
  }

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="border border-[#2a2a35] rounded-lg cursor-pointer"
      />
      <p className="text-xs text-[#888] mt-2">
        Drag the green dot to adjust {bendType === '90' ? 'stub length' : 'height'}.{bendType === 'offset' && ' Angle snaps to standard bender angles.'}
      </p>
      <div className="mt-2 text-xs text-[#555]">
        {distanceBetweenBends > 0 && (
          <span>Distance between bends: <strong>{distanceBetweenBends.toFixed(2)}"</strong></span>
        )}
        {totalShrinkage > 0 && (
          <span className="ml-4">Shrinkage: <strong>{totalShrinkage.toFixed(2)}"</strong></span>
        )}
        {bendType === '90' && (
          <span>Take-up: <strong>{conduitDiameter <= 0.75 ? 5 : conduitDiameter <= 1 ? 6 : conduitDiameter <= 1.25 ? 8 : 11}"</strong></span>
        )}
      </div>
    </div>
  )
}
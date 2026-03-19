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
  const [dragPoint, setDragPoint] = useState<'vertex' | null>(null)

  // Use nearest standard angle for calculations
  const standardAngle = nearestStandardAngle(bendAngle)
  const { multiplier, shrinkage } = getBendMultiplier(standardAngle)
  const distanceBetweenBends = offsetHeight * multiplier
  const totalShrinkage = offsetHeight * shrinkage

  // Convert inches to pixels
  const offsetPx = offsetHeight * SCALE
  const distancePx = distanceBetweenBends * SCALE

  // Base coordinates
  const startX = 50
  const startY = CANVAS_HEIGHT - 50

  // Geometry points and control points
  let points: { x: number; y: number }[] = []
  let controlPoints: { x: number; y: number; id: string; color: string }[] = []
  let dimensions: { type: string; x1: number; y1: number; x2: number; y2: number; label: string }[] = []

  if (bendType === 'offset') {
    const vertexX = startX + distancePx / 2
    const vertexY = startY - offsetPx
    const endX = startX + distancePx
    const endY = startY
    points = [
      { x: startX, y: startY },
      { x: vertexX, y: vertexY },
      { x: endX, y: endY },
    ]
    controlPoints = [
      { x: vertexX, y: vertexY, id: 'vertex', color: '#00ff88' },
      { x: startX, y: startY, id: 'start', color: '#555' },
      { x: endX, y: endY, id: 'end', color: '#555' },
    ]
    dimensions = [
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
      },
    ]
  } else if (bendType === '90') {
    const horizontalRun = 100 // pixels fixed
    const bendX = startX + horizontalRun
    const bendY = startY
    const stubTopX = bendX
    const stubTopY = startY - offsetPx
    points = [
      { x: startX, y: startY },
      { x: bendX, y: bendY },
      { x: stubTopX, y: stubTopY },
    ]
    controlPoints = [
      { x: stubTopX, y: stubTopY, id: 'stubTop', color: '#00ff88' },
      { x: startX, y: startY, id: 'start', color: '#555' },
      { x: bendX, y: bendY, id: 'bend', color: '#555' },
    ]
    dimensions = [
      {
        type: 'stubLength',
        x1: stubTopX + 10,
        y1: stubTopY,
        x2: stubTopX + 10,
        y2: startY,
        label: `${offsetHeight.toFixed(2)}"`,
      },
    ]
  } else if (bendType === '3-point-saddle') {
    // TODO: implement saddle geometry
    const vertexX = startX + distancePx / 2
    const vertexY = startY - offsetPx
    const endX = startX + distancePx
    const endY = startY
    points = [
      { x: startX, y: startY },
      { x: vertexX, y: vertexY },
      { x: endX, y: endY },
    ]
    controlPoints = [
      { x: vertexX, y: vertexY, id: 'vertex', color: '#00ff88' },
    ]
    dimensions = []
  } else if (bendType === '4-point-saddle') {
    // TODO: implement 4-point saddle geometry
    const vertexX = startX + distancePx / 2
    const vertexY = startY - offsetPx
    const endX = startX + distancePx
    const endY = startY
    points = [
      { x: startX, y: startY },
      { x: vertexX, y: vertexY },
      { x: endX, y: endY },
    ]
    controlPoints = [
      { x: vertexX, y: vertexY, id: 'vertex', color: '#00ff88' },
    ]
    dimensions = []
  }

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
    ctx.strokeStyle = '#ff6b00'
    ctx.lineWidth = conduitRadius * 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(vertexX, vertexY)
    ctx.lineTo(endX, endY)
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

    // Draw vertex control point (draggable)
    drawControlPoint(vertexX, vertexY, '#00ff88')
    // Draw start and end points (fixed)
    drawControlPoint(startX, startY, '#555')
    drawControlPoint(endX, endY, '#555')

    // Draw dimension lines
    ctx.strokeStyle = '#888'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    // Offset height dimension
    ctx.beginPath()
    ctx.moveTo(startX + 10, startY)
    ctx.lineTo(startX + 10, vertexY)
    ctx.stroke()
    ctx.fillStyle = '#888'
    ctx.font = '12px monospace'
    ctx.fillText(`${offsetHeight.toFixed(2)}"`, startX + 15, (startY + vertexY) / 2)

    // Distance between bends dimension
    ctx.beginPath()
    ctx.moveTo(startX, startY + 20)
    ctx.lineTo(endX, startY + 20)
    ctx.stroke()
    ctx.fillText(`${distanceBetweenBends.toFixed(2)}"`, (startX + endX) / 2 - 20, startY + 35)

    // Bend angle label
    ctx.fillText(`${standardAngle.toFixed(1)}°`, vertexX + 10, vertexY - 10)

    ctx.setLineDash([])
  }, [offsetHeight, bendAngle, conduitDiameter, startX, startY, vertexX, vertexY, endX, endY, offsetPx, distancePx, distanceBetweenBends, standardAngle])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if click near vertex
    const dx = x - vertexX
    const dy = y - vertexY
    if (Math.sqrt(dx * dx + dy * dy) < 15) {
      setIsDragging(true)
      setDragPoint('vertex')
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragPoint) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (dragPoint === 'vertex') {
      // Constrain vertex to be above start point and within bounds
      const newVertexX = Math.max(startX + 10, Math.min(x, endX - 10))
      const newVertexY = Math.max(10, Math.min(y, startY - 10))
      
      // Calculate new offset height and distance
      const newOffsetHeight = (startY - newVertexY) / SCALE
      const newDistanceBetweenBends = (endX - startX) / SCALE
      // Recalculate bend angle from geometry
      const adjacent = newDistanceBetweenBends / 2
      const opposite = newOffsetHeight
      if (adjacent > 0) {
        let newBendAngle = Math.atan(opposite / adjacent) * 180 / Math.PI
        // Snap to nearest standard angle
        newBendAngle = nearestStandardAngle(newBendAngle)
        onOffsetHeightChange(newOffsetHeight)
        onBendAngleChange(newBendAngle)
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragPoint(null)
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
        Drag the green dot to adjust offset height and bend angle. Angle snaps to standard bender angles.
      </p>
      <div className="mt-2 text-xs text-[#555]">
        <span>Distance between bends: <strong>{distanceBetweenBends.toFixed(2)}"</strong></span>
        {totalShrinkage > 0 && (
          <span className="ml-4">Shrinkage: <strong>{totalShrinkage.toFixed(2)}"</strong></span>
        )}
      </div>
    </div>
  )
}
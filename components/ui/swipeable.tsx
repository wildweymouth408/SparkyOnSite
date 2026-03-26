'use client'

import { ReactNode, useState, useRef, TouchEvent } from 'react'
import { Copy, Trash2 } from 'lucide-react'

interface SwipeableProps {
  children: ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  leftAction?: { icon: ReactNode; text: string; color: string }
  rightAction?: { icon: ReactNode; text: string; color: string }
}

export function Swipeable({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction = { icon: <Copy className="h-4 w-4" />, text: 'Duplicate', color: 'bg-[#f97316]' },
  rightAction = { icon: <Trash2 className="h-4 w-4" />, text: 'Delete', color: 'bg-red-500' },
}: SwipeableProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [offsetX, setOffsetX] = useState(0)
  const [isSwiped, setIsSwiped] = useState(false)
  const minSwipeDistance = 80
  const containerRef = useRef<HTMLDivElement>(null)

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: TouchEvent) => {
    if (!touchStart) return
    const currentTouch = e.targetTouches[0].clientX
    const diff = currentTouch - touchStart
    // Allow swipe only horizontally, limit to ±120px
    if (Math.abs(diff) < 120) {
      setOffsetX(diff)
    }
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft()
    } else if (isRightSwipe && onSwipeRight) {
      onSwipeRight()
    }
    // Reset
    setTouchStart(null)
    setOffsetX(0)
    setIsSwiped(false)
  }

  const handleLeftActionClick = () => {
    onSwipeLeft?.()
    setOffsetX(0)
  }

  const handleRightActionClick = () => {
    onSwipeRight?.()
    setOffsetX(0)
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Background actions */}
      <div className="absolute inset-y-0 left-0 flex items-center">
        <button
          className={`${leftAction.color} text-white px-4 py-3 h-full flex items-center gap-2 transition-transform`}
          style={{ transform: `translateX(${offsetX > 0 ? offsetX : 0}px)` }}
          onClick={handleLeftActionClick}
        >
          {leftAction.icon}
          <span className="text-xs font-medium">{leftAction.text}</span>
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          className={`${rightAction.color} text-white px-4 py-3 h-full flex items-center gap-2 transition-transform`}
          style={{ transform: `translateX(${offsetX < 0 ? offsetX : 0}px)` }}
          onClick={handleRightActionClick}
        >
          {rightAction.icon}
          <span className="text-xs font-medium">{rightAction.text}</span>
        </button>
      </div>
      {/* Foreground content */}
      <div
        ref={containerRef}
        className="relative bg-card transition-transform duration-200"
        style={{ transform: `translateX(${offsetX}px)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {children}
      </div>
    </div>
  )
}
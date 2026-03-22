'use client'

import { X } from 'lucide-react'
import type { PipeBendingResult } from '@/lib/calculations'

interface ArDemoOverlayProps {
  onClose: () => void
  result: PipeBendingResult | null
}

export function ArDemoOverlay({ onClose, result }: ArDemoOverlayProps) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0a0b0d]" style={{ animation: 'slide-up 0.3s ease' }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#27272a] px-4 py-3">
        <span className="text-xs font-medium uppercase tracking-wider text-[#a1a1aa]">AR Measure (Demo)</span>
        <button onClick={onClose} className="text-[#a1a1aa] hover:text-[#fafafa]" aria-label="Close AR view">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Simulated camera view */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#1a1a1a]">
        {/* Grid background to simulate environment */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <line x1="40" y1="0" x2="40" y2="40" stroke="#27272a" strokeWidth="0.5" />
                <line x1="0" y1="40" x2="40" y2="40" stroke="#27272a" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Conduit with bend marks */}
        <svg viewBox="0 0 300 400" className="relative z-10 h-[80%] w-[80%]" preserveAspectRatio="xMidYMid meet">
          {/* Conduit body */}
          <rect x="135" y="20" width="30" height="360" fill="#71717a" rx="0" />
          <rect x="137" y="20" width="26" height="360" fill="#71717a" rx="0" />

          {/* Bend marks */}
          {result && (
            <>
              {/* First mark */}
              <line x1="120" y1="200" x2="180" y2="200" stroke="#f97316" strokeWidth="2"
                strokeDasharray="200" strokeDashoffset="200"
                style={{ animation: 'draw-line 0.8s ease forwards 0.3s' }} />
              <circle cx="150" cy="200" r="4" fill="#f97316" opacity="0"
                style={{ animation: 'fade-in 0.3s ease forwards 0.8s' }} />
              <text x="185" y="204" fill="#f97316" fontSize="12" fontFamily="var(--font-mono)" opacity="0"
                style={{ animation: 'fade-in 0.3s ease forwards 1s' }}>
                Mark 1: {result.firstMark}"
              </text>

              {/* Second mark */}
              {result.secondMark !== 0 && (
                <>
                  <line x1="120" y1="280" x2="180" y2="280" stroke="#00d4ff" strokeWidth="2"
                    strokeDasharray="200" strokeDashoffset="200"
                    style={{ animation: 'draw-line 0.8s ease forwards 0.6s' }} />
                  <circle cx="150" cy="280" r="4" fill="#00d4ff" opacity="0"
                    style={{ animation: 'fade-in 0.3s ease forwards 1.1s' }} />
                  <text x="185" y="284" fill="#00d4ff" fontSize="12" fontFamily="var(--font-mono)" opacity="0"
                    style={{ animation: 'fade-in 0.3s ease forwards 1.3s' }}>
                    Mark 2: {result.secondMark}"
                  </text>
                </>
              )}

              {/* Distance dimension */}
              {result.distanceBetweenBends > 0 && (
                <>
                  <line x1="110" y1="200" x2="110" y2="280" stroke="#a1a1aa" strokeWidth="1" strokeDasharray="3" />
                  <text x="95" y="244" fill="#a1a1aa" fontSize="9" textAnchor="end" fontFamily="var(--font-mono)"
                    transform="rotate(-90 95 244)">
                    {result.distanceBetweenBends}"
                  </text>
                </>
              )}

              {/* Angle indicator */}
              <path d="M 150 200 L 150 180 L 165 190" fill="none" stroke="#f97316" strokeWidth="1" opacity="0.6" />
            </>
          )}
        </svg>

        {/* Crosshair */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <line x1="20" y1="0" x2="20" y2="16" stroke="#f97316" strokeWidth="1" opacity="0.5" />
            <line x1="20" y1="24" x2="20" y2="40" stroke="#f97316" strokeWidth="1" opacity="0.5" />
            <line x1="0" y1="20" x2="16" y2="20" stroke="#f97316" strokeWidth="1" opacity="0.5" />
            <line x1="24" y1="20" x2="40" y2="20" stroke="#f97316" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="border-t border-[#27272a] bg-[#0f1115] p-4">
        <p className="text-center text-[10px] uppercase tracking-wider text-[#71717a]">
          Demo mode -- Real AR requires HTTPS + device camera access
        </p>
        {result && (
          <div className="mt-2 text-center font-mono text-sm text-[#f97316]">
            {result.bendType} | {result.distanceBetweenBends > 0 ? `${result.distanceBetweenBends}" between bends` : `Mark at ${result.firstMark}"`}
          </div>
        )}
      </div>
    </div>
  )
}

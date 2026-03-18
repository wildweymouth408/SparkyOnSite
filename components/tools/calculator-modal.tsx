'use client'

import { X } from 'lucide-react'

interface CalculatorModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

export function CalculatorModal({ title, onClose, children }: CalculatorModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#0f1115]" style={{ animation: 'slide-up 0.3s ease' }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#333] px-4 py-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#f0f0f0]">{title}</h2>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center text-[#888] transition-colors hover:text-[#f0f0f0]"
          aria-label="Close calculator"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 pb-24">
        {children}
        <div className="mt-6 border-t border-[#333] pt-4 text-xs text-[#888]">
          <p><strong>Disclaimer:</strong> Calculations are for reference only. Always verify with the NEC codebook and local regulations.</p>
          <p className="mt-1">Sparky references NEC 2023 but does not guarantee compliance. Always consult the official NEC and a licensed professional.</p>
        </div>
      </div>
    </div>
  )
}

'use client'

import { X } from 'lucide-react'

interface CalculatorModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

export function CalculatorModal({ title, onClose, children }: CalculatorModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-background" style={{ animation: 'slide-up 0.3s ease' }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#fafafa]">{title}</h2>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center text-[#a1a1aa] transition-colors hover:text-[#fafafa]"
          aria-label="Close calculator"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 pb-24">
        {children}
        <div className="mt-6 border-t border-border pt-4 text-xs text-[#a1a1aa]">
          <p><strong>Disclaimer:</strong> Calculations are for reference only. Always verify with the NEC codebook and local regulations.</p>
          <p className="mt-1">Sparky references NEC 2023 but does not guarantee compliance. Always consult the official NEC and a licensed professional.</p>
        </div>
      </div>
    </div>
  )
}

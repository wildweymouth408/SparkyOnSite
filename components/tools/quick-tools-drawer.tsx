'use client'

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { WireSizingCalculator } from './wire-sizing'
import { AmpacityCalculator } from './ampacity'
import { BoxFillCalculator } from './box-fill'
import { useState } from 'react'

interface QuickToolsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type QuickTool = 'wire' | 'ampacity' | 'box'

export function QuickToolsDrawer({ open, onOpenChange }: QuickToolsDrawerProps) {
  const [activeTool, setActiveTool] = useState<QuickTool>('wire')

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] border-t border-[#333] bg-[#0f1115]">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-sm font-bold uppercase tracking-wider text-[#f0f0f0]">Quick Tools</DrawerTitle>
        </DrawerHeader>

        {/* Tool selector */}
        <div className="flex gap-1 px-4 pb-3">
          {([
            { id: 'wire' as const, label: 'Wire Sizing' },
            { id: 'ampacity' as const, label: 'Ampacity' },
            { id: 'box' as const, label: 'Box Fill' },
          ]).map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex-1 py-2 text-[10px] font-medium uppercase tracking-wider transition-colors ${
                activeTool === tool.id
                  ? 'bg-[#f97316] text-[#0f1115]'
                  : 'border border-[#333] bg-[#111] text-[#888]'
              }`}
            >
              {tool.label}
            </button>
          ))}
        </div>

        {/* Tool content */}
        <div className="overflow-y-auto px-4 pb-8">
          {activeTool === 'wire' && <WireSizingCalculator compact />}
          {activeTool === 'ampacity' && <AmpacityCalculator compact />}
          {activeTool === 'box' && <BoxFillCalculator compact />}
          <div className="mt-6 border-t border-[#333] pt-4 text-xs text-[#888]">
            <p><strong>Disclaimer:</strong> Calculations are for reference only. Always verify with the NEC codebook and local regulations.</p>
            <p className="mt-1">Sparky references NEC 2023 but does not guarantee compliance. Always consult the official NEC and a licensed professional.</p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

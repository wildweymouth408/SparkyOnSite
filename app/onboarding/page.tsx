'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Calculator, BookOpen, MessageCircle, ChevronRight, Check } from 'lucide-react'

const steps = [
  {
    icon: Zap,
    title: 'Welcome to Sparky',
    subtitle: 'The electrical toolkit built for the field',
    body: 'Fast, accurate calculations and NEC reference — everything an electrician needs, right in your pocket.',
    color: 'from-orange-500 to-amber-400',
  },
  {
    icon: Calculator,
    title: 'Calculators',
    subtitle: 'Nine tools, always within reach',
    body: 'Voltage drop, wire sizing, conduit fill, conduit bending, ampacity derating, box fill, motor FLA, Ohm\'s law, and construction estimating.',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: BookOpen,
    title: 'NEC Reference',
    subtitle: 'Code at your fingertips',
    body: 'Searchable NEC articles, plain-English explanations, common violations, electrical symbols, and an inspection checklist — no internet needed.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: MessageCircle,
    title: 'Ask Sparky',
    subtitle: 'AI-powered electrical help',
    body: 'Ask anything about electrical code, calculations, or troubleshooting. Sparky gives straight answers grounded in NEC — not generic AI fluff.',
    color: 'from-orange-600 to-red-500',
  },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const router = useRouter()

  const current = steps[step]
  const Icon = current.icon
  const isLast = step === steps.length - 1

  function next() {
    if (isLast) {
      router.push('/calculators')
    } else {
      setStep(s => s + 1)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Skip */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => router.push('/calculators')}
          className="text-zinc-500 text-sm hover:text-zinc-400 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Icon */}
        <div className={`p-5 rounded-3xl bg-gradient-to-br ${current.color} shadow-[0_0_40px_rgba(249,115,22,0.3)] mb-8`}>
          <Icon className="h-10 w-10 text-white" />
        </div>

        <h1 className="text-2xl font-bold mb-2">{current.title}</h1>
        <p className="text-orange-400 text-sm font-semibold mb-4">{current.subtitle}</p>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">{current.body}</p>
      </div>

      {/* Bottom */}
      <div className="px-8 pb-12 space-y-6">
        {/* Step dots */}
        <div className="flex justify-center gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-orange-500' : 'w-2 bg-zinc-700'
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={next}
          className="w-full py-4 bg-orange-500 text-black font-bold text-base rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {isLast ? (
            <>
              <Check className="h-5 w-5" />
              Get Started
            </>
          ) : (
            <>
              Next
              <ChevronRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

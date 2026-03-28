import Link from 'next/link'
import { HelpCircle, ChevronDown } from 'lucide-react'

export const metadata = {
  title: 'Help & FAQ | Sparky',
  description: 'Answers to common questions about using Sparky',
}

const faqs = [
  {
    q: 'How do I save a calculation?',
    a: 'Every calculation is automatically saved when you run it. Access recent calculations from the main Calculators screen.',
  },
  {
    q: 'Are the NEC references up to date?',
    a: 'The built-in NEC reference is based on the 2023 NEC. Always verify against your local amendments and the edition adopted by your AHJ.',
  },
  {
    q: 'How does Ask Sparky work?',
    a: 'Ask Sparky is powered by Claude (Anthropic). Type any electrical question and get a plain-English answer grounded in NEC code. AI responses should be verified — Sparky is a reference tool, not a licensed engineer.',
  },
  {
    q: 'Can I use Sparky offline?',
    a: 'Most calculators and the NEC reference work offline. Ask Sparky requires an internet connection.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Go to Settings → Account Actions → Delete Account. All your data will be removed within 30 days.',
  },
  {
    q: 'Where do I report a bug or request a feature?',
    a: 'Email ianw@sparkyonsite.com with the subject "Bug Report" or "Feature Request". We read every one.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. Your job data, calculations, and credentials are stored only in your account. We do not sell data. See the Privacy Policy for full details.',
  },
  {
    q: 'What conduit types does the Conduit Fill calculator support?',
    a: 'EMT, IMC, RMC, PVC-40, PVC-80, ENT, and LFMC — all per NEC Chapter 9 Table 4.',
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-16">
      <div className="sticky top-0 z-10 bg-zinc-950 border-b border-zinc-800 px-4 py-3 flex items-center gap-3">
        <Link href="/settings" className="text-orange-400 text-sm font-semibold">← Settings</Link>
        <span className="text-zinc-600">/</span>
        <span className="text-sm text-white">Help & FAQ</span>
      </div>

      <div className="px-4 pt-8 max-w-lg mx-auto">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-orange-500/10 rounded-2xl">
            <HelpCircle className="h-8 w-8 text-orange-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Help & FAQ</h1>
        <p className="text-zinc-500 text-sm text-center mb-8">
          Common questions about Sparky. Can't find your answer?{' '}
          <a href="mailto:ianw@sparkyonsite.com" className="text-orange-400 underline">Email us.</a>
        </p>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer list-none hover:bg-zinc-800/60 transition-colors">
                <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                <ChevronDown className="h-4 w-4 text-zinc-500 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-4 pb-4 pt-1 border-t border-zinc-800">
                <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-10 p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl text-center">
          <p className="text-sm text-zinc-400 mb-2">Still need help?</p>
          <a
            href="mailto:ianw@sparkyonsite.com"
            className="inline-block px-5 py-2 bg-orange-500 text-black text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}

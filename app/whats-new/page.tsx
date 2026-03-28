import Link from 'next/link'
import { Zap } from 'lucide-react'

export const metadata = {
  title: "What's New | Sparky",
  description: 'Latest updates and improvements to Sparky',
}

const releases = [
  {
    version: '1.0.0 Beta',
    date: 'March 2026',
    badge: 'Latest',
    changes: [
      { type: 'new', text: 'Conduit Bending calculator with 3-pt saddle, 4-pt saddle, offset, parallel, and back-to-back diagrams' },
      { type: 'new', text: 'Angle selection (22.5°, 30°, 45°, 60°) for saddle and offset calculations' },
      { type: 'new', text: 'Construction estimator with multi-line items and real-time running total' },
      { type: 'new', text: 'NEC Reference with searchable articles, common violations, and inspection checklist' },
      { type: 'new', text: 'Ask Sparky — AI-powered answers to electrical code questions' },
      { type: 'new', text: 'Credentials Wallet with AES-GCM client-side encryption' },
      { type: 'new', text: 'Jobs tracker to organize work by site' },
      { type: 'new', text: 'Motor FLA lookup (NEC 430.248/430.250) for 1Ø and 3Ø motors' },
      { type: 'new', text: 'Panel Schedule builder' },
      { type: 'new', text: 'Material Takeoff calculator' },
      { type: 'fix', text: 'SVG bend diagram text overlap resolved across all bend types' },
      { type: 'fix', text: 'Obstacle circle on 3-pt saddle now shows full circle below pipe centerline' },
    ],
  },
]

const TYPE_STYLE: Record<string, string> = {
  new:     'bg-orange-500/15 text-orange-400',
  fix:     'bg-emerald-500/15 text-emerald-400',
  change:  'bg-blue-500/15 text-blue-400',
}
const TYPE_LABEL: Record<string, string> = {
  new: 'New',
  fix: 'Fix',
  change: 'Change',
}

export default function WhatsNewPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-16">
      <div className="sticky top-0 z-10 bg-zinc-950 border-b border-zinc-800 px-4 py-3 flex items-center gap-3">
        <Link href="/settings" className="text-orange-400 text-sm font-semibold">← Settings</Link>
        <span className="text-zinc-600">/</span>
        <span className="text-sm text-white">What&apos;s New</span>
      </div>

      <div className="px-4 pt-8 max-w-lg mx-auto">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-orange-500/10 rounded-2xl">
            <Zap className="h-8 w-8 text-orange-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">What&apos;s New</h1>
        <p className="text-zinc-500 text-sm text-center mb-10">Release notes for every Sparky update.</p>

        <div className="space-y-8">
          {releases.map(release => (
            <div key={release.version}>
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">{release.version}</span>
                    {release.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/15 text-orange-400 uppercase tracking-wider">
                        {release.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-zinc-600">{release.date}</span>
                </div>
              </div>

              <div className="space-y-2">
                {release.changes.map((change, i) => (
                  <div key={i} className="flex items-start gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                    <span className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${TYPE_STYLE[change.type]}`}>
                      {TYPE_LABEL[change.type]}
                    </span>
                    <p className="text-sm text-zinc-300 leading-relaxed">{change.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

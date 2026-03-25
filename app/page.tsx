import React from 'react';
import Link from 'next/link';
import { Zap, CalculatorIcon, BookOpen, MessageCircle, Lock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">

      {/* HERO SECTION */}
      <section className="px-[clamp(1rem,4vw,1.5rem)] py-[clamp(2rem,5vw,4rem)] text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-orange-500 rounded-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-[clamp(2rem,6vw,2.5rem)] leading-tight mb-4">
          Sparky
        </h1>

        <div className="inline-block bg-[var(--color-primary)] text-slate-900 px-4 py-2 rounded text-sm font-bold mb-6 tracking-wide">
          🚀 NOW IN BETA
        </div>

        <p className="text-[clamp(1rem,4vw,1.25rem)] text-[var(--color-text-secondary)] leading-relaxed max-w-[500px] mx-auto mb-8">
          Professional electrical calculations and NEC reference designed for electricians in the field
        </p>

        <div className="flex gap-4 justify-center mb-12 flex-wrap">
          <Link
            href="/calculators"
            className="inline-block px-8 py-3.5 bg-[var(--color-primary)] text-slate-900 rounded-lg font-bold text-base transition-all duration-200 hover:opacity-90"
          >
            Get Started
          </Link>
          <Link
            href="/nec-reference"
            className="inline-block px-8 py-3.5 bg-transparent text-[var(--color-primary)] border border-[var(--color-primary)] rounded-lg font-bold text-base transition-all duration-200 hover:bg-[var(--color-primary)] hover:text-slate-900"
          >
            NEC Reference
          </Link>
        </div>
      </section>

      {/* BETA ACCESS SECTION */}
      <section className="px-[clamp(1rem,4vw,1.5rem)] py-[clamp(2rem,5vw,3rem)]">
        <div className="bg-[linear-gradient(135deg,#1a3a4a_0%,#1e293b_100%)] border-2 border-[var(--color-primary)] rounded-xl p-[clamp(1.5rem,4vw,3rem)] text-center text-white">
          <h2 className="text-[clamp(1.5rem,5vw,2rem)] leading-tight mb-4">
            All Features Free
          </h2>

          <p className="text-[clamp(0.95rem,3vw,1.125rem)] text-[var(--color-text-secondary)] max-w-[600px] mx-auto mb-8">
            Everything is available right now. Completely free during beta. Payment plans start in April.
          </p>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 mb-8">
            {['✅ All 9 calculators', '✅ Full NEC reference', '✅ Unlimited AI chats', '✅ Credentials wallet', '✅ Achievements', '✅ Field mode'].map((feature, idx) => (
              <div key={idx} className="text-[clamp(0.9rem,2vw,1rem)] text-[var(--color-text-secondary)]">
                {feature}
              </div>
            ))}
          </div>

          <p className="text-[clamp(0.85rem,2vw,0.875rem)] text-[var(--color-text-tertiary)] mt-6">
            Payment plans coming soon
          </p>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="px-[clamp(1rem,4vw,1.5rem)] py-[clamp(2rem,5vw,3rem)]">
        <h2 className="text-[clamp(1.5rem,5vw,1.75rem)] text-center mb-8">
          Features
        </h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mb-8">
          {[
            { icon: CalculatorIcon, title: 'Voltage Drop Calculator', description: 'Precise calculations per NEC Article 210', link: '/calculators/voltage-drop' },
            { icon: CalculatorIcon, title: 'Wire Sizing', description: 'Ampacity and sizing for any circuit', link: '/calculators/wire-sizing' },
            { icon: BookOpen, title: 'NEC Reference', description: 'Instant access to NEC articles and violations', link: '/nec-reference' },
            { icon: MessageCircle, title: 'Ask Sparky', description: 'AI-powered answers to electrical questions', link: '/ask-sparky' },
            { icon: Lock, title: 'Credentials Wallet', description: 'Secure encrypted certifications storage', link: '/credentials' },
            { icon: CalculatorIcon, title: 'More Calculators', description: 'Conduit fill, box fill, motor FLA, and more', link: '/calculators' }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Link href={feature.link} key={idx} className="group">
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 transition-all duration-300 cursor-pointer text-white h-full flex flex-col min-h-[220px] hover:border-[var(--color-primary)] hover:-translate-y-0.5">
                  <Icon className="w-8 h-8 mb-4 text-[var(--color-primary)] shrink-0" />
                  <h3 className="text-[clamp(1rem,2vw,1.125rem)] mt-0 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[clamp(0.9rem,2vw,0.95rem)] text-[var(--color-text-secondary)] m-0 flex-1">
                    {feature.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-[clamp(1rem,4vw,1.5rem)] py-[clamp(2rem,5vw,3rem)] border-t border-[var(--color-border)] text-[var(--color-text-tertiary)] text-[clamp(0.85rem,2vw,0.95rem)] text-center">
        <p className="mb-4">
          &copy; {new Date().getFullYear()} SparkyOnsite. All rights reserved.
        </p>
        <div className="flex gap-4 justify-center flex-wrap text-[clamp(0.8rem,2vw,0.9rem)]">
          <Link href="/privacy" className="text-[var(--color-text-tertiary)]">Privacy</Link>
          <span>•</span>
          <Link href="/terms" className="text-[var(--color-text-tertiary)]">Terms</Link>
          <span>•</span>
          <a href="#" className="text-[var(--color-text-tertiary)]">Contact</a>
        </div>
      </footer>
    </div>
  );
}

import Link from 'next/link';
import { Zap, CalculatorIcon, BookOpen, MessageCircle, Lock } from 'lucide-react';

const features = [
  { icon: CalculatorIcon, title: 'Voltage Drop',      description: 'Precise voltage drop per NEC Article 210',        link: '/calculators?tool=voltage-drop' },
  { icon: CalculatorIcon, title: 'Wire Sizing',        description: 'Ampacity and sizing for any circuit',              link: '/calculators?tool=wire-sizing' },
  { icon: BookOpen,       title: 'NEC Reference',      description: 'Instant access to NEC articles and code sections', link: '/nec-reference' },
  { icon: MessageCircle,  title: 'Ask Sparky',         description: 'AI-powered answers to electrical questions',       link: '/ask-sparky' },
  { icon: Lock,           title: 'Credentials Wallet', description: 'Secure encrypted certifications storage',          link: '/credentials' },
  { icon: CalculatorIcon, title: 'More Calculators',   description: 'Conduit fill, box fill, motor FLA, and more',      link: '/calculators' },
];

const betaFeatures = [
  '✅ All 9 calculators',
  '✅ Full NEC reference',
  '✅ Unlimited AI chats',
  '✅ Credentials wallet',
  '✅ Achievements',
  '✅ Field mode',
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* HERO */}
      <section className="relative px-6 md:px-12 py-24 md:py-32 text-center overflow-hidden">
        {/* Radial gradient mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(249,115,22,0.12),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_60%,rgba(251,191,36,0.05),transparent)] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="p-3.5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-[0_0_40px_rgba(249,115,22,0.35)]">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-6xl md:text-8xl font-bold leading-none mb-6 bg-gradient-to-r from-orange-400 via-amber-300 to-amber-200 bg-clip-text text-transparent">
            Sparky
          </h1>

          {/* Beta badge */}
          <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 tracking-widest border border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
            NOW IN BETA
          </div>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-md mx-auto mb-10">
            Professional electrical calculations and NEC reference built for electricians in the field.
          </p>

          {/* CTAs */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/calculators"
              className="inline-flex items-center justify-center min-h-[48px] px-8 bg-orange-500 text-black rounded-lg font-bold text-base transition-all duration-200 hover:bg-orange-600 hover:shadow-[0_0_28px_rgba(249,115,22,0.45)] active:scale-[0.98]"
            >
              Get Started
            </Link>
            <Link
              href="/nec-reference"
              className="inline-flex items-center justify-center min-h-[48px] px-8 bg-transparent text-orange-400 border border-orange-500/50 rounded-lg font-bold text-base transition-all duration-200 hover:bg-orange-500/10 hover:border-orange-400 active:scale-[0.98]"
            >
              NEC Reference
            </Link>
          </div>
        </div>
      </section>

      {/* BETA ACCESS */}
      <section className="px-6 md:px-12 py-20">
        <div className="electric-card max-w-3xl mx-auto border border-orange-500/15 rounded-2xl p-8 md:p-12 text-center bg-[linear-gradient(135deg,rgba(249,115,22,0.06)_0%,rgba(9,9,11,0.8)_100%)]">
          <h2 className="text-3xl md:text-4xl leading-tight mb-4">
            All Features Free
          </h2>
          <p className="text-zinc-400 max-w-sm mx-auto mb-8 text-base">
            Everything unlocked during beta — no credit card required.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8 text-left">
            {betaFeatures.map((f, i) => (
              <div key={i} className="text-sm text-zinc-300 bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-3 py-2">
                {f}
              </div>
            ))}
          </div>

          <p className="text-xs text-zinc-600 tracking-wide uppercase">
            Payment plans coming soon
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-4">
            Built for the field
          </h2>
          <p className="text-zinc-500 text-center mb-12 max-w-sm mx-auto text-base">
            Every tool an electrician needs, optimized for job-site use.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Link href={feature.link} key={idx}>
                  <div className="electric-card card p-6 cursor-pointer h-full flex flex-col min-h-[180px]">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 shrink-0">
                      <Icon className="w-5 h-5 text-orange-400" />
                    </div>
                    <h3 className="text-base font-semibold text-white mt-0 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-zinc-400 m-0 flex-1 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 md:px-12 py-12 border-t border-zinc-800/80 text-zinc-600 text-sm text-center">
        <p className="mb-5">
          &copy; {new Date().getFullYear()} SparkyOnsite. All rights reserved.
        </p>
        <div className="flex gap-8 justify-center">
          <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms of Service</Link>
          <a href="mailto:ianw@sparkyonsite.com" className="hover:text-zinc-400 transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, CalculatorIcon, BookOpen, MessageCircle, Lock } from 'lucide-react';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #0f172a, #1e293b)', color: 'white' }}>
      <section style={{ padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 1.5rem)', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '0.75rem', background: 'linear-gradient(to bottom right, #06b6d4, #f97316)', borderRadius: '0.5rem' }}>
            <Zap style={{ width: '32px', height: '32px', color: 'white' }} />
          </div>
        </div>

        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', fontWeight: '700', marginBottom: '1rem' }}>Sparky</h1>

        <div style={{ display: 'inline-block', background: '#06b6d4', color: '#0f172a', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '700', marginBottom: '1.5rem' }}>
          🚀 NOW IN BETA
        </div>

        <p style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', color: '#cbd5e1', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
          Professional electrical calculations and NEC reference designed for electricians in the field
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <Link href="/calculators" style={{ display: 'inline-block', padding: '0.875rem 2rem', background: '#06b6d4', color: '#0f172a', borderRadius: '0.5rem', fontWeight: '700', textDecoration: 'none', fontSize: '1rem' }}>
            Get Started
          </Link>
          <Link href="/nec-reference" style={{ display: 'inline-block', padding: '0.875rem 2rem', background: 'transparent', color: '#06b6d4', border: '1.5px solid #06b6d4', borderRadius: '0.5rem', fontWeight: '700', textDecoration: 'none', fontSize: '1rem' }}>
            NEC Reference
          </Link>
        </div>
      </section>

      <section style={{ padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 4vw, 1.5rem)' }}>
        <div style={{ background: 'linear-gradient(135deg, #1a3a4a 0%, #1e293b 100%)', border: '2px solid #06b6d4', borderRadius: '0.75rem', padding: 'clamp(1.5rem, 4vw, 3rem)', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: '700', marginBottom: '1rem' }}>All Features Free</h2>

          <p style={{ fontSize: 'clamp(0.95rem, 3vw, 1.125rem)', color: '#cbd5e1', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Everything is available right now. Completely free during beta. Payment plans start June 15.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {['✅ All 9 calculators', '✅ Full NEC reference', '✅ Unlimited AI chats', '✅ Credentials wallet', '✅ Achievements', '✅ Field mode'].map((feature, idx) => (
              <div key={idx} style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', color: '#cbd5e1' }}>{feature}</div>
            ))}
          </div>

          <p style={{ fontSize: 'clamp(0.85rem, 2vw, 0.875rem)', color: '#94a3b8', marginTop: '1.5rem' }}>Payment plans coming June 15, 2026</p>
        </div>
      </section>

      <section style={{ padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 4vw, 1.5rem)' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 1.75rem)', fontWeight: '700', marginBottom: '2rem', textAlign: 'center' }}>Features</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: CalculatorIcon, title: 'Voltage Drop', description: 'Precise calculations per NEC Article 210', link: '/calculators/voltage-drop' },
            { icon: CalculatorIcon, title: 'Wire Sizing', description: 'Ampacity and sizing', link: '/calculators/wire-sizing' },
            { icon: BookOpen, title: 'NEC Reference', description: 'Instant access to NEC articles', link: '/nec-reference' },
            { icon: MessageCircle, title: 'Ask Sparky', description: 'AI-powered electrical Q&A', link: '/ask-sparky' },
            { icon: Lock, title: 'Credentials', description: 'Secure credential storage', link: '/credentials' },
            { icon: CalculatorIcon, title: 'More Calculators', description: 'Conduit, box fill, motor FLA', link: '/calculators' }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Link href={feature.link} key={idx} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem', color: 'white', minHeight: '220px', display: 'flex', flexDirection: 'column' }}>
                  <Icon style={{ width: '32px', height: '32px', marginBottom: '1rem', color: '#06b6d4' }} />
                  <h3 style={{ fontWeight: '700', marginBottom: '0.75rem' }}>{feature.title}</h3>
                  <p style={{ color: '#cbd5e1', flex: 1, margin: 0 }}>{feature.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <footer style={{ padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 4vw, 1.5rem)', borderTop: '1px solid #334155', color: '#94a3b8', textAlign: 'center' }}>
        <p>&copy; 2024 Sparky. All rights reserved.</p>
      </footer>
    </div>
  );
}
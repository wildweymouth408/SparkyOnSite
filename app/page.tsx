'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, CalculatorIcon, BookOpen, MessageCircle, Lock } from 'lucide-react';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #0f172a, #1e293b)' }}>
      {/* HERO */}
      <section style={{ 
        padding: '4rem 1.5rem',
        textAlign: 'center',
        color: 'white',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ 
            padding: '0.75rem',
            background: 'linear-gradient(to bottom right, #06b6d4, #f97316)',
            borderRadius: '0.5rem'
          }}>
            <Zap style={{ width: '32px', height: '32px', color: 'white' }} />
          </div>
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Sparky
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#cbd5e1', marginBottom: '2rem', lineHeight: '1.6' }}>
          Professional electrical calculations and NEC reference designed for electricians in the field
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
          <Link href="/calculators/voltage-drop" style={{
            display: 'inline-block',
            padding: '0.875rem 2rem',
            background: '#06b6d4',
            color: 'white',
            borderRadius: '0.5rem',
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            Get Started
          </Link>
          <Link href="/nec-reference" style={{
            display: 'inline-block',
            padding: '0.875rem 2rem',
            background: 'transparent',
            color: '#06b6d4',
            border: '1px solid #06b6d4',
            borderRadius: '0.5rem',
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            NEC Reference
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'white', marginBottom: '3rem', textAlign: 'center' }}>
          Features
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          {[
            {
              icon: CalculatorIcon,
              title: 'Voltage Drop Calculator',
              description: 'Precise voltage drop calculations per NEC Article 210',
              link: '/calculators/voltage-drop'
            },
            {
              icon: CalculatorIcon,
              title: 'Wire Sizing',
              description: 'Ampacity and wire sizing for any circuit',
              link: '/calculators/wire-sizing'
            },
            {
              icon: BookOpen,
              title: 'NEC Reference',
              description: 'Instant access to common NEC articles and violations',
              link: '/nec-reference'
            },
            {
              icon: MessageCircle,
              title: 'Ask Sparky',
              description: 'AI-powered answers to electrical questions',
              link: '/ask-sparky'
            },
            {
              icon: Lock,
              title: 'Credentials Wallet',
              description: 'Secure encrypted storage for certifications',
              link: '/credentials'
            },
            {
              icon: CalculatorIcon,
              title: 'More Calculators',
              description: 'Conduit fill, box fill, ampacity, and more',
              link: '/calculators'
            }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Link href={feature.link} key={idx} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '0.75rem',
                  padding: '2rem',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  color: 'white',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = '#06b6d4';
                    el.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = '#334155';
                    el.style.transform = 'translateY(0)';
                  }}
                >
                  <Icon style={{ width: '32px', height: '32px', marginBottom: '1rem', color: '#06b6d4' }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#cbd5e1' }}>
                    {feature.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* BETA ACCESS */}
      <section style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a3a4a 0%, #1e293b 100%)',
          border: '2px solid #06b6d4',
          borderRadius: '0.75rem',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            display: 'inline-block',
            background: '#06b6d4',
            color: '#0f172a',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            letterSpacing: '0.05em'
          }}>
            🚀 NOW IN BETA
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
            All Features Free
          </h2>

          <p style={{ fontSize: '1.125rem', color: '#cbd5e1', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Everything is available right now. Completely free during beta. We'll activate payment plans on June 15.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
            maxWidth: '800px',
            margin: '0 auto 2rem'
          }}>
            {[
              '✅ All 9 calculators',
              '✅ Full NEC reference',
              '✅ Unlimited AI chats',
              '✅ Credentials wallet',
              '✅ Achievements & streaks',
              '✅ Field mode'
            ].map((feature, idx) => (
              <div key={idx} style={{
                fontSize: '1rem',
                color: '#cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {feature}
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button style={{
              padding: '1rem 2rem',
              background: '#06b6d4',
              color: '#0f172a',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.opacity = '0.9';
                el.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.opacity = '1';
                el.style.transform = 'scale(1)';
              }}
            >
              Start Using Sparky
            </button>
          </div>

          <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '2rem' }}>
            Payment plans coming June 15, 2026
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '3rem 1.5rem',
        borderTop: '1px solid #334155',
        color: '#94a3b8',
        fontSize: '0.95rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Product</h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              <li><Link href="/calculators" style={{ color: '#94a3b8', textDecoration: 'none' }}>Calculators</Link></li>
              <li><Link href="/nec-reference" style={{ color: '#94a3b8', textDecoration: 'none' }}>NEC Reference</Link></li>
              <li><Link href="/ask-sparky" style={{ color: '#94a3b8', textDecoration: 'none' }}>Ask Sparky</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Resources</h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Blog</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Documentation</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Legal</h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              <li><a href="/privacy" style={{ color: '#94a3b8', textDecoration: 'none' }}>Privacy</a></li>
              <li><a href="/terms" style={{ color: '#94a3b8', textDecoration: 'none' }}>Terms</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Contact</a></li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #334155', paddingTop: '2rem', textAlign: 'center' }}>
          <p>&copy; 2024 Sparky. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
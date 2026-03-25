'use client';

import React from 'react';
import Link from 'next/link';
import { CalculatorIcon, Zap, Box, Lightbulb } from 'lucide-react';

export default function CalculatorsPage() {
  const calculators = [
    {
      title: 'Voltage Drop',
      description: 'Calculate voltage drop across conductors per NEC Article 210',
      icon: Zap,
      href: '/calculators/voltage-drop'
    },
    {
      title: 'Wire Sizing',
      description: 'Determine proper wire gauge and ampacity for circuits',
      icon: CalculatorIcon,
      href: '/calculators/wire-sizing'
    },
    {
      title: 'Conduit Fill',
      description: 'Calculate conduit fill percentages per NEC Article 300',
      icon: Box,
      href: '/calculators/conduit-fill'
    },
    {
      title: 'Ohm\'s Law',
      description: 'Calculate voltage, current, resistance, and power',
      icon: Lightbulb,
      href: '/calculators/ohms-law'
    }
  ];

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
        Calculators
      </h1>
      <p style={{ color: '#cbd5e1', fontSize: '1.05rem', marginBottom: '3rem' }}>
        Professional tools for electrical field work
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {calculators.map((calc, idx) => {
          const Icon = calc.icon;
          return (
            <Link href={calc.href} key={idx} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '0.75rem',
                padding: '2rem',
                height: '100%',
                color: 'white',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = '#06b6d4';
                  el.style.background = '#1a3a4a';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = '#334155';
                  el.style.background = '#1e293b';
                }}
              >
                <Icon style={{ width: '40px', height: '40px', color: '#06b6d4', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                  {calc.title}
                </h3>
                <p style={{ color: '#cbd5e1', margin: 0 }}>
                  {calc.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
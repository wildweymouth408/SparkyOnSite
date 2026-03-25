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

      {/* PRICING */}
      <section style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'white', marginBottom: '3rem', textAlign: 'center' }}>
          Simple Pricing
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {[
            {
              name: 'Free',
              price: '$0',
              period: 'forever',
              features: ['5 calculators', '5 AI chats/day', 'Basic NEC reference', 'Field mode']
            },
            {
             name: 'Pro',
            price: '$9.99',
            period: '/month',
            popular: true,
            features: ['All calculators', 'Unlimited AI chats', 'Full NEC reference', 'Credentials wallet', 'Achievements']
          },
          {
            name: 'Team - 3 Users',
            price: '$24.99',
            period: '/month',
            features: ['Everything in Pro', '3 team members', 'Shared calculations', 'Basic admin']
          },
          {
            name: 'Team - 10 Users',
            price: '$59.99',
            period: '/month',
            features: ['Everything in Pro', '10 team members', 'Shared calculations', 'Full admin dashboard']
          },
          {
            name: 'Team - 25+ Users',
            price: 'Custom',
            period: 'pricing',
            features: ['Everything in Pro', '25+ team members', 'Shared calculations', 'Full admin', 'Priority support']
          }
          ].map((plan, idx) => (
            <div
              key={idx}
              style={{
                background: plan.popular ? '#1a3a4a' : '#1e293b',
                border: plan.popular ? '2px solid #06b6d4' : '1px solid #334155',
                borderRadius: '0.75rem',
                padding: '2rem',
                position: 'relative'
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#06b6d4',
                  color: '#0f172a',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  POPULAR
                </div>
              )}
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
                {plan.name}
              </h3>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#06b6d4' }}>
                  {plan.price}
                </span>
                <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                  {plan.period}
                </span>
              </div>

              <ul style={{ listStyle: 'none', margin: '0 0 1.5rem', padding: 0 }}>
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} style={{ 
                    color: '#cbd5e1', 
                    fontSize: '0.95rem',
                    marginBottom: '0.75rem',
                    paddingLeft: '1.5rem',
                    position: 'relative'
                  }}>
                    <span style={{ 
                      position: 'absolute',
                      left: 0,
                      color: '#06b6d4'
                    }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button style={{
                width: '100%',
                padding: '0.75rem',
                background: plan.popular ? '#06b6d4' : 'transparent',
                color: plan.popular ? '#0f172a' : '#06b6d4',
                border: plan.popular ? 'none' : '1px solid #06b6d4',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Get Started
              </button>
            </div>
          ))}
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
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Home,
  CalculatorIcon,
  BookOpen,
  MessageCircle,
  Lock,
  LogOut
} from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Calculators', href: '/calculators', icon: CalculatorIcon },
    { name: 'NEC Reference', href: '/nec-reference', icon: BookOpen },
    { name: 'Ask Sparky', href: '/ask-sparky', icon: MessageCircle },
    { name: 'Credentials', href: '/credentials', icon: Lock },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>
      {/* SIDEBAR */}
      <aside style={{
        position: sidebarOpen ? 'fixed' : 'sticky',
        top: 0,
        left: 0,
        width: '256px',
        height: '100vh',
        background: '#1e293b',
        borderRight: '1px solid #334155',
        padding: '2rem 1rem',
        overflowY: 'auto',
        zIndex: 40,
        display: ['none', 'flex'].includes('flex') ? 'flex' : 'none',
        flexDirection: 'column'
      }}>
        <Link href="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          color: 'white',
          textDecoration: 'none',
          marginBottom: '2rem',
          fontWeight: '600'
        }}>
          <div style={{ 
            padding: '0.5rem',
            background: 'linear-gradient(to bottom right, #06b6d4, #f97316)',
            borderRadius: '0.375rem'
          }}>
            <CalculatorIcon style={{ width: '20px', height: '20px' }} />
          </div>
          Sparky
        </Link>

        <nav style={{ flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  color: active ? '#06b6d4' : '#cbd5e1',
                  textDecoration: 'none',
                  borderRadius: '0.5rem',
                  marginBottom: '0.5rem',
                  background: active ? '#334155' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                <Icon style={{ width: '20px', height: '20px' }} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          color: '#cbd5e1',
          background: 'transparent',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          width: '100%'
        }}>
          <LogOut style={{ width: '20px', height: '20px' }} />
          <span>Logout</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* HEADER */}
        <header style={{
          position: 'sticky',
          top: 0,
          background: '#1e293b',
          borderBottom: '1px solid #334155',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 30
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#cbd5e1',
              cursor: 'pointer',
              display: ['flex', 'none'].includes('flex') ? 'flex' : 'none',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {sidebarOpen ? (
              <X style={{ width: '24px', height: '24px' }} />
            ) : (
              <Menu style={{ width: '24px', height: '24px' }} />
            )}
          </button>

          <h1 style={{ color: 'white', fontSize: '1.25rem', margin: 0 }}>Sparky</h1>

          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06b6d4',
            fontWeight: '600'
          }}>
            U
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#0f172a' }}>
          {children}
        </div>
      </main>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 20
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
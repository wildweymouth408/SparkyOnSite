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
import { cn } from '@/lib/utils';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Home',          href: '/',             icon: Home },
    { name: 'Calculators',   href: '/calculators',  icon: CalculatorIcon },
    { name: 'NEC Reference', href: '/nec-reference', icon: BookOpen },
    { name: 'Ask Sparky',    href: '/ask-sparky',   icon: MessageCircle },
    { name: 'Credentials',   href: '/credentials',  icon: Lock },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="flex min-h-screen bg-slate-900">

      {/* SIDEBAR — fixed overlay on mobile, sticky on desktop */}
      <aside className={cn(
        'fixed top-0 bottom-0 left-0 z-40 flex flex-col w-64 bg-slate-900 border-r border-slate-800 px-3 py-8 overflow-y-auto',
        'transition-transform duration-200',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:sticky md:h-screen md:top-0 md:translate-x-0'
      )}>

        {/* Logo */}
        <Link
          href="/"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 text-white mb-8 font-semibold min-h-[44px] px-3"
        >
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-lg shrink-0 shadow-[0_0_16px_rgba(6,182,212,0.3)]">
            <CalculatorIcon className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent font-bold">
            Sparky
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 py-2.5 pr-4 rounded-lg text-sm transition-all duration-150 min-h-[44px] border-l-2',
                  'pl-[14px]',
                  active
                    ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/60 hover:border-slate-700'
                )}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button className="flex items-center gap-3 pl-[14px] pr-4 py-2.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all duration-150 w-full text-sm min-h-[44px] border-l-2 border-transparent mt-2">
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          <span>Logout</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-6 flex justify-between items-center h-[60px]">

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex md:hidden items-center justify-center min-h-[44px] min-w-[44px] text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <span className="text-white font-semibold md:hidden bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">
            Sparky
          </span>

          {/* Spacer on desktop */}
          <div className="hidden md:block" />

          {/* User avatar */}
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 text-sm font-semibold shrink-0">
            U
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto bg-slate-900">
          {children}
        </div>
      </main>

      {/* MOBILE OVERLAY BACKDROP */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

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
    { name: 'Home',          href: '/',              icon: Home },
    { name: 'Calculators',   href: '/calculators',   icon: CalculatorIcon },
    { name: 'NEC Reference', href: '/nec-reference', icon: BookOpen },
    { name: 'Ask Sparky',    href: '/ask-sparky',    icon: MessageCircle },
    { name: 'Credentials',   href: '/credentials',   icon: Lock },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="flex min-h-screen bg-slate-900">

      {/*
        SIDEBAR
        Mobile:  hidden by default; when sidebarOpen → fixed full-height overlay (z-50)
        Desktop: always visible as a sticky column (md:flex overrides hidden)
      */}
      <aside
        className={cn(
          // Shared structure — flex-col keeps nav items stacked vertically
          'flex-col w-64 shrink-0 bg-slate-900 border-r border-slate-800 px-3 py-8 overflow-y-auto',
          // Mobile state
          sidebarOpen
            ? 'flex fixed inset-y-0 left-0 z-50'  // visible overlay
            : 'hidden',                             // completely hidden
          // Desktop: always shown as sticky sidebar (md:flex overrides hidden above)
          'md:flex md:sticky md:top-0 md:h-screen md:z-40',
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 mb-8 min-h-[44px] px-3"
        >
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-lg shrink-0 shadow-[0_0_16px_rgba(6,182,212,0.3)]">
            <CalculatorIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">
            Sparky
          </span>
        </Link>

        {/* Nav — flex-col ensures items stack vertically */}
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
                  'flex items-center gap-3 pl-[14px] pr-4 py-2.5 rounded-lg text-sm',
                  'transition-all duration-150 min-h-[44px] border-l-2',
                  active
                    ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/60 hover:border-slate-700',
                )}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User + Logout — only inside sidebar */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-1">
          <div className="flex items-center gap-3 pl-[14px] pr-4 py-2.5 text-sm text-slate-400">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 text-xs font-semibold shrink-0">
              U
            </div>
            <span>My Account</span>
          </div>
          <button className="flex items-center gap-3 pl-[14px] pr-4 py-2.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all duration-150 w-full text-sm min-h-[44px] border-l-2 border-transparent">
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">

        {/*
          HEADER
          Mobile:  hamburger (left) | "Sparky" (center) | — (right spacer)
          Desktop: empty (sidebar visible) | — (right spacer)
        */}
        <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 h-[60px] px-4 flex items-center justify-between">

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex md:hidden items-center justify-center w-11 h-11 -ml-1 text-slate-400 hover:text-white transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Title — mobile center */}
          <span className="md:hidden font-semibold bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">
            Sparky
          </span>

          {/* Right-side spacer (keeps layout balanced on mobile, fills space on desktop) */}
          <div className="w-11 md:flex-1" />
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto bg-slate-900">
          {children}
        </div>
      </main>

      {/* BACKDROP — mobile only, sits behind sidebar (z-40 < sidebar z-50) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

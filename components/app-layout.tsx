'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Zap,
  Home,
  CalculatorIcon,
  BookOpen,
  MessageCircle,
  Lock,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CALC_SUB_ITEMS = [
  { label: 'Voltage Drop',     tool: 'voltage-drop' },
  { label: 'Conduit Fill',     tool: 'conduit-fill' },
  { label: "Ohm's Law",        tool: 'ohms-law' },
  { label: 'Conduit Bending',  tool: 'pipe-bending' },
  { label: 'Wire Sizing',      tool: 'wire-sizing' },
  { label: 'Ampacity',         tool: 'ampacity' },
  { label: 'Box Fill',         tool: 'box-fill' },
  { label: 'Motor FLA',        tool: 'motor-fla' },
  { label: 'Construction',     tool: 'construction' },
  { label: 'Material Takeoff', tool: 'material-takeoff' },
  { label: 'Panel Schedule',   tool: 'panel-schedule' },
];

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
    <div className="flex min-h-screen bg-zinc-950">

      {/*
        SIDEBAR
        Mobile:  hidden by default; when sidebarOpen → fixed full-height overlay (z-50)
        Desktop: always visible as a sticky column (md:flex overrides hidden)
      */}
      <aside
        className={cn(
          'flex-col w-64 shrink-0 bg-zinc-950 border-r border-zinc-800 px-3 py-8 overflow-y-auto',
          sidebarOpen
            ? 'flex fixed inset-y-0 left-0 z-50'
            : 'hidden',
          'md:flex md:sticky md:top-0 md:h-screen md:z-40',
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 mb-8 min-h-[44px] px-3"
        >
          <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shrink-0 shadow-[0_0_16px_rgba(249,115,22,0.3)]">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            Sparky
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <React.Fragment key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 pl-[14px] pr-4 py-2.5 rounded-lg text-sm',
                    'transition-all duration-150 min-h-[44px] border-l-2',
                    active
                      ? 'border-orange-500 text-orange-400 bg-orange-500/5'
                      : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/60 hover:border-zinc-700',
                  )}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" />
                  <span>{item.name}</span>
                </Link>

                {/* Calculator submenu — visible when Calculators is active */}
                {item.href === '/calculators' && active && (
                  <div className="flex flex-col gap-0.5 mb-1">
                    {CALC_SUB_ITEMS.map((sub) => (
                      <Link
                        key={sub.tool}
                        href={`/calculators?tool=${sub.tool}`}
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center pl-10 pr-4 py-1.5 rounded-md text-xs text-zinc-500 hover:text-white hover:bg-zinc-800/40 transition-colors duration-150"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-col gap-1">
          <div className="flex items-center gap-3 pl-[14px] pr-4 py-2.5 text-sm text-zinc-400">
            <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-orange-400 text-xs font-semibold shrink-0">
              U
            </div>
            <span>My Account</span>
          </div>
          <button className="flex items-center gap-3 pl-[14px] pr-4 py-2.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all duration-150 w-full text-sm min-h-[44px] border-l-2 border-transparent">
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
        <header className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 h-[60px] px-4 flex items-center justify-between">

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex md:hidden items-center justify-center w-11 h-11 -ml-1 text-zinc-400 hover:text-orange-400 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Title — mobile center */}
          <span className="md:hidden font-semibold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            Sparky
          </span>

          {/* Right-side spacer */}
          <div className="w-11 md:flex-1" />
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto bg-zinc-950">
          {children}
        </div>
      </main>

      {/* BACKDROP — mobile only */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

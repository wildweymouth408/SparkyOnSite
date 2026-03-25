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
    { name: 'Home', href: '/', icon: Home },
    { name: 'Calculators', href: '/calculators', icon: CalculatorIcon },
    { name: 'NEC Reference', href: '/nec-reference', icon: BookOpen },
    { name: 'Ask Sparky', href: '/ask-sparky', icon: MessageCircle },
    { name: 'Credentials', href: '/credentials', icon: Lock },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="flex min-h-screen bg-slate-900">

      {/* SIDEBAR — fixed overlay on mobile, sticky on desktop */}
      <aside className={cn(
        'fixed top-0 bottom-0 left-0 z-40 flex flex-col w-64 bg-slate-800 border-r border-slate-700 px-4 py-8 overflow-y-auto',
        'transition-transform duration-200',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:sticky md:h-screen md:top-0 md:translate-x-0'
      )}>

        {/* Logo */}
        <Link
          href="/"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 text-white no-underline mb-8 font-semibold min-h-[44px]"
        >
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-orange-500 rounded-md shrink-0">
            <CalculatorIcon className="w-5 h-5 text-white" />
          </div>
          Sparky
        </Link>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors min-h-[44px]',
                  active
                    ? 'bg-slate-700 text-cyan-400'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors w-full text-sm min-h-[44px]">
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Logout</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <header className="sticky top-0 z-30 bg-slate-800 border-b border-slate-700 px-6 flex justify-between items-center h-[60px]">

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex md:hidden items-center justify-center min-h-[44px] min-w-[44px] text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <h1 className="text-white text-xl font-semibold m-0 md:hidden">Sparky</h1>

          {/* Spacer so avatar stays right on desktop */}
          <div className="hidden md:block" />

          {/* User avatar */}
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-cyan-400 font-semibold shrink-0">
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
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

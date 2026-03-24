'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Menu, X, Home, Calculator, BookOpen, MessageSquare, Shield, Settings, LogOut } from 'lucide-react';

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/calculators', label: 'Calculators', icon: Calculator },
    { href: '/nec-reference', label: 'NEC Reference', icon: BookOpen },
    { href: '/ask-sparky', label: 'Ask Sparky', icon: MessageSquare },
    { href: '/credentials', label: 'Credentials Wallet', icon: Shield },
  ];

  const isActive = (href) => pathname === href;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      {/* SIDEBAR */}
      <aside
        className={`fixed md:relative left-0 top-0 z-40 w-64 h-screen bg-slate-900 border-r border-slate-700 transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 p-6 border-b border-slate-700 hover:bg-slate-800 transition-colors">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-orange-500 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Sparky</h1>
              <p className="text-xs text-slate-400">Electrical Calculator</p>
            </div>
          </Link>

          {/* NAV ITEMS */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    active
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* FOOTER */}
          <div className="border-t border-slate-700 p-4 space-y-2">
            <Link
              href="/mission-control"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 font-medium transition-all"
              onClick={() => setSidebarOpen(false)}
            >
              <Settings className="w-5 h-5" />
              <span>Mission Control</span>
            </Link>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 font-medium transition-all text-left">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex flex-col md:flex-1">
        {/* HEADER */}
        <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur border-b border-slate-700 px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-slate-300" />
              ) : (
                <Menu className="w-6 h-6 text-slate-300" />
              )}
            </button>

            <div className="flex-1 md:flex-none text-center md:text-left">
              <h2 className="text-lg font-semibold text-white">
                {navItems.find((item) => isActive(item.href))?.label || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-slate-300">Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
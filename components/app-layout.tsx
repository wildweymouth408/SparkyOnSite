'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  Zap,
  Home,
  CalculatorIcon,
  BookOpen,
  MessageCircle,
  Lock,
  LogOut,
  Briefcase,
  Users,
  Trophy,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/useAuth';

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

// Pages that don't require authentication
const PUBLIC_PATHS = ['/', '/login', '/signup', '/pricing', '/privacy', '/terms'];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  // Redirect to /login if not authenticated and not on a public page
  useEffect(() => {
    if (!loading && !user && !PUBLIC_PATHS.includes(pathname)) {
      router.replace('/login');
    }
  }, [user, loading, pathname, router]);

  // Show nothing while auth is loading to prevent flash of unauthenticated content
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // On public pages, just render without the sidebar shell
  if (!user && PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  // Not logged in and not public — render nothing (redirect is in flight)
  if (!user) {
    return null;
  }

  const navItems = [
    { name: 'Home',          href: '/',              icon: Home },
    { name: 'Calculators',   href: '/calculators',   icon: CalculatorIcon },
    { name: 'NEC Reference', href: '/nec-reference', icon: BookOpen },
    { name: 'Ask Sparky',    href: '/ask-sparky',    icon: MessageCircle },
    { name: 'Jobs',          href: '/jobs',          icon: Briefcase },
    { name: 'Friends',       href: '/friends',       icon: Users },
    { name: 'Leaderboard',   href: '/leaderboard',   icon: Trophy },
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
            const isCalc = item.href === '/calculators';

            if (isCalc) {
              return (
                <React.Fragment key={item.href}>
                  <button
                    onClick={() => setCalcOpen(v => !v)}
                    className={cn(
                      'flex items-center gap-3 pl-[14px] pr-4 py-2.5 rounded-lg text-sm w-full text-left',
                      'transition-all duration-150 min-h-[44px] border-l-2',
                      active
                        ? 'border-orange-500 text-orange-400 bg-orange-500/5'
                        : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/60 hover:border-zinc-700',
                    )}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    <span className="flex-1">{item.name}</span>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 shrink-0 transition-transform duration-200',
                        calcOpen && 'rotate-180',
                      )}
                    />
                  </button>

                  {calcOpen && (
                    <div className="flex flex-col gap-0.5 mb-1">
                      {CALC_SUB_ITEMS.map((sub) => (
                        <button
                          key={sub.tool}
                          onClick={() => {
                            router.push(`/calculators?tool=${sub.tool}`);
                            setSidebarOpen(false);
                          }}
                          className="flex items-center pl-10 pr-4 py-2 rounded-md text-xs text-zinc-500 hover:text-white hover:bg-zinc-800/40 transition-colors duration-150 w-full text-left min-h-[36px]"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              );
            }

            return (
              <Link
                key={item.href}
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
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-col gap-1">
          <div className="flex items-center gap-3 pl-[14px] pr-4 py-2.5 text-sm text-zinc-400 min-w-0">
            <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-orange-400 text-xs font-semibold shrink-0">
              {user.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <span className="truncate text-xs">{user.email}</span>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-3 pl-[14px] pr-4 py-2.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all duration-150 w-full text-sm min-h-[44px] border-l-2 border-transparent"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            <span>Sign Out</span>
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

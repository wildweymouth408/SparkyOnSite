'use client';

import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Calendar,
  Zap,
  Users,
  LogOut,
  Moon,
  Bell,
  Ruler,
  Settings,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/hooks/useAuth';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { getSettings, saveSettings } from '@/lib/storage';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Profile {
  id: string;
  name: string | null;
  role: string | null;
  years_exp: number | null;
  company: string | null;
}

export default function ProfileTab() {
  const { user, signOut } = useAuth();
  const { subscription, tier, loading: subLoading } = useSubscription(user?.id || null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [settings, setSettings] = useState(getSettings());

  const loading = profileLoading || subLoading;

  // Apply dark mode class on mount and when settings change
  useEffect(() => {
    const html = document.documentElement;
    if (settings.darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Fetch profile
  useEffect(() => {
    if (!user) return;

    async function fetchProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, role, years_exp, company')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setProfileLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  const handleDarkModeToggle = () => {
    const updated = saveSettings({ darkMode: !settings.darkMode });
    setSettings(updated);
  };

  const handleNotificationsToggle = () => {
    const updated = saveSettings({ notifications: !settings.notifications });
    setSettings(updated);
  };

  const handleUnitsPreferenceChange = (pref: 'imperial' | 'metric') => {
    const updated = saveSettings({ unitsPreference: pref });
    setSettings(updated);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile?.name || user.email?.split('@')[0] || 'User';
  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const tierColors = {
    Free: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    Pro: 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 border-orange-500/50',
    Team: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/50',
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            Profile & Settings
          </h1>
          <p className="text-zinc-400 mt-2">Manage your account and preferences</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <section className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-400" />
                Profile
              </h2>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-3xl font-bold">
                    {displayName[0].toUpperCase()}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-zinc-400">Name</label>
                      <p className="text-lg font-medium">{profile?.name || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-zinc-400">Email</label>
                      <p className="text-lg font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4 text-zinc-500" />
                        {user.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-zinc-400">Role</label>
                      <p className="text-lg font-medium">{profile?.role || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-zinc-400">Experience</label>
                      <p className="text-lg font-medium">
                        {profile?.years_exp ? `${profile.years_exp} years` : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-zinc-400">Company</label>
                      <p className="text-lg font-medium">{profile?.company || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-zinc-400">Member since</label>
                      <p className="text-lg font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        {memberSince}
                      </p>
                    </div>
                  </div>

                  {/* Subscription Badge */}
                  <div className="mt-4">
                    <label className="text-sm text-zinc-400">Subscription</label>
                    <div className="flex items-center gap-3 mt-1">
                      <div className={cn(
                        'px-4 py-2 rounded-full border flex items-center gap-2',
                        tierColors[tier as keyof typeof tierColors]
                      )}>
                        {tier === 'Free' && <Zap className="w-4 h-4" />}
                        {tier === 'Pro' && <Zap className="w-4 h-4" />}
                        {tier === 'Team' && <Users className="w-4 h-4" />}
                        <span className="font-semibold">{tier}</span>
                      </div>
                      {tier === 'Free' && (
                        <button className="text-sm text-orange-400 hover:text-orange-300 underline">
                          Upgrade to Pro
                        </button>
                      )}
                    </div>
                    {subscription && (
                      <p className="text-sm text-zinc-500 mt-2">
                        Renews on {new Date(subscription.current_period_end).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Settings Card */}
            <section className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-400" />
                Settings
              </h2>

              <div className="space-y-6">
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-800 rounded-lg">
                      <Moon className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-zinc-400">Switch between light and dark theme</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDarkModeToggle}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      settings.darkMode ? 'bg-orange-500' : 'bg-zinc-700'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>

                {/* Notifications Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-800 rounded-lg">
                      <Bell className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium">Notifications</p>
                      <p className="text-sm text-zinc-400">Receive app notifications</p>
                    </div>
                  </div>
                  <button
                    onClick={handleNotificationsToggle}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      settings.notifications ? 'bg-orange-500' : 'bg-zinc-700'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        settings.notifications ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>

                {/* Units Preference */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-800 rounded-lg">
                      <Ruler className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium">Units</p>
                      <p className="text-sm text-zinc-400">Imperial (ft/in) or Metric (mm/m)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUnitsPreferenceChange('imperial')}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                        settings.unitsPreference === 'imperial'
                          ? 'bg-orange-500 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      )}
                    >
                      Imperial
                    </button>
                    <button
                      onClick={() => handleUnitsPreferenceChange('metric')}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                        settings.unitsPreference === 'metric'
                          ? 'bg-orange-500 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      )}
                    >
                      Metric
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right column - Actions */}
          <div className="space-y-6">
            {/* Account Actions */}
            <section className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Account Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors text-zinc-300 hover:text-white">
                  Edit Profile
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors text-zinc-300 hover:text-white">
                  Change Password
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors text-zinc-300 hover:text-white">
                  Billing & Subscription
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 transition-colors text-zinc-300 hover:text-white">
                  Data & Privacy
                </button>
              </div>
            </section>

            {/* Sign Out */}
            <section className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Sign Out</h2>
              <p className="text-zinc-400 text-sm mb-4">
                Sign out of your account on this device.
              </p>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 hover:text-red-200 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </section>

            {/* App Version */}
            <div className="text-center text-zinc-500 text-sm">
              Sparky v1.0.0-beta • © 2026 SparkyOnsite
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
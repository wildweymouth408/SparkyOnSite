'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Subscription {
  id: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'unpaid' | 'paused';
  price_id: string | null;
  current_period_end: string;
}

export function useSubscription(userId: string | null) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    async function fetchSubscription() {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('id, status, price_id, current_period_end')
          .eq('user_id', userId)
          .in('status', ['active', 'trialing'])
          .maybeSingle();

        if (error) {
          // If table doesn't exist, treat as no subscription (during development)
          if (error.code === '42P01' || error.message.includes('relation')) {
            console.warn('Subscriptions table not found — treating as Free tier');
            setSubscription(null);
          } else {
            throw error;
          }
        } else {
          setSubscription(data);
        }
      } catch (err) {
        console.error('Failed to fetch subscription:', err);
        setError(err as Error);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, [userId]);

  const isPro = !!subscription;
  // Determine tier based on price_id? For now, if subscription exists -> Pro
  // Could be Team if price_id matches team price.
  const tier = subscription ? (subscription.price_id?.includes('team') ? 'Team' : 'Pro') : 'Free';

  return { subscription, loading, error, isPro, tier };
}
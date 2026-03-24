import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

async function getAuthenticatedUser(authHeader: string | null) {
  const supabase = createClient(
    env.supabaseUrl,
    env.supabaseAnonKey,
    authHeader ? { global: { headers: { Authorization: authHeader } } } : {}
  );
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const user = await getAuthenticatedUser(authHeader);


    // Get current month usage
    const supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey);
    const now = new Date();
    const month = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]; // YYYY-MM-01
    const { data: usage, error: usageError } = await supabase
      .from('usage_limits')
      .select('calculator_uses, ask_sparky_uses, job_attachments')
      .eq('user_id', user.id)
      .eq('month', month)
      .single();

    // If no record exists, usage counts are zero
    const usageCounts = usageError && usageError.code === 'PGRST116' ? {
      calculator_uses: 0,
      ask_sparky_uses: 0,
      job_attachments: 0,
    } : usage;

    // Determine tier and limits
    const isPro = subscription !== null;
    const freeLimits = {
      maxCalculatorsPerMonth: 10, // placeholder
      maxAskSparkyPerMonth: 5,
      maxJobAttachmentsPerJob: 1,
      maxJobs: 3,
    };

    return NextResponse.json({
      subscription,
      usage: usageCounts,
      tier: isPro ? 'pro' : 'free',
      limits: isPro ? null : freeLimits,
    });
  } catch (error: any) {
    console.error('Subscription fetch error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
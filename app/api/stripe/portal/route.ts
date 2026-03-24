import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { createPortalSession } from '@/lib/stripe';

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

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const user = await getAuthenticatedUser(authHeader);

    // Fetch customer ID from profile
    const supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey);
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    const { url } = await createPortalSession(profile.stripe_customer_id);
    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('Portal session error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
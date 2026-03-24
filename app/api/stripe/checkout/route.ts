import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

// Helper to get authenticated user
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

    const body = await req.json();
    const { priceId, promoCode } = body;

    if (!priceId || typeof priceId !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid priceId' },
        { status: 400 }
      );
    }

    // Validate priceId matches allowed prices
    const allowedPriceIds = [env.stripeMonthlyPriceId, env.stripeYearlyPriceId];
    if (!allowedPriceIds.includes(priceId)) {
      return NextResponse.json(
        { error: 'Invalid priceId' },
        { status: 400 }
      );
    }

    // Optional promo code validation
    let validatedPromoCode: string | undefined;
    if (promoCode) {
      const allowedPromoCodes = [
        env.stripePromoCodeSparky14,
        env.stripePromoCodeBetaFriend,
      ];
      if (!allowedPromoCodes.includes(promoCode)) {
        return NextResponse.json(
          { error: 'Invalid promo code' },
          { status: 400 }
        );
      }
      validatedPromoCode = promoCode;
    }

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
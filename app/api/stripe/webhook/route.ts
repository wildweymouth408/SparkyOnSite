import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

// Disable body parsing, we need raw body for signature verification
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function getRawBody(req: NextRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = req.body?.getReader();
  if (!reader) {
    throw new Error('No request body');
  }
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let rawBody: Buffer;
  try {
    rawBody = await getRawBody(req);
  } catch (error) {
    console.error('Failed to read raw body:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  let event;
  try {
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  const supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey);

  try {
    switch (event.type) {
      case 'customer.created': {
        const customer = event.data.object as any;
        const userId = customer.metadata?.userId;
        if (userId) {
          // Update profile with stripe_customer_id
          await supabase
            .from('profiles')
            .update({ stripe_customer_id: customer.id })
            .eq('id', userId);
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;
        // Fetch user profile via stripe_customer_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();
        if (profile) {
          // Upsert subscription record
          const subData = {
            user_id: profile.id,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: customerId,
            status: subscription.status,
            price_id: subscription.items.data[0].price.id,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          };
          await supabase
            .from('subscriptions')
            .upsert(subData, { onConflict: 'stripe_subscription_id' });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled', updated_at: new Date().toISOString() })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }
      // Handle other events as needed
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    // Return 200 to avoid Stripe retries for non-critical errors
  }

  return NextResponse.json({ received: true });
}
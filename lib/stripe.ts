/**
 * Stripe server-side utilities.
 * Requires STRIPE_SECRET_KEY environment variable.
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { env } from './env';

export const stripe = new Stripe(env.stripeSecretKey, {
  apiVersion: '2025-02-24.acacia', // Use latest stable version
  typescript: true,
});

// Supabase server client (service role) for trusted server operations
const supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey);

/**
 * Get or create a Stripe customer ID for a user.
 * If the user already has a customer ID stored in their profile, return it.
 * Otherwise, create a new customer and update the profile.
 */
export async function getOrCreateCustomer(userId: string, email?: string): Promise<string> {
  // Fetch profile to see if stripe_customer_id exists
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Failed to fetch profile:', error);
    throw new Error('Database error');
  }

  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  // Create Stripe customer
  const customer = await stripe.customers.create({
    email: email,
    metadata: { userId },
  });

  // Update profile with stripe_customer_id
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', userId);

  if (updateError) {
    console.error('Failed to update profile with customer ID:', updateError);
    // Still return the customer ID; we can try again later
  }

  return customer.id;
}

/**
 * Create a checkout session for subscription.
 * @param userId Supabase user ID
 * @param priceId Stripe price ID (monthly or yearly)
 * @param promoCode Optional promotion code ID
 * @returns Checkout session URL
 */
export async function createCheckoutSession(
  userId: string,
  priceId: string,
  promoCode?: string,
  email?: string
): Promise<{ url: string }> {
  const customerId = await getOrCreateCustomer(userId, email);
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    subscription_data: {
      metadata: {
        userId,
      },
    },
    allow_promotion_codes: true,
  };

  if (promoCode) {
    sessionParams.discounts = [{ promotion_code: promoCode }];
  }

  const session = await stripe.checkout.sessions.create(sessionParams);
  if (!session.url) {
    throw new Error('Failed to create checkout session URL');
  }
  return { url: session.url };
}

/**
 * Create a customer portal session for managing subscriptions.
 */
export async function createPortalSession(customerId: string): Promise<{ url: string }> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });
  return { url: session.url };
}

/**
 * Validate Stripe webhook signature and construct event.
 */
export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Promise<Stripe.Event> {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    env.stripeWebhookSecret
  );
}

/**
 * Get subscription status for a user.
 * Returns null if no active subscription.
 */
export async function getSubscriptionStatus(userId: string): Promise<{
  status: string;
  currentPeriodEnd: number;
  priceId: string;
} | null> {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('status, current_period_end, price_id')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing', 'past_due'])
    .gt('current_period_end', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !subscription) {
    return null;
  }

  return {
    status: subscription.status,
    currentPeriodEnd: new Date(subscription.current_period_end).getTime(),
    priceId: subscription.price_id,
  };
*/
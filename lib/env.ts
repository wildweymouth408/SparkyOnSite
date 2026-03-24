/**
 * Environment variable validation utilities.
 * Throws descriptive errors on missing required variables at runtime.
 */

/**
 * Get a required environment variable.
 * Throws an error if the variable is not defined or is an empty string.
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Public environment variables (prefixed with NEXT_PUBLIC_).
 * Safe to use on both client and server.
 */
export const publicEnv = {
  supabaseUrl: getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  stripePublishableKey: getRequiredEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  stripeMonthlyPriceId: getRequiredEnv('NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID'),
  stripeYearlyPriceId: getRequiredEnv('NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID'),
} as const;

/**
 * Server-only environment variables (not exposed to the client).
 * Use only in server-side code (API routes, server components, lib functions that run on server).
 */
export const serverEnv = {
  supabaseServiceRoleKey: getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
  credentialEncryptionKey: getRequiredEnv('CREDENTIAL_ENCRYPTION_KEY'),
  stripeSecretKey: getRequiredEnv('STRIPE_SECRET_KEY'),
  stripeWebhookSecret: getRequiredEnv('STRIPE_WEBHOOK_SECRET'),
  stripeMonthlyPriceId: getRequiredEnv('STRIPE_MONTHLY_PRICE_ID'),
  stripeYearlyPriceId: getRequiredEnv('STRIPE_YEARLY_PRICE_ID'),
  stripePromoCodeSparky14: getRequiredEnv('STRIPE_PROMO_CODE_SPARKY14'),
  stripePromoCodeBetaFriend: getRequiredEnv('STRIPE_PROMO_CODE_BETAFRIEND'),
} as const;

/**
 * Combined environment variables (for convenience in server-side code).
 * Avoid importing this in client-side modules.
 */
export const env = {
  ...publicEnv,
  ...serverEnv,
} as const;
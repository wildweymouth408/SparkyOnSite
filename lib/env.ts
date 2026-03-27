/**
 * Environment variable validation utilities.
 * Throws descriptive errors on missing required variables at runtime.
 */

/**
 * Get a required environment variable (server-side only).
 * Uses dynamic lookup — only safe in server contexts where process.env is real.
 * Do NOT use for NEXT_PUBLIC_* variables; Next.js cannot statically replace
 * dynamic property access at build time.
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Validate a public env var value that was read via static access.
 * The caller must pass process.env.NEXT_PUBLIC_* as a literal so Next.js
 * can inline the value at build time.
 */
function requirePublicEnv(key: string, value: string | undefined): string {
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
  supabaseUrl: requirePublicEnv('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: requirePublicEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
  stripeMonthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ?? '',
  stripeYearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID ?? '',
} as const;

/**
 * Server-only environment variables (not exposed to the client).
 * Use only in server-side code (API routes, server components, lib functions that run on server).
 *
 * Defined with lazy getters so that merely importing this module on the client
 * does NOT throw — the error is deferred until the value is actually accessed
 * in a code path that runs on the server.
 */
export const serverEnv = {
  get supabaseServiceRoleKey()   { return getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY') },
  get credentialEncryptionKey()  { return getRequiredEnv('CREDENTIAL_ENCRYPTION_KEY') },
  get stripeSecretKey()          { return getRequiredEnv('STRIPE_SECRET_KEY') },
  get stripeWebhookSecret()      { return getRequiredEnv('STRIPE_WEBHOOK_SECRET') },
  get stripeMonthlyPriceId()     { return getRequiredEnv('STRIPE_MONTHLY_PRICE_ID') },
  get stripeYearlyPriceId()      { return getRequiredEnv('STRIPE_YEARLY_PRICE_ID') },
  get stripePromoCodeSparky14()  { return getRequiredEnv('STRIPE_PROMO_CODE_SPARKY14') },
  get stripePromoCodeBetaFriend(){ return getRequiredEnv('STRIPE_PROMO_CODE_BETAFRIEND') },
};

/**
 * Combined environment variables (for convenience in server-side code).
 * Avoid importing this in client-side modules.
 */
export const env = {
  ...publicEnv,
  get supabaseServiceRoleKey()   { return serverEnv.supabaseServiceRoleKey },
  get credentialEncryptionKey()  { return serverEnv.credentialEncryptionKey },
  get stripeSecretKey()          { return serverEnv.stripeSecretKey },
  get stripeWebhookSecret()      { return serverEnv.stripeWebhookSecret },
  get stripeMonthlyPriceId()     { return serverEnv.stripeMonthlyPriceId },
  get stripeYearlyPriceId()      { return serverEnv.stripeYearlyPriceId },
  get stripePromoCodeSparky14()  { return serverEnv.stripePromoCodeSparky14 },
  get stripePromoCodeBetaFriend(){ return serverEnv.stripePromoCodeBetaFriend },
};
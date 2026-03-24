/**
 * Server-side usage tracking and limit enforcement.
 * Requires Supabase service role key.
 */

import { createClient } from '@supabase/supabase-js';
import { env } from './env';

const supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey);

export interface UsageLimits {
  maxCalculatorsPerMonth: number;
  maxAskSparkyPerMonth: number;
  maxJobAttachmentsPerJob: number;
  maxJobs: number;
}

export const FREE_TIER_LIMITS: UsageLimits = {
  maxCalculatorsPerMonth: 10, // TODO: decide actual limit
  maxAskSparkyPerMonth: 5,
  maxJobAttachmentsPerJob: 1,
  maxJobs: 3,
};

export const PRO_TIER_LIMITS: UsageLimits = {
  maxCalculatorsPerMonth: Infinity,
  maxAskSparkyPerMonth: Infinity,
  maxJobAttachmentsPerJob: Infinity,
  maxJobs: Infinity,
};

/**
 * Get current month key (YYYY-MM-01).
 */
function getCurrentMonth(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
}

/**
 * Get usage limits for a user based on subscription status.
 */
export async function getUserLimits(userId: string): Promise<{
  limits: UsageLimits;
  isPro: boolean;
}> {
  const isPro = subscription !== null;
  return {
    limits: isPro ? PRO_TIER_LIMITS : FREE_TIER_LIMITS,
    isPro,
  };
}

/**
 * Increment a usage counter for the current month.
 * Returns the new count after increment.
 */
async function incrementUsage(
  userId: string,
  column: 'calculator_uses' | 'ask_sparky_uses' | 'job_attachments'
): Promise<number> {
  const month = getCurrentMonth();
  // Upsert row for this user/month, increment column atomically
  const { data, error } = await supabase.rpc('increment_usage', {
    p_user_id: userId,
    p_month: month,
    p_column: column,
  });
  if (error) {
    // Fallback: fetch, increment, update
    const { data: existing } = await supabase
      .from('usage_limits')
      .select(column)
      .eq('user_id', userId)
      .eq('month', month)
      .single();
    const current = existing?.[column] || 0;
    const newValue = current + 1;
    await supabase
      .from('usage_limits')
      .upsert({
        user_id: userId,
        month,
        [column]: newValue,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,month' });
    return newValue;
  }
  return data;
}

/**
 * Check if user can use a calculator this month.
 * If allowed, optionally increment the counter.
 */
export async function canUseCalculator(
  userId: string,
  increment: boolean = false
): Promise<{ allowed: boolean; remaining: number }> {
  const { limits, isPro } = await getUserLimits(userId);
  if (isPro) {
    return { allowed: true, remaining: Infinity };
  }
  const month = getCurrentMonth();
  const { data: usage } = await supabase
    .from('usage_limits')
    .select('calculator_uses')
    .eq('user_id', userId)
    .eq('month', month)
    .single();
  const used = usage?.calculator_uses || 0;
  const remaining = limits.maxCalculatorsPerMonth - used;
  if (remaining <= 0) {
    return { allowed: false, remaining: 0 };
  }
  if (increment) {
    const newUsed = await incrementUsage(userId, 'calculator_uses');
    return { allowed: true, remaining: limits.maxCalculatorsPerMonth - newUsed };
  }
  return { allowed: true, remaining };
}

/**
 * Check if user can use Ask Sparky this month.
 */
export async function canUseAskSparky(
  userId: string,
  increment: boolean = false
): Promise<{ allowed: boolean; remaining: number }> {
  const { limits, isPro } = await getUserLimits(userId);
  if (isPro) {
    return { allowed: true, remaining: Infinity };
  }
  const month = getCurrentMonth();
  const { data: usage } = await supabase
    .from('usage_limits')
    .select('ask_sparky_uses')
    .eq('user_id', userId)
    .eq('month', month)
    .single();
  const used = usage?.ask_sparky_uses || 0;
  const remaining = limits.maxAskSparkyPerMonth - used;
  if (remaining <= 0) {
    return { allowed: false, remaining: 0 };
  }
  if (increment) {
    const newUsed = await incrementUsage(userId, 'ask_sparky_uses');
    return { allowed: true, remaining: limits.maxAskSparkyPerMonth - newUsed };
  }
  return { allowed: true, remaining };
}

/**
 * Check if user can attach a calculation or image to a job.
 * This checks per‑job limit (max attachments per job) and total job count.
 * For simplicity, we only enforce per‑job limit here.
 */
export async function canAttachToJob(
  userId: string,
  jobId: string,
  increment: boolean = false
): Promise<{ allowed: boolean; remaining: number }> {
  const { limits, isPro } = await getUserLimits(userId);
  if (isPro) {
    return { allowed: true, remaining: Infinity };
  }
  // Count existing attachments for this job (calculation + photo)
  // We'll need to query job_calculations and job_photos tables.
  // For now, we'll use a simplified monthly limit across all jobs.
  const month = getCurrentMonth();
  const { data: usage } = await supabase
    .from('usage_limits')
    .select('job_attachments')
    .eq('user_id', userId)
    .eq('month', month)
    .single();
  const used = usage?.job_attachments || 0;
  const remaining = limits.maxJobAttachmentsPerJob - used;
  if (remaining <= 0) {
    return { allowed: false, remaining: 0 };
  }
  if (increment) {
    const newUsed = await incrementUsage(userId, 'job_attachments');
    return { allowed: true, remaining: limits.maxJobAttachmentsPerJob - newUsed };
  }
  return { allowed: true, remaining };
}

/**
 * Check if user can create a new job (max jobs limit).
 */
export async function canCreateJob(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const { limits, isPro } = await getUserLimits(userId);
  if (isPro) {
    return { allowed: true, remaining: Infinity };
  }
  const { count, error } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  if (error) {
    console.error('Error counting jobs:', error);
    // Allow creation on error
    return { allowed: true, remaining: limits.maxJobs };
  }
  const used = count || 0;
  const remaining = limits.maxJobs - used;
  return { allowed: remaining > 0, remaining: Math.max(0, remaining) };
}

/**
 * Get current usage counts for the month.
 */
export async function getUsage(userId: string): Promise<{
  calculator_uses: number;
  ask_sparky_uses: number;
  job_attachments: number;
}> {
  const month = getCurrentMonth();
  const { data: usage } = await supabase
    .from('usage_limits')
    .select('calculator_uses, ask_sparky_uses, job_attachments')
    .eq('user_id', userId)
    .eq('month', month)
    .single();
  return {
    calculator_uses: usage?.calculator_uses || 0,
    ask_sparky_uses: usage?.ask_sparky_uses || 0,
    job_attachments: usage?.job_attachments || 0,
  };
}
-- Stripe integration migrations
-- Run this SQL in your Supabase SQL editor to add required tables and columns.

-- 1. Add stripe_customer_id to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- 2. Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    stripe_customer_id TEXT NOT NULL,
    status TEXT NOT NULL,
    price_id TEXT NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- 3. Create usage_limits table to track monthly usage for free tier
CREATE TABLE IF NOT EXISTS usage_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    month DATE NOT NULL, -- first day of month (YYYY-MM-01)
    calculator_uses INTEGER DEFAULT 0,
    ask_sparky_uses INTEGER DEFAULT 0,
    job_attachments INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_usage_limits_user_id_month ON usage_limits(user_id, month);

-- 4. Ensure jobs, job_photos, job_calculations tables have user_id column.
-- If the tables exist from earlier migrations, add user_id column (nullable for existing data).
ALTER TABLE IF EXISTS jobs ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id);
ALTER TABLE IF EXISTS job_photos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id);
ALTER TABLE IF EXISTS job_calculations ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id);
-- Update existing rows to associate with a default user if needed (e.g., admin).

-- 5. Add subscription status helper function
CREATE OR REPLACE FUNCTION get_user_subscription_status(user_uuid UUID)
RETURNS TABLE (
    status TEXT,
    current_period_end TIMESTAMP WITH TIME ZONE,
    price_id TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT s.status, s.current_period_end, s.price_id
    FROM subscriptions s
    WHERE s.user_id = user_uuid
        AND s.status IN ('active', 'trialing', 'past_due')
        AND s.current_period_end > NOW()
    ORDER BY s.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- 6. Increment usage counter atomically
CREATE OR REPLACE FUNCTION increment_usage(
    p_user_id UUID,
    p_month DATE,
    p_column TEXT
) RETURNS INTEGER AS $$
DECLARE
    new_value INTEGER;
BEGIN
    INSERT INTO usage_limits (user_id, month, calculator_uses, ask_sparky_uses, job_attachments)
    VALUES (p_user_id, p_month, 0, 0, 0)
    ON CONFLICT (user_id, month) DO NOTHING;

    CASE p_column
        WHEN 'calculator_uses' THEN
            UPDATE usage_limits
            SET calculator_uses = calculator_uses + 1,
                updated_at = NOW()
            WHERE user_id = p_user_id AND month = p_month
            RETURNING calculator_uses INTO new_value;
        WHEN 'ask_sparky_uses' THEN
            UPDATE usage_limits
            SET ask_sparky_uses = ask_sparky_uses + 1,
                updated_at = NOW()
            WHERE user_id = p_user_id AND month = p_month
            RETURNING ask_sparky_uses INTO new_value;
        WHEN 'job_attachments' THEN
            UPDATE usage_limits
            SET job_attachments = job_attachments + 1,
                updated_at = NOW()
            WHERE user_id = p_user_id AND month = p_month
            RETURNING job_attachments INTO new_value;
        ELSE
            RAISE EXCEPTION 'Invalid column name %', p_column;
    END CASE;

    RETURN new_value;
END;
$$ LANGUAGE plpgsql;
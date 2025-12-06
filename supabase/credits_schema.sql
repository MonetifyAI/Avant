-- Credit System Schema Update
-- Run this in Supabase SQL Editor AFTER the main schema

-- ===========================================
-- ADD CREDITS TO PROFILES
-- ===========================================

-- Add credits column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 4 NOT NULL;

-- Add a check constraint to prevent negative credits
ALTER TABLE public.profiles 
ADD CONSTRAINT credits_non_negative CHECK (credits >= 0);

-- ===========================================
-- CREDIT TRANSACTIONS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'bonus', 'refund')),
  description TEXT,
  reference_id TEXT, -- Whop payment ID or generation task ID
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON public.credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.credit_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ===========================================
-- CREDIT PACKAGES TABLE (for displaying in UI)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.credit_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  credits INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  whop_plan_id TEXT,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Allow all authenticated users to read packages
ALTER TABLE public.credit_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active packages"
  ON public.credit_packages FOR SELECT
  TO authenticated
  USING (is_active = true);

-- ===========================================
-- SEED CREDIT PACKAGES
-- ===========================================
INSERT INTO public.credit_packages (name, credits, price_cents, whop_plan_id, is_popular, sort_order) VALUES
('Starter', 10, 999, 'prod_nsehLcXm5w5Yj', false, 1),
('Popular', 25, 1999, 'prod_fOnp9wXcF0P8Z', true, 2),
('Pro', 100, 5999, 'prod_u8EzPf9CDj2nY', false, 3);

-- ===========================================
-- FUNCTION TO DEDUCT CREDITS
-- ===========================================
CREATE OR REPLACE FUNCTION public.deduct_credit(
  p_user_id UUID,
  p_amount INTEGER DEFAULT 1,
  p_description TEXT DEFAULT 'Generation',
  p_reference_id TEXT DEFAULT NULL
)
RETURNS TABLE(success BOOLEAN, new_balance INTEGER, error_message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_credits INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Get current credits with row lock
  SELECT credits INTO v_current_credits
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF v_current_credits IS NULL THEN
    RETURN QUERY SELECT false, 0, 'User not found'::TEXT;
    RETURN;
  END IF;

  IF v_current_credits < p_amount THEN
    RETURN QUERY SELECT false, v_current_credits, 'Insufficient credits'::TEXT;
    RETURN;
  END IF;

  -- Deduct credits
  v_new_balance := v_current_credits - p_amount;
  
  UPDATE public.profiles
  SET credits = v_new_balance
  WHERE id = p_user_id;

  -- Log transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, description, reference_id, balance_after)
  VALUES (p_user_id, -p_amount, 'usage', p_description, p_reference_id, v_new_balance);

  RETURN QUERY SELECT true, v_new_balance, NULL::TEXT;
END;
$$;

-- ===========================================
-- FUNCTION TO ADD CREDITS (for purchases)
-- ===========================================
CREATE OR REPLACE FUNCTION public.add_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT DEFAULT 'purchase',
  p_description TEXT DEFAULT 'Credit purchase',
  p_reference_id TEXT DEFAULT NULL
)
RETURNS TABLE(success BOOLEAN, new_balance INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  -- Add credits
  UPDATE public.profiles
  SET credits = credits + p_amount
  WHERE id = p_user_id
  RETURNING credits INTO v_new_balance;

  IF v_new_balance IS NULL THEN
    RETURN QUERY SELECT false, 0;
    RETURN;
  END IF;

  -- Log transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, description, reference_id, balance_after)
  VALUES (p_user_id, p_amount, p_type, p_description, p_reference_id, v_new_balance);

  RETURN QUERY SELECT true, v_new_balance;
END;
$$;

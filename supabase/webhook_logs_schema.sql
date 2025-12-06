-- Webhook Logs Table
-- For tracking webhook events and debugging
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,    -- 'whop', 'stripe', etc.
  event_type TEXT NOT NULL,
  payload JSONB,
  status TEXT NOT NULL,    -- 'success', 'failed', 'pending'
  error_message TEXT,
  user_id UUID REFERENCES auth.users(id),
  credits_added INTEGER,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (only service role can insert)
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Admin policy (for viewing in Supabase dashboard)
CREATE POLICY "Service role can insert webhook logs"
  ON public.webhook_logs FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can view webhook logs"
  ON public.webhook_logs FOR SELECT
  TO service_role
  USING (true);

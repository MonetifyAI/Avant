-- Business Analysis Data Storage
-- Run this in Supabase SQL Editor to add website analysis columns to profiles

-- Add website analysis fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS services TEXT[],
ADD COLUMN IF NOT EXISTS unique_selling_points TEXT[];

-- Comment on new columns
COMMENT ON COLUMN public.profiles.website_url IS 'Business website URL from Website Analyzer';
COMMENT ON COLUMN public.profiles.location IS 'Business location/city from website analysis';
COMMENT ON COLUMN public.profiles.services IS 'Array of services offered by the business';
COMMENT ON COLUMN public.profiles.unique_selling_points IS 'Array of USPs from website analysis';

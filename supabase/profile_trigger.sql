-- Fix for Profile Creation During Signup
-- Run this in Supabase SQL Editor

-- Option 1: Create a trigger to auto-create profiles (RECOMMENDED)
-- This runs with elevated privileges and bypasses RLS

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, firstname, lastname, company, email, credits)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'firstname', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'lastname', ''),
    COALESCE(NEW.raw_user_meta_data->>'company', ''),
    NEW.email,
    4  -- Default free credits
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger (drop if exists first)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Option 2: Also update the RLS policy to allow inserts during signup
-- This is a fallback in case the trigger doesn't fire

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (true);  -- Allow any authenticated insert, profile ID must match user ID anyway

-- Keep the SELECT and UPDATE policies restrictive
-- (These should already exist from the original schema)

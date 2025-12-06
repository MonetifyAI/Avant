-- Add delete policy for ad_tasks table
-- Run this in Supabase SQL Editor to enable generation deletion

-- Add the delete policy if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'ad_tasks' 
        AND policyname = 'Users can delete own ad tasks'
    ) THEN
        CREATE POLICY "Users can delete own ad tasks"
            ON public.ad_tasks FOR DELETE
            USING (auth.uid() = user_id);
    END IF;
END $$;

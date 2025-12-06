-- Extended Schema for Ad Generator & Prompt Library
-- Run this in Supabase SQL Editor

-- ===========================================
-- USER ASSETS TABLE (logos, faces)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.user_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('logo', 'face')),
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_assets ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own assets"
  ON public.user_assets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assets"
  ON public.user_assets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assets"
  ON public.user_assets FOR DELETE
  USING (auth.uid() = user_id);

-- ===========================================
-- AD TASKS TABLE (video generation jobs)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.ad_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  kie_task_id TEXT NOT NULL,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'success', 'fail')),
  before_image_url TEXT NOT NULL,
  after_image_url TEXT NOT NULL,
  logo_url TEXT,
  face_url TEXT,
  face_description TEXT,
  prompt TEXT NOT NULL,
  hook_type TEXT,
  aspect_ratio TEXT DEFAULT 'landscape',
  duration TEXT DEFAULT '10',
  result_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.ad_tasks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own ad tasks"
  ON public.ad_tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ad tasks"
  ON public.ad_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ad tasks"
  ON public.ad_tasks FOR UPDATE
  USING (auth.uid() = user_id);

-- ===========================================
-- PROMPTS TABLE (prompt library)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  category TEXT NOT NULL,
  hook_type TEXT NOT NULL,
  awareness_level TEXT,
  use_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (read for all authenticated users)
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read prompts"
  ON public.prompts FOR SELECT
  TO authenticated
  USING (true);

-- ===========================================
-- SEED PROMPT LIBRARY WITH HORMOZI-STYLE HOOKS
-- ===========================================
INSERT INTO public.prompts (title, prompt, category, hook_type, awareness_level, is_featured) VALUES
-- TRANSFORMATION REVEAL HOOKS
('Watch This Transformation', 'Watch what skilled craftsmanship looks like. This [ROOM_TYPE] went from dated and dysfunctional to a stunning modern space. The camera slowly reveals the transformation as homeowners react to their new space.', 'Kitchen', 'Transformation', 'Solution Aware', true),
('$50K Value Reveal', 'This is what $50,000 in skilled labor and premium materials gets you. Watch this complete [ROOM_TYPE] transformation unfold. From demolition to the final reveal, every detail matters.', 'Kitchen', 'Transformation', 'Product Aware', true),
('Same Room, New Life', 'You won''t believe this is the same room. 6 weeks ago, this [ROOM_TYPE] was outdated, cramped, and barely functional. Today? It''s the heart of the home.', 'Kitchen', 'Transformation', 'Problem Aware', true),
('Before Your Eyes', 'Before your eyes, witness the complete transformation. This isn''t just a remodel—it''s a lifestyle upgrade. Watch as [ROOM_TYPE] goes from ordinary to extraordinary.', 'Bathroom', 'Transformation', 'Solution Aware', false),
('POV: You Hired The Right Contractor', 'POV: You finally hired the right contractor. The work is done on time, on budget, and beyond your expectations. This is what that looks like.', 'Full Home', 'Transformation', 'Problem Aware', true),

-- SOCIAL PROOF HOOKS
('See Why 200+ Chose Us', 'See why over 200 homeowners in [CITY] trusted us with their dream [ROOM_TYPE]. Real results. Real families. Real transformations.', 'Kitchen', 'Social Proof', 'Product Aware', true),
('Our Clients React', 'We don''t just remodel homes—we change lives. Watch real homeowner reactions when they see their new [ROOM_TYPE] for the first time.', 'Bathroom', 'Social Proof', 'Product Aware', false),
('Parade of Proof', 'Kitchen after kitchen. Bathroom after bathroom. Home after home. Here''s what we delivered this month alone.', 'Full Home', 'Social Proof', 'Most Aware', true),
('The Difference is Clear', 'The difference between a good contractor and a great one? Watch these before and afters and see for yourself.', 'Full Home', 'Social Proof', 'Solution Aware', false),

-- PAIN-DRIVEN HOOKS
('Tired of Contractors Who Ghost?', 'Tired of contractors who ghost you mid-project? Frustrated with "estimates" that triple overnight? There''s a better way to remodel your home.', 'Full Home', 'Pain-Driven', 'Problem Aware', true),
('Stop Living With That Kitchen', 'Stop living with a [ROOM_TYPE] you hate. Every morning you spend in that outdated space is a morning you could be enjoying your dream home.', 'Kitchen', 'Pain-Driven', 'Problem Aware', true),
('The Hidden Cost', 'The hidden cost of waiting to remodel: your home loses value while material costs rise. Here''s what smart homeowners do instead.', 'Full Home', 'Pain-Driven', 'Problem Aware', false),
('Contractor Horror Stories', 'We''ve heard every contractor horror story. Abandoned projects. Shoddy work. Surprise charges. That ends here.', 'Full Home', 'Pain-Driven', 'Problem Aware', false),

-- CURIOSITY HOOKS
('The Mistake 90% Make', 'The hidden mistake 90% of homeowners make before a remodel—and how to avoid it. This one decision can save you $10,000+.', 'Kitchen', 'Curiosity', 'Unaware', true),
('What Realtors Won''t Tell You', 'What realtors won''t tell you about home values: the one room that determines 80% of your resale price. (Hint: it''s not the living room)', 'Kitchen', 'Curiosity', 'Unaware', false),
('3 Signs', '3 signs your [ROOM_TYPE] is silently destroying your home''s value. Most homeowners miss #2.', 'Bathroom', 'Curiosity', 'Unaware', true),
('The Secret to', 'The secret to doubling your remodeling budget''s impact without spending a penny more. Top designers use this trick.', 'Full Home', 'Curiosity', 'Unaware', false),

-- OFFER-DRIVEN HOOKS
('Free 3D Render', 'Free 3D render of your dream [ROOM_TYPE]—see exactly what it could look like before you spend a dime. Limited spots this month.', 'Kitchen', 'Offer', 'Most Aware', true),
('This Week Only', 'This week only: 15% off all [ROOM_TYPE] remodels. Book your free consultation before spots fill up.', 'Bathroom', 'Offer', 'Most Aware', false),
('Homeowners in [City]', 'Homeowners in [CITY], I have a gift for you 🎁 Free design consultation plus $500 off your remodel if you book this month.', 'Full Home', 'Offer', 'Most Aware', true),

-- DIRECT CALL-OUT HOOKS
('If You''re Planning a Remodel', 'If you''re planning a [ROOM_TYPE] remodel in 2024, this is for you. Watch this 30-second video before you sign any contract.', 'Kitchen', 'Conditional', 'Solution Aware', true),
('For Homeowners Who', 'For homeowners who refuse to settle for average: this is what exceptional craftsmanship looks like.', 'Full Home', 'Label', 'Product Aware', false),
('Read This Before You Remodel', 'Read this before you hire ANY contractor. The 5 questions that separate pros from disasters.', 'Full Home', 'Command', 'Solution Aware', true),

-- STORY HOOKS
('One Day A Homeowner Called', 'One day a homeowner called us crying. Her last contractor had abandoned the project halfway through, taken the deposit, and left her [ROOM_TYPE] in ruins. What we did next changed everything.', 'Kitchen', 'Story', 'Problem Aware', true),
('The Kitchen That Changed Everything', 'This kitchen sat untouched for 30 years. The family gathered there for holidays, but secretly dreaded its cramped layout. Then they called us.', 'Kitchen', 'Story', 'Problem Aware', false),
('When We First Walked In', 'When we first walked into this home, the owner said "I know it''s bad." She had no idea what was possible. 8 weeks later, she cried tears of joy.', 'Full Home', 'Story', 'Problem Aware', true),

-- BEFORE/AFTER SHOCK HOOKS
('Stop Scrolling', 'Stop scrolling if you''ve ever dreamed of a better [ROOM_TYPE]. What you''re about to see took 4 weeks and transformed this family''s daily life.', 'Kitchen', 'Before/After', 'Solution Aware', true),
('The First Frame Will Shock You', 'The first frame will shock you. The last frame will inspire you. Watch this complete [ROOM_TYPE] renovation.', 'Bathroom', 'Before/After', 'Solution Aware', false),
('Swipe to See After', '👀 Swipe to see what''s possible. Same square footage. Same budget. Completely different life.', 'Kitchen', 'Before/After', 'Problem Aware', true),

-- VALUE-FOCUSED HOOKS
('What $30K Gets You', 'What $30,000 gets you with the right contractor: A complete [ROOM_TYPE] transformation that adds $75,000 to your home value.', 'Kitchen', 'Value', 'Product Aware', true),
('ROI of a Kitchen Remodel', 'The ROI of a kitchen remodel: 72% return on investment. Here''s what smart homeowners are doing in 2024.', 'Kitchen', 'Value', 'Solution Aware', false),
('Double Your Home Value', 'Double your home''s value with one strategic remodel. Watch how this [CITY] family did it.', 'Full Home', 'Value', 'Solution Aware', true),

-- EXTERIOR/COMMERCIAL SPECIFIC
('Curb Appeal Transformation', 'Curb appeal sells homes. Watch this exterior transformation that helped this family get 3 offers in the first week.', 'Exterior', 'Transformation', 'Solution Aware', true),
('Your Business Deserves Better', 'Your business deserves a space that impresses clients from the moment they walk in. Watch this commercial remodel.', 'Commercial', 'Pain-Driven', 'Problem Aware', false),
('First Impressions Matter', 'First impressions matter. Your home''s exterior tells a story. What story is yours telling?', 'Exterior', 'Curiosity', 'Unaware', false);

-- ===========================================
-- USER PROMPTS TABLE (AI-generated personalized prompts)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.user_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  category TEXT NOT NULL,
  hook_type TEXT NOT NULL,
  awareness_level TEXT,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'ai_generated')),
  source_url TEXT,
  use_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_prompts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own prompts"
  ON public.user_prompts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prompts"
  ON public.user_prompts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompts"
  ON public.user_prompts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prompts"
  ON public.user_prompts FOR DELETE
  USING (auth.uid() = user_id);

-- ===========================================
-- VISUALIZATION TASKS TABLE (Nano Banana Pro jobs)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.visualization_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  kie_task_id TEXT NOT NULL,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'success', 'fail')),
  source_url TEXT NOT NULL,
  result_url TEXT,
  prompt TEXT NOT NULL,
  room_type TEXT,
  style TEXT,
  aspect_ratio TEXT DEFAULT 'auto',
  resolution TEXT DEFAULT '2K',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.visualization_tasks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own visualization tasks"
  ON public.visualization_tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own visualization tasks"
  ON public.visualization_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own visualization tasks"
  ON public.visualization_tasks FOR UPDATE
  USING (auth.uid() = user_id);

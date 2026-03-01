-- ===================================================================
-- HOMEPAGE FEATURED ACHIEVEMENTS - COMPLETE SETUP
-- ===================================================================
-- Run this entire script in your Supabase SQL Editor to add the
-- homepage featured achievements functionality
-- ===================================================================

-- STEP 1: Create the table
CREATE TABLE IF NOT EXISTS public.homepage_featured_achievements (
  id uuid primary key default gen_random_uuid(),
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  display_order int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- STEP 2: Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_homepage_featured_unique_achievement 
ON public.homepage_featured_achievements(achievement_id);

CREATE INDEX IF NOT EXISTS idx_homepage_featured_achievements_order 
ON public.homepage_featured_achievements(display_order);

-- STEP 3: Enable Row Level Security
ALTER TABLE public.homepage_featured_achievements ENABLE ROW LEVEL SECURITY;

-- STEP 4: Drop old policies if they exist
DROP POLICY IF EXISTS "public read homepage_featured_achievements" ON public.homepage_featured_achievements;
DROP POLICY IF EXISTS "admin manage homepage_featured_achievements" ON public.homepage_featured_achievements;

-- STEP 5: Create RLS policies
CREATE POLICY "public read homepage_featured_achievements"
ON public.homepage_featured_achievements
FOR SELECT
USING (true);

CREATE POLICY "admin manage homepage_featured_achievements"
ON public.homepage_featured_achievements
FOR ALL
USING (auth.email() = 'jvishula.work@gmail.com')
WITH CHECK (auth.email() = 'jvishula.work@gmail.com');

-- STEP 6: Create trigger for updated_at
DROP TRIGGER IF EXISTS update_homepage_featured_achievements_updated_at ON public.homepage_featured_achievements;
CREATE TRIGGER update_homepage_featured_achievements_updated_at
  BEFORE UPDATE ON public.homepage_featured_achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- STEP 7: Add documentation
COMMENT ON TABLE public.homepage_featured_achievements IS 'Stores up to 3 achievements featured on homepage with custom ordering';

-- ===================================================================
-- VERIFICATION
-- ===================================================================
-- Check if table was created successfully
SELECT 
  'SUCCESS! Table created with ' || count(*) || ' rows.' as status,
  'You can now use the Homepage Achievements tab in the admin panel!' as message
FROM public.homepage_featured_achievements;

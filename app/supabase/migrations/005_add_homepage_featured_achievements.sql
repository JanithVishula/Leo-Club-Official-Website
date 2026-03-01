-- Migration: Add homepage featured achievements table
-- This allows admin to select and reorder achievements for the homepage

-- Create homepage_featured_achievements table
CREATE TABLE IF NOT EXISTS public.homepage_featured_achievements (
  id uuid primary key default gen_random_uuid(),
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  display_order int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create unique constraint (each achievement can only be featured once)
CREATE UNIQUE INDEX IF NOT EXISTS idx_homepage_featured_unique_achievement 
ON public.homepage_featured_achievements(achievement_id);

CREATE INDEX IF NOT EXISTS idx_homepage_featured_achievements_order 
ON public.homepage_featured_achievements(display_order);

-- Enable RLS
ALTER TABLE public.homepage_featured_achievements ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "public read homepage_featured_achievements" ON public.homepage_featured_achievements;
DROP POLICY IF EXISTS "admin manage homepage_featured_achievements" ON public.homepage_featured_achievements;

-- Create RLS policies
CREATE POLICY "public read homepage_featured_achievements"
ON public.homepage_featured_achievements
FOR SELECT
USING (true);

CREATE POLICY "admin manage homepage_featured_achievements"
ON public.homepage_featured_achievements
FOR ALL
USING (auth.email() = 'jvishula.work@gmail.com')
WITH CHECK (auth.email() = 'jvishula.work@gmail.com');

-- Trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_homepage_featured_achievements_updated_at ON public.homepage_featured_achievements;
CREATE TRIGGER update_homepage_featured_achievements_updated_at
  BEFORE UPDATE ON public.homepage_featured_achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE public.homepage_featured_achievements IS 'Stores up to 3 achievements featured on homepage with custom ordering';

-- Done!
SELECT 'Migration completed! Homepage featured achievements table created.' as status;

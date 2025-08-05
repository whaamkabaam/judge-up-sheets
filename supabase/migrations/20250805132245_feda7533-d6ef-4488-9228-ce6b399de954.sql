-- Fix RLS policies to allow project insertion
DROP POLICY IF EXISTS "Allow public insert to projects" ON public.projects;
CREATE POLICY "Allow public insert to projects" 
  ON public.projects 
  FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update to projects" ON public.projects;
CREATE POLICY "Allow public update to projects" 
  ON public.projects 
  FOR UPDATE 
  USING (true);
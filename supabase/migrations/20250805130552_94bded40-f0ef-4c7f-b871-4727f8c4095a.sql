-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  team_members JSONB DEFAULT '[]'::jsonb,
  github_url TEXT,
  demo_url TEXT,
  video_url TEXT,
  google_sheet_row_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create judges table
CREATE TABLE public.judges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  auth_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  invitation_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(event_id, email)
);

-- Create criteria table for custom rubrics
CREATE TABLE public.criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  weight DECIMAL(3,2) NOT NULL DEFAULT 1.0,
  max_score INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create scores table
CREATE TABLE public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  judge_id UUID REFERENCES public.judges(id) ON DELETE CASCADE,
  criterion_id UUID REFERENCES public.criteria(id) ON DELETE CASCADE,
  score_value DECIMAL(4,2) NOT NULL,
  comments TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(project_id, judge_id, criterion_id)
);

-- Create community votes table
CREATE TABLE public.community_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to projects and voting
CREATE POLICY "Allow public read access to events" 
  ON public.events FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read access to projects" 
  ON public.projects FOR SELECT USING (true);

CREATE POLICY "Allow public read access to criteria" 
  ON public.criteria FOR SELECT USING (true);

CREATE POLICY "Allow public insert to community votes" 
  ON public.community_votes FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to community votes for counting" 
  ON public.community_votes FOR SELECT USING (true);

-- Create policies for judges
CREATE POLICY "Allow judges to read their assignments" 
  ON public.judges FOR SELECT USING (true);

CREATE POLICY "Allow judges to read scores" 
  ON public.scores FOR SELECT USING (true);

CREATE POLICY "Allow judges to insert scores" 
  ON public.scores FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow judges to update scores" 
  ON public.scores FOR UPDATE USING (true);

-- Create indexes for performance
CREATE INDEX idx_projects_event_id ON public.projects(event_id);
CREATE INDEX idx_scores_project_id ON public.scores(project_id);
CREATE INDEX idx_scores_judge_id ON public.scores(judge_id);
CREATE INDEX idx_community_votes_project_id ON public.community_votes(project_id);
CREATE INDEX idx_community_votes_ip_timestamp ON public.community_votes(ip_address, timestamp);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
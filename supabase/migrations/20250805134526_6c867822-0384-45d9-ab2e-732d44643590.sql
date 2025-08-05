-- Create default event and criteria for JudgeUp
INSERT INTO public.events (id, name, description, start_date, end_date, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'JudgeUp Hackathon',
  'Default hackathon event for JudgeUp platform',
  now(),
  now() + interval '30 days',
  true,
  now(),
  now()
);

-- Get the event ID for criteria
DO $$
DECLARE
    event_uuid uuid;
BEGIN
    SELECT id INTO event_uuid FROM public.events WHERE name = 'JudgeUp Hackathon' LIMIT 1;
    
    -- Insert default judging criteria
    INSERT INTO public.criteria (id, event_id, name, description, weight, max_score, created_at) VALUES
    (gen_random_uuid(), event_uuid, 'Technical Innovation', 'Evaluate the technical complexity and innovation of the solution', 30, 10, now()),
    (gen_random_uuid(), event_uuid, 'Business Impact', 'Assess the potential business value and market impact', 25, 10, now()),
    (gen_random_uuid(), event_uuid, 'User Experience', 'Rate the design and usability of the solution', 25, 10, now()),
    (gen_random_uuid(), event_uuid, 'Presentation', 'Evaluate the quality of the presentation and demo', 20, 10, now());
END $$;
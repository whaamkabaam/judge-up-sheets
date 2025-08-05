-- Insert sample data for JudgeUp demo
INSERT INTO public.events (id, name, description, start_date, end_date, is_active) VALUES 
('11111111-1111-1111-1111-111111111111', 'SummerUp 2025', 'Annual summer hackathon focusing on sustainable technology solutions', '2025-08-01 00:00:00+00', '2025-08-03 23:59:59+00', true);

INSERT INTO public.projects (id, event_id, name, description, team_members, github_url, demo_url, video_url) VALUES 
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'EcoTrack', 'A mobile app that gamifies sustainable living by tracking daily eco-friendly activities and rewarding users with points and achievements.', '["Sarah Chen", "Marcus Rodriguez", "Aisha Patel"]', 'https://github.com/example/ecotrack', 'https://ecotrack-demo.vercel.app', 'https://youtube.com/watch?v=demo1'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'SmartGrid AI', 'An AI-powered energy management system that optimizes renewable energy distribution in smart cities using machine learning algorithms.', '["David Kim", "Elena Volkov", "James O''Connor", "Priya Sharma"]', 'https://github.com/example/smartgrid', 'https://smartgrid-demo.netlify.app', 'https://youtube.com/watch?v=demo2'),
('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'WasteWise', 'A computer vision system that automatically sorts recyclables and provides real-time waste analytics for businesses and municipalities.', '["Alex Thompson", "Maria Santos"]', 'https://github.com/example/wastewise', 'https://wastewise-demo.com', null),
('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'GreenCommute', 'A blockchain-based platform that incentivizes eco-friendly transportation choices by rewarding users with cryptocurrency tokens.', '["Robert Lee", "Nina Kowalski", "Hassan Ahmed"]', 'https://github.com/example/greencommute', null, 'https://youtube.com/watch?v=demo3'),
('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'AquaMonitor', 'IoT sensors and mobile dashboard for real-time water quality monitoring in urban and rural communities.', '["Lisa Zhang", "Carlos Mendez", "Fatima Al-Rashid", "Tom Wilson", "Sophie Laurent"]', 'https://github.com/example/aquamonitor', 'https://aquamonitor-demo.herokuapp.com', 'https://youtube.com/watch?v=demo4');

INSERT INTO public.criteria (id, event_id, name, description, weight, max_score) VALUES 
('77777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'Technical Innovation', 'Novelty and sophistication of the technical solution', 0.40, 10),
('88888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'Environmental Impact', 'Potential positive impact on the environment', 0.30, 10),
('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'Presentation Quality', 'Clarity and effectiveness of the project presentation', 0.20, 10),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Market Viability', 'Commercial potential and business model strength', 0.10, 10);

-- Insert some sample community votes
INSERT INTO public.community_votes (project_id, ip_address, user_agent) VALUES 
('22222222-2222-2222-2222-222222222222', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('22222222-2222-2222-2222-222222222222', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
('33333333-3333-3333-3333-333333333333', '192.168.1.102', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)'),
('44444444-4444-4444-4444-444444444444', '192.168.1.103', 'Mozilla/5.0 (Android 11; Mobile; rv:68.0)'),
('22222222-2222-2222-2222-222222222222', '192.168.1.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('55555555-5555-5555-5555-555555555555', '192.168.1.105', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'),
('33333333-3333-3333-3333-333333333333', '192.168.1.106', 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X)'),
('66666666-6666-6666-6666-666666666666', '192.168.1.107', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
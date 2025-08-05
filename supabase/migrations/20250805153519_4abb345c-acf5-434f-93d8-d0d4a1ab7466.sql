-- Clean up and fix project data
UPDATE projects 
SET 
  name = 'APEX: AI Assessment Platform for Educational Excellence',
  description = 'An AI-powered educational assessment platform that revolutionizes how students learn and teachers evaluate. Features intelligent question generation, real-time analytics, adaptive learning paths, and comprehensive progress tracking.',
  team_members = '["Alex Johnson", "Sarah Chen", "Mike Rodriguez", "Emma Thompson"]'::jsonb
WHERE name = 'APEX: AI Assessment Platform for Educational Excellence' 
  AND description LIKE '%revolutionizes how students learn%';

UPDATE projects 
SET 
  name = 'EcoTrack: Sustainable Lifestyle Companion',
  description = 'A comprehensive environmental impact tracking application that helps users monitor their carbon footprint, discover eco-friendly alternatives, and connect with like-minded individuals for a sustainable future.',
  team_members = '["David Kim", "Lisa Zhang", "Tom Wilson", "Ana Garcia"]'::jsonb
WHERE name = 'EcoTrack: Sustainable Lifestyle Companion' 
  AND description LIKE '%environmental impact tracking%';

UPDATE projects 
SET 
  name = 'HealthHub: Personal Wellness Dashboard',
  description = 'An integrated health management platform that combines fitness tracking, nutrition monitoring, mental health support, and telemedicine features to provide comprehensive wellness solutions.',
  team_members = '["Rachel Park", "James Liu", "Sofia Martinez", "Kevin O''Connor"]'::jsonb
WHERE name = 'HealthHub: Personal Wellness Dashboard' 
  AND description LIKE '%integrated health management%';

UPDATE projects 
SET 
  name = 'CodeMentor: AI-Powered Learning Platform',
  description = 'An intelligent programming education platform that provides personalized coding challenges, real-time feedback, collaborative coding environments, and career guidance for aspiring developers.',
  team_members = '["Alex Wang", "Maria Gonzalez", "John Smith", "Priya Patel"]'::jsonb
WHERE name = 'CodeMentor: AI-Powered Learning Platform' 
  AND description LIKE '%intelligent programming education%';

UPDATE projects 
SET 
  name = 'SmartCity: Urban Planning Assistant',
  description = 'A comprehensive urban planning tool that uses IoT data, traffic analytics, and citizen feedback to optimize city infrastructure, reduce congestion, and improve quality of life for residents.',
  team_members = '["Carlos Rodriguez", "Amy Chen", "Daniel Brown", "Fatima Al-Rashid"]'::jsonb
WHERE name = 'SmartCity: Urban Planning Assistant' 
  AND description LIKE '%comprehensive urban planning%';

-- Delete the malformed entry with very long repetitive description
DELETE FROM projects 
WHERE description LIKE '%Very innovative project that solves real-world problems. Very innovative project that solves real-world problems.%';
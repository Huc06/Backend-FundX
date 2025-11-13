-- Insert or update services
INSERT INTO services (id, name, description, base_cost, category, popular) VALUES
  ('venue-conference-hall', 'Conference Hall', 'Large conference hall with capacity for 200+ people', 500, 'venue', true),
  ('venue-meeting-room', 'Meeting Room', 'Private meeting room for 20-50 people', 150, 'venue', false),
  ('venue-outdoor-space', 'Outdoor Event Space', 'Open-air venue for outdoor events and festivals', 300, 'venue', false),
  ('merch-tshirts', 'Custom T-Shirts', 'Branded t-shirts for attendees (100 units)', 200, 'merchandise', true),
  ('merch-badges', 'Event Badges', 'Custom name badges and lanyards (100 units)', 50, 'merchandise', false),
  ('merch-swag-bags', 'Swag Bags', 'Branded tote bags with promotional items (50 units)', 150, 'merchandise', false),
  ('posm-banners', 'Event Banners', 'Large promotional banners (3 pieces)', 100, 'marketing', true),
  ('posm-flyers', 'Promotional Flyers', 'Printed flyers and brochures (1000 pieces)', 75, 'marketing', false),
  ('posm-signage', 'Directional Signage', 'Wayfinding signs and displays (5 pieces)', 80, 'marketing', false),
  ('posm-social-media', 'Social Media Campaign', 'Professional social media marketing package', 250, 'marketing', false),
  ('food-catering-basic', 'Basic Catering', 'Light refreshments and snacks for 50 people', 300, 'food', true),
  ('food-catering-full', 'Full Meal Catering', 'Complete meal service for 50 people', 600, 'food', false),
  ('equipment-av', 'Audio/Visual Equipment', 'Projector, microphones, and sound system', 200, 'equipment', true),
  ('equipment-stage', 'Stage Setup', 'Professional stage with lighting', 400, 'equipment', false),
  ('equipment-furniture', 'Tables & Chairs', 'Seating arrangement for 100 people', 150, 'equipment', false),
  ('other-photography', 'Professional Photography', 'Full-day event photography service', 300, 'other', false),
  ('other-security', 'Security Services', 'Professional security team (4 hours)', 200, 'other', false),
  ('other-registration', 'Registration Desk Setup', 'Staffed registration desk with materials', 100, 'other', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  base_cost = EXCLUDED.base_cost,
  category = EXCLUDED.category,
  popular = EXCLUDED.popular;

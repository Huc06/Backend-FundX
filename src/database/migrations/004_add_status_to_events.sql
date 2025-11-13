-- Create event_status ENUM type
CREATE TYPE event_status AS ENUM ('pending', 'active', 'completed', 'cancelled');

-- Add status to events table
ALTER TABLE events
ADD COLUMN status event_status NOT NULL DEFAULT 'pending';

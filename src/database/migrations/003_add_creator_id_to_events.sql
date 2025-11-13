-- Add creator_id to events table
ALTER TABLE events
ADD COLUMN creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE;

-- Add index for creator_id on events table
CREATE INDEX ON events (creator_id);

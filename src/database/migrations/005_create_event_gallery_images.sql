-- Create event_gallery_images table
CREATE TABLE event_gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    image_url VARCHAR(2048) NOT NULL,
    is_cover BOOLEAN NOT NULL DEFAULT false
);

-- Add index for event_id on event_gallery_images table
CREATE INDEX ON event_gallery_images (event_id);

-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom ENUM types
CREATE TYPE campaign_status AS ENUM ('pending', 'active', 'successful', 'failed');
CREATE TYPE event_status AS ENUM ('pending', 'active', 'completed', 'cancelled');
CREATE TYPE reward_type AS ENUM ('none', 'token', 'nft');
CREATE TYPE roadmap_phase_state AS ENUM ('done', 'in-progress', 'future');
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Trigger function to automatically update `updated_at` timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Table Definitions

-- users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(66) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    role user_role NOT NULL DEFAULT 'user',
    bio TEXT,
    avatar_url VARCHAR(2048),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- campaigns table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    on_chain_object_id VARCHAR(255) UNIQUE,
    title VARCHAR(255) NOT NULL,
    short_description VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    goal_amount DECIMAL(18, 2) NOT NULL CHECK (goal_amount > 0),
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    amount_raised DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    duration_days INTEGER NOT NULL CHECK (duration_days > 0),
    end_date TIMESTAMPTZ,
    reward_type reward_type NOT NULL DEFAULT 'none',
    status campaign_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- campaign_story_sections table
CREATE TABLE campaign_story_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    display_order INTEGER NOT NULL
);

-- campaign_roadmap_phases table
CREATE TABLE campaign_roadmap_phases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    timeline VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    state roadmap_phase_state NOT NULL,
    display_order INTEGER NOT NULL
);

-- campaign_team_members table
CREATE TABLE campaign_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    contact_info JSONB
);

-- campaign_gallery_images table
CREATE TABLE campaign_gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    image_url VARCHAR(2048) NOT NULL,
    is_cover BOOLEAN NOT NULL DEFAULT false
);

-- event_gallery_images table
CREATE TABLE event_gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    image_url VARCHAR(2048) NOT NULL,
    is_cover BOOLEAN NOT NULL DEFAULT false
);

-- events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    funding_deadline TIMESTAMPTZ NOT NULL,
    timezone VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    visibility VARCHAR(50) NOT NULL DEFAULT 'public',
    target_amount DECIMAL(18, 2) NOT NULL,
    reward_type reward_type NOT NULL DEFAULT 'none',
    capacity INTEGER,
    ticket_price DECIMAL(10, 2) DEFAULT 0.00,
    status event_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- milestones table
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    funding_goal DECIMAL(18, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (campaign_id IS NOT NULL OR event_id IS NOT NULL)
);

-- contributions table
CREATE TABLE contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    amount DECIMAL(18, 2) NOT NULL,
    transaction_hash VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (campaign_id IS NOT NULL OR event_id IS NOT NULL)
);

-- services table
CREATE TABLE services (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_cost DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    popular BOOLEAN DEFAULT false
);

-- event_services table
CREATE TABLE event_services (
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    service_id VARCHAR(255) NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, service_id)
);

-- Triggers for `updated_at`
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON campaigns
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON milestones
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Indexing Strategy
-- Foreign Keys
CREATE INDEX ON campaigns (creator_id);
CREATE INDEX ON events (creator_id);
CREATE INDEX ON campaign_story_sections (campaign_id);
CREATE INDEX ON campaign_roadmap_phases (campaign_id);
CREATE INDEX ON campaign_team_members (campaign_id);
CREATE INDEX ON campaign_gallery_images (campaign_id);
CREATE INDEX ON event_gallery_images (event_id);
CREATE INDEX ON milestones (campaign_id);
CREATE INDEX ON milestones (event_id);
CREATE INDEX ON contributions (user_id);
CREATE INDEX ON contributions (campaign_id);
CREATE INDEX ON contributions (event_id);
CREATE INDEX ON event_services (event_id);
CREATE INDEX ON event_services (service_id);

-- Frequently Queried Columns
CREATE INDEX ON users (wallet_address);
CREATE INDEX ON campaigns (status);
CREATE INDEX ON campaigns (category);

-- GIN Indexes for Full-Text Search (example)
CREATE INDEX campaigns_title_gin ON campaigns USING gin(to_tsvector('english', title));
CREATE INDEX campaigns_description_gin ON campaigns USING gin(to_tsvector('english', short_description));

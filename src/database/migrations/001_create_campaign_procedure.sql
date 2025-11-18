
CREATE OR REPLACE FUNCTION create_campaign_with_details(
    p_creator_address VARCHAR,
    p_on_chain_object_id VARCHAR,
    p_title VARCHAR,
    p_short_description VARCHAR,
    p_category VARCHAR,
    p_goal_amount DECIMAL,
    p_currency VARCHAR,
    p_duration_days INTEGER,
    p_reward_type reward_type,
    p_story_sections JSONB,
    p_roadmap_phases JSONB,
    p_team_members JSONB,
    p_gallery_images JSONB
)
RETURNS UUID AS $$
DECLARE
    v_campaign_id UUID;
    v_end_date TIMESTAMPTZ;
    story_section RECORD;
    roadmap_phase RECORD;
    team_member RECORD;
    gallery_image RECORD;
BEGIN
    -- Calculate end_date
    v_end_date := NOW() + (p_duration_days * INTERVAL '1 day');

    -- Insert into campaigns table
    INSERT INTO campaigns (
        creator_address, on_chain_object_id, title, short_description, category,
        goal_amount, currency, duration_days, end_date, reward_type, status
    ) VALUES (
        p_creator_address, p_on_chain_object_id, p_title, p_short_description, p_category,
        p_goal_amount, p_currency, p_duration_days, v_end_date, p_reward_type, 'pending'
    ) RETURNING id INTO v_campaign_id;

    -- Insert story sections
    FOR story_section IN SELECT * FROM jsonb_to_recordset(p_story_sections) AS x(title VARCHAR, content TEXT, display_order INTEGER)
    LOOP
        INSERT INTO campaign_story_sections (campaign_id, title, content, display_order)
        VALUES (v_campaign_id, story_section.title, story_section.content, story_section.display_order);
    END LOOP;

    -- Insert roadmap phases
    FOR roadmap_phase IN SELECT * FROM jsonb_to_recordset(p_roadmap_phases) AS x(title VARCHAR, timeline VARCHAR, description TEXT, state roadmap_phase_state, display_order INTEGER)
    LOOP
        INSERT INTO campaign_roadmap_phases (campaign_id, title, timeline, description, state, display_order)
        VALUES (v_campaign_id, roadmap_phase.title, roadmap_phase.timeline, roadmap_phase.description, roadmap_phase.state, roadmap_phase.display_order);
    END LOOP;

    -- Insert team members
    FOR team_member IN SELECT * FROM jsonb_to_recordset(p_team_members) AS x(name VARCHAR, role VARCHAR, contact_info JSONB)
    LOOP
        INSERT INTO campaign_team_members (campaign_id, name, role, contact_info)
        VALUES (v_campaign_id, team_member.name, team_member.role, team_member.contact_info);
    END LOOP;

    -- Insert gallery images
    FOR gallery_image IN SELECT * FROM jsonb_to_recordset(p_gallery_images) AS x(image_url VARCHAR, is_cover BOOLEAN)
    LOOP
        INSERT INTO campaign_gallery_images (campaign_id, image_url, is_cover)
        VALUES (v_campaign_id, gallery_image.image_url, gallery_image.is_cover);
    END LOOP;

    RETURN v_campaign_id;
END;
$$ LANGUAGE plpgsql;

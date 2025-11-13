CREATE OR REPLACE FUNCTION create_event_with_details(
    p_creator_id UUID,
    p_name VARCHAR,
    p_description TEXT,
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ,
    p_funding_deadline TIMESTAMPTZ,
    p_timezone VARCHAR,
    p_location VARCHAR,
    p_visibility VARCHAR,
    p_target_amount DECIMAL,
    p_reward_type reward_type,
    p_capacity INTEGER,
    p_ticket_price DECIMAL,
    p_milestones JSONB,
    p_services JSONB,
    p_gallery_images JSONB
)
RETURNS UUID AS $$
DECLARE
    v_event_id UUID;
    milestone RECORD;
    service_id_text TEXT;
    gallery_image RECORD;
BEGIN
    -- Insert into events table
    INSERT INTO events (
        creator_id, name, description, start_time, end_time, funding_deadline,
        timezone, location, visibility, target_amount, reward_type, capacity,
        ticket_price, status
    ) VALUES (
        p_creator_id, p_name, p_description, p_start_time, p_end_time, p_funding_deadline,
        p_timezone, p_location, p_visibility, p_target_amount, p_reward_type, p_capacity,
        p_ticket_price, 'pending'
    ) RETURNING id INTO v_event_id;

    -- Insert milestones
    FOR milestone IN SELECT * FROM jsonb_to_recordset(p_milestones) AS x(title VARCHAR, description TEXT, funding_goal DECIMAL, status VARCHAR)
    LOOP
        INSERT INTO milestones (event_id, title, description, funding_goal, status)
        VALUES (v_event_id, milestone.title, milestone.description, milestone.funding_goal, milestone.status);
    END LOOP;

    -- Insert event services
    FOR service_id_text IN SELECT * FROM jsonb_array_elements_text(p_services)
    LOOP
        INSERT INTO event_services (event_id, service_id)
        VALUES (v_event_id, service_id_text);
    END LOOP;

    -- Insert gallery images
    FOR gallery_image IN SELECT * FROM jsonb_to_recordset(p_gallery_images) AS x(image_url VARCHAR, is_cover BOOLEAN)
    LOOP
        INSERT INTO event_gallery_images (event_id, image_url, is_cover)
        VALUES (v_event_id, gallery_image.image_url, gallery_image.is_cover);
    END LOOP;

    RETURN v_event_id;
END;
$$ LANGUAGE plpgsql;

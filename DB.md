# Database Schema: `overguild`

This document outlines a proposed database schema for the OverGuild application, optimized for PostgreSQL. The schema is designed to support campaigns, milestones, events, and user profiles, incorporating advanced database features for robustness and performance.

## Schema Overview

The core entities are:
*   **Users**: Individuals who can create and back campaigns.
*   **Campaigns**: The central projects seeking funding, composed of stories, roadmaps, and teams.
*   **Events**: Crowd-funded events with ticketing, capacity management, and service planning.
*   **Milestones**: Specific, fundable goals within a campaign or event.
*   **Contributions**: Pledges of funds from users.
*   **Services**: A catalog of services that can be budgeted for events.

---

## PostgreSQL Enhancements

To make the database more robust, performant, and maintainable, the following PostgreSQL-specific features are used in this schema:

1.  **UUID for Primary Keys**: Instead of `SERIAL`, `UUID` is used for primary keys. This prevents ID enumeration attacks and simplifies merging data from different databases. The `pcrpyto` extension is used to generate UUIDs.
    ```sql
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    ```

2.  **Custom ENUM Types**: For columns with a fixed set of possible values (like `status` or `reward_type`), custom `ENUM` types are created. This provides better data integrity than `VARCHAR` and is more efficient.
    ```sql
    CREATE TYPE campaign_status AS ENUM ('pending', 'active', 'successful', 'failed');
    CREATE TYPE reward_type AS ENUM ('none', 'token', 'nft');
    CREATE TYPE roadmap_phase_state AS ENUM ('done', 'in-progress', 'future');
    CREATE TYPE user_role AS ENUM ('admin', 'user');
    ```
    
    3.  **Automatic `updated_at` Timestamps**: A trigger function automatically updates the `updated_at` column on any row modification. This removes the burden from the application layer and ensures the timestamp is always current.
        ```sql
        CREATE OR REPLACE FUNCTION trigger_set_timestamp()
        RETURNS TRIGGER AS $
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $ LANGUAGE plpgsql;
        ```
        This trigger would then be applied to each table, for example:
        ```sql
        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON campaigns
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();
        ```
    
    4.  **Cascading Deletes**: Foreign key constraints use `ON DELETE CASCADE`. This ensures that when a parent record is deleted (e.g., a `campaign`), all its dependent child records (e.g., `milestones`, `story_sections`) are automatically deleted, maintaining data integrity.
    
    5.  **Indexing Strategy**: Indexes are crucial for query performance. In addition to the default `PRIMARY KEY` indexes, the following should be created:
        *   **Foreign Keys**: All foreign key columns (e.g., `creator_id`, `campaign_id`) should be indexed.
        *   **Frequently Queried Columns**: Columns used in `WHERE` clauses, such as `status`, `category`, and `wallet_address`, should be indexed.
        *   **GIN Indexes for Full-Text Search**: For searching within `TEXT` fields like `title` and `description`, a GIN index is recommended.
    
    ---
    
    ## Table Definitions
    
    ### `users`
    
    | Column | Type | Constraints | Description |
    | :--- | :--- | :--- | :--- |
    | `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique identifier for the user. |
    | `wallet_address` | `VARCHAR(66)` | `UNIQUE NOT NULL` | The user's public blockchain wallet address. |
    | `username` | `VARCHAR(255)` | `UNIQUE` | A user-chosen display name. |
    | `email` | `VARCHAR(255)` | `UNIQUE` | The user's email address. |
    | `role` | `user_role` | `NOT NULL DEFAULT 'user'` | The role of the user (e.g., 'admin', 'user'). |
    | `bio` | `TEXT` | | A short user biography. |
| `avatar_url` | `VARCHAR(2048)` | | URL to the user's profile picture. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Timestamp of user creation. |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Timestamp of last user update. |

### `campaigns`

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique identifier for the campaign. |
| `creator_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | The user who created the campaign. |
| `on_chain_object_id` | `VARCHAR(255)` | `UNIQUE` | The object ID on the Sui blockchain. |
| `title` | `VARCHAR(255)` | `NOT NULL` | The title of the campaign. |
| `short_description`| `VARCHAR(255)` | | A brief summary for campaign cards. |
| `category` | `VARCHAR(100)` | `NOT NULL` | The category of the campaign. |
| `goal_amount` | `DECIMAL(18, 2)`| `NOT NULL CHECK (goal_amount > 0)` | The funding goal. |
| `currency` | `VARCHAR(10)` | `NOT NULL DEFAULT 'USD'` | The currency of the funding goal. |
| `amount_raised` | `DECIMAL(18, 2)`| `NOT NULL DEFAULT 0.00` | The current amount of funds raised. |
| `duration_days` | `INTEGER` | `NOT NULL CHECK (duration_days > 0)` | The number of days the campaign will run. |
| `end_date` | `TIMESTAMPTZ` | | The calculated end date of the campaign. |
| `reward_type` | `reward_type` | `NOT NULL DEFAULT 'none'` | Type of reward offered. |
| `status` | `campaign_status`| `NOT NULL DEFAULT 'pending'` | The current status of the campaign. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Timestamp of campaign creation. |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Timestamp of last campaign update. |

### `campaign_story_sections`

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique identifier for the story section. |
| `campaign_id` | `UUID` | `NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE` | The campaign this section belongs to. |
| `title` | `VARCHAR(255)` | `NOT NULL` | The title of the section. |
| `content` | `TEXT` | `NOT NULL` | The content of the section. |
| `display_order` | `INTEGER` | `NOT NULL` | The order in which to display the sections. |

### `campaign_roadmap_phases`

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique identifier for the roadmap phase. |
| `campaign_id` | `UUID` | `NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE` | The campaign this phase belongs to. |
| `title` | `VARCHAR(255)` | `NOT NULL` | The title of the phase. |
| `timeline` | `VARCHAR(100)` | `NOT NULL` | The timeline for this phase (e.g., "Q1 2024"). |
| `description` | `TEXT` | `NOT NULL` | A description of what will be accomplished. |
| `state` | `roadmap_phase_state` | `NOT NULL` | The current state of the phase. |
| `display_order` | `INTEGER` | `NOT NULL` | The order in which to display the phases. |

### `campaign_team_members`

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique identifier for the team member entry. |
| `campaign_id` | `UUID` | `NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE` | The campaign this team member is associated with. |
| `name` | `VARCHAR(255)` | `NOT NULL` | The name of the team member. |
| `role` | `VARCHAR(255)` | `NOT NULL` | The role of the team member. |
| `contact_info` | `JSONB` | | JSON object for email, twitter, telegram, etc. |

### `campaign_gallery_images`

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique identifier for the gallery image. |
| `campaign_id` | `UUID` | `NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE` | The campaign this image belongs to. |
| `image_url` | `VARCHAR(2048)`| `NOT NULL` | URL of the uploaded image. |
| `is_cover` | `BOOLEAN` | `NOT NULL DEFAULT false` | Whether this is the main cover image. |

### `events`

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique identifier for the event. |
| `name` | `VARCHAR(255)` | `NOT NULL` | The name of the event. |
| `description` | `TEXT` | | A detailed description of the event. |
| `start_time` | `TIMESTAMPTZ` | `NOT NULL` | The start date and time of the event. |
| `end_time` | `TIMESTAMPTZ` | `NOT NULL` | The end date and time of the event. |
| `funding_deadline`| `TIMESTAMPTZ` | `NOT NULL` | Deadline for reaching the funding goal. |
| `timezone` | `VARCHAR(100)` | `NOT NULL` | The timezone of the event. |
| `location` | `VARCHAR(255)` | | The physical or virtual location of the event. |
| `visibility` | `VARCHAR(50)` | `NOT NULL DEFAULT 'public'` | Visibility of the event (public, private). |
| `target_amount` | `DECIMAL(18, 2)`| `NOT NULL` | The total funding target for the event. |
| `reward_type` | `reward_type` | `NOT NULL DEFAULT 'none'` | Type of reward for backers. |
| `capacity` | `INTEGER` | | Maximum number of attendees. |
| `ticket_price` | `DECIMAL(10, 2)`| `DEFAULT 0.00` | The price of a ticket if it's a paid event. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Timestamp of event creation. |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Timestamp of last event update. |

### `milestones`

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique identifier for the milestone. |
| `campaign_id` | `UUID` | `REFERENCES campaigns(id) ON DELETE CASCADE` | The campaign this milestone belongs to (if any). |
| `event_id` | `UUID` | `REFERENCES events(id) ON DELETE CASCADE` | The event this milestone belongs to (if any). |
| `title` | `VARCHAR(255)` | `NOT NULL` | The title of the milestone. |
| `description` | `TEXT` | | A description of what this milestone entails. |
| `funding_goal` | `DECIMAL(18, 2)` | `NOT NULL` | The funding amount required for this milestone. |
| `status` | `VARCHAR(50)` | `NOT NULL DEFAULT 'pending'` | The status of the milestone. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Timestamp of milestone creation. |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Timestamp of last milestone update. |
| | | `CHECK (campaign_id IS NOT NULL OR event_id IS NOT NULL)` | |

### `contributions`

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique identifier for the contribution. |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id)` | The user who made the contribution. |
| `campaign_id` | `UUID` | `REFERENCES campaigns(id) ON DELETE CASCADE` | The campaign the contribution was made to (if any). |
| `event_id` | `UUID` | `REFERENCES events(id) ON DELETE CASCADE` | The event the contribution was made to (if any). |
| `amount` | `DECIMAL(18, 2)` | `NOT NULL` | The amount of the contribution. |
| `transaction_hash` | `VARCHAR(255)` | `UNIQUE NOT NULL` | The blockchain transaction hash. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Timestamp of when the contribution was made. |
| | | `CHECK (campaign_id IS NOT NULL OR event_id IS NOT NULL)` | |

### `services`

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique identifier for the service. |
| `name` | `VARCHAR(255)` | `NOT NULL` | The name of the service. |
| `description` | `TEXT` | | A description of the service. |
| `cost` | `DECIMAL(10, 2)`| `NOT NULL` | The base cost of the service. |

### `event_services`

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `event_id` | `UUID` | `NOT NULL REFERENCES events(id) ON DELETE CASCADE` | The event requiring the service. |
| `service_id` | `UUID` | `NOT NULL REFERENCES services(id) ON DELETE CASCADE` | The service being used. |
| | | `PRIMARY KEY (event_id, service_id)` | |
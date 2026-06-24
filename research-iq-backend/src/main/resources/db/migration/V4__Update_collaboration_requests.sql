ALTER TABLE collaboration_requests
    ADD COLUMN IF NOT EXISTS request_type VARCHAR(20) NOT NULL DEFAULT 'COLLABORATION',
    ADD COLUMN IF NOT EXISTS research_id UUID,
    ADD COLUMN IF NOT EXISTS proposed_amount NUMERIC(15, 2),
    ALTER COLUMN collaboration_type DROP NOT NULL,
    ALTER COLUMN timeline_months DROP NOT NULL;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS department VARCHAR(120),
    ADD COLUMN IF NOT EXISTS expertise_keywords TEXT;

CREATE TABLE IF NOT EXISTS collaboration_requests (
    id UUID PRIMARY KEY,
    from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    collaboration_type VARCHAR(120) NOT NULL,
    timeline_months INT NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_collaboration_requests_from_user_id
    ON collaboration_requests(from_user_id);

CREATE INDEX IF NOT EXISTS idx_collaboration_requests_to_user_id
    ON collaboration_requests(to_user_id);

CREATE INDEX IF NOT EXISTS idx_collaboration_requests_status
    ON collaboration_requests(status);
CREATE TABLE IF NOT EXISTS funder_interests (
    id UUID PRIMARY KEY,
    funder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    research_id UUID NOT NULL REFERENCES research(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_funder_interest UNIQUE (funder_id, research_id)
);

CREATE INDEX IF NOT EXISTS idx_funder_interests_funder_id ON funder_interests(funder_id);
CREATE INDEX IF NOT EXISTS idx_funder_interests_research_id ON funder_interests(research_id);

CREATE TABLE IF NOT EXISTS funder_rfps (
    id UUID PRIMARY KEY,
    funder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    summary TEXT NOT NULL,
    amount_range VARCHAR(100),
    areas VARCHAR(100),
    deadline DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_funder_rfps_funder_id ON funder_rfps(funder_id);
CREATE INDEX IF NOT EXISTS idx_funder_rfps_status ON funder_rfps(status);

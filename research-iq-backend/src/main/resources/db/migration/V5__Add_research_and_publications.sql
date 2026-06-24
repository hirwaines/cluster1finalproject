CREATE TABLE IF NOT EXISTS research (
    id UUID PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    abstract_text TEXT NOT NULL,
    authors TEXT NOT NULL,
    field VARCHAR(100) NOT NULL,
    keywords TEXT,
    doi VARCHAR(200),
    publication_date DATE,
    researcher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    funding_status VARCHAR(20),
    funding_amount_needed NUMERIC(15, 2),
    cover_image VARCHAR(500),
    attachment_url VARCHAR(500),
    attachment_label VARCHAR(200),
    citation_count INT NOT NULL DEFAULT 0,
    like_count INT NOT NULL DEFAULT 0,
    share_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_research_researcher_id ON research(researcher_id);
CREATE INDEX IF NOT EXISTS idx_research_funding_status ON research(funding_status);
CREATE INDEX IF NOT EXISTS idx_research_field ON research(field);
CREATE INDEX IF NOT EXISTS idx_research_created_at ON research(created_at DESC);

CREATE TABLE IF NOT EXISTS pending_publications (
    id UUID PRIMARY KEY,
    researcher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    abstract_text TEXT NOT NULL,
    authors TEXT NOT NULL,
    field VARCHAR(100) NOT NULL,
    doi VARCHAR(200),
    funding_status VARCHAR(20),
    funding_amount_needed NUMERIC(15, 2),
    cover_image VARCHAR(500),
    attachment_url VARCHAR(500),
    attachment_label VARCHAR(200),
    suggested_keywords TEXT,
    rejection_reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    submitted_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pending_publications_researcher_id ON pending_publications(researcher_id);
CREATE INDEX IF NOT EXISTS idx_pending_publications_status ON pending_publications(status);

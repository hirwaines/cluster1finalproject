ALTER TABLE users
    ADD COLUMN IF NOT EXISTS openalex_publications TEXT;

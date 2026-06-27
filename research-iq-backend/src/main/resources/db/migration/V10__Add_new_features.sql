-- V10__Add_new_features.sql
-- Add new tables for Reports, Dashboards, Data Integration, and Collaboration Network

-- CollaborationNetwork table
CREATE TABLE IF NOT EXISTS collaboration_network (
    id UUID PRIMARY KEY,
    researcher1_id UUID NOT NULL,
    researcher2_id UUID NOT NULL,
    co_authorship_count INTEGER NOT NULL,
    shared_publications TEXT,
    degree_centrality DOUBLE PRECISION NOT NULL,
    betweenness_centrality DOUBLE PRECISION NOT NULL,
    clustering_coefficient DOUBLE PRECISION NOT NULL,
    shared_keywords TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (researcher1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (researcher2_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_collaboration_network_researcher1 ON collaboration_network(researcher1_id);
CREATE INDEX idx_collaboration_network_researcher2 ON collaboration_network(researcher2_id);

-- Report table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    created_by_id UUID NOT NULL,
    schedule VARCHAR(50) NOT NULL,
    format VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    filters TEXT,
    sections TEXT,
    recipients TEXT,
    next_run_date TIMESTAMP,
    last_generated_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_report_created_by ON reports(created_by_id);
CREATE INDEX idx_report_status ON reports(status);

-- ReportData table
CREATE TABLE IF NOT EXISTS report_data (
    id UUID PRIMARY KEY,
    report_id UUID NOT NULL,
    generated_by_id UUID NOT NULL,
    data TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    FOREIGN KEY (generated_by_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_report_data_report ON report_data(report_id);
CREATE INDEX idx_report_data_generated_by ON report_data(generated_by_id);

-- Dashboard table
CREATE TABLE IF NOT EXISTS dashboards (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    widgets TEXT,
    layout VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_dashboard_user ON dashboards(user_id);
CREATE INDEX idx_dashboard_is_default ON dashboards(is_default);

-- DashboardWidget table
CREATE TABLE IF NOT EXISTS dashboard_widgets (
    id UUID PRIMARY KEY,
    dashboard_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    data_source VARCHAR(255) NOT NULL,
    position INTEGER NOT NULL,
    size VARCHAR(50) NOT NULL,
    config TEXT,
    refresh_interval INTEGER,
    display_order INTEGER NOT NULL,
    FOREIGN KEY (dashboard_id) REFERENCES dashboards(id) ON DELETE CASCADE
);

CREATE INDEX idx_dashboard_widget_dashboard ON dashboard_widgets(dashboard_id);

-- DataSourceConfig table
CREATE TABLE IF NOT EXISTS data_source_config (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    endpoint TEXT,
    api_key TEXT,
    status VARCHAR(50) NOT NULL,
    last_sync TIMESTAMP,
    records_indexed BIGINT NOT NULL DEFAULT 0,
    sync_frequency VARCHAR(50) NOT NULL,
    field_mapping TEXT,
    filters TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_data_source_type ON data_source_config(type);
CREATE INDEX idx_data_source_status ON data_source_config(status);

-- PublicationImport table
CREATE TABLE IF NOT EXISTS publication_imports (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    total_records INTEGER NOT NULL DEFAULT 0,
    successful_records INTEGER NOT NULL DEFAULT 0,
    failed_records INTEGER NOT NULL DEFAULT 0,
    error_details TEXT,
    mapping_config TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_publication_import_user ON publication_imports(user_id);
CREATE INDEX idx_publication_import_status ON publication_imports(status);

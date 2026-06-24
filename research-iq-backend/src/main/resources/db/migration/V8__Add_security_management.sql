CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    resource_id VARCHAR(100),
    changes TEXT,
    ip_address VARCHAR(60),
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    login_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiry_time TIMESTAMPTZ,
    ip_address VARCHAR(60),
    device_info VARCHAR(300),
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(user_id, active);

CREATE TABLE IF NOT EXISTS user_permissions (
    id UUID PRIMARY KEY,
    role VARCHAR(20) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    actions TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_role_resource UNIQUE (role, resource)
);

CREATE INDEX IF NOT EXISTS idx_user_permissions_role ON user_permissions(role);

CREATE TABLE IF NOT EXISTS security_settings (
    id UUID PRIMARY KEY,
    mfa_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    mfa_type VARCHAR(30),
    password_expire_days INT,
    session_timeout_minutes INT,
    ip_whitelist TEXT,
    login_attempt_limit INT,
    data_encryption BOOLEAN NOT NULL DEFAULT TRUE,
    audit_logging_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

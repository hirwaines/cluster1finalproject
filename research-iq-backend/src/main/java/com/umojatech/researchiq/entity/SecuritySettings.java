package com.umojatech.researchiq.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

/**
 * Global security configuration. Maintained as a single row (the org-wide settings panel).
 */
@Entity
@Table(name = "security_settings")
@Getter
@Setter
public class SecuritySettings {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "mfa_enabled", nullable = false)
    private boolean mfaEnabled = true;

    @Column(name = "mfa_type", length = 30)
    private String mfaType = "OTP";

    @Column(name = "password_expire_days")
    private Integer passwordExpireDays;

    @Column(name = "session_timeout_minutes")
    private Integer sessionTimeoutMinutes;

    @Column(name = "ip_whitelist", columnDefinition = "text")
    private String ipWhitelist;

    @Column(name = "login_attempt_limit")
    private Integer loginAttemptLimit;

    @Column(name = "data_encryption", nullable = false)
    private boolean dataEncryption = true;

    @Column(name = "audit_logging_enabled", nullable = false)
    private boolean auditLoggingEnabled = true;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}

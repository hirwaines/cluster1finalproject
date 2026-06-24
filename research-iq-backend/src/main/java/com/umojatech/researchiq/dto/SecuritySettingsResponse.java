package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
@Schema(name = "SecuritySettingsResponse", description = "Global security settings")
public class SecuritySettingsResponse {

    private String id;
    private boolean mfaEnabled;
    private String mfaType;
    private Integer passwordExpireDays;
    private Integer sessionTimeoutMinutes;
    private String ipWhitelist;
    private Integer loginAttemptLimit;
    private boolean dataEncryption;
    private boolean auditLoggingEnabled;
    private Instant updatedAt;
}

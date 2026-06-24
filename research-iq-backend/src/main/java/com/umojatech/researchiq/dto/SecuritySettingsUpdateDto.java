package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(name = "SecuritySettingsUpdateDto", description = "Partial update of global security settings (only non-null fields are applied)")
public class SecuritySettingsUpdateDto {

    private Boolean mfaEnabled;
    private String mfaType;
    private Integer passwordExpireDays;
    private Integer sessionTimeoutMinutes;
    private String ipWhitelist;
    private Integer loginAttemptLimit;
    private Boolean dataEncryption;
    private Boolean auditLoggingEnabled;
}

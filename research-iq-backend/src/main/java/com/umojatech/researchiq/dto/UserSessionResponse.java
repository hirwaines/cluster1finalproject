package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
@Schema(name = "UserSessionResponse", description = "User session record")
public class UserSessionResponse {

    private String id;
    private String userId;
    private String userName;
    private Instant loginTime;
    private Instant lastActivity;
    private Instant expiryTime;
    private String ipAddress;
    private String deviceInfo;
    private boolean active;
}

package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
@Schema(name = "AuditLogResponse", description = "Audit log entry")
public class AuditLogResponse {

    private String id;
    private String userId;
    private String userName;
    private String action;
    private String resource;
    private String resourceId;
    private String changes;
    private String ipAddress;
    private String status;
    private Instant timestamp;
}

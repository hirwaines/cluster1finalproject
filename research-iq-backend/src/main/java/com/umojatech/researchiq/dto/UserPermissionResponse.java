package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@Schema(name = "UserPermissionResponse", description = "Role permission entry")
public class UserPermissionResponse {

    private String id;
    private String role;
    private String resource;
    private List<String> actions;
    private Instant updatedAt;
}

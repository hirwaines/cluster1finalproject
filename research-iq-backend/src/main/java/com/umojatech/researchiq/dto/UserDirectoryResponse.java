package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(name = "UserDirectoryResponse", description = "User directory entry")
public class UserDirectoryResponse {

    private String id;
    private String name;
    private String email;
    private String role;
    private String status;
    private String department;
    private String institution;
    private String organization;
}

package com.umojatech.researchiq.dto;

import lombok.Builder;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Builder
@Schema(name = "AuthResponse", description = "Response object containing JWT token and user details")
public class AuthResponse {

    @Schema(description = "JWT authentication token", example = "eyJhbGciOiJIUzI1NiJ9...")
    private String token;

    @Schema(description = "Details of the authenticated user")
    private UserDto user;

    @Schema(description = "True when admin MFA is required. When true, token and user are null; "
            + "resubmit the same email/password plus the mfaCode to complete login.", example = "false")
    private Boolean mfaRequired;

    @Data
    @Builder
    @Schema(name = "UserDto", description = "Brief details about the user")
    public static class UserDto {
        @Schema(description = "User's unique identifier", example = "123e4567-e89b-12d3-a456-426614174000")
        private String id;

        @Schema(description = "User's full name", example = "John Doe")
        private String name;

        @Schema(description = "User's email address", example = "john.doe@example.com")
        private String email;

        @Schema(description = "User's assigned role", example = "RESEARCHER")
        private String role;
    }
}

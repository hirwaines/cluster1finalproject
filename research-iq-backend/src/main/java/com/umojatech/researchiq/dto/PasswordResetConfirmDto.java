package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@Schema(name = "PasswordResetConfirmDto", description = "Confirm a password reset with OTP and new password")
public class PasswordResetConfirmDto {

    @NotBlank
    @Email
    @Schema(description = "Registered email address", example = "jane.smith@university.edu")
    private String email;

    @NotBlank
    @Schema(description = "6-digit OTP sent to email", example = "123456")
    private String otp;

    @NotBlank
    @Size(min = 8, max = 72)
    @Schema(description = "New password (8-72 chars)", example = "NewSecurePass456!")
    private String newPassword;
}

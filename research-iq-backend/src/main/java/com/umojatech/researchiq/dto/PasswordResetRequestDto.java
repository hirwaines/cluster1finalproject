package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(name = "PasswordResetRequestDto", description = "Request a password reset OTP")
public class PasswordResetRequestDto {

    @NotBlank
    @Email
    @Schema(description = "Registered email address", example = "jane.smith@university.edu")
    private String email;
}

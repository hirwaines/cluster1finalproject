package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(name = "VerifyOtpDto", description = "Request payload for verifying a 6-digit OTP")
public class VerifyOtpDto {

  @NotBlank
  @Email
  @Schema(description = "Email address tied to the OTP", example = "john.doe@example.com")
  private String email;

  @NotBlank
  @Schema(description = "6-digit verification code", example = "123456")
  private String otp;
}
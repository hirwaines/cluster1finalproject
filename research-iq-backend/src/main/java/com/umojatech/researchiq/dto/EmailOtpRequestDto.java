package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(name = "EmailOtpRequestDto", description = "Request payload for sending an email verification OTP")
public class EmailOtpRequestDto {

  @NotBlank
  @Email
  @Schema(description = "Email address to verify", example = "john.doe@example.com")
  private String email;
}
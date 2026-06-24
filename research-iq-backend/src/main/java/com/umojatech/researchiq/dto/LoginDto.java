package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(name = "LoginDto", description = "Data Transfer Object for User Authentication")
public class LoginDto {

  @NotNull(message = "Email cannot be null")
  @Email(message = "Email should be valid")
  @Schema(description = "User's email address", example = "john.doe@example.com")
  private String email;

  @NotBlank(message = "Password cannot be blank")
  @Schema(description = "User's password", example = "SecurePass123")
  private String password;

  @Schema(description = "Admin MFA code when required", example = "123456")
  private String mfaCode;
}

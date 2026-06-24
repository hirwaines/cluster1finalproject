package com.umojatech.researchiq.dto;

import com.umojatech.researchiq.entity.enums.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(name = "CreateStaffAccountDto", description = "Payload for creating staff accounts")
public class CreateStaffAccountDto {

  @NotBlank
  @Schema(description = "Staff member name", example = "Jane Smith")
  private String name;

  @NotBlank
  @Email
  @Schema(description = "Staff email", example = "jane.smith@example.com")
  private String email;

  @NotBlank
  @Size(min = 8, max = 72)
  @Schema(description = "Initial password", example = "SecurePass123")
  private String password;

  @NotNull
  @Schema(description = "Role to assign", example = "MANAGER")
  private UserRole role;

  @Schema(description = "Optional department", example = "Research Office")
  private String department;
}
package com.umojatech.researchiq.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;

import com.umojatech.researchiq.entity.enums.UserRole;

@Data
@Schema(name = "SignupDto", description = "Data Transfer Object for User Registration")
public class SignupDto {
    @NotBlank
    @Schema(description = "Full name of the user", example = "John Doe")
    private String name;

    @NotBlank
    @Email
    @Size(max = 254)
    @Schema(description = "Email address of the user", example = "john.doe@example.com")
    private String email;

    @NotBlank
    @Size(min = 8, max = 72)
    @Schema(description = "Password for the new account (8 to 72 characters)", example = "SecurePass123")
    private String password;

    @NotNull
    @Schema(description = "Account role for signup", example = "RESEARCHER")
    private UserRole role;
}

package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
@Schema(name = "FunderSignupDto", description = "Payload for funder registration")
public class FunderSignupDto {

    @NotBlank
    @Schema(description = "Contact person full name", example = "John Doe")
    private String name;

    @NotBlank
    @Email
    @Size(max = 254)
    @Schema(description = "Work email", example = "john.doe@foundation.org")
    private String email;

    @NotBlank
    @Size(min = 8, max = 72)
    @Schema(description = "Password (8-72 chars)", example = "SecurePass123!")
    private String password;

    @NotBlank
    @Schema(description = "Organization or foundation name", example = "Gates Foundation")
    private String organization;

    @Schema(description = "Contact phone number", example = "+1-555-0123")
    private String phone;

    @Schema(description = "Areas of interest", example = "[\"healthcare\", \"education\", \"climate\"]")
    private List<String> areasOfInterest;

    @Schema(description = "Investment range", example = "$10k-$100k")
    private String investmentRange;
}

package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(name = "ContactMessageDto", description = "Public contact form submission")
public class ContactMessageDto {

  @NotBlank
  @Size(max = 120)
  @Schema(example = "Dr. Jane Doe")
  private String name;

  @NotBlank
  @Email
  @Schema(example = "jane.doe@ur.ac.rw")
  private String email;

  @NotBlank
  @Size(max = 200)
  @Schema(example = "Institutional onboarding inquiry")
  private String subject;

  @NotBlank
  @Size(max = 5000)
  @Schema(example = "We would like to onboard our department on ResearchIQ.")
  private String message;
}

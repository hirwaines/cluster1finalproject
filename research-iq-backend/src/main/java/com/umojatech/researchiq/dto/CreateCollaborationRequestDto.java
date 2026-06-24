package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
@Schema(name = "CreateCollaborationRequestDto", description = "Payload for creating a collaboration request")
public class CreateCollaborationRequestDto {

  @NotNull
  @Schema(description = "Target user id", example = "123e4567-e89b-12d3-a456-426614174000")
  private UUID toUserId;

  @NotBlank
  @Schema(description = "Collaboration type", example = "co_authoring")
  private String collaborationType;

  @NotNull
  @Min(1)
  @Schema(description = "Proposed timeline in months", example = "6")
  private Integer timelineMonths;

  @NotBlank
  @Schema(description = "Invitation message", example = "Would you like to collaborate on this project?")
  private String message;
}
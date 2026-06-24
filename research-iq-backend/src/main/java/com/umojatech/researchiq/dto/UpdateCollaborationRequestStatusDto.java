package com.umojatech.researchiq.dto;

import com.umojatech.researchiq.entity.enums.CollaborationRequestStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(name = "UpdateCollaborationRequestStatusDto", description = "Payload for accepting or rejecting a collaboration request")
public class UpdateCollaborationRequestStatusDto {

  @NotNull
  @Schema(description = "New request status", example = "ACCEPTED")
  private CollaborationRequestStatus status;
}
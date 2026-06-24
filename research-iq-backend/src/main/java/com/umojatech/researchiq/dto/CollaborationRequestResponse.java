package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@Schema(name = "CollaborationRequestResponse", description = "Collaboration request summary")
public class CollaborationRequestResponse {

  private String id;
  private String requestType;
  private String fromUserId;
  private String fromUserName;
  private String toUserId;
  private String toUserName;
  private String collaborationType;
  private Integer timelineMonths;
  private String researchId;
  private BigDecimal proposedAmount;
  private String message;
  private String status;
  private Instant createdAt;
  private Instant updatedAt;
}
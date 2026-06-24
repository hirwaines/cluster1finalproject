package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@Schema(name = "CollaborationDiscoveryResponse", description = "Potential collaborator search result")
public class CollaborationDiscoveryResponse {

  private String userId;
  private String name;
  private String department;
  private List<String> expertiseKeywords;
  private int matchScore;
  private String explanation;
}
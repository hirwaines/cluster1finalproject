package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
@Schema(name = "FunderInterestResponse", description = "Funder interest record")
public class FunderInterestResponse {

    private String id;
    private String funderId;
    private String funderName;
    private String funderOrganization;
    private String researchId;
    private String researchTitle;
    private String status;
    private String message;
    private Instant createdAt;
    private Instant updatedAt;
}

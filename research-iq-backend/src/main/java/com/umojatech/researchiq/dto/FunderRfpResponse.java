package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@Schema(name = "FunderRfpResponse", description = "Funding opportunity (RFP)")
public class FunderRfpResponse {

    private String id;
    private String funderId;
    private String funderName;
    private String funderOrganization;
    private String title;
    private String summary;
    private String amountRange;
    private String areas;
    private LocalDate deadline;
    private String status;
    private Instant createdAt;
}

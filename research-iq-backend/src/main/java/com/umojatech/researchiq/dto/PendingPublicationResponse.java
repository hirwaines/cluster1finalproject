package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@Schema(name = "PendingPublicationResponse", description = "Pending publication awaiting admin review")
public class PendingPublicationResponse {

    private String id;
    private String researcherId;
    private String researcherName;
    private String researcherEmail;
    private String title;
    private String abstractText;
    private List<String> authors;
    private String field;
    private String doi;
    private String fundingStatus;
    private BigDecimal fundingAmountNeeded;
    private String coverImage;
    private String attachmentUrl;
    private String attachmentLabel;
    private List<String> suggestedKeywords;
    private String rejectionReason;
    private String status;
    private Instant submittedDate;
}

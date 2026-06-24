package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@Schema(name = "ResearchResponse", description = "Approved research publication")
public class ResearchResponse {

    private String id;
    private String title;
    private String abstractText;
    private List<String> authors;
    private String field;
    private List<String> keywords;
    private List<String> collaborators;
    private String doi;
    private LocalDate publicationDate;
    private String researcherId;
    private String researcherName;
    private String researcherDepartment;
    private String researcherInstitution;
    private String fundingStatus;
    private BigDecimal fundingAmountNeeded;
    private String coverImage;
    private String attachmentUrl;
    private String attachmentLabel;
    private Integer citationCount;
    private Integer likeCount;
    private Integer shareCount;
    private Integer commentCount;
    private Instant createdAt;
}

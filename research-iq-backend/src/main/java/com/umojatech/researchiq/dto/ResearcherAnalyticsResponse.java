package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
@Schema(name = "ResearcherAnalyticsResponse", description = "Analytics summary for a researcher")
public class ResearcherAnalyticsResponse {

    private String researcherId;
    private String researcherName;
    private long publicationCount;
    private long totalCitations;
    private int hIndex;
    private Map<String, Long> keywordFrequency;
    private Map<String, Long> fundingStatusDistribution;
}

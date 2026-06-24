package com.umojatech.researchiq.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "ai")
@Getter
@Setter
public class AiServiceProperties {
    // Researcher AI Services
    private String expertiseMappingUrl = "http://localhost:8001";
    private String collaborationUrl    = "http://localhost:8002";
    private String trendAnalysisUrl    = "http://localhost:8003";
    private String fundingAlignmentUrl = "http://localhost:8004";
    private String knowledgeProcessingUrl = "http://localhost:8005";
    private String networkAnalysisUrl = "http://localhost:8006";
    // Research Manager AI Services
    private String departmentAnalyticsUrl = "http://localhost:8007";
    private String researchPortfolioUrl = "http://localhost:8008";
    // Department Head & Admin AI Services
    private String facultyIntelligenceUrl = "http://localhost:8009";
    private String knowledgePipelineUrl = "http://localhost:8010";
}

package com.umojatech.researchiq.service;

import com.umojatech.researchiq.config.AiServiceProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiServiceClient {

    private final AiServiceProperties props;

    @SuppressWarnings("unchecked")
    public Map<String, Object> getExpertiseProfile(String researcherId) {
        try {
            return client(props.getExpertiseMappingUrl())
                    .get()
                    .uri("/expertise/profile/{id}", researcherId)
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            log.warn("AI expertise-mapping unavailable: {}", e.getMessage());
            return Map.of();
        }
    }
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> searchExpertise(String keyword, int limit) {
        try {
            return client(props.getExpertiseMappingUrl())
                    .get()
                    .uri(u -> u.path("/expertise/search")
                            .queryParam("keyword", keyword)
                            .queryParam("limit", limit)
                            .build())
                    .retrieve()
                    .body(List.class);
        } catch (RestClientException e) {
            log.warn("AI expertise search unavailable: {}", e.getMessage());
            return List.of();
        }
    }
    @SuppressWarnings("unchecked")
    public Map<String, Object> getExpertiseHeatmap() {
        try {
            return client(props.getExpertiseMappingUrl())
                    .get()
                    .uri("/expertise/heatmap")
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            log.warn("AI heatmap unavailable: {}", e.getMessage());
            return Map.of();
        }
    }
    @SuppressWarnings("unchecked")
    public Map<String, Object> extractExpertiseFromText(String text, int topN) {
        try {
            return client(props.getExpertiseMappingUrl())
                    .post()
                    .uri("/expertise/extract")
                    .body(Map.of("text", text, "top_n", topN))
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            log.warn("AI expertise extraction unavailable: {}", e.getMessage());
            return Map.of();
        }
    }
    @SuppressWarnings("unchecked")
    public Map<String, Object> getCollaborationRecommendations(String researcherId, int limit) {
        try {
            return client(props.getCollaborationUrl())
                    .get()
                    .uri(u -> u.path("/collaboration/recommend/{id}")
                            .queryParam("limit", limit)
                            .build(researcherId))
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            log.warn("AI collaboration recommendations unavailable: {}", e.getMessage());
            return Map.of();
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> checkCompatibility(String researcherId1, String researcherId2) {
        try {
            return client(props.getCollaborationUrl())
                    .post()
                    .uri("/collaboration/compatibility")
                    .body(Map.of("researcher_id_1", researcherId1, "researcher_id_2", researcherId2))
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            log.warn("AI compatibility check unavailable: {}", e.getMessage());
            return Map.of();
        }
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getCrossDisciplinaryMatches(String researcherId, int limit) {
        try {
            return client(props.getCollaborationUrl())
                    .get()
                    .uri(u -> u.path("/collaboration/cross-disciplinary/{id}")
                            .queryParam("limit", limit)
                            .build(researcherId))
                    .retrieve()
                    .body(List.class);
        } catch (RestClientException e) {
            log.warn("AI cross-disciplinary matches unavailable: {}", e.getMessage());
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getFullTrendAnalysis() {
        try {
            return client(props.getTrendAnalysisUrl())
                    .get()
                    .uri("/trends/full")
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            log.warn("AI trend analysis unavailable: {}", e.getMessage());
            return Map.of();
        }
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getTrendingTopics(int sinceYear) {
        try {
            return client(props.getTrendAnalysisUrl())
                    .get()
                    .uri(u -> u.path("/trends/topics").queryParam("since_year", sinceYear).build())
                    .retrieve()
                    .body(List.class);
        } catch (RestClientException e) {
            log.warn("AI trending topics unavailable: {}", e.getMessage());
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getEmergingAreas(int lookbackYears) {
        try {
            return client(props.getTrendAnalysisUrl())
                    .get()
                    .uri(u -> u.path("/trends/emerging").queryParam("lookback_years", lookbackYears).build())
                    .retrieve()
                    .body(List.class);
        } catch (RestClientException e) {
            log.warn("AI emerging areas unavailable: {}", e.getMessage());
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getTrendForecast(String topic) {
        try {
            return client(props.getTrendAnalysisUrl())
                    .get()
                    .uri(u -> u.path("/trends/forecast").queryParam("topic", topic).build())
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            log.warn("AI trend forecast unavailable: {}", e.getMessage());
            return Map.of();
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getFundingMatches(String researcherId) {
        try {
            return client(props.getFundingAlignmentUrl())
                    .get()
                    .uri("/funding/match/{id}", researcherId)
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            log.warn("AI funding alignment unavailable: {}", e.getMessage());
            return Map.of();
        }
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> analyzeFunding(List<String> keywords, String researchArea) {
        try {
            return client(props.getFundingAlignmentUrl())
                    .post()
                    .uri("/funding/analyze")
                    .body(Map.of("keywords", keywords, "research_area", researchArea == null ? "" : researchArea))
                    .retrieve()
                    .body(List.class);
        } catch (RestClientException e) {
            log.warn("AI funding analysis unavailable: {}", e.getMessage());
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getFundingLandscape() {
        try {
            return client(props.getFundingAlignmentUrl())
                    .get()
                    .uri("/funding/landscape")
                    .retrieve()
                    .body(List.class);
        } catch (RestClientException e) {
            log.warn("AI funding landscape unavailable: {}", e.getMessage());
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> processPublication(Map<String, Object> publicationData) {
        try {
            return client(props.getKnowledgeProcessingUrl())
                    .post()
                    .uri("/knowledge/process")
                    .body(publicationData)
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            log.warn("AI knowledge processing unavailable: {}", e.getMessage());
            return Map.of();
        }
    }
    @SuppressWarnings("unchecked")
    public Map<String, Object> classifyResearchArea(String text) {
        try {
            return client(props.getKnowledgeProcessingUrl())
                    .post()
                    .uri("/knowledge/classify")
                    .body(Map.of("text", text))
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            log.warn("AI text classification unavailable: {}", e.getMessage());
            return Map.of();
        }
    }
    @SuppressWarnings("unchecked")
    public Map<String, Object> extractEntities(String text) {
        try {
            return client(props.getKnowledgeProcessingUrl())
                    .post()
                    .uri("/knowledge/entities")
                    .body(Map.of("text", text))
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            log.warn("AI entity extraction unavailable: {}", e.getMessage());
            return Map.of();
        }
    }
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getTopicModel() {
        try {
            return client(props.getKnowledgeProcessingUrl())
                    .get()
                    .uri("/knowledge/topics")
                    .retrieve()
                    .body(List.class);
        } catch (RestClientException e) {
            log.warn("AI topic model unavailable: {}", e.getMessage());
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getNetworkSummary() {
        try {
            return client(props.getNetworkAnalysisUrl())
                    .get()
                    .uri("/network/summary")
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            log.warn("AI network analysis unavailable: {}", e.getMessage());
            return Map.of();
        }
    }
    @SuppressWarnings("unchecked")
    public Map<String, Object> getNetworkMetrics(String researcherId) {
        try {
            return client(props.getNetworkAnalysisUrl())
                    .get()
                    .uri("/network/metrics/{id}", researcherId)
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            log.warn("AI network metrics unavailable: {}", e.getMessage());
            return Map.of();
        }
    }
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getNetworkCommunities() {
        try {
            return client(props.getNetworkAnalysisUrl())
                    .get()
                    .uri("/network/communities")
                    .retrieve()
                    .body(List.class);
        } catch (RestClientException e) {
            log.warn("AI community detection unavailable: {}", e.getMessage());
            return List.of();
        }
    }
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getDepartmentStats() {
        try {
            return client(props.getDepartmentAnalyticsUrl())
                    .get()
                    .uri("/analytics/departments")
                    .retrieve()
                    .body(List.class);
        } catch (RestClientException e) {
            log.warn("AI department analytics unavailable: {}", e.getMessage());
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getInstitutionStats() {
        try {
            return client(props.getDepartmentAnalyticsUrl())
                    .get()
                    .uri("/analytics/institutions")
                    .retrieve()
                    .body(List.class);
        } catch (RestClientException e) {
            log.warn("AI institution analytics unavailable: {}", e.getMessage());
            return List.of();
        }
    }
    @SuppressWarnings("unchecked")
    public Map<String, Object> getDepartmentComparison() {
        try {
            return client(props.getDepartmentAnalyticsUrl())
                    .get()
                    .uri("/analytics/comparison")
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            log.warn("AI department comparison unavailable: {}", e.getMessage());
            return Map.of();
        }
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getResearcherPerformance(String institution) {
        try {
            return client(props.getDepartmentAnalyticsUrl())
                    .get()
                    .uri(u -> u.path("/analytics/performance")
                            .queryParam("institution", institution)
                            .build())
                    .retrieve()
                    .body(List.class);
        } catch (RestClientException e) {
            log.warn("AI researcher performance ranking unavailable: {}", e.getMessage());
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> analyzePortfolio(String institution) {
        try {
            return client(props.getResearchPortfolioUrl())
                    .get()
                    .uri(u -> u.path("/portfolio/analyze")
                            .queryParam("institution", institution)
                            .build())
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            log.warn("AI portfolio analysis unavailable: {}", e.getMessage());
            return Map.of();
        }
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getBenchmarks() {
        try {
            return client(props.getResearchPortfolioUrl())
                    .get()
                    .uri("/portfolio/benchmarks")
                    .retrieve()
                    .body(List.class);
        } catch (RestClientException e) {
            log.warn("AI benchmarking unavailable: {}", e.getMessage());
            return List.of();
        }
    }

   
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getFacultyProfiles(String department, String institution) {
        try {
            return client(props.getFacultyIntelligenceUrl())
                    .get()
                    .uri(u -> u.path("/faculty/profiles")
                            .queryParam("department", department)
                            .queryParam("institution", institution)
                            .build())
                    .retrieve()
                    .body(List.class);
        } catch (RestClientException e) {
            log.warn("AI faculty profiles unavailable: {}", e.getMessage());
            return List.of();
        }
    }

 
    @SuppressWarnings("unchecked")
    public Map<String, Object> getDepartmentInsight(String department, String institution) {
        try {
            return client(props.getFacultyIntelligenceUrl())
                    .get()
                    .uri(u -> u.path("/faculty/insight")
                            .queryParam("department", department)
                            .queryParam("institution", institution)
                            .build())
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            log.warn("AI department insight unavailable: {}", e.getMessage());
            return Map.of();
        }
    }

   
    @SuppressWarnings("unchecked")
    public Map<String, Object> getFacultyDistribution(String department) {
        try {
            return client(props.getFacultyIntelligenceUrl())
                    .get()
                    .uri(u -> u.path("/faculty/distribution")
                            .queryParam("department", department)
                            .build())
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            log.warn("AI faculty distribution unavailable: {}", e.getMessage());
            return Map.of();
        }
    }

   
    @SuppressWarnings("unchecked")
    public Map<String, Object> runPipeline(List<String> publicationIds, boolean processAll) {
        try {
            return client(props.getKnowledgePipelineUrl())
                    .post()
                    .uri("/pipeline/run")
                    .body(Map.of("publication_ids", publicationIds, "process_all", processAll))
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            log.warn("AI pipeline execution unavailable: {}", e.getMessage());
            return Map.of();
        }
    }

    
    @SuppressWarnings("unchecked")
    public Map<String, Object> getQualityReport() {
        try {
            return client(props.getKnowledgePipelineUrl())
                    .get()
                    .uri("/pipeline/quality")
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            log.warn("AI quality report unavailable: {}", e.getMessage());
            return Map.of();
        }
    }

   
    @SuppressWarnings("unchecked")
    public Map<String, Object> processSinglePublication(String publicationId) {
        try {
            return client(props.getKnowledgePipelineUrl())
                    .get()
                    .uri("/pipeline/process/{id}", publicationId)
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientException e) {
            log.warn("AI single publication processing unavailable: {}", e.getMessage());
            return Map.of();
        }
    }

   

    private RestClient client(String baseUrl) {
        return RestClient.builder().baseUrl(baseUrl).build();
    }
}

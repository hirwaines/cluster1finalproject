package com.umojatech.researchiq.controller;

import com.umojatech.researchiq.service.AiServiceClient;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(name = "AI Services")
@SecurityRequirement(name = "bearerAuth")
public class AiController {

    private final AiServiceClient aiServiceClient;

    // Expertise Mapping

    @GetMapping("/expertise/profile/{researcherId}")
    @Operation(summary = "AI expertise profile for a researcher")
    public ResponseEntity<Map<String, Object>> expertiseProfile(@PathVariable String researcherId) {
        return ResponseEntity.ok(aiServiceClient.getExpertiseProfile(researcherId));
    }

    @GetMapping("/expertise/search")
    @Operation(summary = "Search researchers by expertise keyword")
    public ResponseEntity<List<Map<String, Object>>> searchExpertise(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(aiServiceClient.searchExpertise(keyword, limit));
    }

    @GetMapping("/expertise/heatmap")
    @Operation(summary = "Expertise density heatmap across departments")
    public ResponseEntity<Map<String, Object>> expertiseHeatmap() {
        return ResponseEntity.ok(aiServiceClient.getExpertiseHeatmap());
    }

    @PostMapping("/expertise/extract")
    @Operation(summary = "Extract expertise keywords from abstract text")
    public ResponseEntity<Map<String, Object>> extractExpertise(
            @RequestBody Map<String, Object> body
    ) {
        String text = (String) body.getOrDefault("text", "");
        int topN = (int) body.getOrDefault("top_n", 12);
        return ResponseEntity.ok(aiServiceClient.extractExpertiseFromText(text, topN));
    }

    // Collaboration Recommendation

    @GetMapping("/collaboration/recommend/{researcherId}")
    @Operation(summary = "AI collaboration recommendations for a researcher")
    public ResponseEntity<Map<String, Object>> collaborationRecommendations(
            @PathVariable String researcherId,
            @RequestParam(defaultValue = "8") int limit
    ) {
        return ResponseEntity.ok(aiServiceClient.getCollaborationRecommendations(researcherId, limit));
    }

    @PostMapping("/collaboration/compatibility")
    @Operation(summary = "Check collaboration compatibility between two researchers")
    public ResponseEntity<Map<String, Object>> checkCompatibility(
            @RequestBody Map<String, String> body
    ) {
        return ResponseEntity.ok(aiServiceClient.checkCompatibility(
                body.get("researcher_id_1"),
                body.get("researcher_id_2")
        ));
    }

    @GetMapping("/collaboration/cross-disciplinary/{researcherId}")
    @Operation(summary = "Cross-disciplinary collaboration suggestions")
    public ResponseEntity<List<Map<String, Object>>> crossDisciplinary(
            @PathVariable String researcherId,
            @RequestParam(defaultValue = "5") int limit
    ) {
        return ResponseEntity.ok(aiServiceClient.getCrossDisciplinaryMatches(researcherId, limit));
    }

    // Research Trend Analysis

    @GetMapping("/trends/full")
    @Operation(summary = "Full AI trend analysis (topics + volumes + emerging areas)")
    public ResponseEntity<Map<String, Object>> fullTrends() {
        return ResponseEntity.ok(aiServiceClient.getFullTrendAnalysis());
    }

    @GetMapping("/trends/topics")
    @Operation(summary = "Trending research topics")
    public ResponseEntity<List<Map<String, Object>>> trendingTopics(
            @RequestParam(defaultValue = "2018") int sinceYear
    ) {
        return ResponseEntity.ok(aiServiceClient.getTrendingTopics(sinceYear));
    }

    @GetMapping("/trends/emerging")
    @Operation(summary = "Emerging research areas with growth rates")
    public ResponseEntity<List<Map<String, Object>>> emergingAreas(
            @RequestParam(defaultValue = "3") int lookbackYears
    ) {
        return ResponseEntity.ok(aiServiceClient.getEmergingAreas(lookbackYears));
    }

    @GetMapping("/trends/forecast")
    @Operation(summary = "Forecast publication volume for a research topic")
    public ResponseEntity<Map<String, Object>> trendForecast(@RequestParam String topic) {
        return ResponseEntity.ok(aiServiceClient.getTrendForecast(topic));
    }

    // Funding Alignment

    @GetMapping("/funding/match/{researcherId}")
    @Operation(summary = "AI-matched funding opportunities for a researcher")
    public ResponseEntity<Map<String, Object>> fundingMatches(@PathVariable String researcherId) {
        return ResponseEntity.ok(aiServiceClient.getFundingMatches(researcherId));
    }

    @PostMapping("/funding/analyze")
    @Operation(summary = "Match funding opportunities by keywords or research area")
    public ResponseEntity<List<Map<String, Object>>> analyzeFunding(
            @RequestBody Map<String, Object> body
    ) {
        @SuppressWarnings("unchecked")
        List<String> keywords = (List<String>) body.getOrDefault("keywords", List.of());
        String area = (String) body.getOrDefault("research_area", "");
        return ResponseEntity.ok(aiServiceClient.analyzeFunding(keywords, area));
    }

    @GetMapping("/funding/landscape")
    @Operation(summary = "Funding landscape overview by research area")
    public ResponseEntity<List<Map<String, Object>>> fundingLandscape() {
        return ResponseEntity.ok(aiServiceClient.getFundingLandscape());
    }

    // Research Knowledge Processing

    @PostMapping("/knowledge/process")
    @Operation(summary = "Process research publication through NLP pipeline")
    public ResponseEntity<Map<String, Object>> processPublication(
            @RequestBody Map<String, Object> body
    ) {
        return ResponseEntity.ok(aiServiceClient.processPublication(body));
    }

    @PostMapping("/knowledge/classify")
    @Operation(summary = "Classify text into research area")
    public ResponseEntity<Map<String, Object>> classifyText(
            @RequestBody Map<String, String> body
    ) {
        return ResponseEntity.ok(aiServiceClient.classifyResearchArea(body.get("text")));
    }

    @PostMapping("/knowledge/entities")
    @Operation(summary = "Extract named entities from text")
    public ResponseEntity<Map<String, Object>> extractEntities(
            @RequestBody Map<String, String> body
    ) {
        return ResponseEntity.ok(aiServiceClient.extractEntities(body.get("text")));
    }

    @GetMapping("/knowledge/topics")
    @Operation(summary = "Get topic model of research corpus")
    public ResponseEntity<List<Map<String, Object>>> topicModel() {
        return ResponseEntity.ok(aiServiceClient.getTopicModel());
    }

    // Research Collaboration Network Analysis

    @GetMapping("/network/summary")
    @Operation(summary = "Get full collaboration network")
    public ResponseEntity<Map<String, Object>> networkSummary() {
        return ResponseEntity.ok(aiServiceClient.getNetworkSummary());
    }

    @GetMapping("/network/metrics/{researcherId}")
    @Operation(summary = "Get researcher's network metrics and centrality scores")
    public ResponseEntity<Map<String, Object>> networkMetrics(
            @PathVariable String researcherId
    ) {
        return ResponseEntity.ok(aiServiceClient.getNetworkMetrics(researcherId));
    }

    @GetMapping("/network/communities")
    @Operation(summary = "Get research communities in collaboration network")
    public ResponseEntity<List<Map<String, Object>>> networkCommunities() {
        return ResponseEntity.ok(aiServiceClient.getNetworkCommunities());
    }

    // Department Analytics

    @GetMapping("/analytics/departments")
    @Operation(summary = "Get performance stats for all departments")
    public ResponseEntity<List<Map<String, Object>>> departmentStats() {
        return ResponseEntity.ok(aiServiceClient.getDepartmentStats());
    }

    @GetMapping("/analytics/institutions")
    @Operation(summary = "Get institution-level research metrics")
    public ResponseEntity<List<Map<String, Object>>> institutionStats() {
        return ResponseEntity.ok(aiServiceClient.getInstitutionStats());
    }

    @GetMapping("/analytics/comparison")
    @Operation(summary = "Get comparative department analysis")
    public ResponseEntity<Map<String, Object>> departmentComparison() {
        return ResponseEntity.ok(aiServiceClient.getDepartmentComparison());
    }

    @GetMapping("/analytics/performance")
    @Operation(summary = "Get individual researcher performance rankings")
    public ResponseEntity<List<Map<String, Object>>> researcherPerformance(
            @RequestParam(required = false) String institution
    ) {
        return ResponseEntity.ok(aiServiceClient.getResearcherPerformance(institution));
    }

    // Research Portfolio Analysis

    @GetMapping("/portfolio/analyze")
    @Operation(summary = "Analyze institutional research portfolio strength and gaps")
    public ResponseEntity<Map<String, Object>> analyzePortfolio(
            @RequestParam(defaultValue = "University of Rwanda") String institution
    ) {
        return ResponseEntity.ok(aiServiceClient.analyzePortfolio(institution));
    }

    @GetMapping("/portfolio/benchmarks")
    @Operation(summary = "Get research benchmarks across all institutions")
    public ResponseEntity<List<Map<String, Object>>> benchmarks() {
        return ResponseEntity.ok(aiServiceClient.getBenchmarks());
    }

    // Faculty Intelligence

    @GetMapping("/faculty/profiles")
    @Operation(summary = "Get AI-generated faculty research profiles")
    public ResponseEntity<List<Map<String, Object>>> facultyProfiles(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String institution
    ) {
        return ResponseEntity.ok(aiServiceClient.getFacultyProfiles(department, institution));
    }

    @GetMapping("/faculty/insight")
    @Operation(summary = "Get strategic intelligence for a department")
    public ResponseEntity<Map<String, Object>> departmentInsight(
            @RequestParam String department,
            @RequestParam(required = false) String institution
    ) {
        return ResponseEntity.ok(aiServiceClient.getDepartmentInsight(department, institution));
    }

    @GetMapping("/faculty/distribution")
    @Operation(summary = "Get faculty distribution by career stage and research area")
    public ResponseEntity<Map<String, Object>> facultyDistribution(
            @RequestParam String department
    ) {
        return ResponseEntity.ok(aiServiceClient.getFacultyDistribution(department));
    }

    // Admin Knowledge Pipeline

    @PostMapping("/pipeline/run")
    @Operation(summary = "Run batch NLP processing on publications")
    public ResponseEntity<Map<String, Object>> runPipeline(
            @RequestBody Map<String, Object> body
    ) {
        @SuppressWarnings("unchecked")
        List<String> pubIds = (List<String>) body.getOrDefault("publication_ids", List.of());
        boolean processAll = (boolean) body.getOrDefault("process_all", false);
        return ResponseEntity.ok(aiServiceClient.runPipeline(pubIds, processAll));
    }

    @GetMapping("/pipeline/quality")
    @Operation(summary = "Get data quality report for research corpus")
    public ResponseEntity<Map<String, Object>> qualityReport() {
        return ResponseEntity.ok(aiServiceClient.getQualityReport());
    }

    @GetMapping("/pipeline/process/{publicationId}")
    @Operation(summary = "Process a single publication through pipeline")
    public ResponseEntity<Map<String, Object>> processSinglePublication(
            @PathVariable String publicationId
    ) {
        return ResponseEntity.ok(aiServiceClient.processSinglePublication(publicationId));
    }
}

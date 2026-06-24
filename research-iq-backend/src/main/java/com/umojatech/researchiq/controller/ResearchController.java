package com.umojatech.researchiq.controller;

import com.umojatech.researchiq.dto.PendingPublicationResponse;
import com.umojatech.researchiq.dto.ResearchResponse;
import com.umojatech.researchiq.dto.ResearcherAnalyticsResponse;
import com.umojatech.researchiq.dto.SubmitResearchDto;
import com.umojatech.researchiq.service.ResearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/research")
@RequiredArgsConstructor
@Tag(name = "Research APIs")
@SecurityRequirement(name = "bearerAuth")
public class ResearchController {

    private final ResearchService researchService;

    @PostMapping
    @Operation(summary = "Submit research for review", description = "Creates a PendingPublication awaiting admin approval.")
    public ResponseEntity<PendingPublicationResponse> submit(
            @Valid @RequestBody SubmitResearchDto request,
            Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(researchService.submitResearch(request, authentication));
    }

    @GetMapping
    @Operation(summary = "Browse approved research", description = "Returns all approved publications. Supports search and field filter.")
    public ResponseEntity<List<ResearchResponse>> getFeed(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String field
    ) {
        return ResponseEntity.ok(researchService.getFeed(query, field));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get research by ID")
    public ResponseEntity<ResearchResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(researchService.getById(id));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current researcher's own publications")
    public ResponseEntity<List<ResearchResponse>> getMyResearch(Authentication authentication) {
        return ResponseEntity.ok(researchService.getMyResearch(authentication));
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get own researcher analytics (publications, citations, h-index, keywords)")
    public ResponseEntity<ResearcherAnalyticsResponse> getMyAnalytics(Authentication authentication) {
        return ResponseEntity.ok(researchService.getAnalytics(authentication));
    }

    @GetMapping("/analytics/{researcherId}")
    @Operation(summary = "Get analytics for a specific researcher")
    public ResponseEntity<ResearcherAnalyticsResponse> getAnalyticsForResearcher(@PathVariable UUID researcherId) {
        return ResponseEntity.ok(researchService.getAnalyticsForUser(researcherId));
    }

    @GetMapping("/trends")
    @Operation(summary = "Get research trends", description = "Aggregated publication counts by field and funding status.")
    public ResponseEntity<List<Map<String, Object>>> getTrends() {
        return ResponseEntity.ok(researchService.getTrends());
    }

    @GetMapping("/expertise-map")
    @Operation(summary = "Get expertise map", description = "Keyword → expert density from approved publications.")
    public ResponseEntity<List<Map<String, Object>>> getExpertiseMap(
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(researchService.getExpertiseMap(keyword));
    }
}

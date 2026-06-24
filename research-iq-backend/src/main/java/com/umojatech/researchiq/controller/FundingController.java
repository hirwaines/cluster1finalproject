package com.umojatech.researchiq.controller;

import com.umojatech.researchiq.dto.CollaborationRequestResponse;
import com.umojatech.researchiq.dto.FunderInterestDto;
import com.umojatech.researchiq.dto.FunderInterestResponse;
import com.umojatech.researchiq.dto.FunderRfpDto;
import com.umojatech.researchiq.dto.FunderRfpResponse;
import com.umojatech.researchiq.dto.FundingApplicationDto;
import com.umojatech.researchiq.dto.ResearchResponse;
import com.umojatech.researchiq.dto.UpdateInterestStatusDto;
import com.umojatech.researchiq.service.FundingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/funding")
@RequiredArgsConstructor
@Tag(name = "Funding APIs")
@SecurityRequirement(name = "bearerAuth")
public class FundingController {

    private final FundingService fundingService;

    @GetMapping("/projects")
    @Operation(summary = "Browse projects seeking funding", description = "Returns approved research with SEEKING funding status. Supports query and field filter.")
    public ResponseEntity<List<ResearchResponse>> getSeekingFundingProjects(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String field
    ) {
        return ResponseEntity.ok(fundingService.getSeekingFundingProjects(query, field));
    }

    @PostMapping("/interests")
    @Operation(summary = "Express interest in a project", description = "Funder expresses interest in a seeking-funding research project.")
    public ResponseEntity<FunderInterestResponse> expressInterest(
            @Valid @RequestBody FunderInterestDto request,
            Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fundingService.expressInterest(request, authentication));
    }

    @GetMapping("/interests")
    @Operation(summary = "Get funder's active interests")
    public ResponseEntity<List<FunderInterestResponse>> getMyInterests(Authentication authentication) {
        return ResponseEntity.ok(fundingService.getMyInterests(authentication));
    }

    @GetMapping("/interests/research/{researchId}")
    @Operation(summary = "Get interests for a research project", description = "Returns all funder interests for a specific project (visible to the researcher).")
    public ResponseEntity<List<FunderInterestResponse>> getInterestsForResearch(
            @PathVariable UUID researchId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(fundingService.getInterestsForResearch(researchId, authentication));
    }

    @PatchMapping("/interests/{interestId}/status")
    @Operation(summary = "Update interest status", description = "Researcher or funder can update the interest status.")
    public ResponseEntity<FunderInterestResponse> updateInterestStatus(
            @PathVariable UUID interestId,
            @Valid @RequestBody UpdateInterestStatusDto request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(fundingService.updateInterestStatus(interestId, request, authentication));
    }

    @PostMapping("/rfp")
    @Operation(summary = "Post a funding opportunity (RFP)", description = "Funder posts a Request for Proposals.")
    public ResponseEntity<FunderRfpResponse> postRfp(
            @Valid @RequestBody FunderRfpDto request,
            Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fundingService.postRfp(request, authentication));
    }

    @PostMapping("/applications")
    @Operation(summary = "Apply to a funding opportunity", description = "Researcher applies to an RFP; creates a funding-type request to the funder, visible in the researcher's sent requests.")
    public ResponseEntity<CollaborationRequestResponse> applyToOpportunity(
            @Valid @RequestBody FundingApplicationDto request,
            Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fundingService.applyToOpportunity(request, authentication));
    }

    @GetMapping("/opportunities")
    @Operation(summary = "Browse funding opportunities (RFPs)", description = "Returns all open RFPs. Optional status filter.")
    public ResponseEntity<List<FunderRfpResponse>> getOpportunities(
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(fundingService.getOpportunities(status));
    }

    @GetMapping("/my-rfps")
    @Operation(summary = "Get funder's own RFPs")
    public ResponseEntity<List<FunderRfpResponse>> getMyRfps(Authentication authentication) {
        return ResponseEntity.ok(fundingService.getMyRfps(authentication));
    }
}

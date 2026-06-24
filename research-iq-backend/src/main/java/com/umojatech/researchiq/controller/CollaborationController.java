package com.umojatech.researchiq.controller;

import com.umojatech.researchiq.dto.CollaborationDiscoveryResponse;
import com.umojatech.researchiq.dto.CollaborationRequestResponse;
import com.umojatech.researchiq.dto.CreateCollaborationRequestDto;
import com.umojatech.researchiq.dto.UpdateCollaborationRequestStatusDto;
import com.umojatech.researchiq.entity.enums.CollaborationRequestStatus;
import com.umojatech.researchiq.service.CollaborationService;
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
@RequestMapping("/api/v1/collaboration")
@RequiredArgsConstructor
@Tag(name = "Collaboration APIs")
@SecurityRequirement(name = "bearerAuth")
public class CollaborationController {

  private final CollaborationService collaborationService;

  @GetMapping("/discover")
  @Operation(summary = "Discover collaborators", description = "Searches collaborators by name, department, and expertise keywords.")
  public ResponseEntity<List<CollaborationDiscoveryResponse>> discover(
          @RequestParam(required = false) String query,
          @RequestParam(required = false) String department,
          Authentication authentication
  ) {
    return ResponseEntity.ok(collaborationService.discoverCollaborators(query, department, authentication));
  }

  @GetMapping("/collaborators")
  @Operation(summary = "List collaborators", description = "Alias for collaborator discovery so the UI can render a collaborator list.")
  public ResponseEntity<List<CollaborationDiscoveryResponse>> collaborators(
          @RequestParam(required = false) String query,
          @RequestParam(required = false) String department,
          Authentication authentication
  ) {
    return ResponseEntity.ok(collaborationService.discoverCollaborators(query, department, authentication));
  }

  @PostMapping("/requests")
  @Operation(summary = "Create collaboration request", description = "Creates a collaboration request for another user.")
  public ResponseEntity<CollaborationRequestResponse> createRequest(
          @Valid @RequestBody CreateCollaborationRequestDto request,
          Authentication authentication
  ) {
    return ResponseEntity.status(HttpStatus.CREATED).body(collaborationService.createRequest(request, authentication));
  }

  @GetMapping("/requests/incoming")
  @Operation(summary = "List incoming collaboration requests", description = "Returns requests sent to the current user.")
  public ResponseEntity<List<CollaborationRequestResponse>> incomingRequests(
          @RequestParam(required = false) CollaborationRequestStatus status,
          Authentication authentication
  ) {
    return ResponseEntity.ok(collaborationService.getIncomingRequests(authentication, status));
  }

  @GetMapping("/requests/sent")
  @Operation(summary = "List sent collaboration requests", description = "Returns requests created by the current user.")
  public ResponseEntity<List<CollaborationRequestResponse>> sentRequests(
          @RequestParam(required = false) CollaborationRequestStatus status,
          Authentication authentication
  ) {
    return ResponseEntity.ok(collaborationService.getSentRequests(authentication, status));
  }

  @PatchMapping("/requests/{requestId}/status")
  @Operation(summary = "Update collaboration request status", description = "Accepts or rejects a pending request.")
  public ResponseEntity<CollaborationRequestResponse> updateStatus(
          @PathVariable UUID requestId,
          @Valid @RequestBody UpdateCollaborationRequestStatusDto request,
          Authentication authentication
  ) {
    return ResponseEntity.ok(collaborationService.updateRequestStatus(requestId, request, authentication));
  }
}
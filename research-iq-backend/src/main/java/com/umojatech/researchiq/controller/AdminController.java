package com.umojatech.researchiq.controller;

import com.umojatech.researchiq.dto.ApproveRejectDto;
import com.umojatech.researchiq.dto.CreateStaffAccountDto;
import com.umojatech.researchiq.dto.PendingPublicationResponse;
import com.umojatech.researchiq.dto.ResearchResponse;
import com.umojatech.researchiq.dto.StaffAccountResponse;
import com.umojatech.researchiq.dto.UserDirectoryResponse;
import com.umojatech.researchiq.dto.UserProfileResponse;
import com.umojatech.researchiq.service.AdminService;
import com.umojatech.researchiq.service.StaffProvisionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
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
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin APIs")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final StaffProvisionService staffProvisionService;
    private final AdminService adminService;

    // --- Staff provisioning ---

    @PostMapping("/staff")
    @Operation(summary = "Create staff account", description = "Creates manager, department head, funder, or admin accounts.")
    public ResponseEntity<StaffAccountResponse> createStaff(
            @Valid @RequestBody CreateStaffAccountDto request,
            Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(staffProvisionService.createStaff(request, authentication));
    }

    // --- Pending user approvals ---

    @GetMapping("/pending-users")
    @Operation(summary = "List pending users", description = "Returns users with PENDING status awaiting approval. Optionally filter by role.")
    public ResponseEntity<List<UserProfileResponse>> getPendingUsers(
            @RequestParam(required = false) String role
    ) {
        return ResponseEntity.ok(adminService.getPendingUsers(role));
    }

    @PatchMapping("/pending-users/{userId}/approve")
    @Operation(summary = "Approve a pending researcher or funder")
    public ResponseEntity<UserProfileResponse> approveUser(
            @PathVariable UUID userId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(adminService.approveUser(userId, authentication));
    }

    @PatchMapping("/pending-users/{userId}/reject")
    @Operation(summary = "Reject a pending researcher or funder", description = "Sets the user's status to DISABLED.")
    public ResponseEntity<UserProfileResponse> rejectUser(
            @PathVariable UUID userId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(adminService.rejectUser(userId, authentication));
    }

    // --- User directory ---

    @GetMapping("/users")
    @Operation(summary = "User directory", description = "Lists all users. Optional role and status filters.")
    public ResponseEntity<List<UserDirectoryResponse>> getUserDirectory(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(adminService.getUserDirectory(role, status));
    }

    @PatchMapping("/users/{userId}/disable")
    @Operation(summary = "Disable a user account")
    public ResponseEntity<UserDirectoryResponse> disableUser(
            @PathVariable UUID userId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(adminService.disableUser(userId, authentication));
    }

    @PatchMapping("/users/{userId}/enable")
    @Operation(summary = "Re-enable a disabled user account")
    public ResponseEntity<UserDirectoryResponse> enableUser(
            @PathVariable UUID userId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(adminService.enableUser(userId, authentication));
    }

    @DeleteMapping("/users/{userId}")
    @Operation(summary = "Delete a user account")
    public ResponseEntity<Void> deleteUser(
            @PathVariable UUID userId,
            Authentication authentication
    ) {
        adminService.deleteUser(userId, authentication);
        return ResponseEntity.noContent().build();
    }

    // --- Pending publications ---

    @GetMapping("/pending-publications")
    @Operation(summary = "List pending publications awaiting approval")
    public ResponseEntity<List<PendingPublicationResponse>> getPendingPublications() {
        return ResponseEntity.ok(adminService.getPendingPublications());
    }

    @PatchMapping("/pending-publications/{pendingId}/approve")
    @Operation(summary = "Approve a pending publication", description = "Moves the publication to the approved research list.")
    public ResponseEntity<ResearchResponse> approvePendingPublication(
            @PathVariable UUID pendingId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(adminService.approvePendingPublication(pendingId, authentication));
    }

    @PatchMapping("/pending-publications/{pendingId}/reject")
    @Operation(summary = "Reject a pending publication")
    public ResponseEntity<PendingPublicationResponse> rejectPendingPublication(
            @PathVariable UUID pendingId,
            @RequestBody ApproveRejectDto request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(adminService.rejectPendingPublication(pendingId, request, authentication));
    }
}

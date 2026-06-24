package com.umojatech.researchiq.controller;

import com.umojatech.researchiq.dto.AuditLogResponse;
import com.umojatech.researchiq.dto.SecuritySettingsResponse;
import com.umojatech.researchiq.dto.SecuritySettingsUpdateDto;
import com.umojatech.researchiq.dto.UserPermissionDto;
import com.umojatech.researchiq.dto.UserPermissionResponse;
import com.umojatech.researchiq.dto.UserSessionResponse;
import com.umojatech.researchiq.service.AuditService;
import com.umojatech.researchiq.service.SecurityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/security")
@RequiredArgsConstructor
@Tag(name = "Security Management APIs")
@SecurityRequirement(name = "bearerAuth")
public class SecurityController {

    private final AuditService auditService;
    private final SecurityService securityService;

    // --- Audit logs ---

    @GetMapping("/audit-logs")
    @Operation(summary = "List audit logs", description = "Returns recent audit entries. Optional userId or action filter.")
    public ResponseEntity<List<AuditLogResponse>> getAuditLogs(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String action
    ) {
        return ResponseEntity.ok(auditService.getAuditLogs(userId, action));
    }

    // --- Sessions ---

    @GetMapping("/sessions")
    @Operation(summary = "List user sessions", description = "Optional userId or active filter.")
    public ResponseEntity<List<UserSessionResponse>> getSessions(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) Boolean active
    ) {
        return ResponseEntity.ok(securityService.getSessions(userId, active));
    }

    @PatchMapping("/sessions/{sessionId}/terminate")
    @Operation(summary = "Terminate a session", description = "Marks the session inactive. Note: stateless JWTs remain valid until expiry.")
    public ResponseEntity<UserSessionResponse> terminateSession(@PathVariable UUID sessionId) {
        return ResponseEntity.ok(securityService.terminateSession(sessionId));
    }

    // --- Permissions ---

    @GetMapping("/permissions")
    @Operation(summary = "List role permissions", description = "Optional role filter.")
    public ResponseEntity<List<UserPermissionResponse>> getPermissions(
            @RequestParam(required = false) String role
    ) {
        return ResponseEntity.ok(securityService.getPermissions(role));
    }

    @PutMapping("/permissions")
    @Operation(summary = "Create or update a role permission", description = "Upserts the actions a role may perform on a resource.")
    public ResponseEntity<UserPermissionResponse> upsertPermission(@Valid @RequestBody UserPermissionDto request) {
        return ResponseEntity.ok(securityService.upsertPermission(request));
    }

    @DeleteMapping("/permissions/{permissionId}")
    @Operation(summary = "Delete a role permission")
    public ResponseEntity<Void> deletePermission(@PathVariable UUID permissionId) {
        securityService.deletePermission(permissionId);
        return ResponseEntity.noContent().build();
    }

    // --- Settings ---

    @GetMapping("/settings")
    @Operation(summary = "Get global security settings")
    public ResponseEntity<SecuritySettingsResponse> getSettings() {
        return ResponseEntity.ok(securityService.getSettings());
    }

    @PutMapping("/settings")
    @Operation(summary = "Update global security settings", description = "Partial update; only non-null fields are applied.")
    public ResponseEntity<SecuritySettingsResponse> updateSettings(@RequestBody SecuritySettingsUpdateDto request) {
        return ResponseEntity.ok(securityService.updateSettings(request));
    }
}

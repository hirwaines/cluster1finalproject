package com.umojatech.researchiq.service;

import com.umojatech.researchiq.dto.SecuritySettingsResponse;
import com.umojatech.researchiq.dto.SecuritySettingsUpdateDto;
import com.umojatech.researchiq.dto.UserPermissionDto;
import com.umojatech.researchiq.dto.UserPermissionResponse;
import com.umojatech.researchiq.dto.UserSessionResponse;
import com.umojatech.researchiq.entity.SecuritySettings;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.entity.UserPermission;
import com.umojatech.researchiq.entity.UserSession;
import com.umojatech.researchiq.entity.enums.UserRole;
import com.umojatech.researchiq.exception.BusinessException;
import com.umojatech.researchiq.exception.ResourceNotFoundException;
import com.umojatech.researchiq.repository.SecuritySettingsRepository;
import com.umojatech.researchiq.repository.UserPermissionRepository;
import com.umojatech.researchiq.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SecurityService {

    private final UserSessionRepository userSessionRepository;
    private final UserPermissionRepository userPermissionRepository;
    private final SecuritySettingsRepository securitySettingsRepository;

    // --- Sessions ---

    /** Records a login session. Never throws so it cannot break authentication. */
    @Transactional
    public void recordSession(User user, String ipAddress, String deviceInfo, Instant expiryTime) {
        try {
            UserSession session = new UserSession();
            session.setUser(user);
            session.setLastActivity(Instant.now());
            session.setExpiryTime(expiryTime);
            session.setIpAddress(ipAddress);
            session.setDeviceInfo(deviceInfo);
            session.setActive(true);
            userSessionRepository.save(session);
        } catch (RuntimeException ignored) {
            // Session tracking must not interfere with login.
        }
    }

    public List<UserSessionResponse> getSessions(String userId, Boolean active) {
        List<UserSession> sessions;
        if (userId != null && !userId.isBlank()) {
            sessions = userSessionRepository.findByUser_IdOrderByLoginTimeDesc(UUID.fromString(userId));
        } else if (active != null) {
            sessions = userSessionRepository.findByActiveOrderByLoginTimeDesc(active);
        } else {
            sessions = userSessionRepository.findByOrderByLoginTimeDesc();
        }
        return sessions.stream().map(this::toSessionResponse).toList();
    }

    @Transactional
    public UserSessionResponse terminateSession(UUID sessionId) {
        UserSession session = userSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        session.setActive(false);
        return toSessionResponse(userSessionRepository.save(session));
    }

    // --- Permissions ---

    public List<UserPermissionResponse> getPermissions(String role) {
        List<UserPermission> permissions = (role != null && !role.isBlank())
                ? userPermissionRepository.findByRoleOrderByResourceAsc(parseRole(role))
                : userPermissionRepository.findByOrderByRoleAscResourceAsc();
        return permissions.stream().map(this::toPermissionResponse).toList();
    }

    @Transactional
    public UserPermissionResponse upsertPermission(UserPermissionDto request) {
        UserRole role = parseRole(request.getRole());
        String resource = request.getResource().trim();
        UserPermission permission = userPermissionRepository.findByRoleAndResource(role, resource)
                .orElseGet(UserPermission::new);
        permission.setRole(role);
        permission.setResource(resource);
        permission.setActions(String.join(",", request.getActions().stream()
                .map(a -> a.trim().toUpperCase(Locale.ROOT))
                .filter(a -> !a.isBlank())
                .toList()));
        return toPermissionResponse(userPermissionRepository.save(permission));
    }

    @Transactional
    public void deletePermission(UUID permissionId) {
        UserPermission permission = userPermissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found"));
        userPermissionRepository.delete(permission);
    }

    // --- Settings ---

    public SecuritySettingsResponse getSettings() {
        return toSettingsResponse(getOrCreateSettings());
    }

    @Transactional
    public SecuritySettingsResponse updateSettings(SecuritySettingsUpdateDto request) {
        SecuritySettings settings = getOrCreateSettings();
        if (request.getMfaEnabled() != null) settings.setMfaEnabled(request.getMfaEnabled());
        if (request.getMfaType() != null) settings.setMfaType(request.getMfaType());
        if (request.getPasswordExpireDays() != null) settings.setPasswordExpireDays(request.getPasswordExpireDays());
        if (request.getSessionTimeoutMinutes() != null) settings.setSessionTimeoutMinutes(request.getSessionTimeoutMinutes());
        if (request.getIpWhitelist() != null) settings.setIpWhitelist(request.getIpWhitelist());
        if (request.getLoginAttemptLimit() != null) settings.setLoginAttemptLimit(request.getLoginAttemptLimit());
        if (request.getDataEncryption() != null) settings.setDataEncryption(request.getDataEncryption());
        if (request.getAuditLoggingEnabled() != null) settings.setAuditLoggingEnabled(request.getAuditLoggingEnabled());
        return toSettingsResponse(securitySettingsRepository.save(settings));
    }

    @Transactional
    public SecuritySettings getOrCreateSettings() {
        return securitySettingsRepository.findAll().stream().findFirst()
                .orElseGet(() -> securitySettingsRepository.save(new SecuritySettings()));
    }

    private UserRole parseRole(String role) {
        try {
            return UserRole.valueOf(role.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Invalid role: " + role);
        }
    }

    private UserSessionResponse toSessionResponse(UserSession s) {
        return UserSessionResponse.builder()
                .id(s.getId().toString())
                .userId(s.getUser().getId().toString())
                .userName(s.getUser().getName())
                .loginTime(s.getLoginTime())
                .lastActivity(s.getLastActivity())
                .expiryTime(s.getExpiryTime())
                .ipAddress(s.getIpAddress())
                .deviceInfo(s.getDeviceInfo())
                .active(s.isActive())
                .build();
    }

    private UserPermissionResponse toPermissionResponse(UserPermission p) {
        List<String> actions = (p.getActions() == null || p.getActions().isBlank())
                ? List.of()
                : Arrays.stream(p.getActions().split(",")).map(String::trim).filter(a -> !a.isBlank()).toList();
        return UserPermissionResponse.builder()
                .id(p.getId().toString())
                .role(p.getRole().name())
                .resource(p.getResource())
                .actions(actions)
                .updatedAt(p.getUpdatedAt())
                .build();
    }

    private SecuritySettingsResponse toSettingsResponse(SecuritySettings s) {
        return SecuritySettingsResponse.builder()
                .id(s.getId().toString())
                .mfaEnabled(s.isMfaEnabled())
                .mfaType(s.getMfaType())
                .passwordExpireDays(s.getPasswordExpireDays())
                .sessionTimeoutMinutes(s.getSessionTimeoutMinutes())
                .ipWhitelist(s.getIpWhitelist())
                .loginAttemptLimit(s.getLoginAttemptLimit())
                .dataEncryption(s.isDataEncryption())
                .auditLoggingEnabled(s.isAuditLoggingEnabled())
                .updatedAt(s.getUpdatedAt())
                .build();
    }
}

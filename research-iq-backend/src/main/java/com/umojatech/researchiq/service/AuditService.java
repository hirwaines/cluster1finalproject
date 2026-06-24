package com.umojatech.researchiq.service;

import com.umojatech.researchiq.dto.AuditLogResponse;
import com.umojatech.researchiq.entity.AuditLog;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    /** Records an audit entry. Never throws so it cannot break the action being audited. */
    @Transactional
    public void record(User actor, String action, String resource, String resourceId, String status) {
        try {
            AuditLog log = new AuditLog();
            log.setUser(actor);
            log.setUserName(actor != null ? actor.getName() : "system");
            log.setAction(action);
            log.setResource(resource);
            log.setResourceId(resourceId);
            log.setStatus(status == null ? "SUCCESS" : status);
            auditLogRepository.save(log);
        } catch (RuntimeException ignored) {
            // Auditing must not interfere with the primary operation.
        }
    }

    public List<AuditLogResponse> getAuditLogs(String userId, String action) {
        List<AuditLog> logs;
        if (userId != null && !userId.isBlank()) {
            logs = auditLogRepository.findByUser_IdOrderByTimestampDesc(java.util.UUID.fromString(userId));
        } else if (action != null && !action.isBlank()) {
            logs = auditLogRepository.findByActionOrderByTimestampDesc(action);
        } else {
            logs = auditLogRepository.findTop200ByOrderByTimestampDesc();
        }
        return logs.stream().map(this::toResponse).toList();
    }

    private AuditLogResponse toResponse(AuditLog log) {
        return AuditLogResponse.builder()
                .id(log.getId().toString())
                .userId(log.getUser() != null ? log.getUser().getId().toString() : null)
                .userName(log.getUserName())
                .action(log.getAction())
                .resource(log.getResource())
                .resourceId(log.getResourceId())
                .changes(log.getChanges())
                .ipAddress(log.getIpAddress())
                .status(log.getStatus())
                .timestamp(log.getTimestamp())
                .build();
    }
}

package com.umojatech.researchiq.repository;

import com.umojatech.researchiq.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    List<AuditLog> findTop200ByOrderByTimestampDesc();

    List<AuditLog> findByUser_IdOrderByTimestampDesc(UUID userId);

    List<AuditLog> findByActionOrderByTimestampDesc(String action);
}

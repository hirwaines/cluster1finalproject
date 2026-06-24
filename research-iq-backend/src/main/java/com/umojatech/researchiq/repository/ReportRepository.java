package com.umojatech.researchiq.repository;

import com.umojatech.researchiq.entity.Report;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.entity.enums.ReportStatus;
import com.umojatech.researchiq.entity.enums.ReportType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {
    Page<Report> findByCreatedBy(User createdBy, Pageable pageable);
    Page<Report> findByCreatedByAndStatus(User createdBy, ReportStatus status, Pageable pageable);
    Page<Report> findByCreatedByAndType(User createdBy, ReportType type, Pageable pageable);
    Page<Report> findByStatus(ReportStatus status, Pageable pageable);
}

package com.umojatech.researchiq.repository;

import com.umojatech.researchiq.entity.ReportData;
import com.umojatech.researchiq.entity.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReportDataRepository extends JpaRepository<ReportData, UUID> {
    Page<ReportData> findByReport(Report report, Pageable pageable);
    Page<ReportData> findByReportOrderByGeneratedAtDesc(Report report, Pageable pageable);
}

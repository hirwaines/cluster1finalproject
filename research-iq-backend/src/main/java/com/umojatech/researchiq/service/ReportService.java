package com.umojatech.researchiq.service;

import com.umojatech.researchiq.entity.Report;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.entity.enums.ReportStatus;
import com.umojatech.researchiq.entity.enums.ReportType;
import com.umojatech.researchiq.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportService {

    private final ReportRepository reportRepository;

    public Report createReport(Report report) {
        return reportRepository.save(report);
    }

    public Report updateReport(Report report) {
        return reportRepository.save(report);
    }

    public Optional<Report> getReport(UUID id) {
        return reportRepository.findById(id);
    }

    public Page<Report> getUserReports(User user, Pageable pageable) {
        return reportRepository.findByCreatedBy(user, pageable);
    }

    public Page<Report> getUserReportsByStatus(User user, ReportStatus status, Pageable pageable) {
        return reportRepository.findByCreatedByAndStatus(user, status, pageable);
    }

    public Page<Report> getUserReportsByType(User user, ReportType type, Pageable pageable) {
        return reportRepository.findByCreatedByAndType(user, type, pageable);
    }

    public Page<Report> getReportsByStatus(ReportStatus status, Pageable pageable) {
        return reportRepository.findByStatus(status, pageable);
    }

    public void deleteReport(UUID id) {
        reportRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean exists(UUID id) {
        return reportRepository.existsById(id);
    }
}

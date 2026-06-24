package com.umojatech.researchiq.controller;

import com.umojatech.researchiq.entity.Report;
import com.umojatech.researchiq.entity.ReportData;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.entity.enums.ReportStatus;
import com.umojatech.researchiq.entity.enums.ReportType;
import com.umojatech.researchiq.service.ReportService;
import com.umojatech.researchiq.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Tag(name = "Reporting", description = "Report builder and management")
@SecurityRequirement(name = "bearerAuth")
public class ReportingController {

    private final ReportService reportService;
    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<Report> createReport(@RequestBody Report report) {
        Report created = reportService.createReport(report);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{reportId}")
    @PreAuthorize("hasAnyRole('MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<Report> getReport(@PathVariable UUID reportId) {
        return reportService.getReport(reportId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<Page<Report>> getUserReports(Pageable pageable, Authentication authentication) {
        User user = userService.getByEmail(authentication.getName());
        Page<Report> reports = reportService.getUserReports(user, pageable);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("hasAnyRole('MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<Page<Report>> getReportsByType(@PathVariable ReportType type, Pageable pageable, Authentication authentication) {
        User user = userService.getByEmail(authentication.getName());
        Page<Report> reports = reportService.getUserReportsByType(user, type, pageable);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Page<Report>> getReportsByStatus(@PathVariable ReportStatus status, Pageable pageable) {
        Page<Report> reports = reportService.getReportsByStatus(status, pageable);
        return ResponseEntity.ok(reports);
    }

    @PutMapping("/{reportId}")
    @PreAuthorize("hasAnyRole('MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<Report> updateReport(@PathVariable UUID reportId, @RequestBody Report report) {
        report.setId(reportId);
        Report updated = reportService.updateReport(report);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{reportId}")
    @PreAuthorize("hasAnyRole('MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<Void> deleteReport(@PathVariable UUID reportId) {
        reportService.deleteReport(reportId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{reportId}/generate")
    @PreAuthorize("hasAnyRole('MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<Report> generateReport(@PathVariable UUID reportId) {
        return reportService.getReport(reportId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

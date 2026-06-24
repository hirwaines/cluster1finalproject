package com.umojatech.researchiq.controller;

import com.umojatech.researchiq.entity.Dashboard;
import com.umojatech.researchiq.entity.DashboardWidget;
import com.umojatech.researchiq.service.DashboardService;
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
import com.umojatech.researchiq.service.UserService;
import com.umojatech.researchiq.entity.User;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/dashboards")
@RequiredArgsConstructor
@Tag(name = "Dashboards", description = "Dashboard customization and management")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasAnyRole('RESEARCHER', 'MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<Dashboard> createDashboard(@RequestBody Dashboard dashboard) {
        Dashboard created = dashboardService.createDashboard(dashboard);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{dashboardId}")
    @PreAuthorize("hasAnyRole('RESEARCHER', 'MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<Dashboard> getDashboard(@PathVariable UUID dashboardId) {
        return dashboardService.getDashboard(dashboardId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('RESEARCHER', 'MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<Page<Dashboard>> getUserDashboards(Pageable pageable, Authentication authentication) {
        User user = userService.getByEmail(authentication.getName());
        Page<Dashboard> dashboards = dashboardService.getUserDashboards(user, pageable);
        return ResponseEntity.ok(dashboards);
    }

    @GetMapping("/default")
    @PreAuthorize("hasAnyRole('RESEARCHER', 'MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<Dashboard> getDefaultDashboard(Authentication authentication) {
        User user = userService.getByEmail(authentication.getName());
        return dashboardService.getDefaultDashboard(user)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{dashboardId}")
    @PreAuthorize("hasAnyRole('RESEARCHER', 'MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<Dashboard> updateDashboard(@PathVariable UUID dashboardId, @RequestBody Dashboard dashboard) {
        dashboard.setId(dashboardId);
        Dashboard updated = dashboardService.updateDashboard(dashboard);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{dashboardId}")
    @PreAuthorize("hasAnyRole('RESEARCHER', 'MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<Void> deleteDashboard(@PathVariable UUID dashboardId) {
        dashboardService.deleteDashboard(dashboardId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{dashboardId}/widgets")
    @PreAuthorize("hasAnyRole('RESEARCHER', 'MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<List<DashboardWidget>> getDashboardWidgets(@PathVariable UUID dashboardId) {
        List<DashboardWidget> widgets = dashboardService.getDashboardWidgets(dashboardId);
        return ResponseEntity.ok(widgets);
    }

    @PostMapping("/{dashboardId}/widgets")
    @PreAuthorize("hasAnyRole('RESEARCHER', 'MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<DashboardWidget> addWidget(@PathVariable UUID dashboardId, @RequestBody DashboardWidget widget) {
        DashboardWidget created = dashboardService.addWidget(dashboardId, widget);
        if (created != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/widgets/{widgetId}")
    @PreAuthorize("hasAnyRole('RESEARCHER', 'MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<Void> removeWidget(@PathVariable UUID widgetId) {
        dashboardService.removeWidget(widgetId);
        return ResponseEntity.noContent().build();
    }
}

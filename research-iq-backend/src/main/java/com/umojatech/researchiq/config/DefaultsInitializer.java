package com.umojatech.researchiq.config;

import com.umojatech.researchiq.entity.*;
import com.umojatech.researchiq.entity.enums.DashboardLayout;
import com.umojatech.researchiq.entity.enums.DashboardWidgetType;
import com.umojatech.researchiq.entity.enums.ReportSchedule;
import com.umojatech.researchiq.entity.enums.ReportStatus;
import com.umojatech.researchiq.entity.enums.UserRole;
import com.umojatech.researchiq.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DefaultsInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final DashboardRepository dashboardRepository;
    private final DashboardWidgetRepository widgetRepository;
    private final ReportRepository reportRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        log.info("Default initialization skipped - tables will be created on demand");
    }

    private void initializeDefaultDashboardsForAllUsers() {
        List<User> users = userRepository.findAll();

        for (User user : users) {
            try {
                UserRole role = user.getRole();

                Dashboard existingDefault = dashboardRepository
                        .findByUserAndIsDefault(user, true)
                        .orElse(null);

                if (existingDefault == null) {
                    Dashboard defaultDashboard = new Dashboard();
                    defaultDashboard.setUser(user);
                    defaultDashboard.setName("My Dashboard");
                    defaultDashboard.setRole(role.name());
                    defaultDashboard.setIsDefault(true);
                    defaultDashboard.setLayout(DashboardLayout.GRID);

                    Dashboard saved = dashboardRepository.save(defaultDashboard);

                    addDefaultWidgets(saved, role);

                    log.debug("Created default dashboard for user: {}", user.getEmail());
                }
            } catch (Exception e) {
                log.error("Error creating default dashboard for user: {}", user.getEmail(), e);
            }
        }
    }

    private void addDefaultWidgets(Dashboard dashboard, UserRole role) {
        int order = 1;

        if (role == UserRole.RESEARCHER) {
            addWidget(dashboard, "Publication Statistics", DashboardWidgetType.METRIC,
                    "researcher_publications", order++);
            addWidget(dashboard, "Research Trends", DashboardWidgetType.CHART,
                    "research_trends", order++);
            addWidget(dashboard, "Collaboration Network", DashboardWidgetType.NETWORK,
                    "collaboration_network", order++);
            addWidget(dashboard, "Recent Publications", DashboardWidgetType.LIST,
                    "recent_publications", order++);
        } else if (role == UserRole.FUNDER) {
            addWidget(dashboard, "Funding Opportunities", DashboardWidgetType.TABLE,
                    "funding_opportunities", order++);
            addWidget(dashboard, "Interest Tracking", DashboardWidgetType.METRIC,
                    "funder_interests", order++);
            addWidget(dashboard, "Applications", DashboardWidgetType.LIST,
                    "funder_applications", order++);
        } else if (role == UserRole.MANAGER || role == UserRole.DEPARTMENT_HEAD) {
            addWidget(dashboard, "Department Overview", DashboardWidgetType.METRIC,
                    "department_overview", order++);
            addWidget(dashboard, "Research Analytics", DashboardWidgetType.CHART,
                    "research_analytics", order++);
            addWidget(dashboard, "Collaboration Map", DashboardWidgetType.NETWORK,
                    "collaboration_map", order++);
            addWidget(dashboard, "Performance Metrics", DashboardWidgetType.TABLE,
                    "performance_metrics", order++);
        } else if (role == UserRole.ADMIN) {
            addWidget(dashboard, "System Overview", DashboardWidgetType.METRIC,
                    "system_overview", order++);
            addWidget(dashboard, "User Statistics", DashboardWidgetType.CHART,
                    "user_statistics", order++);
            addWidget(dashboard, "Recent Activities", DashboardWidgetType.LIST,
                    "recent_activities", order++);
            addWidget(dashboard, "System Health", DashboardWidgetType.METRIC,
                    "system_health", order++);
        }
    }

    private void addWidget(Dashboard dashboard, String title, DashboardWidgetType type,
                          String dataSource, int order) {
        DashboardWidget widget = new DashboardWidget();
        widget.setDashboard(dashboard);
        widget.setTitle(title);
        widget.setType(type);
        widget.setDataSource(dataSource);
        widget.setPosition(order);
        widget.setSize("medium");
        widget.setRefreshInterval(300);
        widget.setDisplayOrder(order);

        widgetRepository.save(widget);
    }

    private void initializeDefaultReportsForAllUsers() {
        List<User> users = userRepository.findAll();

        for (User user : users) {
            try {
                UserRole role = user.getRole();

                if (role == UserRole.MANAGER || role == UserRole.DEPARTMENT_HEAD || role == UserRole.ADMIN) {
                    createDefaultReport(user, role);
                }
            } catch (Exception e) {
                log.error("Error creating default report for user: {}", user.getEmail(), e);
            }
        }
    }

    private void createDefaultReport(User user, UserRole role) {
        Report existingReport = reportRepository.findByCreatedBy(user,
                org.springframework.data.domain.PageRequest.of(0, 1))
                .getContent()
                .stream()
                .findFirst()
                .orElse(null);

        if (existingReport == null) {
            Report report = new Report();
            report.setName("Default " + role + " Report");
            report.setCreatedBy(user);
            report.setStatus(ReportStatus.DRAFT);
            report.setSchedule(ReportSchedule.MONTHLY);
            report.setFormat(com.umojatech.researchiq.entity.enums.ReportFormat.PDF);

            if (role == UserRole.MANAGER || role == UserRole.DEPARTMENT_HEAD) {
                report.setType(com.umojatech.researchiq.entity.enums.ReportType.PERFORMANCE);
            } else if (role == UserRole.ADMIN) {
                report.setType(com.umojatech.researchiq.entity.enums.ReportType.CUSTOM);
            }

            reportRepository.save(report);
            log.debug("Created default report for user: {}", user.getEmail());
        }
    }
}

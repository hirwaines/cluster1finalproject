package com.umojatech.researchiq.service;

import com.umojatech.researchiq.entity.Dashboard;
import com.umojatech.researchiq.entity.DashboardWidget;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.repository.DashboardRepository;
import com.umojatech.researchiq.repository.DashboardWidgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class DashboardService {

    private final DashboardRepository dashboardRepository;
    private final DashboardWidgetRepository widgetRepository;

    public Dashboard createDashboard(Dashboard dashboard) {
        return dashboardRepository.save(dashboard);
    }

    public Dashboard updateDashboard(Dashboard dashboard) {
        return dashboardRepository.save(dashboard);
    }

    public Optional<Dashboard> getDashboard(UUID id) {
        return dashboardRepository.findById(id);
    }

    public Page<Dashboard> getUserDashboards(User user, Pageable pageable) {
        return dashboardRepository.findByUser(user, pageable);
    }

    public Optional<Dashboard> getDefaultDashboard(User user) {
        return dashboardRepository.findByUserAndIsDefault(user, true);
    }

    public Page<Dashboard> getUserDashboardsByRole(User user, String role, Pageable pageable) {
        return dashboardRepository.findByUserAndRole(user, role, pageable);
    }

    public void deleteDashboard(UUID id) {
        Optional<Dashboard> dashboard = dashboardRepository.findById(id);
        if (dashboard.isPresent()) {
            widgetRepository.deleteByDashboard(dashboard.get());
            dashboardRepository.deleteById(id);
        }
    }

    public List<DashboardWidget> getDashboardWidgets(UUID dashboardId) {
        Optional<Dashboard> dashboard = dashboardRepository.findById(dashboardId);
        return dashboard.map(d -> widgetRepository.findByDashboardOrderByDisplayOrder(d))
                .orElseGet(List::of);
    }

    public DashboardWidget addWidget(UUID dashboardId, DashboardWidget widget) {
        Optional<Dashboard> dashboard = dashboardRepository.findById(dashboardId);
        if (dashboard.isPresent()) {
            widget.setDashboard(dashboard.get());
            return widgetRepository.save(widget);
        }
        return null;
    }

    public void removeWidget(UUID widgetId) {
        widgetRepository.deleteById(widgetId);
    }
}

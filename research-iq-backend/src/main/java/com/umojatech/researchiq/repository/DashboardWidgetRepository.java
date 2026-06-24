package com.umojatech.researchiq.repository;

import com.umojatech.researchiq.entity.DashboardWidget;
import com.umojatech.researchiq.entity.Dashboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DashboardWidgetRepository extends JpaRepository<DashboardWidget, UUID> {
    List<DashboardWidget> findByDashboardOrderByDisplayOrder(Dashboard dashboard);
    void deleteByDashboard(Dashboard dashboard);
}

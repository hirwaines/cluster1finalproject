package com.umojatech.researchiq.entity;

import com.umojatech.researchiq.entity.enums.DashboardWidgetType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "dashboard_widgets", indexes = {
    @Index(name = "idx_dashboard", columnList = "dashboard_id")
})
@Getter
@Setter
public class DashboardWidget {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dashboard_id", nullable = false)
    private Dashboard dashboard;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DashboardWidgetType type;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Column(nullable = false)
    private String dataSource;

    @Column(nullable = false)
    private Integer position;

    @Column(nullable = false)
    private String size;

    @Column(columnDefinition = "text")
    private String config;

    private Integer refreshInterval;

    @Column(nullable = false)
    private Integer displayOrder;
}

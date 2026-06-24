package com.umojatech.researchiq.entity;

import com.umojatech.researchiq.entity.enums.ReportFormat;
import com.umojatech.researchiq.entity.enums.ReportSchedule;
import com.umojatech.researchiq.entity.enums.ReportStatus;
import com.umojatech.researchiq.entity.enums.ReportType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reports", indexes = {
    @Index(name = "idx_created_by", columnList = "created_by_id"),
    @Index(name = "idx_status", columnList = "status")
})
@Getter
@Setter
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportType type;

    @Column(columnDefinition = "text")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportSchedule schedule;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportFormat format;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status;

    @Column(columnDefinition = "text")
    private String filters;

    @Column(columnDefinition = "text")
    private String sections;

    @Column(columnDefinition = "text")
    private String recipients;

    private LocalDateTime nextRunDate;

    private LocalDateTime lastGeneratedAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
}

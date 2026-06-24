package com.umojatech.researchiq.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "report_data", indexes = {
    @Index(name = "idx_report", columnList = "report_id"),
    @Index(name = "idx_generated_by", columnList = "generated_by_id")
})
@Getter
@Setter
public class ReportData {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "report_id", nullable = false)
    private Report report;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "generated_by_id", nullable = false)
    private User generatedBy;

    @Column(nullable = false, columnDefinition = "longtext")
    private String data;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String filePath;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant generatedAt;
}

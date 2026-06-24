package com.umojatech.researchiq.entity;

import com.umojatech.researchiq.entity.enums.DataSourceType;
import com.umojatech.researchiq.entity.enums.DataSourceStatus;
import com.umojatech.researchiq.entity.enums.SyncFrequency;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "data_source_config", indexes = {
    @Index(name = "idx_type", columnList = "type"),
    @Index(name = "idx_status", columnList = "status")
})
@Getter
@Setter
public class DataSourceConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DataSourceType type;

    @Column(columnDefinition = "text")
    private String endpoint;

    @Column(columnDefinition = "text")
    private String apiKey;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DataSourceStatus status;

    private LocalDateTime lastSync;

    @Column(nullable = false)
    private Long recordsIndexed;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SyncFrequency syncFrequency;

    @Column(columnDefinition = "text")
    private String fieldMapping;

    @Column(columnDefinition = "text")
    private String filters;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant lastModified;
}

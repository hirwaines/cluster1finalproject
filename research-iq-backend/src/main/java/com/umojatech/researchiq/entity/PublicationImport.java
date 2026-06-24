package com.umojatech.researchiq.entity;

import com.umojatech.researchiq.entity.enums.ImportStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "publication_imports", indexes = {
    @Index(name = "idx_user", columnList = "user_id"),
    @Index(name = "idx_status", columnList = "status")
})
@Getter
@Setter
public class PublicationImport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String filePath;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ImportStatus status;

    @Column(nullable = false)
    private Integer totalRecords;

    @Column(nullable = false)
    private Integer successfulRecords;

    @Column(nullable = false)
    private Integer failedRecords;

    @Column(columnDefinition = "longtext")
    private String errorDetails;

    @Column(columnDefinition = "text")
    private String mappingConfig;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
}

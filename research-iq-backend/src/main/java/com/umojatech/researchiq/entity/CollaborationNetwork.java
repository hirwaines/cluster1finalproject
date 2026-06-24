package com.umojatech.researchiq.entity;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "collaboration_network", indexes = {
    @Index(name = "idx_researcher1", columnList = "researcher1_id"),
    @Index(name = "idx_researcher2", columnList = "researcher2_id")
})
@Getter
@Setter
public class CollaborationNetwork {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "researcher1_id", nullable = false)
    private User researcher1;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "researcher2_id", nullable = false)
    private User researcher2;

    @Column(nullable = false)
    private Integer coAuthorshipCount;

    @Column(nullable = false, columnDefinition = "text")
    private String sharedPublications;

    @Column(nullable = false)
    private Double degreeCentrality;

    @Column(nullable = false)
    private Double betweennessCentrality;

    @Column(nullable = false)
    private Double clusteringCoefficient;

    @Column(columnDefinition = "text")
    private String sharedKeywords;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
}

package com.umojatech.researchiq.entity;

import com.umojatech.researchiq.entity.enums.FunderInterestStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "funder_interests")
@Getter
@Setter
public class FunderInterest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "funder_id", nullable = false)
    private User funder;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "research_id", nullable = false)
    private Research research;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FunderInterestStatus status = FunderInterestStatus.PENDING;

    @Column(columnDefinition = "text")
    private String message;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
}

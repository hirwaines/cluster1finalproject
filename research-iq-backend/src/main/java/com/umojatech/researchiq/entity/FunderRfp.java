package com.umojatech.researchiq.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "funder_rfps")
@Getter
@Setter
public class FunderRfp {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "funder_id", nullable = false)
    private User funder;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "text")
    private String summary;

    @Column(name = "amount_range", length = 100)
    private String amountRange;

    @Column(length = 100)
    private String areas;

    private LocalDate deadline;

    @Column(nullable = false, length = 20)
    private String status = "OPEN";

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}

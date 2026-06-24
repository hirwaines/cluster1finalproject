package com.umojatech.researchiq.entity;

import com.umojatech.researchiq.entity.enums.FundingStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "pending_publications")
@Getter
@Setter
public class PendingPublication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "researcher_id", nullable = false)
    private User researcher;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "text")
    private String abstractText;

    @Column(nullable = false, columnDefinition = "text")
    private String authors;

    @Column(nullable = false, length = 100)
    private String field;

    @Column(length = 200)
    private String doi;

    @Enumerated(EnumType.STRING)
    @Column(name = "funding_status", length = 20)
    private FundingStatus fundingStatus;

    @Column(name = "funding_amount_needed", precision = 15, scale = 2)
    private BigDecimal fundingAmountNeeded;

    @Column(name = "cover_image", length = 500)
    private String coverImage;

    @Column(name = "attachment_url", length = 500)
    private String attachmentUrl;

    @Column(name = "attachment_label", length = 200)
    private String attachmentLabel;

    @Column(name = "suggested_keywords", columnDefinition = "text")
    private String suggestedKeywords;

    @Column(name = "rejection_reason", columnDefinition = "text")
    private String rejectionReason;

    @Column(nullable = false, length = 20)
    private String status = "PENDING";

    @CreationTimestamp
    @Column(name = "submitted_date", nullable = false, updatable = false)
    private Instant submittedDate;
}

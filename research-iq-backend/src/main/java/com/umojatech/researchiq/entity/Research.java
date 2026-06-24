package com.umojatech.researchiq.entity;

import com.umojatech.researchiq.entity.enums.FundingStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "research")
@Getter
@Setter
public class Research {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "text")
    private String abstractText;

    @Column(nullable = false, columnDefinition = "text")
    private String authors;

    @Column(nullable = false, length = 100)
    private String field;

    @Column(columnDefinition = "text")
    private String keywords;

    @Column(columnDefinition = "text")
    private String collaborators;

    @Column(length = 200)
    private String doi;

    @Column(name = "publication_date")
    private LocalDate publicationDate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "researcher_id", nullable = false)
    private User researcher;

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

    @Column(name = "citation_count")
    private Integer citationCount = 0;

    @Column(name = "comment_count")
    private Integer commentCount = 0;

    @Column(name = "like_count")
    private Integer likeCount = 0;

    @Column(name = "share_count")
    private Integer shareCount = 0;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}

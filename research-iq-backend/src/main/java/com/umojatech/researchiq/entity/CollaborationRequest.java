package com.umojatech.researchiq.entity;

import com.umojatech.researchiq.entity.enums.CollaborationRequestStatus;
import com.umojatech.researchiq.entity.enums.RequestType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "collaboration_requests")
@Getter
@Setter
public class CollaborationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "request_type", nullable = false, length = 20)
    private RequestType requestType = RequestType.COLLABORATION;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "from_user_id", nullable = false)
    private User fromUser;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "to_user_id", nullable = false)
    private User toUser;

    @Column(name = "research_id")
    private UUID researchId;

    @Column(length = 120)
    private String collaborationType;

    private Integer timelineMonths;

    @Column(name = "proposed_amount", precision = 15, scale = 2)
    private BigDecimal proposedAmount;

    @Column(nullable = false, columnDefinition = "text")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CollaborationRequestStatus status = CollaborationRequestStatus.PENDING;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
}

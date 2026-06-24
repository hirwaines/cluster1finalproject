package com.umojatech.researchiq.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "user_name", length = 100)
    private String userName;

    @Column(nullable = false, length = 100)
    private String action;

    @Column(length = 100)
    private String resource;

    @Column(name = "resource_id", length = 100)
    private String resourceId;

    @Column(columnDefinition = "text")
    private String changes;

    @Column(name = "ip_address", length = 60)
    private String ipAddress;

    @Column(nullable = false, length = 20)
    private String status = "SUCCESS";

    @CreationTimestamp
    @Column(name = "timestamp", nullable = false, updatable = false)
    private Instant timestamp;
}

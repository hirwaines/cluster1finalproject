package com.umojatech.researchiq.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_sessions")
@Getter
@Setter
public class UserSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp
    @Column(name = "login_time", nullable = false, updatable = false)
    private Instant loginTime;

    @Column(name = "last_activity", nullable = false)
    private Instant lastActivity;

    @Column(name = "expiry_time")
    private Instant expiryTime;

    @Column(name = "ip_address", length = 60)
    private String ipAddress;

    @Column(name = "device_info", length = 300)
    private String deviceInfo;

    @Column(nullable = false)
    private boolean active = true;
}

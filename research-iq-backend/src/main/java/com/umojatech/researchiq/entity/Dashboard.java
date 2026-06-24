package com.umojatech.researchiq.entity;

import com.umojatech.researchiq.entity.enums.DashboardLayout;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "dashboards", indexes = {
    @Index(name = "idx_user", columnList = "user_id"),
    @Index(name = "idx_is_default", columnList = "is_default")
})
@Getter
@Setter
public class Dashboard {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private Boolean isDefault;

    @Column(columnDefinition = "text")
    private String widgets;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DashboardLayout layout;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant lastModified;
}

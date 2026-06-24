package com.umojatech.researchiq.entity;

import com.umojatech.researchiq.entity.enums.UserRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_permissions",
        uniqueConstraints = @UniqueConstraint(name = "uq_role_resource", columnNames = {"role", "resource"}))
@Getter
@Setter
public class UserPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role;

    @Column(nullable = false, length = 100)
    private String resource;

    /** Comma-separated action list, e.g. "READ,WRITE,DELETE". */
    @Column(nullable = false, columnDefinition = "text")
    private String actions;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}

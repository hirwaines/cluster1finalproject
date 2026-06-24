package com.umojatech.researchiq.repository;

import com.umojatech.researchiq.entity.UserPermission;
import com.umojatech.researchiq.entity.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserPermissionRepository extends JpaRepository<UserPermission, UUID> {

    List<UserPermission> findByOrderByRoleAscResourceAsc();

    List<UserPermission> findByRoleOrderByResourceAsc(UserRole role);

    Optional<UserPermission> findByRoleAndResource(UserRole role, String resource);
}

package com.umojatech.researchiq.repository;

import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.entity.enums.UserRole;
import com.umojatech.researchiq.entity.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByRole(UserRole role);

    List<User> findByRoleOrderByName(UserRole role);

    List<User> findByStatusOrderByName(UserStatus status);

    List<User> findByRoleAndStatusOrderByName(UserRole role, UserStatus status);

    Optional<User> findByOrcid(String orcid);
}

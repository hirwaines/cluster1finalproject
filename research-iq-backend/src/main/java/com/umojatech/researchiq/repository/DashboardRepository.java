package com.umojatech.researchiq.repository;

import com.umojatech.researchiq.entity.Dashboard;
import com.umojatech.researchiq.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DashboardRepository extends JpaRepository<Dashboard, UUID> {
    Page<Dashboard> findByUser(User user, Pageable pageable);
    Optional<Dashboard> findByUserAndIsDefault(User user, Boolean isDefault);
    Page<Dashboard> findByUserAndRole(User user, String role, Pageable pageable);
}

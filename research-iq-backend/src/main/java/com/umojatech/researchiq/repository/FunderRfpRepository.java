package com.umojatech.researchiq.repository;

import com.umojatech.researchiq.entity.FunderRfp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FunderRfpRepository extends JpaRepository<FunderRfp, UUID> {

    List<FunderRfp> findByOrderByCreatedAtDesc();

    List<FunderRfp> findByFunder_IdOrderByCreatedAtDesc(UUID funderId);

    List<FunderRfp> findByStatusOrderByCreatedAtDesc(String status);
}

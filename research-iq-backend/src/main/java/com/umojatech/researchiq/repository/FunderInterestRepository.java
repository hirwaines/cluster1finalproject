package com.umojatech.researchiq.repository;

import com.umojatech.researchiq.entity.FunderInterest;
import com.umojatech.researchiq.entity.enums.FunderInterestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FunderInterestRepository extends JpaRepository<FunderInterest, UUID> {

    List<FunderInterest> findByFunder_IdOrderByCreatedAtDesc(UUID funderId);

    List<FunderInterest> findByResearch_IdOrderByCreatedAtDesc(UUID researchId);

    Optional<FunderInterest> findByFunder_IdAndResearch_Id(UUID funderId, UUID researchId);

    List<FunderInterest> findByFunder_IdAndStatusOrderByCreatedAtDesc(UUID funderId, FunderInterestStatus status);
}

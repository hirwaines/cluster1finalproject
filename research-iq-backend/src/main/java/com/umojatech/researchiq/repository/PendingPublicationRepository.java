package com.umojatech.researchiq.repository;

import com.umojatech.researchiq.entity.PendingPublication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PendingPublicationRepository extends JpaRepository<PendingPublication, UUID> {

    List<PendingPublication> findByStatusOrderBySubmittedDateDesc(String status);

    List<PendingPublication> findByResearcher_IdOrderBySubmittedDateDesc(UUID researcherId);
}

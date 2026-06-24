package com.umojatech.researchiq.repository;

import com.umojatech.researchiq.entity.CollaborationNetwork;
import com.umojatech.researchiq.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CollaborationNetworkRepository extends JpaRepository<CollaborationNetwork, UUID> {
    Optional<CollaborationNetwork> findByResearcher1AndResearcher2(User researcher1, User researcher2);
    Page<CollaborationNetwork> findByResearcher1(User researcher1, Pageable pageable);
    Page<CollaborationNetwork> findByResearcher2(User researcher2, Pageable pageable);
    List<CollaborationNetwork> findByResearcher1OrderByDegreeCentralityDesc(User researcher1);
}

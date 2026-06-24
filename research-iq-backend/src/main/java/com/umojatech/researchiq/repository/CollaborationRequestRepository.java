package com.umojatech.researchiq.repository;

import com.umojatech.researchiq.entity.CollaborationRequest;
import com.umojatech.researchiq.entity.enums.CollaborationRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CollaborationRequestRepository extends JpaRepository<CollaborationRequest, UUID> {
  List<CollaborationRequest> findByFromUser_IdOrderByCreatedAtDesc(UUID fromUserId);

  List<CollaborationRequest> findByToUser_IdOrderByCreatedAtDesc(UUID toUserId);

  List<CollaborationRequest> findByFromUser_IdAndStatusOrderByCreatedAtDesc(UUID fromUserId, CollaborationRequestStatus status);

  List<CollaborationRequest> findByToUser_IdAndStatusOrderByCreatedAtDesc(UUID toUserId, CollaborationRequestStatus status);
}
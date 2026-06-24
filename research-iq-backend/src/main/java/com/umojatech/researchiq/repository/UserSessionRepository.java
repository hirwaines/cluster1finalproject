package com.umojatech.researchiq.repository;

import com.umojatech.researchiq.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserSessionRepository extends JpaRepository<UserSession, UUID> {

    List<UserSession> findByOrderByLoginTimeDesc();

    List<UserSession> findByUser_IdOrderByLoginTimeDesc(UUID userId);

    List<UserSession> findByActiveOrderByLoginTimeDesc(boolean active);
}

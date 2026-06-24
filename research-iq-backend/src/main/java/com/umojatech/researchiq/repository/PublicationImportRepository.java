package com.umojatech.researchiq.repository;

import com.umojatech.researchiq.entity.PublicationImport;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.entity.enums.ImportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PublicationImportRepository extends JpaRepository<PublicationImport, UUID> {
    Page<PublicationImport> findByUser(User user, Pageable pageable);
    Page<PublicationImport> findByUserAndStatus(User user, ImportStatus status, Pageable pageable);
    Page<PublicationImport> findByStatusOrderByUpdatedAtDesc(ImportStatus status, Pageable pageable);
}

package com.umojatech.researchiq.service;

import com.umojatech.researchiq.entity.PublicationImport;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.entity.enums.ImportStatus;
import com.umojatech.researchiq.repository.PublicationImportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PublicationImportService {

    private final PublicationImportRepository importRepository;

    public PublicationImport createImport(PublicationImport importRecord) {
        importRecord.setStatus(ImportStatus.PENDING);
        return importRepository.save(importRecord);
    }

    public PublicationImport updateImport(PublicationImport importRecord) {
        return importRepository.save(importRecord);
    }

    public Optional<PublicationImport> getImport(UUID id) {
        return importRepository.findById(id);
    }

    public Page<PublicationImport> getUserImports(User user, Pageable pageable) {
        return importRepository.findByUser(user, pageable);
    }

    public Page<PublicationImport> getUserImportsByStatus(User user, ImportStatus status, Pageable pageable) {
        return importRepository.findByUserAndStatus(user, status, pageable);
    }

    public Page<PublicationImport> getImportsByStatus(ImportStatus status, Pageable pageable) {
        return importRepository.findByStatusOrderByUpdatedAtDesc(status, pageable);
    }

    public void deleteImport(UUID id) {
        importRepository.deleteById(id);
    }

    public PublicationImport updateImportProgress(UUID id, Integer successful, Integer failed, String errorDetails) {
        Optional<PublicationImport> importRecord = importRepository.findById(id);
        if (importRecord.isPresent()) {
            PublicationImport pi = importRecord.get();
            pi.setSuccessfulRecords(successful);
            pi.setFailedRecords(failed);
            if (failed == 0) {
                pi.setStatus(ImportStatus.SUCCESS);
            } else if (successful > 0) {
                pi.setStatus(ImportStatus.PARTIAL);
            } else {
                pi.setStatus(ImportStatus.FAILED);
            }
            if (errorDetails != null && !errorDetails.isEmpty()) {
                pi.setErrorDetails(errorDetails);
            }
            return importRepository.save(pi);
        }
        return null;
    }

    public PublicationImport markAsProcessing(UUID id) {
        Optional<PublicationImport> importRecord = importRepository.findById(id);
        if (importRecord.isPresent()) {
            PublicationImport pi = importRecord.get();
            pi.setStatus(ImportStatus.PROCESSING);
            return importRepository.save(pi);
        }
        return null;
    }
}

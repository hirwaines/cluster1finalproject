package com.umojatech.researchiq.controller;

import com.umojatech.researchiq.entity.PublicationImport;
import com.umojatech.researchiq.entity.enums.ImportStatus;
import com.umojatech.researchiq.service.PublicationImportService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import com.umojatech.researchiq.service.UserService;
import com.umojatech.researchiq.entity.User;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/publications/import")
@RequiredArgsConstructor
@Tag(name = "Publication Import", description = "CSV import of publications for bulk operations")
@SecurityRequirement(name = "bearerAuth")
public class PublicationImportController {

    private final PublicationImportService importService;
    private final UserService userService;

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('RESEARCHER', 'ADMIN')")
    public ResponseEntity<PublicationImport> uploadImportFile(@RequestParam MultipartFile file) {
        PublicationImport importRecord = new PublicationImport();
        importRecord.setFileName(file.getOriginalFilename());
        importRecord.setFilePath("/uploads/imports/" + file.getOriginalFilename());
        importRecord.setTotalRecords(0);
        importRecord.setSuccessfulRecords(0);
        importRecord.setFailedRecords(0);
        
        PublicationImport created = importService.createImport(importRecord);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{importId}")
    @PreAuthorize("hasAnyRole('RESEARCHER', 'ADMIN')")
    public ResponseEntity<PublicationImport> getImport(@PathVariable UUID importId) {
        return importService.getImport(importId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('RESEARCHER', 'ADMIN')")
    public ResponseEntity<Page<PublicationImport>> getUserImports(Pageable pageable, Authentication authentication) {
        User user = userService.getByEmail(authentication.getName());
        Page<PublicationImport> imports = importService.getUserImports(user, pageable);
        return ResponseEntity.ok(imports);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Page<PublicationImport>> getImportsByStatus(
            @PathVariable ImportStatus status,
            Pageable pageable) {
        Page<PublicationImport> imports = importService.getImportsByStatus(status, pageable);
        return ResponseEntity.ok(imports);
    }

    @PostMapping("/{importId}/process")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<PublicationImport> processImport(@PathVariable UUID importId) {
        PublicationImport processing = importService.markAsProcessing(importId);
        if (processing != null) {
            return ResponseEntity.accepted().body(processing);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{importId}/progress")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<PublicationImport> updateProgress(
            @PathVariable UUID importId,
            @RequestParam Integer successful,
            @RequestParam Integer failed,
            @RequestParam(required = false) String errors) {
        PublicationImport updated = importService.updateImportProgress(importId, successful, failed, errors);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{importId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> deleteImport(@PathVariable UUID importId) {
        importService.deleteImport(importId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/template")
    @PreAuthorize("hasAnyRole('RESEARCHER', 'ADMIN')")
    public ResponseEntity<String> getImportTemplate() {
        String template = "title,authors,abstract,field,doi,fundingStatus,fundingAmountNeeded\n" +
                "\"Sample Title\",\"Author 1; Author 2\",\"Sample abstract text\",\"Computer Science\",\"10.xxxx/xxxx\",\"SEEKING\",\"10000\"";
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=publication-import-template.csv")
                .header("Content-Type", "text/csv")
                .body(template);
    }
}

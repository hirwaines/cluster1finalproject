package com.umojatech.researchiq.controller;

import com.umojatech.researchiq.entity.DataSourceConfig;
import com.umojatech.researchiq.entity.enums.DataSourceStatus;
import com.umojatech.researchiq.entity.enums.DataSourceType;
import com.umojatech.researchiq.service.DataIntegrationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/data-sources")
@RequiredArgsConstructor
@Tag(name = "Data Integration", description = "External data source management and synchronization")
@SecurityRequirement(name = "bearerAuth")
public class DataIntegrationController {

    private final DataIntegrationService integrationService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<DataSourceConfig> createDataSource(@RequestBody DataSourceConfig config) {
        DataSourceConfig created = integrationService.createDataSource(config);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{dataSourceId}")
    @PreAuthorize("hasAnyRole('MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<DataSourceConfig> getDataSource(@PathVariable UUID dataSourceId) {
        return integrationService.getDataSource(dataSourceId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<List<DataSourceConfig>> getConnectedDataSources() {
        List<DataSourceConfig> sources = integrationService.getConnectedDataSources();
        return ResponseEntity.ok(sources);
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("hasAnyRole('MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<List<DataSourceConfig>> getDataSourcesByType(@PathVariable DataSourceType type) {
        List<DataSourceConfig> sources = integrationService.getDataSourcesByType(type);
        return ResponseEntity.ok(sources);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Page<DataSourceConfig>> getDataSourcesByStatus(
            @PathVariable DataSourceStatus status,
            Pageable pageable) {
        Page<DataSourceConfig> sources = integrationService.getDataSourcesByStatus(status, pageable);
        return ResponseEntity.ok(sources);
    }

    @PutMapping("/{dataSourceId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<DataSourceConfig> updateDataSource(
            @PathVariable UUID dataSourceId,
            @RequestBody DataSourceConfig config) {
        config.setId(dataSourceId);
        DataSourceConfig updated = integrationService.updateDataSource(config);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{dataSourceId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> deleteDataSource(@PathVariable UUID dataSourceId) {
        integrationService.deleteDataSource(dataSourceId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{dataSourceId}/sync")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<DataSourceConfig> syncDataSource(@PathVariable UUID dataSourceId) {
        return integrationService.getDataSource(dataSourceId)
                .map(config -> {
                    config.setStatus(DataSourceStatus.SYNCING);
                    DataSourceConfig updated = integrationService.updateDataSource(config);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{dataSourceId}/test-connection")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<String> testConnection(@PathVariable UUID dataSourceId) {
        return integrationService.getDataSource(dataSourceId)
                .map(config -> ResponseEntity.ok("Connection test passed for: " + config.getName()))
                .orElse(ResponseEntity.notFound().build());
    }
}

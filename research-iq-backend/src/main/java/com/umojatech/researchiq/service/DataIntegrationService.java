package com.umojatech.researchiq.service;

import com.umojatech.researchiq.entity.DataSourceConfig;
import com.umojatech.researchiq.entity.enums.DataSourceStatus;
import com.umojatech.researchiq.entity.enums.DataSourceType;
import com.umojatech.researchiq.repository.DataSourceConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class DataIntegrationService {

    private final DataSourceConfigRepository configRepository;

    public DataSourceConfig createDataSource(DataSourceConfig config) {
        return configRepository.save(config);
    }

    public DataSourceConfig updateDataSource(DataSourceConfig config) {
        return configRepository.save(config);
    }

    public Optional<DataSourceConfig> getDataSource(UUID id) {
        return configRepository.findById(id);
    }

    public Page<DataSourceConfig> getDataSourcesByStatus(DataSourceStatus status, Pageable pageable) {
        return configRepository.findByStatus(status, pageable);
    }

    public List<DataSourceConfig> getDataSourcesByType(DataSourceType type) {
        return configRepository.findByType(type);
    }

    public List<DataSourceConfig> getConnectedDataSources() {
        return configRepository.findByStatusOrderByLastModifiedDesc(DataSourceStatus.CONNECTED);
    }

    public void deleteDataSource(UUID id) {
        configRepository.deleteById(id);
    }

    public void updateSyncStatus(UUID id, LocalDateTime lastSync, Long recordsIndexed) {
        Optional<DataSourceConfig> config = configRepository.findById(id);
        if (config.isPresent()) {
            DataSourceConfig ds = config.get();
            ds.setLastSync(lastSync);
            ds.setRecordsIndexed(recordsIndexed);
            ds.setStatus(DataSourceStatus.CONNECTED);
            configRepository.save(ds);
        }
    }

    public void markAsError(UUID id, String errorMessage) {
        Optional<DataSourceConfig> config = configRepository.findById(id);
        if (config.isPresent()) {
            DataSourceConfig ds = config.get();
            ds.setStatus(DataSourceStatus.ERROR);
            configRepository.save(ds);
        }
    }
}

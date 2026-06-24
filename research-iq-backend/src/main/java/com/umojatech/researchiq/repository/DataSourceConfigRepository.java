package com.umojatech.researchiq.repository;

import com.umojatech.researchiq.entity.DataSourceConfig;
import com.umojatech.researchiq.entity.enums.DataSourceStatus;
import com.umojatech.researchiq.entity.enums.DataSourceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DataSourceConfigRepository extends JpaRepository<DataSourceConfig, UUID> {
    Page<DataSourceConfig> findByStatus(DataSourceStatus status, Pageable pageable);
    List<DataSourceConfig> findByType(DataSourceType type);
    List<DataSourceConfig> findByStatusOrderByLastModifiedDesc(DataSourceStatus status);
}

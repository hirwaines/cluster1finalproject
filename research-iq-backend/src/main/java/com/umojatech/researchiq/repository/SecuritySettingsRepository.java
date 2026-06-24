package com.umojatech.researchiq.repository;

import com.umojatech.researchiq.entity.SecuritySettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SecuritySettingsRepository extends JpaRepository<SecuritySettings, UUID> {
}

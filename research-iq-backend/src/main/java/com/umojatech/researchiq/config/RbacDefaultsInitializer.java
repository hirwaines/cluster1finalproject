package com.umojatech.researchiq.config;

import com.umojatech.researchiq.entity.UserPermission;
import com.umojatech.researchiq.entity.enums.UserRole;
import com.umojatech.researchiq.repository.UserPermissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class RbacDefaultsInitializer implements ApplicationRunner {

    private final UserPermissionRepository userPermissionRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seed(UserRole.RESEARCHER, "publications", "CREATE,READ,UPDATE");
        seed(UserRole.RESEARCHER, "collaboration", "CREATE,READ,UPDATE");
        seed(UserRole.RESEARCHER, "funding", "READ");
        seed(UserRole.RESEARCHER, "profile", "READ,UPDATE");
        seed(UserRole.RESEARCHER, "analytics", "READ");

        seed(UserRole.FUNDER, "funding", "CREATE,READ,UPDATE");
        seed(UserRole.FUNDER, "projects", "READ");
        seed(UserRole.FUNDER, "profile", "READ,UPDATE");

        seed(UserRole.MANAGER, "reports", "CREATE,READ,UPDATE");
        seed(UserRole.MANAGER, "analytics", "READ");
        seed(UserRole.MANAGER, "publications", "READ");
        seed(UserRole.MANAGER, "collaboration", "READ");

        seed(UserRole.DEPARTMENT_HEAD, "analytics", "READ");
        seed(UserRole.DEPARTMENT_HEAD, "reports", "READ");
        seed(UserRole.DEPARTMENT_HEAD, "users", "READ");
        seed(UserRole.DEPARTMENT_HEAD, "publications", "READ");

        seed(UserRole.ADMIN, "users", "CREATE,READ,UPDATE,DELETE,ADMIN");
        seed(UserRole.ADMIN, "publications", "CREATE,READ,UPDATE,DELETE,APPROVE,ADMIN");
        seed(UserRole.ADMIN, "security", "CREATE,READ,UPDATE,DELETE,ADMIN");
        seed(UserRole.ADMIN, "funding", "READ,ADMIN");
        seed(UserRole.ADMIN, "reports", "CREATE,READ,UPDATE,DELETE,ADMIN");
        seed(UserRole.ADMIN, "analytics", "READ,ADMIN");
        seed(UserRole.ADMIN, "collaboration", "READ,ADMIN");

        log.info("RBAC default permissions ensured for all roles");
    }

    private void seed(UserRole role, String resource, String actions) {
        userPermissionRepository.findByRoleAndResource(role, resource)
                .ifPresentOrElse(
                        existing -> log.trace("RBAC entry exists: {} / {}", role, resource),
                        () -> {
                            UserPermission permission = new UserPermission();
                            permission.setRole(role);
                            permission.setResource(resource);
                            permission.setActions(actions);
                            userPermissionRepository.save(permission);
                            log.debug("Seeded RBAC: {} / {}", role, resource);
                        }
                );
    }
}

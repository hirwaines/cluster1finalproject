package com.umojatech.researchiq.config;

import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.entity.enums.UserRole;
import com.umojatech.researchiq.entity.enums.UserStatus;
import com.umojatech.researchiq.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("dev")
@Order(4)
@RequiredArgsConstructor
public class DevResearchManagerSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DevResearchManagerSeeder.class);
    private static final String MANAGER_EMAIL = "rithanzaramba@gmail.com";
    private static final String DEFAULT_PASSWORD = "12345678";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        String hashed = passwordEncoder.encode(DEFAULT_PASSWORD);

        userRepository.findByEmail(MANAGER_EMAIL).ifPresentOrElse(
            user -> {
                user.setPassword(hashed);
                user.setRole(UserRole.MANAGER);
                user.setStatus(UserStatus.ACTIVE);
                userRepository.save(user);
                log.info("DevResearchManagerSeeder: updated research manager account for {}", MANAGER_EMAIL);
            },
            () -> {
                User manager = new User();
                manager.setName("Ritha Nzaramba");
                manager.setEmail(MANAGER_EMAIL);
                manager.setPassword(hashed);
                manager.setRole(UserRole.MANAGER);
                manager.setStatus(UserStatus.ACTIVE);
                manager.setDepartment("Research Management Office");
                manager.setInstitution("University of Rwanda");
                userRepository.save(manager);
                log.info("DevResearchManagerSeeder: created research manager account for {}", MANAGER_EMAIL);
            }
        );
    }
}

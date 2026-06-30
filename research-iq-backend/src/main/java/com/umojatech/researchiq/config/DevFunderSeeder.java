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
@Order(2)
@RequiredArgsConstructor
public class DevFunderSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DevFunderSeeder.class);
    private static final String FUNDER_EMAIL = "gasaronicky@gmail.com";
    private static final String DEFAULT_PASSWORD = "12345678";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        String hashed = passwordEncoder.encode(DEFAULT_PASSWORD);

        userRepository.findByEmail(FUNDER_EMAIL).ifPresentOrElse(
            user -> {
                user.setPassword(hashed);
                user.setStatus(UserStatus.ACTIVE);
                userRepository.save(user);
                log.info("DevFunderSeeder: updated funder account for {}", FUNDER_EMAIL);
            },
            () -> {
                User funder = new User();
                funder.setName("Nicky Gasaro");
                funder.setEmail(FUNDER_EMAIL);
                funder.setPassword(hashed);
                funder.setRole(UserRole.FUNDER);
                funder.setStatus(UserStatus.ACTIVE);
                funder.setOrganization("ResearchIQ");
                userRepository.save(funder);
                log.info("DevFunderSeeder: created funder account for {}", FUNDER_EMAIL);
            }
        );
    }
}

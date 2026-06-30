package com.umojatech.researchiq.config;

import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.entity.enums.UserRole;
import com.umojatech.researchiq.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DevResearcherPasswordSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DevResearcherPasswordSeeder.class);
    private static final String DEFAULT_PASSWORD = "12345678";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        List<User> researchers = userRepository.findByRoleOrderByName(UserRole.RESEARCHER);
        if (researchers.isEmpty()) return;

        String hashed = passwordEncoder.encode(DEFAULT_PASSWORD);
        researchers.forEach(u -> u.setPassword(hashed));
        userRepository.saveAll(researchers);
        log.info("DevResearcherPasswordSeeder: set default password '{}' for {} researcher(s)",
                DEFAULT_PASSWORD, researchers.size());
    }
}

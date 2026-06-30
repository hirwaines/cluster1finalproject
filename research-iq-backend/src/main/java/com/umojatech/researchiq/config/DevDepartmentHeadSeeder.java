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
@Order(3)
@RequiredArgsConstructor
public class DevDepartmentHeadSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DevDepartmentHeadSeeder.class);
    private static final String DEPT_HEAD_EMAIL = "hirwai2003@gmail.com";
    private static final String DEFAULT_PASSWORD = "12345678";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        String hashed = passwordEncoder.encode(DEFAULT_PASSWORD);

        userRepository.findByEmail(DEPT_HEAD_EMAIL).ifPresentOrElse(
            user -> {
                user.setPassword(hashed);
                user.setRole(UserRole.DEPARTMENT_HEAD);
                user.setStatus(UserStatus.ACTIVE);
                userRepository.save(user);
                log.info("DevDepartmentHeadSeeder: updated department head account for {}", DEPT_HEAD_EMAIL);
            },
            () -> {
                User deptHead = new User();
                deptHead.setName("Hirwa Ines");
                deptHead.setEmail(DEPT_HEAD_EMAIL);
                deptHead.setPassword(hashed);
                deptHead.setRole(UserRole.DEPARTMENT_HEAD);
                deptHead.setStatus(UserStatus.ACTIVE);
                deptHead.setDepartment("Research & Innovation");
                deptHead.setInstitution("University of Rwanda");
                userRepository.save(deptHead);
                log.info("DevDepartmentHeadSeeder: created department head account for {}", DEPT_HEAD_EMAIL);
            }
        );
    }
}

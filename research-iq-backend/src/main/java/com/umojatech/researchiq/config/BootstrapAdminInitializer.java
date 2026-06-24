package com.umojatech.researchiq.config;

import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.entity.enums.UserRole;
import com.umojatech.researchiq.entity.enums.UserStatus;
import com.umojatech.researchiq.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class BootstrapAdminInitializer implements CommandLineRunner {

  private final BootstrapAdminProperties bootstrapAdminProperties;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @Override
  public void run(String... args) {
    if (bootstrapAdminProperties.getEmail() == null || bootstrapAdminProperties.getPassword() == null) {
      return;
    }

      if (userRepository.existsByRole(UserRole.ADMIN)) {
      return;
    }

      Optional<User> existingUser = userRepository.findByEmail(bootstrapAdminProperties.getEmail());
      User admin = existingUser.orElseGet(User::new);
      admin.setName(bootstrapAdminProperties.getName() != null ? bootstrapAdminProperties.getName() : "System Admin");
      admin.setEmail(bootstrapAdminProperties.getEmail());
      admin.setPassword(passwordEncoder.encode(bootstrapAdminProperties.getPassword()));
      admin.setRole(UserRole.ADMIN);
      admin.setStatus(UserStatus.ACTIVE);
      userRepository.save(admin);
  }
}
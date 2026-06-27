package com.umojatech.researchiq.config;

import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.entity.enums.UserRole;
import com.umojatech.researchiq.entity.enums.UserStatus;
import com.umojatech.researchiq.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds demo accounts for local testing (dev profile only).
 * Passwords are reset on each startup so credentials stay predictable.
 */
@Component
@Profile("dev")
@Order(2)
@RequiredArgsConstructor
@Slf4j
public class DemoUsersSeedInitializer implements CommandLineRunner {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  private record DemoUser(
      String email,
      String password,
      String name,
      UserRole role,
      UserStatus status,
      String institution,
      String department) {}

  private static final DemoUser[] DEMO_USERS = {
      new DemoUser(
          "ineshirwa8@gmail.com",
          "79544921",
          "System Admin",
          UserRole.ADMIN,
          UserStatus.ACTIVE,
          null,
          null),
      new DemoUser(
          "sarah.chen@auca.edu",
          "Research@123",
          "Sarah Chen",
          UserRole.RESEARCHER,
          UserStatus.ACTIVE,
          "Adventist University of Central Africa",
          "Computer Science"),
      new DemoUser(
          "claver.ndahayo@auca.edu",
          "Research@123",
          "Claver Ndahayo",
          UserRole.RESEARCHER,
          UserStatus.ACTIVE,
          "Adventist University of Central Africa",
          "Engineering"),
      new DemoUser(
          "funder@impact.org",
          "Research@123",
          "Impact Fund Rwanda",
          UserRole.FUNDER,
          UserStatus.ACTIVE,
          null,
          null),
      new DemoUser(
          "manager@researchiq.com",
          "Research@123",
          "Research Manager",
          UserRole.MANAGER,
          UserStatus.ACTIVE,
          "NCST",
          "Research Office"),
      new DemoUser(
          "department.head@auca.edu",
          "Research@123",
          "Department Head",
          UserRole.DEPARTMENT_HEAD,
          UserStatus.ACTIVE,
          "Adventist University of Central Africa",
          "Faculty of Science"),
  };

  @Override
  public void run(String... args) {
    for (DemoUser demo : DEMO_USERS) {
      User user = userRepository.findByEmail(demo.email()).orElseGet(User::new);
      user.setName(demo.name());
      user.setEmail(demo.email());
      user.setPassword(passwordEncoder.encode(demo.password()));
      user.setRole(demo.role());
      user.setStatus(demo.status());
      if (demo.institution() != null) {
        user.setInstitution(demo.institution());
      }
      if (demo.department() != null) {
        user.setDepartment(demo.department());
      }
      if (demo.role() == UserRole.FUNDER) {
        user.setOrganization("Impact Fund Rwanda");
      }
      userRepository.save(user);
    }
    log.info(
        "Demo users seeded for dev — admin: ineshirwa8@gmail.com / 79544921; others: *@* / Research@123");
  }
}

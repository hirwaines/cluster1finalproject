package com.umojatech.researchiq.service;

import com.umojatech.researchiq.dto.CreateStaffAccountDto;
import com.umojatech.researchiq.dto.StaffAccountResponse;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.entity.enums.UserRole;
import com.umojatech.researchiq.entity.enums.UserStatus;
import com.umojatech.researchiq.exception.BusinessException;
import com.umojatech.researchiq.exception.DuplicateResourceException;
import com.umojatech.researchiq.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StaffProvisionService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuditService auditService;

  @Transactional
  public StaffAccountResponse createStaff(CreateStaffAccountDto request, Authentication authentication) {
    ensureAdmin(authentication);

    if (userRepository.existsByEmail(request.getEmail())) {
      throw new DuplicateResourceException("Email already in use");
    }

    if (request.getRole() == UserRole.RESEARCHER) {
      throw new BusinessException("Staff provisioning cannot create researcher accounts");
    }

    User user = new User();
    user.setName(request.getName());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(request.getRole());
    user.setStatus(UserStatus.ACTIVE);
    user.setDepartment(request.getDepartment());

    User saved = userRepository.save(user);
    auditService.record(actor(authentication), "CREATE_STAFF", "users", saved.getId().toString(), "SUCCESS");
    return StaffAccountResponse.builder()
            .id(saved.getId().toString())
            .name(saved.getName())
            .email(saved.getEmail())
            .role(saved.getRole().name())
            .department(saved.getDepartment())
            .build();
  }

  private User actor(Authentication authentication) {
    return userRepository.findByEmail(authentication.getName()).orElse(null);
  }

  private void ensureAdmin(Authentication authentication) {
    if (authentication == null) {
      throw new BusinessException("Authentication is required");
    }

    boolean isAdmin = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch("ROLE_ADMIN"::equals);

    if (!isAdmin) {
      throw new BusinessException("Only admins can provision staff accounts");
    }
  }
}
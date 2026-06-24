package com.umojatech.researchiq.service;

import com.umojatech.researchiq.dto.AuthResponse;
import com.umojatech.researchiq.dto.EmailOtpRequestDto;
import com.umojatech.researchiq.dto.FunderSignupDto;
import com.umojatech.researchiq.dto.LoginDto;
import com.umojatech.researchiq.dto.PasswordResetConfirmDto;
import com.umojatech.researchiq.dto.PasswordResetRequestDto;
import com.umojatech.researchiq.dto.ResearcherSignupDto;
import com.umojatech.researchiq.dto.SignupDto;
import com.umojatech.researchiq.dto.VerifyOtpDto;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.entity.enums.UserRole;
import com.umojatech.researchiq.entity.enums.UserStatus;
import com.umojatech.researchiq.exception.BusinessException;
import com.umojatech.researchiq.exception.DuplicateResourceException;
import com.umojatech.researchiq.exception.ResourceNotFoundException;
import com.umojatech.researchiq.exception.UnauthorizedException;
import com.umojatech.researchiq.repository.UserRepository;
import com.umojatech.researchiq.security.CustomUserDetails;
import com.umojatech.researchiq.security.JwtUtil;
import com.umojatech.researchiq.util.CsvUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final OtpService otpService;
    private final SecurityService securityService;
    private final AuditService auditService;

    @Transactional
    public AuthResponse signup(SignupDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already in use");
        }
        if (request.getRole() == UserRole.ADMIN || request.getRole() == UserRole.MANAGER || request.getRole() == UserRole.DEPARTMENT_HEAD) {
            throw new BusinessException("Public signup only supports researcher and funder roles");
        }
        if (!otpService.isEmailVerified(request.getEmail())) {
            throw new BusinessException("Email verification is required before signup");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setStatus(UserStatus.PENDING);

        userRepository.save(user);
        otpService.consumeVerifiedEmail(request.getEmail());
        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse signupResearcher(ResearcherSignupDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already in use");
        }
        if (!otpService.isEmailVerified(request.getEmail())) {
            throw new BusinessException("Email verification is required before signup");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.RESEARCHER);
        user.setStatus(UserStatus.PENDING);
        user.setInstitution(request.getInstitution());
        user.setDepartment(request.getDepartment());
        user.setOrcid(request.getOrcid());
        user.setDegree(request.getDegree());
        user.setEducationSummary(request.getEducationSummary());
        user.setYearsExperience(request.getYearsExperience());
        user.setCvUrl(request.getCvUrl());
        user.setPublicationsList(CsvUtil.toCsv(request.getPublicationsList()));
        user.setExpertiseKeywords(CsvUtil.toCsv(request.getExpertiseKeywords()));

        userRepository.save(user);
        otpService.consumeVerifiedEmail(request.getEmail());
        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse signupFunder(FunderSignupDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already in use");
        }
        if (!otpService.isEmailVerified(request.getEmail())) {
            throw new BusinessException("Email verification is required before signup");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.FUNDER);
        user.setStatus(UserStatus.PENDING);
        user.setOrganization(request.getOrganization());
        user.setPhone(request.getPhone());
        user.setAreasOfInterest(CsvUtil.toCsv(request.getAreasOfInterest()));
        user.setInvestmentRange(request.getInvestmentRange());

        userRepository.save(user);
        otpService.consumeVerifiedEmail(request.getEmail());
        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginDto request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (user.getStatus() == UserStatus.DISABLED) {
            throw new UnauthorizedException("Your account has been disabled. Contact an administrator.");
        }

        if (user.getStatus() == UserStatus.PENDING && user.getRole() != UserRole.ADMIN) {
            throw new UnauthorizedException("Your account is pending approval. You will be notified once approved.");
        }

        if (user.getRole() == UserRole.ADMIN) {
            if (request.getMfaCode() == null || request.getMfaCode().isBlank()) {
                // Password is valid but a second factor is required. This is NOT an error:
                // return a 200 response the client can distinguish from bad credentials (401).
                otpService.sendAdminMfaCode(user.getEmail());
                auditService.record(user, "LOGIN_MFA_CHALLENGE", "auth", user.getId().toString(), "SUCCESS");
                return AuthResponse.builder().mfaRequired(true).build();
            }
            otpService.verifyAdminMfaCode(user.getEmail(), request.getMfaCode());
            otpService.invalidateAdminMfaCode(user.getEmail());
        }

        securityService.recordSession(user, null, null, null);
        auditService.record(user, "LOGIN", "auth", user.getId().toString(), "SUCCESS");
        return buildAuthResponse(user);
    }

    public String requestEmailVerification(EmailOtpRequestDto request) {
        otpService.sendEmailVerificationCode(request.getEmail());
        return "Verification code sent to the console";
    }

    public String verifyEmailCode(VerifyOtpDto request) {
        otpService.verifyEmailCode(request.getEmail(), request.getOtp());
        return "Email verified successfully";
    }

    public String requestPasswordReset(PasswordResetRequestDto request) {
        if (!userRepository.existsByEmail(request.getEmail())) {
            return "If an account with that email exists, a reset code has been sent";
        }
        otpService.sendPasswordResetCode(request.getEmail());
        return "Password reset code sent to the console";
    }

    @Transactional
    public String confirmPasswordReset(PasswordResetConfirmDto request) {
        otpService.verifyPasswordResetCode(request.getEmail(), request.getOtp());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        otpService.consumePasswordResetCode(request.getEmail());
        return "Password updated successfully";
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtUtil.generateToken(new CustomUserDetails(user));
        return AuthResponse.builder()
                .token(token)
                .mfaRequired(false)
                .user(AuthResponse.UserDto.builder()
                        .id(user.getId().toString())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .build())
                .build();
    }
}

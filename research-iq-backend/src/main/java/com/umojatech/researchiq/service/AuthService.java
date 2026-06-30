package com.umojatech.researchiq.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.umojatech.researchiq.dto.AuthResponse;
import com.umojatech.researchiq.dto.EmailOtpRequestDto;
import com.umojatech.researchiq.dto.FunderSignupDto;
import com.umojatech.researchiq.dto.LoginDto;
import com.umojatech.researchiq.dto.OpenAlexPublicationDto;
import com.umojatech.researchiq.dto.OrcidLoginDto;
import com.umojatech.researchiq.dto.OrcidLookupResponse;
import com.umojatech.researchiq.dto.PasswordResetConfirmDto;
import com.umojatech.researchiq.dto.PasswordResetRequestDto;
import com.umojatech.researchiq.dto.ResearcherSignupDto;
import com.umojatech.researchiq.dto.SignupDto;
import com.umojatech.researchiq.dto.VerifyOtpDto;
import com.umojatech.researchiq.entity.Research;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.entity.enums.UserRole;
import com.umojatech.researchiq.entity.enums.UserStatus;
import com.umojatech.researchiq.repository.ResearchRepository;
import com.umojatech.researchiq.exception.BusinessException;
import com.umojatech.researchiq.exception.DuplicateResourceException;
import com.umojatech.researchiq.exception.ResourceNotFoundException;
import com.umojatech.researchiq.exception.UnauthorizedException;
import com.umojatech.researchiq.repository.UserRepository;
import com.umojatech.researchiq.security.CustomUserDetails;
import com.umojatech.researchiq.security.JwtUtil;
import com.umojatech.researchiq.util.CsvUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDate;
import java.util.List;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final OtpService otpService;
    private final SecurityService securityService;
    private final AuditService auditService;
    private final OpenAlexService openAlexService;
    private final ObjectMapper objectMapper;
    private final ResearchRepository researchRepository;

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

        if (request.getMfaCode() == null || request.getMfaCode().isBlank()) {
            otpService.sendLoginMfaCode(user.getEmail());
            auditService.record(user, "LOGIN_MFA_CHALLENGE", "auth", user.getId().toString(), "SUCCESS");
            return AuthResponse.builder().mfaRequired(true).build();
        }
        otpService.verifyLoginMfaCode(user.getEmail(), request.getMfaCode());
        otpService.invalidateLoginMfaCode(user.getEmail());

        securityService.recordSession(user, null, null, null);
        auditService.record(user, "LOGIN", "auth", user.getId().toString(), "SUCCESS");
        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse orcidLogin(OrcidLoginDto request) {
        String normalized = request.getOrcid().trim()
                .replace("https://orcid.org/", "")
                .replace("http://orcid.org/", "")
                .replace("orcid.org/", "");

        // Always fetch from OpenAlex first — needed for auto-create and sync
        OrcidLookupResponse openalex = null;
        try {
            openalex = openAlexService.lookupByOrcid(normalized);
        } catch (Exception e) {
            log.warn("OpenAlex lookup failed for ORCID {}: {}", normalized, e.getMessage());
        }

        // Find existing account or auto-create one from OpenAlex data
        User user = userRepository.findByOrcid(normalized).orElse(null);
        if (user == null) {
            if (openalex == null) {
                throw new UnauthorizedException(
                        "ORCID " + normalized + " was not found in OpenAlex. Ensure your ORCID profile is public.");
            }
            user = createResearcherFromOpenAlex(normalized, openalex);
        }

        if (user.getStatus() == UserStatus.DISABLED) {
            throw new UnauthorizedException("Your account has been disabled. Contact an administrator.");
        }
        if (user.getStatus() == UserStatus.PENDING) {
            throw new UnauthorizedException("Your account is pending approval. You will be notified once approved.");
        }

        // Sync OpenAlex data to DB so the researcher's profile is always current
        if (openalex != null) {
            syncOpenAlexData(user, openalex);
        }

        // ORCID is a verified researcher identifier — skip password and MFA, issue JWT directly
        securityService.recordSession(user, null, null, null);
        auditService.record(user, "LOGIN_ORCID", "auth", user.getId().toString(), "SUCCESS");
        return buildAuthResponse(user);
    }

    private User createResearcherFromOpenAlex(String orcidId, OrcidLookupResponse data) {
        String email = "orcid." + orcidId.replace("-", "") + "@researchiq.local";
        if (userRepository.existsByEmail(email)) {
            email = "orcid." + orcidId + "@researchiq.local";
        }
        User user = new User();
        user.setName(data.getName() != null ? data.getName() : "Researcher " + orcidId);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("12345678"));
        user.setRole(UserRole.RESEARCHER);
        user.setStatus(UserStatus.ACTIVE);
        user.setOrcid(orcidId);
        log.info("Auto-created researcher account for ORCID {} ({})", orcidId, user.getName());
        return userRepository.save(user);
    }

    private void syncOpenAlexData(User user, OrcidLookupResponse openalex) {
        if (openalex.getName() != null) user.setName(openalex.getName());
        if (openalex.getInstitution() != null) user.setInstitution(openalex.getInstitution());
        if (openalex.getExpertiseKeywords() != null && !openalex.getExpertiseKeywords().isEmpty()) {
            user.setExpertiseKeywords(CsvUtil.toCsv(openalex.getExpertiseKeywords()));
        }
        user.setHIndex(openalex.getHIndex());
        user.setCitedByCount(openalex.getCitedByCount());
        user.setWorksCount(openalex.getWorksCount());

        if (openalex.getPublications() != null && !openalex.getPublications().isEmpty()) {
            // CSV citation strings (legacy)
            List<String> citations = openalex.getPublications().stream()
                    .map(OrcidLookupResponse.Publication::getCitation)
                    .filter(c -> c != null && !c.isBlank())
                    .toList();
            user.setPublicationsList(CsvUtil.toCsv(citations));

            // Structured JSON for rich display
            List<OpenAlexPublicationDto> pubDtos = openalex.getPublications().stream()
                    .map(p -> new OpenAlexPublicationDto(
                            p.getTitle(), p.getDoi(), p.getYear(),
                            p.getCitedByCount(), p.getJournal(), p.getCitation()))
                    .toList();
            try {
                user.setOpenalexPublications(objectMapper.writeValueAsString(pubDtos));
            } catch (JsonProcessingException e) {
                log.warn("Could not serialize publications for ORCID {}: {}", user.getOrcid(), e.getMessage());
            }
        }

        userRepository.save(user);
        log.info("Synced OpenAlex data for ORCID {}: h-index={}, cited={}, works={}, pubs={}",
                user.getOrcid(), openalex.getHIndex(), openalex.getCitedByCount(),
                openalex.getWorksCount(),
                openalex.getPublications() != null ? openalex.getPublications().size() : 0);

        // Import publications into the research feed (skip any already present by DOI)
        if (openalex.getPublications() != null) {
            importPublicationsToFeed(user, openalex);
        }
    }

    private void importPublicationsToFeed(User user, OrcidLookupResponse openalex) {
        List<String> keywords = openalex.getExpertiseKeywords() != null ? openalex.getExpertiseKeywords() : List.of();
        String primaryField = keywords.isEmpty() ? "Research" : keywords.get(0);
        String keywordsCsv = CsvUtil.toCsv(keywords.isEmpty() ? List.of("Research") : keywords);

        int imported = 0;
        for (OrcidLookupResponse.Publication pub : openalex.getPublications()) {
            if (pub.getTitle() == null || pub.getTitle().isBlank()) continue;

            // Skip duplicates — match on DOI if present, otherwise skip (title alone is not safe)
            if (pub.getDoi() != null && !pub.getDoi().isBlank()) {
                if (researchRepository.existsByResearcher_IdAndDoi(user.getId(), pub.getDoi())) continue;
            } else {
                continue; // no DOI → skip to avoid exact duplicates
            }

            Research r = new Research();
            r.setTitle(pub.getTitle());
            r.setAbstractText(pub.getCitation() != null ? pub.getCitation()
                    : "Published in: " + (pub.getJournal() != null ? pub.getJournal() : "Unknown journal"));
            r.setAuthors(user.getName());
            r.setField(primaryField);
            r.setKeywords(keywordsCsv);
            r.setDoi(pub.getDoi());
            r.setResearcher(user);
            r.setCitationCount(pub.getCitedByCount() != null ? pub.getCitedByCount() : 0);
            if (pub.getYear() != null) {
                r.setPublicationDate(LocalDate.of(pub.getYear(), 1, 1));
            }
            researchRepository.save(r);
            imported++;
        }
        if (imported > 0) {
            log.info("Imported {} new publication(s) to feed for ORCID {}", imported, user.getOrcid());
        }
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

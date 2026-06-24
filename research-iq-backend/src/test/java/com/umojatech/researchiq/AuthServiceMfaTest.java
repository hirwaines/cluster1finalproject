package com.umojatech.researchiq;

import com.umojatech.researchiq.dto.AuthResponse;
import com.umojatech.researchiq.dto.LoginDto;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.entity.enums.UserRole;
import com.umojatech.researchiq.entity.enums.UserStatus;
import com.umojatech.researchiq.exception.BusinessException;
import com.umojatech.researchiq.repository.UserRepository;
import com.umojatech.researchiq.service.AuthService;
import com.umojatech.researchiq.service.OtpService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AuthServiceMfaTest {

    private static final String ADMIN_EMAIL = "mfa.admin@researchiq.test";
    private static final String RESEARCHER_EMAIL = "mfa.researcher@researchiq.test";
    private static final String PASSWORD = "AdminPass123!";

    @Autowired private AuthService authService;
    @Autowired private OtpService otpService;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @BeforeEach
    void seedUsers() {
        userRepository.save(activeUser(ADMIN_EMAIL, UserRole.ADMIN));
        userRepository.save(activeUser(RESEARCHER_EMAIL, UserRole.RESEARCHER));
    }

    private User activeUser(String email, UserRole role) {
        User u = new User();
        u.setName("Test " + role);
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(PASSWORD));
        u.setRole(role);
        u.setStatus(UserStatus.ACTIVE);
        return u;
    }

    private LoginDto login(String email, String code) {
        LoginDto dto = new LoginDto();
        dto.setEmail(email);
        dto.setPassword(PASSWORD);
        dto.setMfaCode(code);
        return dto;
    }

    @Test
    void nonAdminGetsTokenImmediately() {
        AuthResponse res = authService.login(login(RESEARCHER_EMAIL, null));

        assertNotNull(res.getToken(), "non-admin should receive a token on first call");
        assertEquals(Boolean.FALSE, res.getMfaRequired());
        assertNotNull(res.getUser());
    }

    @Test
    void adminWithoutCodeGetsMfaChallengeNotAnError() {
        // The critical fix: this must be a normal response the client can read,
        // distinct from a 401 bad-credentials error.
        AuthResponse res = authService.login(login(ADMIN_EMAIL, null));

        assertEquals(Boolean.TRUE, res.getMfaRequired(), "admin first call must signal mfaRequired");
        assertNull(res.getToken(), "no token until the code is supplied");
        assertNull(res.getUser());
    }

    @Test
    void adminWithValidCodeGetsTokenAndCodeIsSingleUse() {
        // Seed a known code the way the login flow would, then complete the second step.
        String code = otpService.sendAdminMfaCode(ADMIN_EMAIL);

        AuthResponse res = authService.login(login(ADMIN_EMAIL, code));
        assertNotNull(res.getToken(), "valid code should yield a token");
        assertEquals(Boolean.FALSE, res.getMfaRequired());
        assertNotNull(res.getUser());
        assertEquals(ADMIN_EMAIL, res.getUser().getEmail());

        // Reusing the same code must fail — it is invalidated after a successful login.
        assertThrows(BusinessException.class, () -> authService.login(login(ADMIN_EMAIL, code)),
                "MFA code must be single-use");
    }

    @Test
    void adminWithWrongCodeIsRejected() {
        otpService.sendAdminMfaCode(ADMIN_EMAIL);
        String wrong = "000000";

        assertThrows(BusinessException.class, () -> authService.login(login(ADMIN_EMAIL, wrong)),
                "an invalid code must be rejected");
    }
}

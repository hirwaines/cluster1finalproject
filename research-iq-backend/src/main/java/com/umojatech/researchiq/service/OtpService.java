package com.umojatech.researchiq.service;

import com.umojatech.researchiq.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private static final long TTL_SECONDS = 10L * 60;

    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, OtpRecord> emailVerificationOtps = new ConcurrentHashMap<>();
    private final Map<String, OtpRecord> loginMfaOtps = new ConcurrentHashMap<>();
    private final Map<String, OtpRecord> passwordResetOtps = new ConcurrentHashMap<>();

    public String sendEmailVerificationCode(String email) {
        String code = issue(emailVerificationOtps, email, "email verification");
        emailService.sendOtp(email, "ResearchIQ – Verify your email", code, "email verification");
        return code;
    }

    public boolean verifyEmailCode(String email, String otp) {
        return consume(emailVerificationOtps, email, otp, "email verification");
    }

    public boolean isEmailVerified(String email) {
        OtpRecord entry = emailVerificationOtps.get(normalize(email));
        return entry != null && entry.verified;
    }

    public void consumeVerifiedEmail(String email) {
        emailVerificationOtps.remove(normalize(email));
    }

    public String sendLoginMfaCode(String email) {
        String code = issue(loginMfaOtps, email, "login MFA");
        emailService.sendOtp(email, "ResearchIQ – Login verification code", code, "login verification");
        return code;
    }

    public boolean verifyLoginMfaCode(String email, String otp) {
        return consume(loginMfaOtps, email, otp, "login MFA");
    }

    public void invalidateLoginMfaCode(String email) {
        loginMfaOtps.remove(normalize(email));
    }

    /** @deprecated use {@link #sendLoginMfaCode(String)} */
    @Deprecated
    public String sendAdminMfaCode(String email) {
        return sendLoginMfaCode(email);
    }

    /** @deprecated use {@link #verifyLoginMfaCode(String, String)} */
    @Deprecated
    public boolean verifyAdminMfaCode(String email, String otp) {
        return verifyLoginMfaCode(email, otp);
    }

    /** @deprecated use {@link #invalidateLoginMfaCode(String)} */
    @Deprecated
    public void invalidateAdminMfaCode(String email) {
        invalidateLoginMfaCode(email);
    }

    public String sendPasswordResetCode(String email) {
        String code = issue(passwordResetOtps, email, "password reset");
        emailService.sendOtp(email, "ResearchIQ – Password reset code", code, "password reset");
        return code;
    }

    public boolean verifyPasswordResetCode(String email, String otp) {
        return consume(passwordResetOtps, email, otp, "password reset");
    }

    public void consumePasswordResetCode(String email) {
        passwordResetOtps.remove(normalize(email));
    }

    private String issue(Map<String, OtpRecord> store, String email, String purpose) {
        String normalizedEmail = normalize(email);
        String code = String.format("%06d", secureRandom.nextInt(1_000_000));
        store.put(normalizedEmail, new OtpRecord(code, Instant.now().getEpochSecond() + TTL_SECONDS, false));
        log.info("{} OTP for {}: {} (also check terminal if email delivery fails)", purpose, normalizedEmail, code);
        return code;
    }

    private boolean consume(Map<String, OtpRecord> store, String email, String otp, String purpose) {
        String normalizedEmail = normalize(email);
        OtpRecord entry = store.get(normalizedEmail);
        if (entry == null) {
            throw new BusinessException("No " + purpose + " code found for this email");
        }
        if (entry.expiresAtEpochSeconds < Instant.now().getEpochSecond()) {
            store.remove(normalizedEmail);
            throw new BusinessException(purpose + " code expired");
        }
        if (!entry.code.equals(otp)) {
            throw new BusinessException("Invalid " + purpose + " code");
        }
        store.put(normalizedEmail, entry.markVerified());
        return true;
    }

    private String normalize(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private record OtpRecord(String code, long expiresAtEpochSeconds, boolean verified) {
        private OtpRecord markVerified() {
            return new OtpRecord(code, expiresAtEpochSeconds, true);
        }
    }
}

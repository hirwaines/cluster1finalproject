package com.umojatech.researchiq.service;

import com.umojatech.researchiq.exception.BusinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private static final long TTL_SECONDS = 10L * 60;

    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, OtpRecord> emailVerificationOtps = new ConcurrentHashMap<>();
    private final Map<String, OtpRecord> adminMfaOtps = new ConcurrentHashMap<>();
    private final Map<String, OtpRecord> passwordResetOtps = new ConcurrentHashMap<>();

    public String sendEmailVerificationCode(String email) {
        return issue(emailVerificationOtps, email, "email verification");
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

    public String sendAdminMfaCode(String email) {
        return issue(adminMfaOtps, email, "admin MFA");
    }

    public boolean verifyAdminMfaCode(String email, String otp) {
        return consume(adminMfaOtps, email, otp, "admin MFA");
    }

    public void invalidateAdminMfaCode(String email) {
        adminMfaOtps.remove(normalize(email));
    }

    public String sendPasswordResetCode(String email) {
        return issue(passwordResetOtps, email, "password reset");
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
        log.info("{} OTP for {}: {}", purpose, normalizedEmail, code);
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

package com.umojatech.researchiq.controller;

import com.umojatech.researchiq.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Dev-only helpers — only active when spring.profiles.active=dev.
 * Exposes OTP codes in plain text so developers can log in without email.
 */
@RestController
@RequestMapping("/api/v1/dev")
@Profile("dev")
@RequiredArgsConstructor
public class DevController {

    private final OtpService otpService;

    @GetMapping("/otp")
    public ResponseEntity<Map<String, String>> peekOtp(
            @RequestParam String email,
            @RequestParam(defaultValue = "mfa") String type
    ) {
        String code = "email-verification".equals(type)
                ? otpService.peekEmailVerificationCode(email)
                : otpService.peekLoginMfaCode(email);
        return ResponseEntity.ok(Map.of("code", code != null ? code : ""));
    }
}

package com.umojatech.researchiq.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    @Async
    public void sendOtp(String to, String subject, String code, String purpose) {
        if (fromAddress == null || fromAddress.isBlank()) {
            log.info("[EMAIL SKIPPED – no mail configured] To: {} | {} code: {}", to, purpose, code);
            return;
        }
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(buildHtml(purpose, code), true);
            mailSender.send(msg);
            log.info("OTP email sent to {} for {}", to, purpose);
        } catch (MessagingException e) {
            log.error("Failed to send OTP email to {}: {}", to, e.getMessage());
            log.info("[FALLBACK] {} code for {}: {}", purpose, to, code);
        }
    }

    private String buildHtml(String purpose, String code) {
        return """
                <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:12px">
                  <div style="text-align:center;margin-bottom:24px">
                    <div style="background:#1e3a8a;width:56px;height:56px;border-radius:12px;margin:0 auto 12px;display:flex;align-items:center;justify-content:center">
                      <span style="color:white;font-size:28px;font-weight:bold">R</span>
                    </div>
                    <h1 style="color:#1e3a8a;font-size:22px;margin:0">ResearchIQ</h1>
                  </div>
                  <div style="background:white;border-radius:8px;padding:24px;border:1px solid #e2e8f0">
                    <h2 style="color:#1e293b;margin-top:0">Your verification code</h2>
                    <p style="color:#64748b;margin-bottom:24px">Use this code to complete your <strong>%s</strong>. It expires in 10 minutes.</p>
                    <div style="background:#f1f5f9;border-radius:8px;padding:20px;text-align:center;margin-bottom:24px">
                      <span style="font-size:40px;font-weight:bold;letter-spacing:12px;color:#1e3a8a">%s</span>
                    </div>
                    <p style="color:#94a3b8;font-size:13px;margin:0">If you did not request this, please ignore this email.</p>
                  </div>
                  <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:16px">ResearchIQ · African University of Central Africa</p>
                </div>
                """.formatted(purpose, code);
    }
}

package com.umojatech.researchiq.service;

import com.umojatech.researchiq.config.BootstrapAdminProperties;
import com.umojatech.researchiq.dto.ContactMessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactService {

  private final EmailService emailService;
  private final BootstrapAdminProperties bootstrapAdminProperties;

  public String submitContactMessage(ContactMessageDto request) {
    String adminEmail = bootstrapAdminProperties.getEmail();
    if (adminEmail == null || adminEmail.isBlank()) {
      adminEmail = "ineshirwa8@gmail.com";
    }
    emailService.sendContactInquiry(
        adminEmail.trim(),
        request.getName().trim(),
        request.getEmail().trim(),
        request.getSubject().trim(),
        request.getMessage().trim());
    return "Your message has been sent. We will respond within 2 business days.";
  }
}

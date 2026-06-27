package com.umojatech.researchiq.controller;

import com.umojatech.researchiq.dto.ContactMessageDto;
import com.umojatech.researchiq.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/contact")
@RequiredArgsConstructor
@Tag(name = "Contact", description = "Public contact form")
public class ContactController {

  private final ContactService contactService;

  @Operation(summary = "Send contact message", description = "Forwards the message to the system administrator by email.")
  @PostMapping
  public ResponseEntity<String> sendContactMessage(@Valid @RequestBody ContactMessageDto request) {
    return ResponseEntity.ok(contactService.submitContactMessage(request));
  }
}

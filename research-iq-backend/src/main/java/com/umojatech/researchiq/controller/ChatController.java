package com.umojatech.researchiq.controller;

import com.umojatech.researchiq.dto.ChatMessageResponse;
import com.umojatech.researchiq.dto.SendMessageDto;
import com.umojatech.researchiq.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
@Tag(name = "Chat APIs")
@SecurityRequirement(name = "bearerAuth")
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/messages")
    @Operation(summary = "Send a message", description = "Sends a 1:1 message to another user.")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @Valid @RequestBody SendMessageDto request,
            Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(chatService.sendMessage(request, authentication));
    }

    @GetMapping("/messages/{otherId}")
    @Operation(summary = "Get conversation", description = "Returns all messages between the current user and the specified user.")
    public ResponseEntity<List<ChatMessageResponse>> getConversation(
            @PathVariable UUID otherId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(chatService.getConversation(otherId, authentication));
    }

    @PatchMapping("/messages/{otherId}/read")
    @Operation(summary = "Mark conversation as read", description = "Marks all unread messages from the other user as read.")
    public ResponseEntity<Void> markRead(@PathVariable UUID otherId, Authentication authentication) {
        chatService.markConversationRead(otherId, authentication);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get total unread message count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        return ResponseEntity.ok(Map.of("count", chatService.getUnreadCount(authentication)));
    }

    @GetMapping("/conversations")
    @Operation(summary = "List conversations", description = "Returns the last message from each conversation partner.")
    public ResponseEntity<List<ChatMessageResponse>> getConversations(Authentication authentication) {
        return ResponseEntity.ok(chatService.getConversationPartners(authentication));
    }
}

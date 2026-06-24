package com.umojatech.researchiq.service;

import com.umojatech.researchiq.dto.ChatMessageResponse;
import com.umojatech.researchiq.dto.SendMessageDto;
import com.umojatech.researchiq.entity.ChatMessage;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.exception.ResourceNotFoundException;
import com.umojatech.researchiq.repository.ChatMessageRepository;
import com.umojatech.researchiq.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    @Transactional
    public ChatMessageResponse sendMessage(SendMessageDto request, Authentication authentication) {
        User sender = getUser(authentication);
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient user not found"));

        ChatMessage message = new ChatMessage();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(request.getContent().trim());
        message.setAttachmentUrl(request.getAttachmentUrl());
        message.setAttachmentName(request.getAttachmentName());
        message.setReadStatus(false);

        return toResponse(chatMessageRepository.save(message));
    }

    public List<ChatMessageResponse> getConversation(UUID otherId, Authentication authentication) {
        User currentUser = getUser(authentication);
        return chatMessageRepository.findConversation(currentUser.getId(), otherId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public void markConversationRead(UUID otherId, Authentication authentication) {
        User currentUser = getUser(authentication);
        chatMessageRepository.findConversation(currentUser.getId(), otherId).stream()
                .filter(m -> m.getReceiver().getId().equals(currentUser.getId()) && !m.isReadStatus())
                .forEach(m -> {
                    m.setReadStatus(true);
                    chatMessageRepository.save(m);
                });
    }

    public long getUnreadCount(Authentication authentication) {
        User currentUser = getUser(authentication);
        return chatMessageRepository.countUnreadByReceiverId(currentUser.getId());
    }

    public List<ChatMessageResponse> getConversationPartners(Authentication authentication) {
        User currentUser = getUser(authentication);
        return chatMessageRepository.findConversationPartners(currentUser.getId()).stream()
                .map(partner -> {
                    List<ChatMessage> messages = chatMessageRepository.findConversation(currentUser.getId(), partner.getId());
                    ChatMessage last = messages.isEmpty() ? null : messages.get(messages.size() - 1);
                    if (last == null) return null;
                    return toResponse(last);
                })
                .filter(r -> r != null)
                .toList();
    }

    private User getUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ChatMessageResponse toResponse(ChatMessage m) {
        return ChatMessageResponse.builder()
                .id(m.getId().toString())
                .senderId(m.getSender().getId().toString())
                .senderName(m.getSender().getName())
                .receiverId(m.getReceiver().getId().toString())
                .receiverName(m.getReceiver().getName())
                .content(m.getContent())
                .readStatus(m.isReadStatus())
                .attachmentUrl(m.getAttachmentUrl())
                .attachmentName(m.getAttachmentName())
                .createdAt(m.getCreatedAt())
                .build();
    }
}

package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
@Schema(name = "ChatMessageResponse", description = "A chat message")
public class ChatMessageResponse {

    private String id;
    private String senderId;
    private String senderName;
    private String receiverId;
    private String receiverName;
    private String content;
    private boolean readStatus;
    private String attachmentUrl;
    private String attachmentName;
    private Instant createdAt;
}

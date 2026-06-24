package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
@Schema(name = "SendMessageDto", description = "Payload to send a chat message")
public class SendMessageDto {

    @NotNull
    @Schema(description = "Recipient user ID")
    private UUID receiverId;

    @NotBlank
    @Schema(description = "Message text content")
    private String content;

    @Schema(description = "URL of file attachment (optional)")
    private String attachmentUrl;

    @Schema(description = "Attachment display name (optional)")
    private String attachmentName;
}

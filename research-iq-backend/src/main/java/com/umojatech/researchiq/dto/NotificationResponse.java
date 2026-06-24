package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
@Schema(name = "NotificationResponse", description = "A user notification")
public class NotificationResponse {

    private String id;
    private String type;
    private String title;
    private String message;
    private boolean readStatus;
    private String link;
    private Instant createdAt;
}

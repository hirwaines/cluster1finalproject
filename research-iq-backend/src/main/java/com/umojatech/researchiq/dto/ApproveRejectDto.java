package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(name = "ApproveRejectDto", description = "Payload for approving or rejecting a pending item")
public class ApproveRejectDto {

    @Schema(description = "Rejection reason (required when rejecting)", example = "Insufficient credentials")
    private String reason;
}

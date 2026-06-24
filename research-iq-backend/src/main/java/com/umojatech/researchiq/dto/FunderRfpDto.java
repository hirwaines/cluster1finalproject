package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
@Schema(name = "FunderRfpDto", description = "Payload for creating a funding opportunity (RFP)")
public class FunderRfpDto {

    @NotBlank
    @Schema(description = "RFP title", example = "AI for Healthcare Research Grant 2025")
    private String title;

    @NotBlank
    @Schema(description = "Summary of the funding opportunity")
    private String summary;

    @Schema(description = "Investment range", example = "$10k-$500k")
    private String amountRange;

    @Schema(description = "Areas of focus", example = "healthcare,AI,diagnostics")
    private String areas;

    @Schema(description = "Application deadline", example = "2025-12-31")
    private LocalDate deadline;
}

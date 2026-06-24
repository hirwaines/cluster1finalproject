package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Schema(name = "FundingApplicationDto", description = "Researcher application to a funding opportunity (RFP)")
public class FundingApplicationDto {

    @NotNull
    @Schema(description = "ID of the funding opportunity (RFP) being applied to")
    private UUID rfpId;

    @Schema(description = "ID of the researcher's own project this funding would support (optional)")
    private UUID researchId;

    @Schema(description = "Proposed funding amount", example = "75000.00")
    private BigDecimal proposedAmount;

    @Min(1)
    @Schema(description = "Proposed timeline in months", example = "12")
    private Integer timelineMonths;

    @NotBlank
    @Schema(description = "Message to the funder")
    private String message;
}

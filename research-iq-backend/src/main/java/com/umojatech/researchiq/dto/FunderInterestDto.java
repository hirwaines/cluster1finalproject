package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
@Schema(name = "FunderInterestDto", description = "Express interest in a research project")
public class FunderInterestDto {

    @NotNull
    @Schema(description = "ID of the research project")
    private UUID researchId;

    @Schema(description = "Optional message to the researcher")
    private String message;
}

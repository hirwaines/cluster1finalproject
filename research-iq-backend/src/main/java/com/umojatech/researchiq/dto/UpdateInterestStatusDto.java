package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(name = "UpdateInterestStatusDto", description = "Update the status of a funder interest")
public class UpdateInterestStatusDto {

    @NotBlank
    @Schema(description = "New status", allowableValues = {"PENDING", "DISCUSSION", "FUNDED", "DECLINED"})
    private String status;
}

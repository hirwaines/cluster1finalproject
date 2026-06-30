package com.umojatech.researchiq.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrcidLoginDto {

    @NotBlank(message = "ORCID is required")
    private String orcid;
}

package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
@Schema(name = "UserPermissionDto", description = "Set the actions a role may perform on a resource")
public class UserPermissionDto {

    @NotBlank
    @Schema(description = "Role", example = "MANAGER")
    private String role;

    @NotBlank
    @Schema(description = "Resource identifier", example = "reports")
    private String resource;

    @NotEmpty
    @Schema(description = "Allowed actions", example = "[\"READ\", \"WRITE\"]")
    private List<String> actions;
}

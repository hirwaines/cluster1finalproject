package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
@Schema(name = "UpdateProfileDto", description = "Fields to update on the current user's profile")
public class UpdateProfileDto {

    @Size(max = 100)
    private String name;

    @Size(max = 120)
    private String department;

    @Size(max = 120)
    private String position;

    @Size(max = 200)
    private String institution;

    @Size(max = 50)
    private String orcid;

    @Size(max = 100)
    private String degree;

    private String educationSummary;

    private Integer yearsExperience;

    @Size(max = 500)
    private String cvUrl;

    @Size(max = 500)
    private String profilePicture;

    private List<String> expertiseKeywords;

    private List<String> publicationsList;

    @Size(max = 50)
    private String phone;

    @Size(max = 200)
    private String organization;

    private List<String> areasOfInterest;

    @Size(max = 100)
    private String investmentRange;
}

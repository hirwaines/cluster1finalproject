package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
@Schema(name = "ResearcherSignupDto", description = "Payload for researcher registration (multi-step)")
public class ResearcherSignupDto {

    @NotBlank
    @Schema(description = "Full name", example = "Dr. Jane Smith")
    private String name;

    @NotBlank
    @Email
    @Size(max = 254)
    @Schema(description = "Work email", example = "jane.smith@university.edu")
    private String email;

    @NotBlank
    @Size(min = 8, max = 72)
    @Schema(description = "Password (8-72 chars)", example = "SecurePass123!")
    private String password;

    @Schema(description = "University or research institution", example = "MIT")
    private String institution;

    @Schema(description = "Department", example = "Computer Science")
    private String department;

    @Schema(description = "ORCID identifier", example = "0000-0001-2345-6789")
    private String orcid;

    @Schema(description = "Highest degree", example = "PhD")
    private String degree;

    @Schema(description = "Education background summary")
    private String educationSummary;

    @Min(0)
    @Schema(description = "Years of research experience", example = "5")
    private Integer yearsExperience;

    @Schema(description = "URL of uploaded CV (PDF/DOC)", example = "https://storage.example.com/cvs/abc123.pdf")
    private String cvUrl;

    @Schema(description = "Prior publication titles/citations (one entry per item)", example = "[\"Smith J. (2023). Deep nets. Nature.\"]")
    private List<String> publicationsList;

    @Schema(description = "Expertise keywords", example = "[\"machine learning\", \"NLP\", \"computer vision\"]")
    private List<String> expertiseKeywords;
}

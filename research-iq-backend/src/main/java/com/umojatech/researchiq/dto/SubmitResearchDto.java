package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Schema(name = "SubmitResearchDto", description = "Payload for submitting a research publication for review")
public class SubmitResearchDto {

    @NotBlank
    @Schema(description = "Publication title")
    private String title;

    @NotBlank
    @Schema(description = "Abstract text")
    private String abstractText;

    @NotEmpty
    @Schema(description = "Author names", example = "[\"Jane Smith\", \"John Doe\"]")
    private List<String> authors;

    @NotBlank
    @Schema(description = "Research field/category", example = "Computer Science")
    private String field;

    @Schema(description = "DOI (optional)", example = "10.1000/xyz123")
    private String doi;

    @Schema(description = "Funding status", example = "SEEKING", allowableValues = {"SEEKING", "FUNDED", "COMPLETED"})
    private String fundingStatus;

    @Schema(description = "Funding amount needed (if SEEKING)", example = "50000.00")
    private BigDecimal fundingAmountNeeded;

    @Schema(description = "URL of uploaded cover image")
    private String coverImage;

    @Schema(description = "URL of uploaded PDF attachment")
    private String attachmentUrl;

    @Schema(description = "Attachment display label", example = "Full Paper (PDF)")
    private String attachmentLabel;

    @Schema(description = "Optional keyword hints", example = "[\"deep learning\", \"transformers\", \"NLP\"]")
    private List<String> suggestedKeywords;
}

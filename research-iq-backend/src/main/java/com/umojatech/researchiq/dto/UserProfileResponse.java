package com.umojatech.researchiq.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@Schema(name = "UserProfileResponse", description = "User profile data")
public class UserProfileResponse {

    private String id;
    private String name;
    private String email;
    private String role;
    private String status;
    private String department;
    private String position;
    private String institution;
    private String orcid;
    private String degree;
    private String educationSummary;
    private Integer yearsExperience;
    private String cvUrl;
    private String profilePicture;
    private List<String> expertiseKeywords;
    private List<String> publicationsList;
    private Integer hIndex;
    private Integer citedByCount;
    private Integer worksCount;
    private List<OpenAlexPublicationDto> openalexPublications;
    private String phone;
    private String organization;
    private List<String> areasOfInterest;
    private String investmentRange;
    private Instant joinedDate;
}

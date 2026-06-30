package com.umojatech.researchiq.entity;

import com.umojatech.researchiq.entity.enums.UserRole;
import com.umojatech.researchiq.entity.enums.UserStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role = UserRole.RESEARCHER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserStatus status = UserStatus.PENDING;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 120)
    private String department;

    @Column(length = 120)
    private String position;

    @Column(name = "expertise_keywords", columnDefinition = "text")
    private String expertiseKeywords;

    // Researcher profile fields
    @Column(length = 200)
    private String institution;

    @Column(length = 50)
    private String orcid;

    @Column(length = 100)
    private String degree;

    @Column(name = "education_summary", columnDefinition = "text")
    private String educationSummary;

    @Column(name = "years_experience")
    private Integer yearsExperience;

    @Column(name = "cv_url", length = 500)
    private String cvUrl;

    @Column(name = "profile_picture", length = 500)
    private String profilePicture;

    @Column(name = "publications_list", columnDefinition = "text")
    private String publicationsList;

    @Column(name = "h_index")
    private Integer hIndex;

    @Column(name = "cited_by_count")
    private Integer citedByCount;

    @Column(name = "works_count")
    private Integer worksCount;

    @Column(name = "openalex_publications", columnDefinition = "text")
    private String openalexPublications;

    // Funder profile fields
    @Column(length = 50)
    private String phone;

    @Column(length = 200)
    private String organization;

    @Column(name = "areas_of_interest", columnDefinition = "text")
    private String areasOfInterest;

    @Column(name = "investment_range", length = 100)
    private String investmentRange;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}

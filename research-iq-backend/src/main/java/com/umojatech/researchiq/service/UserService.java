package com.umojatech.researchiq.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.umojatech.researchiq.dto.OpenAlexPublicationDto;
import com.umojatech.researchiq.dto.UpdateProfileDto;
import com.umojatech.researchiq.dto.UserProfileResponse;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.exception.ResourceNotFoundException;
import com.umojatech.researchiq.repository.UserRepository;
import com.umojatech.researchiq.util.CsvUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public UserProfileResponse getMyProfile(Authentication authentication) {
        User user = getByEmail(authentication.getName());
        return toResponse(user);
    }

    @Transactional
    public UserProfileResponse updateMyProfile(UpdateProfileDto request, Authentication authentication) {
        User user = getByEmail(authentication.getName());

        if (request.getName() != null) user.setName(request.getName());
        if (request.getDepartment() != null) user.setDepartment(request.getDepartment());
        if (request.getPosition() != null) user.setPosition(request.getPosition());
        if (request.getInstitution() != null) user.setInstitution(request.getInstitution());
        if (request.getOrcid() != null) user.setOrcid(request.getOrcid());
        if (request.getDegree() != null) user.setDegree(request.getDegree());
        if (request.getEducationSummary() != null) user.setEducationSummary(request.getEducationSummary());
        if (request.getYearsExperience() != null) user.setYearsExperience(request.getYearsExperience());
        if (request.getCvUrl() != null) user.setCvUrl(request.getCvUrl());
        if (request.getProfilePicture() != null) user.setProfilePicture(request.getProfilePicture());
        if (request.getExpertiseKeywords() != null) user.setExpertiseKeywords(CsvUtil.toCsv(request.getExpertiseKeywords()));
        if (request.getPublicationsList() != null) user.setPublicationsList(CsvUtil.toCsv(request.getPublicationsList()));
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getOrganization() != null) user.setOrganization(request.getOrganization());
        if (request.getAreasOfInterest() != null) user.setAreasOfInterest(CsvUtil.toCsv(request.getAreasOfInterest()));
        if (request.getInvestmentRange() != null) user.setInvestmentRange(request.getInvestmentRange());

        return toResponse(userRepository.save(user));
    }

    public UserProfileResponse getUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toResponse(user);
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public List<OpenAlexPublicationDto> parsePublications(String json) {
        if (json == null || json.isBlank()) return null;
        try {
            return objectMapper.readValue(json, new TypeReference<List<OpenAlexPublicationDto>>() {});
        } catch (Exception e) {
            log.warn("Could not parse openalexPublications JSON: {}", e.getMessage());
            return null;
        }
    }

    public UserProfileResponse toResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId().toString())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .department(user.getDepartment())
                .position(user.getPosition())
                .institution(user.getInstitution())
                .orcid(user.getOrcid())
                .degree(user.getDegree())
                .educationSummary(user.getEducationSummary())
                .yearsExperience(user.getYearsExperience())
                .cvUrl(user.getCvUrl())
                .profilePicture(user.getProfilePicture())
                .expertiseKeywords(CsvUtil.toList(user.getExpertiseKeywords()))
                .publicationsList(CsvUtil.toList(user.getPublicationsList()))
                .hIndex(user.getHIndex())
                .citedByCount(user.getCitedByCount())
                .worksCount(user.getWorksCount())
                .openalexPublications(parsePublications(user.getOpenalexPublications()))
                .phone(user.getPhone())
                .organization(user.getOrganization())
                .areasOfInterest(CsvUtil.toList(user.getAreasOfInterest()))
                .investmentRange(user.getInvestmentRange())
                .joinedDate(user.getCreatedAt())
                .build();
    }
}

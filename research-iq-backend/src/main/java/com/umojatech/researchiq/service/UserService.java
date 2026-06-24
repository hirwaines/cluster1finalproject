package com.umojatech.researchiq.service;

import com.umojatech.researchiq.dto.UpdateProfileDto;
import com.umojatech.researchiq.dto.UserProfileResponse;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.exception.ResourceNotFoundException;
import com.umojatech.researchiq.repository.UserRepository;
import com.umojatech.researchiq.util.CsvUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

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
                .phone(user.getPhone())
                .organization(user.getOrganization())
                .areasOfInterest(CsvUtil.toList(user.getAreasOfInterest()))
                .investmentRange(user.getInvestmentRange())
                .joinedDate(user.getCreatedAt())
                .build();
    }
}

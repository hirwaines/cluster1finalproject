package com.umojatech.researchiq.service;

import com.umojatech.researchiq.dto.ApproveRejectDto;
import com.umojatech.researchiq.dto.OpenAlexPublicationDto;
import com.umojatech.researchiq.dto.PendingPublicationResponse;
import com.umojatech.researchiq.dto.ResearchResponse;
import com.umojatech.researchiq.dto.UserDirectoryResponse;
import com.umojatech.researchiq.dto.UserProfileResponse;
import com.umojatech.researchiq.entity.PendingPublication;
import com.umojatech.researchiq.entity.Research;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.entity.enums.NotificationType;
import com.umojatech.researchiq.entity.enums.UserRole;
import com.umojatech.researchiq.entity.enums.UserStatus;
import com.umojatech.researchiq.exception.BusinessException;
import com.umojatech.researchiq.exception.ResourceNotFoundException;
import com.umojatech.researchiq.repository.PendingPublicationRepository;
import com.umojatech.researchiq.repository.ResearchRepository;
import com.umojatech.researchiq.repository.UserRepository;
import com.umojatech.researchiq.util.CsvUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);
    private static final String USER_NOT_FOUND = "User not found";
    private static final String STATUS_PENDING = "PENDING";
    private static final String AUDIT_SUCCESS = "SUCCESS";
    private static final String RESOURCE_USERS = "users";
    private static final String RESOURCE_PUBLICATIONS = "pending_publications";

    private final UserRepository userRepository;
    private final PendingPublicationRepository pendingPublicationRepository;
    private final ResearchRepository researchRepository;
    private final ResearchService researchService;
    private final NotificationService notificationService;
    private final AuditService auditService;
    private final ObjectMapper objectMapper;


    public List<UserProfileResponse> getPendingUsers(String role) {
        if (role != null && !role.isBlank()) {
            UserRole userRole;
            try {
                userRole = UserRole.valueOf(role.toUpperCase(Locale.ROOT));
            } catch (IllegalArgumentException e) {
                throw new BusinessException("Invalid role: " + role);
            }
            return userRepository.findByRoleAndStatusOrderByName(userRole, UserStatus.PENDING)
                    .stream().map(this::toProfileResponse).toList();
        }
        return userRepository.findByStatusOrderByName(UserStatus.PENDING)
                .stream().map(this::toProfileResponse).toList();
    }

    @Transactional
    public UserProfileResponse approveUser(UUID userId, Authentication authentication) {
        ensureAdmin(authentication);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(USER_NOT_FOUND));

        if (user.getStatus() != UserStatus.PENDING) {
            throw new BusinessException("User is not in PENDING status");
        }

        user.setStatus(UserStatus.ACTIVE);
        User saved = userRepository.save(user);
        notificationService.createNotification(saved, NotificationType.SYSTEM,
                "Account approved",
                "Your account has been approved. You can now sign in.",
                "/login");
        auditService.record(actor(authentication), "APPROVE_USER", RESOURCE_USERS,userId.toString(), AUDIT_SUCCESS);
        return toProfileResponse(saved);
    }

    @Transactional
    public UserProfileResponse rejectUser(UUID userId, Authentication authentication) {
        ensureAdmin(authentication);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(USER_NOT_FOUND));

        if (user.getStatus() != UserStatus.PENDING) {
            throw new BusinessException("User is not in PENDING status");
        }

        user.setStatus(UserStatus.DISABLED);
        UserProfileResponse response = toProfileResponse(userRepository.save(user));
        auditService.record(actor(authentication), "REJECT_USER", RESOURCE_USERS,userId.toString(), AUDIT_SUCCESS);
        return response;
    }

    public List<UserDirectoryResponse> getUserDirectory(String role, String status) {
        List<User> users;
        if (role != null && !role.isBlank() && status != null && !status.isBlank()) {
            UserRole userRole = parseRole(role);
            UserStatus userStatus = parseStatus(status);
            users = userRepository.findByRoleAndStatusOrderByName(userRole, userStatus);
        } else if (role != null && !role.isBlank()) {
            users = userRepository.findByRoleOrderByName(parseRole(role));
        } else if (status != null && !status.isBlank()) {
            users = userRepository.findByStatusOrderByName(parseStatus(status));
        } else {
            users = userRepository.findAll();
        }
        return users.stream().map(this::toDirectoryResponse).toList();
    }

    @Transactional
    public UserDirectoryResponse disableUser(UUID userId, Authentication authentication) {
        ensureAdmin(authentication);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(USER_NOT_FOUND));
        user.setStatus(UserStatus.DISABLED);
        UserDirectoryResponse response = toDirectoryResponse(userRepository.save(user));
        auditService.record(actor(authentication), "DISABLE_USER", RESOURCE_USERS,userId.toString(), AUDIT_SUCCESS);
        return response;
    }

    @Transactional
    public UserDirectoryResponse enableUser(UUID userId, Authentication authentication) {
        ensureAdmin(authentication);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(USER_NOT_FOUND));
        user.setStatus(UserStatus.ACTIVE);
        UserDirectoryResponse response = toDirectoryResponse(userRepository.save(user));
        auditService.record(actor(authentication), "ENABLE_USER", RESOURCE_USERS,userId.toString(), AUDIT_SUCCESS);
        return response;
    }

    @Transactional
    public void deleteUser(UUID userId, Authentication authentication) {
        ensureAdmin(authentication);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(USER_NOT_FOUND));
        User auditActor = actor(authentication);
        userRepository.delete(user);
        auditService.record(auditActor, "DELETE_USER", RESOURCE_USERS,userId.toString(), AUDIT_SUCCESS);
    }

    public List<PendingPublicationResponse> getPendingPublications() {
        return pendingPublicationRepository.findByStatusOrderBySubmittedDateDesc(STATUS_PENDING)
                .stream().map(researchService::toPendingResponse).toList();
    }

    @Transactional
    public ResearchResponse approvePendingPublication(UUID pendingId, Authentication authentication) {
        ensureAdmin(authentication);
        PendingPublication pending = pendingPublicationRepository.findById(pendingId)
                .orElseThrow(() -> new ResourceNotFoundException("Pending publication not found"));

        if (!STATUS_PENDING.equals(pending.getStatus())) {
            throw new BusinessException("Publication is not in PENDING status");
        }

        Research research = new Research();
        research.setResearcher(pending.getResearcher());
        research.setTitle(pending.getTitle());
        research.setAbstractText(pending.getAbstractText());
        research.setAuthors(pending.getAuthors());
        research.setField(pending.getField());
        research.setDoi(pending.getDoi());
        research.setFundingStatus(pending.getFundingStatus());
        research.setFundingAmountNeeded(pending.getFundingAmountNeeded());
        research.setCoverImage(pending.getCoverImage());
        research.setAttachmentUrl(pending.getAttachmentUrl());
        research.setAttachmentLabel(pending.getAttachmentLabel());
        research.setKeywords(pending.getSuggestedKeywords());
        research.setPublicationDate(LocalDate.now());
        research.setCitationCount(0);
        research.setLikeCount(0);
        research.setShareCount(0);

        Research saved = researchRepository.save(research);

        pending.setStatus("APPROVED");
        pendingPublicationRepository.save(pending);

        notificationService.createNotification(pending.getResearcher(), NotificationType.PUBLICATION,
                "Publication approved",
                "Your publication \"" + pending.getTitle() + "\" has been approved and is now public.",
                "/research/" + saved.getId());

        auditService.record(actor(authentication), "APPROVE_PUBLICATION", RESOURCE_PUBLICATIONS,pendingId.toString(), AUDIT_SUCCESS);
        return researchService.toResponse(saved);
    }

    @Transactional
    public PendingPublicationResponse rejectPendingPublication(UUID pendingId, ApproveRejectDto request, Authentication authentication) {
        ensureAdmin(authentication);
        PendingPublication pending = pendingPublicationRepository.findById(pendingId)
                .orElseThrow(() -> new ResourceNotFoundException("Pending publication not found"));

        if (!STATUS_PENDING.equals(pending.getStatus())) {
            throw new BusinessException("Publication is not in PENDING status");
        }

        pending.setStatus("REJECTED");
        pending.setRejectionReason(request.getReason());
        PendingPublication saved = pendingPublicationRepository.save(pending);

        notificationService.createNotification(saved.getResearcher(), NotificationType.PUBLICATION,
                "Publication needs revision",
                "Your publication \"" + saved.getTitle() + "\" was not approved."
                        + (saved.getRejectionReason() != null ? " Reason: " + saved.getRejectionReason() : ""),
                "/research/my");
        auditService.record(actor(authentication), "REJECT_PUBLICATION", RESOURCE_PUBLICATIONS,pendingId.toString(), AUDIT_SUCCESS);
        return researchService.toPendingResponse(saved);
    }

    private User actor(Authentication authentication) {
        if (authentication == null) {
            return null;
        }
        return userRepository.findByEmail(authentication.getName()).orElse(null);
    }

    private void ensureAdmin(Authentication authentication) {
        if (authentication == null) {
            throw new BusinessException("Authentication required");
        }
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);
        if (!isAdmin) {
            throw new BusinessException("Admin access required");
        }
    }

    private UserRole parseRole(String role) {
        try {
            return UserRole.valueOf(role.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Invalid role: " + role);
        }
    }

    private UserStatus parseStatus(String status) {
        try {
            return UserStatus.valueOf(status.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Invalid status: " + status);
        }
    }

    private UserProfileResponse toProfileResponse(User user) {
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

    private List<OpenAlexPublicationDto> parsePublications(String json) {
        if (json == null || json.isBlank()) return null;
        try {
            return objectMapper.readValue(json, new TypeReference<List<OpenAlexPublicationDto>>() {});
        } catch (Exception e) {
            log.warn("Could not parse openalexPublications JSON: {}", e.getMessage());
            return null;
        }
    }

    private UserDirectoryResponse toDirectoryResponse(User user) {
        return UserDirectoryResponse.builder()
                .id(user.getId().toString())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .department(user.getDepartment())
                .institution(user.getInstitution())
                .organization(user.getOrganization())
                .build();
    }
}

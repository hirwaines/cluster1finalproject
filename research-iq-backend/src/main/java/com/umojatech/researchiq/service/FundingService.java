package com.umojatech.researchiq.service;

import com.umojatech.researchiq.dto.CollaborationRequestResponse;
import com.umojatech.researchiq.dto.FunderInterestDto;
import com.umojatech.researchiq.dto.FunderInterestResponse;
import com.umojatech.researchiq.dto.FunderRfpDto;
import com.umojatech.researchiq.dto.FunderRfpResponse;
import com.umojatech.researchiq.dto.FundingApplicationDto;
import com.umojatech.researchiq.dto.ResearchResponse;
import com.umojatech.researchiq.dto.UpdateInterestStatusDto;
import com.umojatech.researchiq.entity.CollaborationRequest;
import com.umojatech.researchiq.entity.FunderInterest;
import com.umojatech.researchiq.entity.FunderRfp;
import com.umojatech.researchiq.entity.Research;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.entity.enums.CollaborationRequestStatus;
import com.umojatech.researchiq.entity.enums.FunderInterestStatus;
import com.umojatech.researchiq.entity.enums.FundingStatus;
import com.umojatech.researchiq.entity.enums.NotificationType;
import com.umojatech.researchiq.entity.enums.RequestType;
import com.umojatech.researchiq.entity.enums.UserRole;
import com.umojatech.researchiq.exception.BusinessException;
import com.umojatech.researchiq.exception.DuplicateResourceException;
import com.umojatech.researchiq.exception.ResourceNotFoundException;
import com.umojatech.researchiq.repository.CollaborationRequestRepository;
import com.umojatech.researchiq.repository.FunderInterestRepository;
import com.umojatech.researchiq.repository.FunderRfpRepository;
import com.umojatech.researchiq.repository.ResearchRepository;
import com.umojatech.researchiq.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FundingService {

    private final FunderInterestRepository funderInterestRepository;
    private final FunderRfpRepository funderRfpRepository;
    private final ResearchRepository researchRepository;
    private final UserRepository userRepository;
    private final ResearchService researchService;
    private final NotificationService notificationService;
    private final CollaborationRequestRepository collaborationRequestRepository;
    private final CollaborationService collaborationService;

    public List<ResearchResponse> getSeekingFundingProjects(String query, String field) {
        List<Research> projects = researchRepository.findByFundingStatusOrderByCreatedAtDesc(FundingStatus.SEEKING);
        if (query != null && !query.isBlank()) {
            String q = query.trim().toLowerCase(Locale.ROOT);
            projects = projects.stream()
                    .filter(r -> containsIgnoreCase(r.getTitle(), q)
                            || containsIgnoreCase(r.getField(), q)
                            || containsIgnoreCase(r.getKeywords(), q))
                    .toList();
        }
        if (field != null && !field.isBlank()) {
            projects = projects.stream()
                    .filter(r -> field.equalsIgnoreCase(r.getField()))
                    .toList();
        }
        return projects.stream().map(researchService::toResponse).toList();
    }

    @Transactional
    public FunderInterestResponse expressInterest(FunderInterestDto request, Authentication authentication) {
        User funder = getUser(authentication);
        if (funder.getRole() != UserRole.FUNDER) {
            throw new BusinessException("Only funders can express interest in projects");
        }

        Research research = researchRepository.findById(request.getResearchId())
                .orElseThrow(() -> new ResourceNotFoundException("Research not found"));

        if (funderInterestRepository.findByFunder_IdAndResearch_Id(funder.getId(), research.getId()).isPresent()) {
            throw new DuplicateResourceException("You have already expressed interest in this project");
        }

        FunderInterest interest = new FunderInterest();
        interest.setFunder(funder);
        interest.setResearch(research);
        interest.setMessage(request.getMessage());
        interest.setStatus(FunderInterestStatus.PENDING);

        FunderInterest saved = funderInterestRepository.save(interest);
        notificationService.createNotification(research.getResearcher(), NotificationType.FUNDING,
                "New funding interest",
                funder.getName() + " expressed interest in \"" + research.getTitle() + "\".",
                "/funding");
        return toInterestResponse(saved);
    }

    public List<FunderInterestResponse> getMyInterests(Authentication authentication) {
        User funder = getUser(authentication);
        return funderInterestRepository.findByFunder_IdOrderByCreatedAtDesc(funder.getId())
                .stream().map(this::toInterestResponse).toList();
    }

    public List<FunderInterestResponse> getInterestsForResearch(UUID researchId, Authentication authentication) {
        User user = getUser(authentication);
        Research research = researchRepository.findById(researchId)
                .orElseThrow(() -> new ResourceNotFoundException("Research not found"));
        boolean isOwner = research.getResearcher().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == UserRole.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new BusinessException("Not authorized to view interests for this project");
        }
        return funderInterestRepository.findByResearch_IdOrderByCreatedAtDesc(researchId)
                .stream().map(this::toInterestResponse).toList();
    }

    @Transactional
    public FunderInterestResponse updateInterestStatus(UUID interestId, UpdateInterestStatusDto request, Authentication authentication) {
        User user = getUser(authentication);
        FunderInterest interest = funderInterestRepository.findById(interestId)
                .orElseThrow(() -> new ResourceNotFoundException("Interest not found"));

        boolean isResearcher = interest.getResearch().getResearcher().getId().equals(user.getId());
        boolean isFunder = interest.getFunder().getId().equals(user.getId());

        if (!isResearcher && !isFunder) {
            throw new BusinessException("Not authorized to update this interest");
        }

        FunderInterestStatus newStatus;
        try {
            newStatus = FunderInterestStatus.valueOf(request.getStatus().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Invalid status: " + request.getStatus());
        }

        interest.setStatus(newStatus);
        FunderInterest saved = funderInterestRepository.save(interest);
        User counterparty = isFunder ? saved.getResearch().getResearcher() : saved.getFunder();
        notificationService.createNotification(counterparty, NotificationType.FUNDING,
                "Funding interest " + newStatus.name().toLowerCase(Locale.ROOT),
                user.getName() + " updated a funding interest for \"" + saved.getResearch().getTitle() + "\" to " + newStatus.name() + ".",
                "/funding");
        return toInterestResponse(saved);
    }

    @Transactional
    public FunderRfpResponse postRfp(FunderRfpDto request, Authentication authentication) {
        User funder = getUser(authentication);
        if (funder.getRole() != UserRole.FUNDER) {
            throw new BusinessException("Only funders can post funding opportunities");
        }

        FunderRfp rfp = new FunderRfp();
        rfp.setFunder(funder);
        rfp.setTitle(request.getTitle().trim());
        rfp.setSummary(request.getSummary().trim());
        rfp.setAmountRange(request.getAmountRange());
        rfp.setAreas(request.getAreas());
        rfp.setDeadline(request.getDeadline());
        rfp.setStatus("OPEN");

        return toRfpResponse(funderRfpRepository.save(rfp));
    }

    @Transactional
    public CollaborationRequestResponse applyToOpportunity(FundingApplicationDto request, Authentication authentication) {
        User researcher = getUser(authentication);
        if (researcher.getRole() != UserRole.RESEARCHER) {
            throw new BusinessException("Only researchers can apply to funding opportunities");
        }

        FunderRfp rfp = funderRfpRepository.findById(request.getRfpId())
                .orElseThrow(() -> new ResourceNotFoundException("Funding opportunity not found"));

        if (request.getResearchId() != null) {
            Research research = researchRepository.findById(request.getResearchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Research not found"));
            if (!research.getResearcher().getId().equals(researcher.getId())) {
                throw new BusinessException("You can only apply on behalf of your own research");
            }
        }

        CollaborationRequest application = new CollaborationRequest();
        application.setRequestType(RequestType.FUNDING);
        application.setFromUser(researcher);
        application.setToUser(rfp.getFunder());
        application.setResearchId(request.getResearchId());
        application.setProposedAmount(request.getProposedAmount());
        application.setTimelineMonths(request.getTimelineMonths());
        application.setMessage(request.getMessage().trim());
        application.setStatus(CollaborationRequestStatus.PENDING);

        CollaborationRequest saved = collaborationRequestRepository.save(application);
        notificationService.createNotification(rfp.getFunder(), NotificationType.FUNDING,
                "New funding application",
                researcher.getName() + " applied to your funding opportunity \"" + rfp.getTitle() + "\".",
                "/collaboration/requests");
        return collaborationService.toResponse(saved);
    }

    public List<FunderRfpResponse> getOpportunities(String status) {
        List<FunderRfp> rfps = status != null && !status.isBlank()
                ? funderRfpRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase(Locale.ROOT))
                : funderRfpRepository.findByOrderByCreatedAtDesc();
        return rfps.stream().map(this::toRfpResponse).toList();
    }

    public List<FunderRfpResponse> getMyRfps(Authentication authentication) {
        User funder = getUser(authentication);
        return funderRfpRepository.findByFunder_IdOrderByCreatedAtDesc(funder.getId())
                .stream().map(this::toRfpResponse).toList();
    }

    private User getUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private boolean containsIgnoreCase(String value, String query) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(query);
    }

    private FunderInterestResponse toInterestResponse(FunderInterest fi) {
        return FunderInterestResponse.builder()
                .id(fi.getId().toString())
                .funderId(fi.getFunder().getId().toString())
                .funderName(fi.getFunder().getName())
                .funderOrganization(fi.getFunder().getOrganization())
                .researchId(fi.getResearch().getId().toString())
                .researchTitle(fi.getResearch().getTitle())
                .status(fi.getStatus().name())
                .message(fi.getMessage())
                .createdAt(fi.getCreatedAt())
                .updatedAt(fi.getUpdatedAt())
                .build();
    }

    private FunderRfpResponse toRfpResponse(FunderRfp rfp) {
        return FunderRfpResponse.builder()
                .id(rfp.getId().toString())
                .funderId(rfp.getFunder().getId().toString())
                .funderName(rfp.getFunder().getName())
                .funderOrganization(rfp.getFunder().getOrganization())
                .title(rfp.getTitle())
                .summary(rfp.getSummary())
                .amountRange(rfp.getAmountRange())
                .areas(rfp.getAreas())
                .deadline(rfp.getDeadline())
                .status(rfp.getStatus())
                .createdAt(rfp.getCreatedAt())
                .build();
    }
}

package com.umojatech.researchiq.service;

import com.umojatech.researchiq.dto.CollaborationDiscoveryResponse;
import com.umojatech.researchiq.dto.CollaborationRequestResponse;
import com.umojatech.researchiq.dto.CreateCollaborationRequestDto;
import com.umojatech.researchiq.dto.UpdateCollaborationRequestStatusDto;
import com.umojatech.researchiq.entity.CollaborationRequest;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.entity.enums.CollaborationRequestStatus;
import com.umojatech.researchiq.entity.enums.NotificationType;
import com.umojatech.researchiq.exception.BusinessException;
import com.umojatech.researchiq.exception.ResourceNotFoundException;
import com.umojatech.researchiq.repository.CollaborationRequestRepository;
import com.umojatech.researchiq.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CollaborationService {

  private final UserRepository userRepository;
  private final CollaborationRequestRepository collaborationRequestRepository;
  private final NotificationService notificationService;

  public List<CollaborationDiscoveryResponse> discoverCollaborators(String query, String department, Authentication authentication) {
    User currentUser = getCurrentUser(authentication);
    String normalizedQuery = query == null ? "" : query.trim().toLowerCase(Locale.ROOT);
    String normalizedDepartment = department == null ? "" : department.trim().toLowerCase(Locale.ROOT);

    return userRepository.findAll().stream()
            .filter(user -> !user.getId().equals(currentUser.getId()))
        .filter(user -> user.getRole() == com.umojatech.researchiq.entity.enums.UserRole.RESEARCHER)
            .filter(user -> normalizedDepartment.isEmpty() || normalizedDepartment.equalsIgnoreCase(nullSafe(user.getDepartment())))
            .filter(user -> normalizedQuery.isEmpty()
                    || containsIgnoreCase(user.getName(), normalizedQuery)
                    || containsIgnoreCase(user.getDepartment(), normalizedQuery)
                    || containsAnyKeyword(user.getExpertiseKeywords(), normalizedQuery))
            .map(user -> toDiscoveryResponse(currentUser, user, normalizedQuery))
            .sorted((left, right) -> Integer.compare(right.getMatchScore(), left.getMatchScore()))
            .toList();
  }

  @Transactional
  public CollaborationRequestResponse createRequest(CreateCollaborationRequestDto request, Authentication authentication) {
    User currentUser = getCurrentUser(authentication);
    User targetUser = userRepository.findById(request.getToUserId())
            .orElseThrow(() -> new ResourceNotFoundException("Target user not found"));

    if (currentUser.getId().equals(targetUser.getId())) {
      throw new BusinessException("You cannot send a collaboration request to yourself");
    }

    CollaborationRequest collaborationRequest = new CollaborationRequest();
    collaborationRequest.setFromUser(currentUser);
    collaborationRequest.setToUser(targetUser);
    collaborationRequest.setCollaborationType(request.getCollaborationType().trim());
    collaborationRequest.setTimelineMonths(request.getTimelineMonths());
    collaborationRequest.setMessage(request.getMessage().trim());
    collaborationRequest.setStatus(CollaborationRequestStatus.PENDING);

    CollaborationRequest saved = collaborationRequestRepository.save(collaborationRequest);
    notificationService.createNotification(targetUser, NotificationType.COLLABORATION,
            "New collaboration request",
            currentUser.getName() + " sent you a collaboration request.",
            "/collaboration/requests");
    return toResponse(saved);
  }

  public List<CollaborationRequestResponse> getIncomingRequests(Authentication authentication, CollaborationRequestStatus status) {
    User currentUser = getCurrentUser(authentication);
    List<CollaborationRequest> requests = status == null
            ? collaborationRequestRepository.findByToUser_IdOrderByCreatedAtDesc(currentUser.getId())
            : collaborationRequestRepository.findByToUser_IdAndStatusOrderByCreatedAtDesc(currentUser.getId(), status);
    return requests.stream().map(this::toResponse).toList();
  }

  public List<CollaborationRequestResponse> getSentRequests(Authentication authentication, CollaborationRequestStatus status) {
    User currentUser = getCurrentUser(authentication);
    List<CollaborationRequest> requests = status == null
            ? collaborationRequestRepository.findByFromUser_IdOrderByCreatedAtDesc(currentUser.getId())
            : collaborationRequestRepository.findByFromUser_IdAndStatusOrderByCreatedAtDesc(currentUser.getId(), status);
    return requests.stream().map(this::toResponse).toList();
  }

  @Transactional
  public CollaborationRequestResponse updateRequestStatus(UUID requestId, UpdateCollaborationRequestStatusDto payload, Authentication authentication) {
    User currentUser = getCurrentUser(authentication);
    CollaborationRequest request = collaborationRequestRepository.findById(requestId)
            .orElseThrow(() -> new ResourceNotFoundException("Collaboration request not found"));

    if (!request.getToUser().getId().equals(currentUser.getId())) {
      throw new BusinessException("Only the recipient can update this request");
    }

    if (request.getStatus() != CollaborationRequestStatus.PENDING) {
      throw new BusinessException("Only pending requests can be updated");
    }

    request.setStatus(payload.getStatus());
    CollaborationRequest saved = collaborationRequestRepository.save(request);
    String verb = saved.getStatus().name().toLowerCase(Locale.ROOT);
    notificationService.createNotification(saved.getFromUser(), NotificationType.COLLABORATION,
            "Collaboration request " + verb,
            currentUser.getName() + " " + verb + " your collaboration request.",
            "/collaboration/requests");
    return toResponse(saved);
  }

  private User getCurrentUser(Authentication authentication) {
    if (authentication == null || authentication.getName() == null) {
      throw new BusinessException("Authentication is required");
    }

    return userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
  }

  private CollaborationDiscoveryResponse toDiscoveryResponse(User currentUser, User candidate, String query) {
    List<String> matchedKeywords = overlapKeywords(currentUser.getExpertiseKeywords(), candidate.getExpertiseKeywords());
    boolean departmentMatch = notBlank(currentUser.getDepartment())
            && currentUser.getDepartment().equalsIgnoreCase(candidate.getDepartment());
    int score = 0;
    if (departmentMatch) {
      score += 40;
    }
    score += Math.min(matchedKeywords.size() * 20, 60);
    if (!query.isBlank()) {
      if (containsIgnoreCase(candidate.getName(), query)) {
        score += 20;
      }
      if (containsIgnoreCase(candidate.getDepartment(), query)) {
        score += 10;
      }
      if (containsAnyKeyword(candidate.getExpertiseKeywords(), query)) {
        score += 10;
      }
    }

    List<String> explanationParts = new ArrayList<>();
    if (departmentMatch) {
      explanationParts.add("Same department");
    }
    if (!matchedKeywords.isEmpty()) {
      explanationParts.add("Shared expertise keywords: " + String.join(", ", matchedKeywords));
    }
    if (explanationParts.isEmpty() && !query.isBlank()) {
      explanationParts.add("Matches search term: " + query);
    }

    return CollaborationDiscoveryResponse.builder()
            .userId(candidate.getId().toString())
            .name(candidate.getName())
            .department(candidate.getDepartment())
            .expertiseKeywords(com.umojatech.researchiq.util.CsvUtil.toList(candidate.getExpertiseKeywords()))
            .matchScore(Math.max(score, 1))
            .explanation(String.join("; ", explanationParts))
            .build();
  }

  public CollaborationRequestResponse toResponse(CollaborationRequest request) {
    return CollaborationRequestResponse.builder()
            .id(request.getId().toString())
            .requestType(request.getRequestType() != null ? request.getRequestType().name() : null)
            .fromUserId(request.getFromUser().getId().toString())
            .fromUserName(request.getFromUser().getName())
            .toUserId(request.getToUser().getId().toString())
            .toUserName(request.getToUser().getName())
            .collaborationType(request.getCollaborationType())
            .timelineMonths(request.getTimelineMonths())
            .researchId(request.getResearchId() != null ? request.getResearchId().toString() : null)
            .proposedAmount(request.getProposedAmount())
            .message(request.getMessage())
            .status(request.getStatus().name())
            .createdAt(request.getCreatedAt())
            .updatedAt(request.getUpdatedAt())
            .build();
  }

  private boolean containsIgnoreCase(String value, String query) {
    return value != null && value.toLowerCase(Locale.ROOT).contains(query);
  }

  private boolean containsAnyKeyword(String keywords, String query) {
    if (keywords == null || keywords.isBlank()) {
      return false;
    }
    return Arrays.stream(keywords.split("[;,]"))
            .map(String::trim)
            .filter(keyword -> !keyword.isBlank())
            .anyMatch(keyword -> keyword.toLowerCase(Locale.ROOT).contains(query));
  }

  private List<String> overlapKeywords(String currentKeywords, String candidateKeywords) {
    Set<String> current = splitKeywords(currentKeywords);
    return splitKeywords(candidateKeywords).stream()
            .filter(current::contains)
            .toList();
  }

  private Set<String> splitKeywords(String keywords) {
    if (keywords == null || keywords.isBlank()) {
      return Set.of();
    }

    return Arrays.stream(keywords.split("[;,]"))
            .map(keyword -> keyword.trim().toLowerCase(Locale.ROOT))
            .filter(keyword -> !keyword.isBlank())
            .collect(Collectors.toSet());
  }

  private boolean notBlank(String value) {
    return value != null && !value.isBlank();
  }

  private String nullSafe(String value) {
    return value == null ? "" : value;
  }
}
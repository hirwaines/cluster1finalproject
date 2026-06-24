package com.umojatech.researchiq.service;

import com.umojatech.researchiq.dto.PendingPublicationResponse;
import com.umojatech.researchiq.dto.ResearchResponse;
import com.umojatech.researchiq.dto.ResearcherAnalyticsResponse;
import com.umojatech.researchiq.dto.SubmitResearchDto;
import com.umojatech.researchiq.entity.PendingPublication;
import com.umojatech.researchiq.entity.Research;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.entity.enums.FundingStatus;
import com.umojatech.researchiq.entity.enums.UserRole;
import com.umojatech.researchiq.exception.BusinessException;
import com.umojatech.researchiq.exception.ResourceNotFoundException;
import com.umojatech.researchiq.repository.PendingPublicationRepository;
import com.umojatech.researchiq.repository.ResearchRepository;
import com.umojatech.researchiq.repository.UserRepository;
import com.umojatech.researchiq.util.CsvUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResearchService {

    private final ResearchRepository researchRepository;
    private final PendingPublicationRepository pendingPublicationRepository;
    private final UserRepository userRepository;
    private final AiServiceClient aiServiceClient;

    @Transactional
    public PendingPublicationResponse submitResearch(SubmitResearchDto request, Authentication authentication) {
        User researcher = getUser(authentication);
        if (researcher.getRole() != UserRole.RESEARCHER) {
            throw new BusinessException("Only researchers can submit publications");
        }

        PendingPublication pending = new PendingPublication();
        pending.setResearcher(researcher);
        pending.setTitle(request.getTitle().trim());
        pending.setAbstractText(request.getAbstractText().trim());
        pending.setAuthors(CsvUtil.toCsv(request.getAuthors()));
        pending.setField(request.getField().trim());
        pending.setDoi(request.getDoi());
        pending.setFundingStatus(parseFundingStatus(request.getFundingStatus()));
        pending.setFundingAmountNeeded(request.getFundingAmountNeeded());
        pending.setCoverImage(request.getCoverImage());
        pending.setAttachmentUrl(request.getAttachmentUrl());
        pending.setAttachmentLabel(request.getAttachmentLabel());
        pending.setSuggestedKeywords(CsvUtil.toCsv(request.getSuggestedKeywords()));
        pending.setStatus("PENDING");

        return toPendingResponse(pendingPublicationRepository.save(pending));
    }

    public List<ResearchResponse> getFeed(String query, String field) {
        List<Research> results;
        if (query != null && !query.isBlank()) {
            results = researchRepository.searchByQuery(query.trim());
        } else if (field != null && !field.isBlank()) {
            results = researchRepository.findByFieldIgnoreCase(field.trim());
        } else {
            results = researchRepository.findAllByOrderByCreatedAtDesc();
        }
        return results.stream().map(this::toResponse).toList();
    }

    public ResearchResponse getById(UUID id) {
        Research research = researchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Research not found"));
        return toResponse(research);
    }

    public List<ResearchResponse> getMyResearch(Authentication authentication) {
        User researcher = getUser(authentication);
        return researchRepository.findByResearcher_IdOrderByCreatedAtDesc(researcher.getId())
                .stream().map(this::toResponse).toList();
    }

    public ResearcherAnalyticsResponse getAnalytics(Authentication authentication) {
        User researcher = getUser(authentication);
        return buildAnalytics(researcher);
    }

    public ResearcherAnalyticsResponse getAnalyticsForUser(UUID researcherId) {
        User researcher = userRepository.findById(researcherId)
                .orElseThrow(() -> new ResourceNotFoundException("Researcher not found"));
        return buildAnalytics(researcher);
    }

    public List<Map<String, Object>> getTrends() {
        List<Research> all = researchRepository.findAllByOrderByCreatedAtDesc();
        Map<String, Long> byField = all.stream()
                .collect(Collectors.groupingBy(r -> r.getField() == null ? "Unknown" : r.getField(), Collectors.counting()));
        Map<String, Long> byFunding = all.stream()
                .filter(r -> r.getFundingStatus() != null)
                .collect(Collectors.groupingBy(r -> r.getFundingStatus().name(), Collectors.counting()));

        Map<String, Object> base = new java.util.LinkedHashMap<>();
        base.put("byField", byField);
        base.put("byFundingStatus", byFunding);
        base.put("totalPublications", all.size());

        // Enrich with AI trend analysis when available
        Map<String, Object> aiTrends = aiServiceClient.getFullTrendAnalysis();
        if (!aiTrends.isEmpty()) {
            base.put("aiTrends", aiTrends);
        }
        return List.of(base);
    }

    public List<Map<String, Object>> getExpertiseMap(String keyword) {
        List<Research> all = researchRepository.findAllByOrderByCreatedAtDesc();

        if (keyword != null && !keyword.isBlank()) {
            String kw = keyword.trim().toLowerCase(Locale.ROOT);
            all = all.stream()
                    .filter(r -> r.getKeywords() != null && r.getKeywords().toLowerCase(Locale.ROOT).contains(kw))
                    .toList();
        }

        Map<String, Long> keywordToExpertCount = new LinkedHashMap<>();
        all.forEach(r -> {
            if (r.getKeywords() != null) {
                Arrays.stream(r.getKeywords().split("[,;]"))
                        .map(String::trim)
                        .filter(k -> !k.isBlank())
                        .forEach(k -> keywordToExpertCount.merge(k.toLowerCase(Locale.ROOT), 1L, Long::sum));
            }
        });

        List<Map<String, Object>> base = keywordToExpertCount.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(e -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("keyword", e.getKey());
                    row.put("expertCount", e.getValue());
                    return row;
                })
                .collect(Collectors.toList());

        // Enrich with AI expertise search when a keyword is provided
        if (keyword != null && !keyword.isBlank()) {
            List<Map<String, Object>> aiResults = aiServiceClient.searchExpertise(keyword, 10);
            if (!aiResults.isEmpty()) {
                base.forEach(row -> row.put("aiExperts", aiResults));
            }
        }
        return base;
    }

    private ResearcherAnalyticsResponse buildAnalytics(User researcher) {
        List<Research> publications = researchRepository.findByResearcher_IdOrderByCreatedAtDesc(researcher.getId());

        long totalCitations = publications.stream()
                .mapToLong(r -> r.getCitationCount() == null ? 0 : r.getCitationCount())
                .sum();

        int hIndex = computeHIndex(publications);

        Map<String, Long> keywordFreq = new LinkedHashMap<>();
        publications.forEach(r -> {
            if (r.getKeywords() != null) {
                Arrays.stream(r.getKeywords().split("[,;]"))
                        .map(String::trim)
                        .filter(k -> !k.isBlank())
                        .forEach(k -> keywordFreq.merge(k.toLowerCase(Locale.ROOT), 1L, Long::sum));
            }
        });

        Map<String, Long> fundingDist = publications.stream()
                .filter(r -> r.getFundingStatus() != null)
                .collect(Collectors.groupingBy(r -> r.getFundingStatus().name(), Collectors.counting()));

        return ResearcherAnalyticsResponse.builder()
                .researcherId(researcher.getId().toString())
                .researcherName(researcher.getName())
                .publicationCount(publications.size())
                .totalCitations(totalCitations)
                .hIndex(hIndex)
                .keywordFrequency(keywordFreq)
                .fundingStatusDistribution(fundingDist)
                .build();
    }

    private int computeHIndex(List<Research> publications) {
        List<Integer> citations = publications.stream()
                .map(r -> r.getCitationCount() == null ? 0 : r.getCitationCount())
                .sorted((a, b) -> b - a)
                .toList();

        int h = 0;
        for (int i = 0; i < citations.size(); i++) {
            if (citations.get(i) >= i + 1) {
                h = i + 1;
            } else {
                break;
            }
        }
        return h;
    }

    private FundingStatus parseFundingStatus(String value) {
        if (value == null || value.isBlank()) return null;
        try {
            return FundingStatus.valueOf(value.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Invalid funding status: " + value);
        }
    }

    private User getUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public ResearchResponse toResponse(Research r) {
        return ResearchResponse.builder()
                .id(r.getId().toString())
                .title(r.getTitle())
                .abstractText(r.getAbstractText())
                .authors(CsvUtil.toList(r.getAuthors()))
                .field(r.getField())
                .keywords(CsvUtil.toList(r.getKeywords()))
                .collaborators(CsvUtil.toList(r.getCollaborators()))
                .doi(r.getDoi())
                .publicationDate(r.getPublicationDate())
                .researcherId(r.getResearcher().getId().toString())
                .researcherName(r.getResearcher().getName())
                .researcherDepartment(r.getResearcher().getDepartment())
                .researcherInstitution(r.getResearcher().getInstitution())
                .fundingStatus(r.getFundingStatus() != null ? r.getFundingStatus().name() : null)
                .fundingAmountNeeded(r.getFundingAmountNeeded())
                .coverImage(r.getCoverImage())
                .attachmentUrl(r.getAttachmentUrl())
                .attachmentLabel(r.getAttachmentLabel())
                .citationCount(r.getCitationCount())
                .likeCount(r.getLikeCount())
                .shareCount(r.getShareCount())
                .commentCount(r.getCommentCount())
                .createdAt(r.getCreatedAt())
                .build();
    }

    public PendingPublicationResponse toPendingResponse(PendingPublication p) {
        return PendingPublicationResponse.builder()
                .id(p.getId().toString())
                .researcherId(p.getResearcher().getId().toString())
                .researcherName(p.getResearcher().getName())
                .researcherEmail(p.getResearcher().getEmail())
                .title(p.getTitle())
                .abstractText(p.getAbstractText())
                .authors(CsvUtil.toList(p.getAuthors()))
                .field(p.getField())
                .doi(p.getDoi())
                .fundingStatus(p.getFundingStatus() != null ? p.getFundingStatus().name() : null)
                .fundingAmountNeeded(p.getFundingAmountNeeded())
                .coverImage(p.getCoverImage())
                .attachmentUrl(p.getAttachmentUrl())
                .attachmentLabel(p.getAttachmentLabel())
                .suggestedKeywords(CsvUtil.toList(p.getSuggestedKeywords()))
                .rejectionReason(p.getRejectionReason())
                .status(p.getStatus())
                .submittedDate(p.getSubmittedDate())
                .build();
    }
}

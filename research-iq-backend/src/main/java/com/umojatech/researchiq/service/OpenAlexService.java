package com.umojatech.researchiq.service;

import com.umojatech.researchiq.dto.OrcidLookupResponse;
import com.umojatech.researchiq.exception.BusinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OpenAlexService {

    private static final Logger log = LoggerFactory.getLogger(OpenAlexService.class);
    private static final String BASE_URL = "https://api.openalex.org";

    private final RestClient restClient;

    public OpenAlexService(@Value("${app.bootstrap-admin.email:researchiq@localhost}") String contactEmail) {
        this.restClient = RestClient.builder()
                .baseUrl(BASE_URL)
                .defaultHeader("User-Agent", "ResearchIQ/1.0 (mailto:" + contactEmail + ")")
                .build();
    }

    public OrcidLookupResponse lookupByOrcid(String rawOrcid) {
        String orcidId = normalizeOrcidId(rawOrcid);

        Map<String, Object> author = fetchAuthor(orcidId);
        List<Map<String, Object>> works = fetchWorks(orcidId);

        return buildResponse(orcidId, author, works);
    }

    // ------------------------------------------------------------------ helpers

    @SuppressWarnings("unchecked")
    private Map<String, Object> fetchAuthor(String orcidId) {
        // Use URI.create() to avoid RestClient double-encoding the https:// in the path
        URI uri = URI.create(BASE_URL + "/authors/https://orcid.org/" + orcidId
                + "?select=id,display_name,orcid,cited_by_count,works_count,summary_stats,last_known_institutions,topics");
        try {
            return restClient.get().uri(uri).retrieve().body(Map.class);
        } catch (RestClientException e) {
            log.warn("OpenAlex author not found for ORCID {}: {}", orcidId, e.getMessage());
            throw new BusinessException("No researcher found in OpenAlex for ORCID: " + orcidId
                    + ". Make sure your ORCID profile is public.");
        }
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> fetchWorks(String orcidId) {
        URI uri = URI.create(BASE_URL + "/works?filter=author.orcid:" + orcidId
                + "&select=title,doi,publication_year,cited_by_count,primary_location,authorships"
                + "&per-page=100&sort=cited_by_count:desc");
        try {
            Map<String, Object> body = restClient.get().uri(uri).retrieve().body(Map.class);
            if (body == null) return List.of();
            Object results = body.get("results");
            return results instanceof List<?> list
                    ? list.stream().map(w -> (Map<String, Object>) w).toList()
                    : List.of();
        } catch (RestClientException e) {
            log.warn("Could not fetch works for ORCID {}: {}", orcidId, e.getMessage());
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    private OrcidLookupResponse buildResponse(String orcidId, Map<String, Object> author,
                                               List<Map<String, Object>> works) {
        String name = stringOf(author, "display_name");

        // Institution — first entry in last_known_institutions
        String institution = null;
        Object instList = author.get("last_known_institutions");
        if (instList instanceof List<?> insts && !insts.isEmpty()) {
            Object first = insts.getFirst();
            if (first instanceof Map<?, ?> inst) {
                institution = (String) inst.get("display_name");
            }
        }

        // Stats
        Integer citedByCount = intOf(author, "cited_by_count");
        Integer worksCount = intOf(author, "works_count");
        Integer hIndex = null;
        Integer i10Index = null;
        Object stats = author.get("summary_stats");
        if (stats instanceof Map<?, ?> sm) {
            hIndex = intFromMap(sm, "h_index");
            i10Index = intFromMap(sm, "i10_index");
        }

        // Topics → expertise keywords (top 8)
        List<String> keywords = new ArrayList<>();
        Object topicsObj = author.get("topics");
        if (topicsObj instanceof List<?> topics) {
            for (Object t : topics) {
                if (keywords.size() >= 8) break;
                if (t instanceof Map<?, ?> topic) {
                    String label = (String) topic.get("display_name");
                    if (label != null) keywords.add(label);
                }
            }
        }

        // Publications
        List<OrcidLookupResponse.Publication> pubs = works.stream()
                .map(this::mapWork)
                .toList();

        return OrcidLookupResponse.builder()
                .orcid(orcidId)
                .name(name)
                .institution(institution)
                .department(null)
                .citedByCount(citedByCount)
                .worksCount(worksCount)
                .hIndex(hIndex)
                .i10Index(i10Index)
                .expertiseKeywords(keywords)
                .publications(pubs)
                .build();
    }

    @SuppressWarnings("unchecked")
    private OrcidLookupResponse.Publication mapWork(Map<String, Object> work) {
        String title = stringOf(work, "title");
        String doi = stringOf(work, "doi");
        Integer year = intOf(work, "publication_year");
        Integer cited = intOf(work, "cited_by_count");

        String journal = null;
        Object loc = work.get("primary_location");
        if (loc instanceof Map<?, ?> location) {
            Object src = location.get("source");
            if (src instanceof Map<?, ?> source) {
                journal = (String) source.get("display_name");
            }
        }

        // Build a short citation string
        String firstAuthor = extractFirstAuthor(work);
        String citation = buildCitation(firstAuthor, year, title, journal, doi);

        return OrcidLookupResponse.Publication.builder()
                .title(title)
                .doi(doi)
                .year(year)
                .citedByCount(cited)
                .journal(journal)
                .citation(citation)
                .build();
    }

    @SuppressWarnings("unchecked")
    private String extractFirstAuthor(Map<String, Object> work) {
        Object authorships = work.get("authorships");
        if (authorships instanceof List<?> list && !list.isEmpty()) {
            Object first = list.getFirst();
            if (first instanceof Map<?, ?> a) {
                Object authorObj = a.get("author");
                if (authorObj instanceof Map<?, ?> au) {
                    return (String) au.get("display_name");
                }
            }
        }
        return null;
    }

    private String buildCitation(String author, Integer year, String title, String journal, String doi) {
        StringBuilder sb = new StringBuilder();
        if (author != null) sb.append(author).append(". ");
        if (year != null) sb.append("(").append(year).append("). ");
        if (title != null) sb.append(title).append(". ");
        if (journal != null) sb.append(journal).append(". ");
        if (doi != null) sb.append(doi);
        return sb.toString().trim();
    }

    private String normalizeOrcidId(String raw) {
        if (raw == null) throw new BusinessException("ORCID is required");
        String id = raw.trim()
                .replace("https://orcid.org/", "")
                .replace("http://orcid.org/", "")
                .replace("orcid.org/", "");
        if (!id.matches("\\d{4}-\\d{4}-\\d{4}-\\d{3}[0-9X]")) {
            throw new BusinessException("Invalid ORCID format. Expected: 0000-0000-0000-0000");
        }
        return id;
    }

    private String stringOf(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v instanceof String s ? s : null;
    }

    private Integer intOf(Map<String, Object> map, String key) {
        Object v = map.get(key);
        if (v instanceof Integer i) return i;
        if (v instanceof Number n) return n.intValue();
        return null;
    }

    @SuppressWarnings("unchecked")
    private Integer intFromMap(Map<?, ?> map, String key) {
        Object v = map.get(key);
        if (v instanceof Integer i) return i;
        if (v instanceof Number n) return n.intValue();
        return null;
    }
}

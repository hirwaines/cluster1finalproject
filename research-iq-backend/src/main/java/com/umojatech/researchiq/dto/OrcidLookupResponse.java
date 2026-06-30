package com.umojatech.researchiq.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrcidLookupResponse {

    private String orcid;
    private String name;
    private String institution;
    private String department;
    private Integer citedByCount;
    private Integer worksCount;
    private Integer hIndex;
    private Integer i10Index;
    private List<String> expertiseKeywords;
    private List<Publication> publications;

    @Data
    @Builder
    public static class Publication {
        private String title;
        private String doi;
        private Integer year;
        private Integer citedByCount;
        private String journal;
        private String citation;
    }
}

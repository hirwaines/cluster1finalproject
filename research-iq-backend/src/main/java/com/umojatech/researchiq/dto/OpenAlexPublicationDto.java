package com.umojatech.researchiq.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Jackson-friendly DTO for storing/returning structured OpenAlex publication data. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OpenAlexPublicationDto {
    private String title;
    private String doi;
    private Integer year;
    private Integer citedByCount;
    private String journal;
    private String citation;
}

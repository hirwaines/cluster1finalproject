package com.umojatech.researchiq.controller;

import com.umojatech.researchiq.dto.OrcidLookupResponse;
import com.umojatech.researchiq.service.OpenAlexService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orcid")
@RequiredArgsConstructor
@Tag(name = "ORCID APIs")
public class OrcidController {

    private final OpenAlexService openAlexService;

    @Operation(
        summary = "Look up researcher by ORCID",
        description = "Fetches name, institution, publications, citation count, h-index, and expertise " +
                      "from OpenAlex using the researcher's ORCID. No authentication required — intended " +
                      "for use during signup so researchers can auto-populate their profile."
    )
    @GetMapping("/lookup")
    public ResponseEntity<OrcidLookupResponse> lookup(@RequestParam String orcid) {
        return ResponseEntity.ok(openAlexService.lookupByOrcid(orcid));
    }
}

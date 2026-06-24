package com.umojatech.researchiq.controller;

import com.umojatech.researchiq.entity.CollaborationNetwork;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.repository.UserRepository;
import com.umojatech.researchiq.service.CollaborationNetworkService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/network")
@RequiredArgsConstructor
@Tag(name = "Network Analysis", description = "Collaboration network and graph analysis")
@SecurityRequirement(name = "bearerAuth")
public class NetworkAnalysisController {

    private final CollaborationNetworkService networkService;
    private final UserRepository userRepository;

    @GetMapping("/analysis/{researcherId}")
    @PreAuthorize("hasAnyRole('RESEARCHER', 'MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<List<CollaborationNetwork>> analyzeNetwork(@PathVariable UUID researcherId) {
        return userRepository.findById(researcherId)
                .map(user -> ResponseEntity.ok(networkService.analyzeNetwork(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/collaborators/{researcherId}")
    @PreAuthorize("hasAnyRole('RESEARCHER', 'MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<List<CollaborationNetwork>> getTopCollaborators(@PathVariable UUID researcherId) {
        return userRepository.findById(researcherId)
                .map(user -> ResponseEntity.ok(networkService.getTopCollaborators(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/graph/{researcherId}")
    @PreAuthorize("hasAnyRole('RESEARCHER', 'MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<Page<CollaborationNetwork>> getNetworkGraph(
            @PathVariable UUID researcherId,
            Pageable pageable) {
        return userRepository.findById(researcherId)
                .map(user -> ResponseEntity.ok(networkService.getUserNetwork(user, pageable)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{networkId}")
    @PreAuthorize("hasAnyRole('RESEARCHER', 'MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<CollaborationNetwork> getNetwork(@PathVariable UUID networkId) {
        return networkService.getNetwork(networkId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/export/graph/{researcherId}")
    @PreAuthorize("hasAnyRole('MANAGER', 'DEPARTMENT_HEAD', 'ADMIN')")
    public ResponseEntity<String> exportNetworkGraph(@PathVariable UUID researcherId) {
        return userRepository.findById(researcherId)
                .map(user -> {
                    List<CollaborationNetwork> networks = networkService.getTopCollaborators(user);
                    String csv = generateCsvFromNetworks(networks);
                    return ResponseEntity.ok()
                            .header("Content-Disposition", "attachment; filename=network-graph.csv")
                            .header("Content-Type", "text/csv")
                            .body(csv);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private String generateCsvFromNetworks(List<CollaborationNetwork> networks) {
        StringBuilder csv = new StringBuilder();
        csv.append("Researcher 1,Researcher 2,Co-Authorship Count,Degree Centrality,Betweenness Centrality,Clustering Coefficient\n");
        for (CollaborationNetwork network : networks) {
            csv.append(String.format("%s,%s,%d,%.4f,%.4f,%.4f\n",
                    network.getResearcher1().getName(),
                    network.getResearcher2().getName(),
                    network.getCoAuthorshipCount(),
                    network.getDegreeCentrality(),
                    network.getBetweennessCentrality(),
                    network.getClusteringCoefficient()));
        }
        return csv.toString();
    }
}

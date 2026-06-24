package com.umojatech.researchiq.service;

import com.umojatech.researchiq.entity.CollaborationNetwork;
import com.umojatech.researchiq.entity.User;
import com.umojatech.researchiq.repository.CollaborationNetworkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CollaborationNetworkService {

    private final CollaborationNetworkRepository networkRepository;

    public CollaborationNetwork createOrUpdate(User researcher1, User researcher2,
                                              Integer coAuthorshipCount, String sharedPublications,
                                              Double degreeCentrality, Double betweennessCentrality,
                                              Double clusteringCoefficient, String sharedKeywords) {
        Optional<CollaborationNetwork> existing = networkRepository.findByResearcher1AndResearcher2(researcher1, researcher2);

        CollaborationNetwork network = existing.orElseGet(CollaborationNetwork::new);
        network.setResearcher1(researcher1);
        network.setResearcher2(researcher2);
        network.setCoAuthorshipCount(coAuthorshipCount);
        network.setSharedPublications(sharedPublications);
        network.setDegreeCentrality(degreeCentrality);
        network.setBetweennessCentrality(betweennessCentrality);
        network.setClusteringCoefficient(clusteringCoefficient);
        network.setSharedKeywords(sharedKeywords);

        return networkRepository.save(network);
    }

    public Page<CollaborationNetwork> getUserNetwork(User researcher, Pageable pageable) {
        return networkRepository.findByResearcher1(researcher, pageable);
    }

    public List<CollaborationNetwork> getTopCollaborators(User researcher) {
        return networkRepository.findByResearcher1OrderByDegreeCentralityDesc(researcher);
    }

    public Optional<CollaborationNetwork> getNetwork(UUID id) {
        return networkRepository.findById(id);
    }

    public void deleteNetwork(UUID id) {
        networkRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<CollaborationNetwork> analyzeNetwork(User researcher) {
        return networkRepository.findByResearcher1OrderByDegreeCentralityDesc(researcher);
    }
}

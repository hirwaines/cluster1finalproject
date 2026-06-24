package com.umojatech.researchiq.repository;

import com.umojatech.researchiq.entity.Research;
import com.umojatech.researchiq.entity.enums.FundingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ResearchRepository extends JpaRepository<Research, UUID> {

    List<Research> findAllByOrderByCreatedAtDesc();

    List<Research> findByResearcher_IdOrderByCreatedAtDesc(UUID researcherId);

    List<Research> findByFundingStatusOrderByCreatedAtDesc(FundingStatus fundingStatus);

    @Query("SELECT r FROM Research r WHERE " +
           "LOWER(r.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.field) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.keywords) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.authors) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Research> searchByQuery(@Param("query") String query);

    @Query("SELECT r FROM Research r WHERE LOWER(r.field) = LOWER(:field)")
    List<Research> findByFieldIgnoreCase(@Param("field") String field);

    long countByResearcher_Id(UUID researcherId);
}

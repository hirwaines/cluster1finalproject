"""
Collaboration Recommendation Service — core AI logic.
Recommends collaborators using TF-IDF cosine similarity + complementarity scoring.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from typing import List
from shared.data.rwanda_dataset import (
    RESEARCHERS, get_researcher_by_id,
    get_researcher_publications, get_co_authors
)
from shared.utils.text_utils import (
    build_corpus_idf, build_tfidf_vector, cosine_similarity, classify_research_area, tokenize
)
from researcher.collaboration_recommendation.models import (
    CollaboratorMatch, CollaborationRecommendationResponse,
    CompatibilityResult, CrossDisciplinaryMatch
)

_ALL_TEXTS = [p["abstract"] for p in __import__(
    "shared.data.rwanda_dataset", fromlist=["PUBLICATIONS"]
).PUBLICATIONS]
_CORPUS_IDF = build_corpus_idf(_ALL_TEXTS)


def _researcher_vector(researcher_id: str):
    pubs = get_researcher_publications(researcher_id)
    blob = " ".join(
        p.get("title", "") + " " + p.get("abstract", "") + " " + " ".join(p.get("keywords", []))
        for p in pubs
    )
    return build_tfidf_vector(blob, _CORPUS_IDF)


def _top_keywords(vec, n=8):
    return [k for k, _ in sorted(vec.items(), key=lambda x: x[1], reverse=True)[:n]]


def _primary_area(researcher_id: str) -> str:
    from collections import Counter
    pubs = get_researcher_publications(researcher_id)
    areas = Counter(p.get("research_area", classify_research_area(p.get("abstract", ""))) for p in pubs)
    return areas.most_common(1)[0][0] if areas else "General Research"


def recommend_collaborators(researcher_id: str, limit: int = 8) -> CollaborationRecommendationResponse:
    target = get_researcher_by_id(researcher_id)
    if not target:
        return CollaborationRecommendationResponse(
            for_researcher_id=researcher_id,
            for_researcher_name="Unknown",
            recommendations=[],
            recommendation_type="similarity"
        )

    target_vec = _researcher_vector(researcher_id)
    target_kw = set(_top_keywords(target_vec, 15))
    target_area = _primary_area(researcher_id)
    existing_collabs = set(get_co_authors(researcher_id))

    matches = []
    for r in RESEARCHERS:
        if r["id"] == researcher_id:
            continue
        r_vec = _researcher_vector(r["id"])
        sim = cosine_similarity(target_vec, r_vec)
        if sim < 0.01:
            continue

        r_kw = set(_top_keywords(r_vec, 15))
        shared = list(target_kw & r_kw)[:6]
        r_area = _primary_area(r["id"])
        complementary = [r_area] if r_area != target_area else []

        is_existing = r["id"] in existing_collabs
        # Boost score for same institution intra-collaboration
        boost = 1.1 if r["institution"] == target["institution"] else 1.0
        final_score = round(min(sim * boost, 1.0), 4)

        reason = (
            f"Strong expertise overlap in {shared[0] if shared else 'research themes'}."
            if sim > 0.3 else
            f"Complementary expertise in {r_area} could enhance your {target_area} research."
        )

        matches.append(CollaboratorMatch(
            researcher_id=r["id"],
            researcher_name=r["name"],
            institution=r["institution"],
            department=r["department"],
            career_stage=r.get("career_stage", "mid"),
            similarity_score=final_score,
            shared_keywords=shared,
            complementary_areas=complementary,
            existing_collaboration=is_existing,
            recommendation_reason=reason,
            h_index=r.get("h_index", 0),
        ))

    matches.sort(key=lambda x: x.similarity_score, reverse=True)
    return CollaborationRecommendationResponse(
        for_researcher_id=researcher_id,
        for_researcher_name=target["name"],
        recommendations=matches[:limit],
        recommendation_type="tfidf_cosine_similarity"
    )


def check_compatibility(id1: str, id2: str) -> CompatibilityResult:
    r1 = get_researcher_by_id(id1)
    r2 = get_researcher_by_id(id2)
    if not r1 or not r2:
        return CompatibilityResult(
            researcher_1=id1, researcher_2=id2,
            similarity_score=0.0, shared_keywords=[], shared_areas=[],
            complementarity_score=0.0, collaboration_potential="Unknown",
            explanation="One or both researchers not found."
        )

    vec1 = _researcher_vector(id1)
    vec2 = _researcher_vector(id2)
    sim = cosine_similarity(vec1, vec2)

    kw1 = set(_top_keywords(vec1, 15))
    kw2 = set(_top_keywords(vec2, 15))
    shared_kw = list(kw1 & kw2)[:8]

    area1 = _primary_area(id1)
    area2 = _primary_area(id2)
    shared_areas = [area1] if area1 == area2 else []
    # Complementarity: different areas = higher complementarity
    complementarity = round(1.0 - sim if area1 != area2 else sim * 0.5, 3)

    if sim > 0.5:
        potential = "Very High"
        explanation = f"Both researchers share deep expertise in {shared_kw[:2] if shared_kw else 'overlapping areas'}, making co-authorship highly productive."
    elif sim > 0.3:
        potential = "High"
        explanation = f"Significant shared interest in {shared_kw[:2] if shared_kw else 'related topics'} with room for complementary contributions."
    elif complementarity > 0.5:
        potential = "Medium (Cross-disciplinary)"
        explanation = f"{r1['name']}'s expertise in {area1} and {r2['name']}'s in {area2} create cross-disciplinary collaboration potential."
    else:
        potential = "Low"
        explanation = "Limited overlap detected. Collaboration may require a bridging research theme."

    return CompatibilityResult(
        researcher_1=r1["name"], researcher_2=r2["name"],
        similarity_score=round(sim, 4), shared_keywords=shared_kw,
        shared_areas=shared_areas, complementarity_score=complementarity,
        collaboration_potential=potential, explanation=explanation
    )


def recommend_cross_disciplinary(researcher_id: str, limit: int = 5) -> List[CrossDisciplinaryMatch]:
    target = get_researcher_by_id(researcher_id)
    if not target:
        return []

    target_vec = _researcher_vector(researcher_id)
    target_area = _primary_area(researcher_id)
    target_kw = set(_top_keywords(target_vec, 12))

    results = []
    for r in RESEARCHERS:
        if r["id"] == researcher_id:
            continue
        r_area = _primary_area(r["id"])
        if r_area == target_area:
            continue  # same discipline — skip

        r_vec = _researcher_vector(r["id"])
        r_kw = set(_top_keywords(r_vec, 12))

        # Bridge keywords: keywords that appear in both but in different area contexts
        bridge = list(target_kw & r_kw)[:4]
        sim = cosine_similarity(target_vec, r_vec)

        # We want some similarity (shared themes) but different areas
        cross_score = round(sim * 0.5 + 0.5, 3) if bridge else round(sim, 3)

        results.append(CrossDisciplinaryMatch(
            researcher_id=r["id"],
            researcher_name=r["name"],
            institution=r["institution"],
            primary_area=r_area,
            bridge_keywords=bridge,
            cross_score=cross_score,
            why_cross_disciplinary=f"Bridges {target_area} with {r_area} through shared themes: {', '.join(bridge[:2]) if bridge else 'emerging intersections'}."
        ))

    results.sort(key=lambda x: x.cross_score, reverse=True)
    return results[:limit]

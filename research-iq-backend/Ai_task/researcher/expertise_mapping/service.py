"""
Expertise Mapping Service — core AI logic.
Extracts researcher expertise from publication abstracts and keywords using TF-IDF.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from collections import Counter
from typing import List, Dict, Tuple
from shared.data.rwanda_dataset import (
    RESEARCHERS, PUBLICATIONS,
    get_researcher_by_id, get_researcher_publications
)
from shared.utils.text_utils import (
    tokenize, build_corpus_idf, build_tfidf_vector,
    cosine_similarity, classify_research_area, extract_keywords_from_text
)
from researcher.expertise_mapping.models import (
    ExpertiseProfile, ExpertiseKeyword, ExpertiseFromTextResponse,
    ExpertiseSearchResult, HeatmapCell, HeatmapResponse
)

# Pre-build IDF from all publication abstracts once at startup
_ALL_TEXTS = [p["abstract"] for p in PUBLICATIONS]
_CORPUS_IDF = build_corpus_idf(_ALL_TEXTS)


def _build_researcher_text_blob(researcher_id: str) -> str:
    pubs = get_researcher_publications(researcher_id)
    parts = []
    for p in pubs:
        parts.append(p.get("title", ""))
        parts.append(p.get("abstract", ""))
        parts.extend(p.get("keywords", []))
    return " ".join(parts)


def _score_keywords(text: str, top_n: int = 15) -> List[ExpertiseKeyword]:
    tokens = tokenize(text)
    freq = Counter(tokens)
    vec = build_tfidf_vector(text, _CORPUS_IDF)
    results = []
    for word, tfidf_score in sorted(vec.items(), key=lambda x: x[1], reverse=True)[:top_n]:
        results.append(ExpertiseKeyword(
            keyword=word,
            score=round(tfidf_score, 4),
            frequency=freq.get(word, 1)
        ))
    return results


def get_expertise_profile(researcher_id: str) -> ExpertiseProfile | None:
    researcher = get_researcher_by_id(researcher_id)
    if not researcher:
        return None

    pubs = get_researcher_publications(researcher_id)
    blob = _build_researcher_text_blob(researcher_id)
    keywords = _score_keywords(blob, top_n=15)

    # Derive research areas from individual publications
    area_counter = Counter()
    for p in pubs:
        area = p.get("research_area", classify_research_area(p.get("abstract", "")))
        area_counter[area] += 1
    primary_area = area_counter.most_common(1)[0][0] if area_counter else "General Research"
    research_areas = [a for a, _ in area_counter.most_common()]

    # Expertise score = h_index normalized + publication count weight
    h = researcher.get("h_index", 0)
    pub_count = len(pubs)
    expertise_score = round(min((h * 0.6 + pub_count * 0.4) / 20.0, 1.0), 3)

    return ExpertiseProfile(
        researcher_id=researcher_id,
        researcher_name=researcher["name"],
        institution=researcher["institution"],
        department=researcher["department"],
        primary_area=primary_area,
        top_keywords=keywords,
        research_areas=research_areas,
        expertise_score=expertise_score,
        total_publications=pub_count,
        h_index=h,
    )


def extract_expertise_from_text(text: str, top_n: int = 12) -> ExpertiseFromTextResponse:
    vec = build_tfidf_vector(text, _CORPUS_IDF)
    sorted_kw = sorted(vec.items(), key=lambda x: x[1], reverse=True)[:top_n]
    tokens = tokenize(text)
    freq = Counter(tokens)
    keywords = [
        ExpertiseKeyword(keyword=w, score=round(s, 4), frequency=freq.get(w, 1))
        for w, s in sorted_kw
    ]
    detected_area = classify_research_area(text)
    return ExpertiseFromTextResponse(keywords=keywords, detected_area=detected_area)


def search_by_expertise(keyword: str, limit: int = 10) -> List[ExpertiseSearchResult]:
    kw_lower = keyword.lower()
    results = []
    for researcher in RESEARCHERS:
        blob = _build_researcher_text_blob(researcher["id"])
        tokens = tokenize(blob)
        freq = Counter(tokens)

        # Direct keyword match in blob
        matching_keywords = [
            w for w in set(tokens) if kw_lower in w or w in kw_lower
        ]
        if not matching_keywords:
            # Try in raw publication keywords list
            for p in get_researcher_publications(researcher["id"]):
                for pk in p.get("keywords", []):
                    if kw_lower in pk.lower():
                        matching_keywords.append(pk)

        if matching_keywords:
            # Score based on match frequency
            score = sum(freq.get(m, 0) for m in matching_keywords) / max(len(tokens), 1)
            results.append(ExpertiseSearchResult(
                researcher_id=researcher["id"],
                researcher_name=researcher["name"],
                institution=researcher["institution"],
                department=researcher["department"],
                relevance_score=round(score * 100, 2),
                matching_keywords=list(set(matching_keywords))[:5],
                h_index=researcher.get("h_index", 0),
            ))

    results.sort(key=lambda x: x.relevance_score, reverse=True)
    return results[:limit]


def get_expertise_heatmap() -> HeatmapResponse:
    # Aggregate top keywords per department
    dept_keywords: Dict[str, Counter] = {}
    dept_researchers: Dict[str, int] = {}
    dept_institutions: Dict[str, str] = {}

    for researcher in RESEARCHERS:
        dept = researcher["department"]
        inst = researcher["institution"]
        dept_institutions[dept] = inst
        dept_researchers[dept] = dept_researchers.get(dept, 0) + 1

        blob = _build_researcher_text_blob(researcher["id"])
        vec = build_tfidf_vector(blob, _CORPUS_IDF)
        top_words = sorted(vec.items(), key=lambda x: x[1], reverse=True)[:8]

        if dept not in dept_keywords:
            dept_keywords[dept] = Counter()
        for word, score in top_words:
            dept_keywords[dept][word] += score

    # Build heatmap cells
    cells = []
    all_keywords: Counter = Counter()
    for dept, kw_counter in dept_keywords.items():
        for kw, intensity in kw_counter.most_common(5):
            all_keywords[kw] += 1
            cells.append(HeatmapCell(
                department=dept,
                institution=dept_institutions.get(dept, ""),
                keyword=kw,
                intensity=round(float(intensity), 4),
                researcher_count=dept_researchers.get(dept, 1),
            ))

    top_keywords = [kw for kw, _ in all_keywords.most_common(20)]
    departments = list(dept_keywords.keys())

    return HeatmapResponse(cells=cells, top_keywords=top_keywords, departments=departments)

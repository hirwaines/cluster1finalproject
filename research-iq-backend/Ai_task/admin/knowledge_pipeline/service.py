"""
Admin Knowledge Pipeline Service — core AI logic.
Batch processes all publications, runs quality checks, and monitors corpus health.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from collections import Counter
from typing import List, Dict
from shared.data.rwanda_dataset import PUBLICATIONS, get_publication_by_id
from shared.utils.text_utils import (
    build_corpus_idf, build_tfidf_vector, tokenize,
    classify_research_area, extract_named_entities
)
from admin.knowledge_pipeline.models import (
    PipelineResult, PipelineSummary, DataQualityReport
)

_IDF = build_corpus_idf([p["abstract"] for p in PUBLICATIONS])


def _process_single(pub: dict) -> PipelineResult:
    try:
        full_text = pub.get("title", "") + " " + pub.get("abstract", "")
        vec = build_tfidf_vector(full_text, _IDF)
        kw = [k for k, _ in sorted(vec.items(), key=lambda x: x[1], reverse=True)[:12]]
        area = pub.get("research_area", classify_research_area(full_text))
        entities = extract_named_entities(full_text)
        word_count = len(pub.get("abstract", "").split())
        return PipelineResult(
            publication_id=pub["id"],
            title=pub.get("title", ""),
            extracted_keywords=kw,
            research_area=area,
            entities=entities,
            word_count=word_count,
            status="success",
        )
    except Exception as e:
        return PipelineResult(
            publication_id=pub.get("id", "unknown"),
            title=pub.get("title", ""),
            extracted_keywords=[],
            research_area="Unknown",
            entities={},
            word_count=0,
            status=f"error: {str(e)}",
        )


def run_pipeline(publication_ids: List[str] = None, process_all: bool = False) -> PipelineSummary:
    if process_all or not publication_ids:
        pubs_to_process = PUBLICATIONS
    else:
        pubs_to_process = [p for p in PUBLICATIONS if p["id"] in publication_ids]

    results = [_process_single(p) for p in pubs_to_process]
    successful = [r for r in results if r.status == "success"]
    failed = [r for r in results if r.status != "success"]

    area_dist = Counter(r.research_area for r in successful)
    all_kw = []
    total_words = 0
    for r in successful:
        all_kw.extend(r.extracted_keywords)
        total_words += r.word_count

    top_kw = [k for k, _ in Counter(all_kw).most_common(20)]
    avg_words = round(total_words / max(len(successful), 1), 1)

    return PipelineSummary(
        total_processed=len(results),
        successful=len(successful),
        failed=len(failed),
        area_distribution=dict(area_dist),
        top_keywords_corpus=top_kw,
        avg_word_count=avg_words,
    )


def get_data_quality_report() -> DataQualityReport:
    total = len(PUBLICATIONS)
    with_abstracts = sum(1 for p in PUBLICATIONS if p.get("abstract", "").strip())
    with_keywords = sum(1 for p in PUBLICATIONS if p.get("keywords"))
    avg_kw = sum(len(p.get("keywords", [])) for p in PUBLICATIONS) / max(total, 1)

    area_dist = Counter(
        p.get("research_area", classify_research_area(p.get("abstract", "")))
        for p in PUBLICATIONS
    )

    # Check for duplicate titles
    titles = [p.get("title", "").lower().strip() for p in PUBLICATIONS]
    title_counts = Counter(titles)
    duplicates = [t for t, c in title_counts.items() if c > 1]

    # Quality score
    abstract_coverage = with_abstracts / max(total, 1)
    keyword_coverage = with_keywords / max(total, 1)
    quality_score = round((abstract_coverage * 0.5 + keyword_coverage * 0.3 + (1 - len(duplicates) / max(total, 1)) * 0.2), 3)

    recommendations = []
    if abstract_coverage < 0.9:
        recommendations.append("Add abstracts for all publications to improve NLP processing quality.")
    if keyword_coverage < 0.8:
        recommendations.append("Ensure all publications have at least 5 keywords for better expertise mapping.")
    if duplicates:
        recommendations.append(f"Remove {len(duplicates)} duplicate title(s) detected in the dataset.")
    if quality_score > 0.85:
        recommendations.append("Dataset quality is high. Continue regular data validation cycles.")

    return DataQualityReport(
        total_publications=total,
        publications_with_abstracts=with_abstracts,
        publications_with_keywords=with_keywords,
        avg_keyword_count=round(avg_kw, 1),
        area_coverage=dict(area_dist),
        duplicate_titles=duplicates[:5],
        quality_score=quality_score,
        recommendations=recommendations,
    )


def get_single_result(publication_id: str) -> PipelineResult | None:
    pub = get_publication_by_id(publication_id)
    if not pub:
        return None
    return _process_single(pub)

"""
Research Knowledge Processing Service — core AI logic.
Processes publication text: keyword extraction, area classification,
NER, topic modeling, and metadata enrichment.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

import re
from collections import Counter
from typing import List, Dict
from shared.data.rwanda_dataset import PUBLICATIONS
from shared.utils.text_utils import (
    build_corpus_idf, build_tfidf_vector, tokenize,
    classify_research_area, extract_named_entities,
    extract_keywords_from_text
)
from researcher.knowledge_processing.models import (
    ProcessedPublication, ClassifyResponse,
    EntityExtractionResponse, TopicModelResult
)

_IDF = build_corpus_idf([p["abstract"] for p in PUBLICATIONS])

# Research area taxonomy with representative keywords
_AREA_PROFILES: Dict[str, List[str]] = {
    "Agriculture & Food Security": [
        "cassava","maize","bean","soil","irrigation","harvest","fertilizer",
        "crop","farming","food","security","seed","livestock","dairy","sorghum"
    ],
    "Health & Biomedical Sciences": [
        "malaria","hiv","tuberculosis","maternal","child","hospital","disease",
        "treatment","medicine","vaccine","nutrition","diabetes","epidemiology","clinical"
    ],
    "ICT & Digital Innovation": [
        "digital","mobile","software","algorithm","machine learning","blockchain",
        "iot","sensor","cybersecurity","e-government","app","platform","network","ai"
    ],
    "Environment & Natural Resources": [
        "forest","deforestation","conservation","biodiversity","wetland","lake",
        "water","climate","ecosystem","erosion","carbon","pollution","wildlife"
    ],
    "Economics & Finance": [
        "economic","finance","gdp","investment","trade","market","poverty","income",
        "microfinance","bank","insurance","debt","employment","sme","tourism"
    ],
    "Education & Social Sciences": [
        "education","school","curriculum","teacher","student","learning","tvet",
        "university","literacy","early childhood","gender","social","household"
    ],
    "Energy & Infrastructure": [
        "energy","solar","electricity","power","grid","biogas","renewable","fuel",
        "electrification","infrastructure","construction","housing","flood"
    ],
    "Peace, Security & Governance": [
        "peace","reconciliation","genocide","gacaca","governance","conflict",
        "security","political","parliament","law","policy","accountability"
    ],
}


def _compute_area_confidence(text: str) -> Dict[str, float]:
    text_lower = text.lower()
    tokens = set(tokenize(text))
    scores: Dict[str, float] = {}
    for area, keywords in _AREA_PROFILES.items():
        exact = sum(1 for kw in keywords if kw in text_lower)
        token_match = sum(1 for kw in keywords if kw in tokens)
        scores[area] = (exact * 1.0 + token_match * 0.5) / len(keywords)
    return scores


def _sentiment_label(text: str) -> str:
    positive_words = {
        "improved","increase","effective","successful","significant","positive",
        "higher","better","reduce","reduced","achieved","progress","benefit"
    }
    negative_words = {
        "challenge","barrier","limited","constraint","problem","decline",
        "reduce","gap","insufficient","lack","poor","failure","threat"
    }
    tokens = set(tokenize(text))
    pos = len(tokens & positive_words)
    neg = len(tokens & negative_words)
    if pos > neg + 1:
        return "Positive"
    elif neg > pos + 1:
        return "Cautionary"
    return "Neutral"


def _readability(text: str) -> str:
    words = text.split()
    sentences = re.split(r"[.!?]+", text)
    sentences = [s for s in sentences if s.strip()]
    if not sentences:
        return "N/A"
    avg_words_per_sentence = len(words) / len(sentences)
    long_words = sum(1 for w in words if len(w) > 8)
    long_word_ratio = long_words / max(len(words), 1)
    # Simple Flesch-Kincaid-like heuristic
    if avg_words_per_sentence < 18 and long_word_ratio < 0.25:
        return "Easy"
    elif avg_words_per_sentence < 25 and long_word_ratio < 0.35:
        return "Moderate"
    return "Technical"


def process_publication(title: str, abstract: str, raw_keywords: List[str] = None) -> ProcessedPublication:
    full_text = title + " " + abstract
    vec = build_tfidf_vector(full_text, _IDF)
    extracted_kw = [k for k, _ in sorted(vec.items(), key=lambda x: x[1], reverse=True)[:12]]

    # Merge with provided raw keywords
    if raw_keywords:
        for kw in raw_keywords:
            kw_clean = kw.lower().strip()
            if kw_clean not in extracted_kw:
                extracted_kw.insert(0, kw_clean)
    extracted_kw = extracted_kw[:15]

    area = classify_research_area(full_text)
    entities = extract_named_entities(full_text)
    topic_tokens = tokenize(abstract)[:20]
    word_count = len(abstract.split())
    readability = _readability(abstract)
    sentiment = _sentiment_label(abstract)

    return ProcessedPublication(
        title=title,
        extracted_keywords=extracted_kw,
        research_area=area,
        entities=entities,
        topic_tokens=topic_tokens,
        word_count=word_count,
        readability_score=readability,
        sentiment_label=sentiment,
    )


def classify_text(text: str) -> ClassifyResponse:
    scores = _compute_area_confidence(text)
    sorted_areas = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    primary = sorted_areas[0][0] if sorted_areas else "General Research"
    primary_score = sorted_areas[0][1] if sorted_areas else 0.0
    secondary = [a for a, s in sorted_areas[1:4] if s > 0.02]
    confidence = round(min(primary_score / 0.5, 1.0), 3)
    return ClassifyResponse(
        research_area=primary, confidence=confidence, secondary_areas=secondary
    )


def extract_entities(text: str) -> EntityExtractionResponse:
    base = extract_named_entities(text)
    # Extract potential author names (Title Case followed by comma or "and")
    author_pattern = re.compile(r"\b(Dr\.|Prof\.|Mr\.|Ms\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)")
    potential_authors = [m.group(0) for m in author_pattern.finditer(text)]
    return EntityExtractionResponse(
        institutions=base["institutions"],
        locations=base["locations"],
        funders=base["funders"],
        potential_authors=list(set(potential_authors))[:6],
    )


def get_topic_model() -> List[TopicModelResult]:
    """
    Simple topic model: group publications by research area and extract representative keywords.
    In production, replace with LDA via sklearn or gensim.
    """
    area_groups: Dict[str, list] = {}
    for pub in PUBLICATIONS:
        area = pub.get("research_area", classify_research_area(pub.get("abstract", "")))
        if area not in area_groups:
            area_groups[area] = []
        area_groups[area].append(pub)

    topics = []
    for idx, (area, pubs) in enumerate(sorted(area_groups.items())):
        all_tokens = []
        for p in pubs:
            all_tokens.extend(tokenize(p.get("abstract", "")))
        top_kw = [k for k, _ in Counter(all_tokens).most_common(8)]
        representative_title = pubs[0]["title"] if pubs else ""
        topics.append(TopicModelResult(
            topic_id=idx,
            label=area,
            keywords=top_kw,
            document_count=len(pubs),
            representative_title=representative_title,
        ))

    return topics

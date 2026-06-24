"""
Funding Opportunity Alignment Service — core AI logic.
Matches researcher expertise to Rwanda-relevant funding opportunities using TF-IDF cosine similarity.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from collections import Counter
from typing import List, Dict
from shared.data.rwanda_dataset import (
    RESEARCHERS, FUNDING_OPPORTUNITIES,
    get_researcher_by_id, get_researcher_publications
)
from shared.utils.text_utils import (
    build_corpus_idf, build_tfidf_vector, cosine_similarity,
    tokenize, classify_research_area
)
from researcher.funding_alignment.models import (
    FundingMatch, FundingAlignmentResponse, FundingLandscapeItem
)

# Build IDF from both publication abstracts and funding descriptions
_ALL_TEXTS = (
    [p["abstract"] for p in __import__(
        "shared.data.rwanda_dataset", fromlist=["PUBLICATIONS"]
    ).PUBLICATIONS]
    + [f["description"] for f in FUNDING_OPPORTUNITIES]
)
_IDF = build_corpus_idf(_ALL_TEXTS)


def _researcher_expertise_vector(researcher_id: str):
    pubs = get_researcher_publications(researcher_id)
    blob = " ".join(
        p.get("title", "") + " " + p.get("abstract", "") + " " + " ".join(p.get("keywords", []))
        for p in pubs
    )
    return build_tfidf_vector(blob, _IDF)


def _funding_vector(fund: dict):
    text = fund["title"] + " " + fund["description"] + " " + " ".join(fund.get("keywords", []))
    return build_tfidf_vector(text, _IDF)


def _primary_area(researcher_id: str) -> str:
    pubs = get_researcher_publications(researcher_id)
    areas = Counter(p.get("research_area", classify_research_area(p.get("abstract", ""))) for p in pubs)
    return areas.most_common(1)[0][0] if areas else "General Research"


def match_funding_for_researcher(researcher_id: str) -> FundingAlignmentResponse:
    researcher = get_researcher_by_id(researcher_id)
    if not researcher:
        return FundingAlignmentResponse(
            researcher_id=researcher_id, researcher_name="Unknown",
            primary_area="Unknown", matches=[]
        )

    researcher_vec = _researcher_expertise_vector(researcher_id)
    researcher_kw = set(k for k, _ in sorted(researcher_vec.items(), key=lambda x: x[1], reverse=True)[:20])
    primary_area = _primary_area(researcher_id)

    matches = []
    for fund in FUNDING_OPPORTUNITIES:
        fund_vec = _funding_vector(fund)
        sim = cosine_similarity(researcher_vec, fund_vec)

        # Also boost by area overlap
        area_boost = 0.15 if any(
            primary_area.lower() in fa.lower() or fa.lower() in primary_area.lower()
            for fa in fund.get("areas", [])
        ) else 0.0

        final_score = round(min(sim + area_boost, 1.0), 4)

        fund_kw = set(tokenize(fund["description"] + " " + " ".join(fund.get("keywords", []))))
        matched_kw = list(researcher_kw & fund_kw)[:5]

        if final_score > 0.02:
            reason = (
                f"Your expertise in {primary_area} directly aligns with this grant's focus on {fund['areas'][0]}."
                if area_boost > 0 else
                f"Keyword overlap in {', '.join(matched_kw[:2]) if matched_kw else 'related themes'} suggests strong alignment."
            )
            matches.append(FundingMatch(
                fund_id=fund["id"],
                title=fund["title"],
                funder=fund["funder"],
                match_score=final_score,
                matched_keywords=matched_kw,
                amount=fund.get("amount", "N/A"),
                deadline=fund.get("deadline", "N/A"),
                areas=fund.get("areas", []),
                eligibility=fund.get("eligibility", ""),
                why_match=reason,
            ))

    matches.sort(key=lambda x: x.match_score, reverse=True)
    return FundingAlignmentResponse(
        researcher_id=researcher_id,
        researcher_name=researcher["name"],
        primary_area=primary_area,
        matches=matches[:10],
    )


def analyze_custom_funding(keywords: List[str], research_area: str = None) -> List[FundingMatch]:
    blob = " ".join(keywords) + (" " + research_area if research_area else "")
    query_vec = build_tfidf_vector(blob, _IDF)

    matches = []
    for fund in FUNDING_OPPORTUNITIES:
        fund_vec = _funding_vector(fund)
        sim = cosine_similarity(query_vec, fund_vec)
        if sim > 0.01:
            fund_kw = set(tokenize(fund["description"]))
            query_kw = set(tokenize(blob))
            matched = list(query_kw & fund_kw)[:5]
            matches.append(FundingMatch(
                fund_id=fund["id"],
                title=fund["title"],
                funder=fund["funder"],
                match_score=round(sim, 4),
                matched_keywords=matched,
                amount=fund.get("amount", "N/A"),
                deadline=fund.get("deadline", "N/A"),
                areas=fund.get("areas", []),
                eligibility=fund.get("eligibility", ""),
                why_match=f"Keyword alignment with funding priorities: {', '.join(matched[:2]) if matched else 'thematic overlap'}.",
            ))

    matches.sort(key=lambda x: x.match_score, reverse=True)
    return matches[:10]


def get_funding_landscape() -> List[FundingLandscapeItem]:
    area_funds: Dict[str, list] = {}
    for fund in FUNDING_OPPORTUNITIES:
        for area in fund.get("areas", ["General"]):
            if area not in area_funds:
                area_funds[area] = []
            area_funds[area].append(fund)

    landscape = []
    for area, funds in area_funds.items():
        funders = list(set(f["funder"].split("(")[0].strip() for f in funds))[:3]
        all_kw = []
        for f in funds:
            all_kw.extend(tokenize(f["description"]))
        top_themes = [k for k, _ in Counter(all_kw).most_common(5)]
        landscape.append(FundingLandscapeItem(
            area=area,
            opportunity_count=len(funds),
            total_approximate_usd=f"Multiple grants available",
            top_funders=funders,
            key_themes=top_themes,
        ))

    landscape.sort(key=lambda x: x.opportunity_count, reverse=True)
    return landscape

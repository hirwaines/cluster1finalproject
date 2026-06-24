"""
Research Portfolio Analysis Service — core AI logic.
Analyzes institutional research portfolio strength, gaps, and strategic positioning.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from collections import Counter, defaultdict
from typing import List, Dict
from shared.data.rwanda_dataset import (
    RESEARCHERS, PUBLICATIONS, FUNDING_OPPORTUNITIES,
    get_researcher_publications
)
from shared.utils.text_utils import classify_research_area
from research_manager.research_portfolio.models import (
    PortfolioStrengthArea, PortfolioGap,
    PortfolioAnalysisResponse, BenchmarkItem
)

ALL_AREAS = [
    "Agriculture & Food Security", "Health & Biomedical Sciences",
    "ICT & Digital Innovation", "Environment & Natural Resources",
    "Economics & Finance", "Education & Social Sciences",
    "Energy & Infrastructure", "Peace, Security & Governance"
]


def _area_data_for_institution(institution: str) -> Dict[str, dict]:
    area_info: Dict[str, dict] = defaultdict(lambda: {
        "pubs": [], "citations": 0, "researchers": set()
    })
    for r in RESEARCHERS:
        if institution.lower() not in r["institution"].lower():
            continue
        for pub in get_researcher_publications(r["id"]):
            area = pub.get("research_area", classify_research_area(pub.get("abstract", "")))
            area_info[area]["pubs"].append(pub)
            area_info[area]["citations"] += pub.get("citations", 0)
            area_info[area]["researchers"].add(r["id"])
    return area_info


def analyze_portfolio(institution: str = "University of Rwanda") -> PortfolioAnalysisResponse:
    area_info = _area_data_for_institution(institution)
    inst_researchers = [r for r in RESEARCHERS if institution.lower() in r["institution"].lower()]
    total_pubs = sum(len(d["pubs"]) for d in area_info.values())

    # Build strength areas
    strength_areas = []
    for area, data in area_info.items():
        pub_count = len(data["pubs"])
        cites = data["citations"]
        active = len(data["researchers"])
        citation_impact = cites / max(pub_count, 1)

        recent = sum(1 for p in data["pubs"] if p.get("year", 0) >= 2021)
        older = max(pub_count - recent, 0)
        trend = "growing" if recent > older else "stable" if recent == older else "declining"

        strength_score = round(
            (pub_count / max(total_pubs, 1)) * 0.4
            + min(citation_impact / 30, 1.0) * 0.4
            + (active / max(len(inst_researchers), 1)) * 0.2,
            3
        )
        strength_areas.append(PortfolioStrengthArea(
            area=area, strength_score=strength_score,
            publication_count=pub_count, citation_impact=round(citation_impact, 1),
            active_researchers=active, trend=trend,
        ))

    strength_areas.sort(key=lambda x: x.strength_score, reverse=True)

    # Identify gaps
    covered_areas = {s.area for s in strength_areas}
    gaps = []
    for area in ALL_AREAS:
        if area not in covered_areas:
            funding = [f["title"] for f in FUNDING_OPPORTUNITIES if area in f.get("areas", [])][:2]
            gaps.append(PortfolioGap(
                area=area,
                reason=f"No publications found in {area} for {institution}.",
                recommended_action=f"Consider recruiting or developing capacity in {area}.",
                potential_funding=funding,
            ))
        elif next((s for s in strength_areas if s.area == area and s.strength_score < 0.05), None):
            funding = [f["title"] for f in FUNDING_OPPORTUNITIES if area in f.get("areas", [])][:2]
            gaps.append(PortfolioGap(
                area=area,
                reason=f"Weak coverage in {area} — only {sum(1 for s in strength_areas if s.area == area)} active researchers.",
                recommended_action=f"Invest in {area} research capacity and apply for targeted funding.",
                potential_funding=funding,
            ))

    # Diversity score: how evenly spread across areas
    area_counts = [s.publication_count for s in strength_areas]
    total = sum(area_counts) or 1
    proportions = [c / total for c in area_counts]
    import math
    diversity = round(-sum(p * math.log(p) for p in proportions if p > 0) / math.log(len(ALL_AREAS)), 3)

    # Interdisciplinary score: publications with cross-area keywords
    cross_area_pubs = sum(
        1 for p in PUBLICATIONS
        if len(set(p.get("keywords", []))) > 5
        and any(institution.lower() in get_researcher_publications(a)[0].get("title", "").lower()
                for a in p.get("authors", []))
    )
    interdisciplinary = round(min(cross_area_pubs / max(total_pubs, 1) * 3, 1.0), 3)

    top_area = strength_areas[0].area if strength_areas else "N/A"
    strategic_rec = (
        f"{institution}'s strongest area is {top_area}. "
        f"Portfolio diversity score is {diversity:.2f}/1.0. "
        f"Priority: address gaps in {gaps[0].area if gaps else 'all areas covered'}."
    )

    return PortfolioAnalysisResponse(
        institution=institution,
        total_researchers=len(inst_researchers),
        total_publications=total_pubs,
        strength_areas=strength_areas,
        gaps=gaps,
        diversity_score=diversity,
        interdisciplinary_score=interdisciplinary,
        strategic_recommendation=strategic_rec,
    )


def get_benchmarks() -> List[BenchmarkItem]:
    from shared.data.rwanda_dataset import RESEARCHERS as ALL_R
    inst_pubs: Dict[str, list] = defaultdict(list)
    inst_h: Dict[str, list] = defaultdict(list)

    for r in ALL_R:
        inst_h[r["institution"]].append(r.get("h_index", 0))
    for pub in PUBLICATIONS:
        for author_id in pub.get("authors", []):
            from shared.data.rwanda_dataset import get_researcher_by_id
            r = get_researcher_by_id(author_id)
            if r:
                inst_pubs[r["institution"]].append(pub)

    benchmarks = []
    for inst, pubs in inst_pubs.items():
        avg_cites = sum(p.get("citations", 0) for p in pubs) / max(len(pubs), 1)
        h_vals = inst_h.get(inst, [0])
        h_avg = sum(h_vals) / max(len(h_vals), 1)
        areas = Counter(p.get("research_area", "") for p in pubs)
        top_area = areas.most_common(1)[0][0] if areas else "N/A"
        benchmarks.append(BenchmarkItem(
            institution=inst,
            total_publications=len(pubs),
            avg_citations=round(avg_cites, 1),
            h_index_avg=round(h_avg, 1),
            top_area=top_area,
            rank=0,
        ))

    benchmarks.sort(key=lambda x: x.total_publications, reverse=True)
    for i, b in enumerate(benchmarks):
        b.rank = i + 1
    return benchmarks

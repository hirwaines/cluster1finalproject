"""
Department Analytics Service — core AI logic.
Provides research managers with department-level intelligence.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from collections import Counter, defaultdict
from typing import List, Dict
from shared.data.rwanda_dataset import (
    RESEARCHERS, PUBLICATIONS,
    get_researcher_by_id, get_researcher_publications, get_co_authors
)
from shared.utils.text_utils import classify_research_area
from research_manager.department_analytics.models import (
    DepartmentStat, InstitutionStat,
    DepartmentComparisonResponse, ResearcherPerformanceItem
)


def _primary_area(researcher_id: str) -> str:
    pubs = get_researcher_publications(researcher_id)
    areas = Counter(p.get("research_area", classify_research_area(p.get("abstract", ""))) for p in pubs)
    return areas.most_common(1)[0][0] if areas else "General Research"


def get_department_stats() -> List[DepartmentStat]:
    dept_data: Dict[str, dict] = defaultdict(lambda: {
        "institution": "", "researchers": [], "publications": [],
        "citations": 0, "h_indices": [], "areas": []
    })

    for r in RESEARCHERS:
        dept = r["department"]
        dept_data[dept]["institution"] = r["institution"]
        dept_data[dept]["researchers"].append(r["name"])
        dept_data[dept]["h_indices"].append(r.get("h_index", 0))

    for pub in PUBLICATIONS:
        for author_id in pub.get("authors", []):
            researcher = get_researcher_by_id(author_id)
            if researcher:
                dept = researcher["department"]
                dept_data[dept]["publications"].append(pub["id"])
                dept_data[dept]["citations"] += pub.get("citations", 0)
                area = pub.get("research_area", classify_research_area(pub.get("abstract", "")))
                dept_data[dept]["areas"].append(area)

    stats = []
    for dept, data in dept_data.items():
        pub_count = len(set(data["publications"]))
        h_avg = sum(data["h_indices"]) / max(len(data["h_indices"]), 1)
        top_areas = [a for a, _ in Counter(data["areas"]).most_common(3)]
        top_researchers = data["researchers"][:3]

        # Trend: compare recent vs older publications
        dept_pubs = [p for p in PUBLICATIONS if p["id"] in set(data["publications"])]
        recent = sum(1 for p in dept_pubs if p.get("year", 0) >= 2021)
        older = sum(1 for p in dept_pubs if p.get("year", 0) < 2021)
        trend = "growing" if recent > older else "stable" if recent == older else "declining"

        stats.append(DepartmentStat(
            department=dept,
            institution=data["institution"],
            researcher_count=len(data["researchers"]),
            total_publications=pub_count,
            total_citations=data["citations"],
            avg_h_index=round(h_avg, 1),
            top_research_areas=top_areas,
            top_researchers=top_researchers,
            publication_trend=trend,
        ))

    stats.sort(key=lambda x: x.total_citations, reverse=True)
    return stats


def get_institution_stats() -> List[InstitutionStat]:
    inst_data: Dict[str, dict] = defaultdict(lambda: {
        "departments": set(), "researchers": [], "publications": set(),
        "citations": 0, "areas": [], "collab_count": 0
    })

    for r in RESEARCHERS:
        inst = r["institution"]
        inst_data[inst]["departments"].add(r["department"])
        inst_data[inst]["researchers"].append(r["id"])
        co = get_co_authors(r["id"])
        inst_data[inst]["collab_count"] += len(co)

    for pub in PUBLICATIONS:
        for author_id in pub.get("authors", []):
            r = get_researcher_by_id(author_id)
            if r:
                inst = r["institution"]
                inst_data[inst]["publications"].add(pub["id"])
                inst_data[inst]["citations"] += pub.get("citations", 0)
                area = pub.get("research_area", "")
                if area:
                    inst_data[inst]["areas"].append(area)

    result = []
    for inst, data in inst_data.items():
        top_areas = [a for a, _ in Counter(data["areas"]).most_common(3)]
        n = max(len(data["researchers"]), 1)
        collab_score = round(min(data["collab_count"] / (n * 5), 1.0), 3)
        result.append(InstitutionStat(
            institution=inst,
            department_count=len(data["departments"]),
            total_researchers=len(data["researchers"]),
            total_publications=len(data["publications"]),
            total_citations=data["citations"],
            top_areas=top_areas,
            collaboration_score=collab_score,
        ))

    result.sort(key=lambda x: x.total_publications, reverse=True)
    return result


def get_department_comparison() -> DepartmentComparisonResponse:
    stats = get_department_stats()
    top_dept = max(stats, key=lambda x: x.total_citations).department
    collab_map = {}
    for r in RESEARCHERS:
        dept = r["department"]
        collab_map[dept] = collab_map.get(dept, 0) + len(get_co_authors(r["id"]))
    most_collab = max(collab_map, key=collab_map.get) if collab_map else "N/A"
    return DepartmentComparisonResponse(
        departments=stats,
        top_performing_department=top_dept,
        most_collaborative_department=most_collab,
        summary=f"Analysis of {len(stats)} departments across Rwandan research institutions."
    )


def get_researcher_performance(institution: str = None) -> List[ResearcherPerformanceItem]:
    items = []
    for r in RESEARCHERS:
        if institution and institution.lower() not in r["institution"].lower():
            continue
        pubs = get_researcher_publications(r["id"])
        total_cites = sum(p.get("citations", 0) for p in pubs)
        h = r.get("h_index", 0)
        area = _primary_area(r["id"])

        # Performance tier based on h-index
        if h >= 10:
            tier = "Top Performer"
        elif h >= 5:
            tier = "Active Researcher"
        elif h >= 2:
            tier = "Emerging Researcher"
        else:
            tier = "Early Career"

        items.append(ResearcherPerformanceItem(
            researcher_id=r["id"],
            name=r["name"],
            department=r["department"],
            h_index=h,
            publication_count=len(pubs),
            total_citations=total_cites,
            career_stage=r.get("career_stage", "mid"),
            primary_area=area,
            performance_tier=tier,
        ))

    items.sort(key=lambda x: x.h_index, reverse=True)
    return items

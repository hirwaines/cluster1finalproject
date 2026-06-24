"""
Faculty Intelligence Service — core AI logic for Department Heads.
Provides faculty expertise distribution, succession risk, and hiring recommendations.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from collections import Counter, defaultdict
from typing import List, Dict
from shared.data.rwanda_dataset import (
    RESEARCHERS, FUNDING_OPPORTUNITIES,
    get_researcher_by_id, get_researcher_publications, get_co_authors
)
from shared.utils.text_utils import (
    build_corpus_idf, build_tfidf_vector, classify_research_area
)
from department_head.faculty_intelligence.models import (
    FacultyProfile, DepartmentInsight, FacultyDistributionResponse
)

_ALL_TEXTS = [p["abstract"] for p in __import__(
    "shared.data.rwanda_dataset", fromlist=["PUBLICATIONS"]
).PUBLICATIONS]
_IDF = build_corpus_idf(_ALL_TEXTS)

ALL_AREAS = [
    "Agriculture & Food Security", "Health & Biomedical Sciences",
    "ICT & Digital Innovation", "Environment & Natural Resources",
    "Economics & Finance", "Education & Social Sciences",
    "Energy & Infrastructure", "Peace, Security & Governance"
]


def _primary_area(researcher_id: str) -> str:
    pubs = get_researcher_publications(researcher_id)
    areas = Counter(p.get("research_area", classify_research_area(p.get("abstract", ""))) for p in pubs)
    return areas.most_common(1)[0][0] if areas else "General Research"


def _top_kw(researcher_id: str) -> List[str]:
    pubs = get_researcher_publications(researcher_id)
    blob = " ".join(p.get("abstract", "") + " " + " ".join(p.get("keywords", [])) for p in pubs)
    vec = build_tfidf_vector(blob, _IDF)
    return [k for k, _ in sorted(vec.items(), key=lambda x: x[1], reverse=True)[:6]]


def _funding_alignment_score(researcher_id: str) -> float:
    pubs = get_researcher_publications(researcher_id)
    blob = " ".join(p.get("abstract", "") for p in pubs).lower()
    matches = sum(
        1 for f in FUNDING_OPPORTUNITIES
        if any(kw.lower() in blob for kw in f.get("keywords", []))
    )
    return round(min(matches / len(FUNDING_OPPORTUNITIES), 1.0), 3)


def get_faculty_profiles(department: str = None, institution: str = None) -> List[FacultyProfile]:
    profiles = []
    for r in RESEARCHERS:
        if department and department.lower() not in r["department"].lower():
            continue
        if institution and institution.lower() not in r["institution"].lower():
            continue

        pubs = get_researcher_publications(r["id"])
        total_cites = sum(p.get("citations", 0) for p in pubs)
        h = r.get("h_index", 0)
        area = _primary_area(r["id"])
        kw = _top_kw(r["id"])
        collab_count = len(get_co_authors(r["id"]))
        funding_score = _funding_alignment_score(r["id"])

        if h >= 10:
            tier = "Top Performer"
        elif h >= 5:
            tier = "Active"
        elif h >= 2:
            tier = "Emerging"
        else:
            tier = "Early Career"

        profiles.append(FacultyProfile(
            researcher_id=r["id"],
            name=r["name"],
            position=r.get("position", "Lecturer"),
            career_stage=r.get("career_stage", "mid"),
            h_index=h,
            publication_count=len(pubs),
            total_citations=total_cites,
            primary_area=area,
            expertise_keywords=kw,
            collaboration_count=collab_count,
            funding_alignment_score=funding_score,
            performance_tier=tier,
        ))

    profiles.sort(key=lambda x: x.h_index, reverse=True)
    return profiles


def get_department_insight(department: str, institution: str = None) -> DepartmentInsight:
    faculty = get_faculty_profiles(department=department, institution=institution)
    if not faculty:
        return DepartmentInsight(
            department=department, institution=institution or "N/A",
            faculty_count=0, research_strength="Unknown",
            coverage_areas=[], gap_areas=ALL_AREAS,
            succession_risk="High", recommended_hires=[]
        )

    inst = faculty[0].name if faculty else institution or "N/A"
    areas = Counter(f.primary_area for f in faculty)
    top_area = areas.most_common(1)[0][0] if areas else "N/A"
    coverage = list(areas.keys())
    gaps = [a for a in ALL_AREAS if a not in coverage]

    # Succession risk: if >50% of senior researchers nearing retirement (senior)
    senior_count = sum(1 for f in faculty if f.career_stage == "senior")
    junior_count = sum(1 for f in faculty if f.career_stage == "junior")
    succession_risk = (
        "High" if senior_count > len(faculty) * 0.6
        else "Medium" if senior_count > len(faculty) * 0.3
        else "Low"
    )

    # Recommend hiring for gap areas
    recommended_hires = [f"Researcher in {g}" for g in gaps[:3]]

    inst_val = next((r["institution"] for r in RESEARCHERS
                    if department.lower() in r["department"].lower()), institution or "N/A")

    return DepartmentInsight(
        department=department,
        institution=inst_val,
        faculty_count=len(faculty),
        research_strength=top_area,
        coverage_areas=coverage,
        gap_areas=gaps,
        succession_risk=succession_risk,
        recommended_hires=recommended_hires,
    )


def get_faculty_distribution(department: str) -> FacultyDistributionResponse:
    faculty = get_faculty_profiles(department=department)
    stage_dist = Counter(f.career_stage for f in faculty)
    area_dist = Counter(f.primary_area for f in faculty)

    senior = stage_dist.get("senior", 0)
    mid = stage_dist.get("mid", 0)
    junior = stage_dist.get("junior", 0)
    total = max(len(faculty), 1)

    if senior / total > 0.5:
        balance = "Senior-heavy — succession planning needed"
    elif junior / total > 0.5:
        balance = "Junior-heavy — mentorship programs recommended"
    else:
        balance = "Balanced career stage distribution"

    return FacultyDistributionResponse(
        department=department,
        by_career_stage=dict(stage_dist),
        by_research_area=dict(area_dist),
        seniority_balance=balance,
        area_coverage=list(area_dist.keys()),
    )

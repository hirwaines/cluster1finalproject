from pydantic import BaseModel
from typing import List, Dict, Optional

class FacultyProfile(BaseModel):
    researcher_id: str
    name: str
    position: str
    career_stage: str
    h_index: int
    publication_count: int
    total_citations: int
    primary_area: str
    expertise_keywords: List[str]
    collaboration_count: int
    funding_alignment_score: float
    performance_tier: str

class DepartmentInsight(BaseModel):
    department: str
    institution: str
    faculty_count: int
    research_strength: str
    coverage_areas: List[str]
    gap_areas: List[str]
    succession_risk: str
    recommended_hires: List[str]

class FacultyDistributionResponse(BaseModel):
    department: str
    by_career_stage: Dict[str, int]
    by_research_area: Dict[str, int]
    seniority_balance: str
    area_coverage: List[str]

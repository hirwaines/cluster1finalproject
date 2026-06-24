from pydantic import BaseModel
from typing import List, Dict, Optional

class DepartmentStat(BaseModel):
    department: str
    institution: str
    researcher_count: int
    total_publications: int
    total_citations: int
    avg_h_index: float
    top_research_areas: List[str]
    top_researchers: List[str]
    publication_trend: str

class InstitutionStat(BaseModel):
    institution: str
    department_count: int
    total_researchers: int
    total_publications: int
    total_citations: int
    top_areas: List[str]
    collaboration_score: float

class DepartmentComparisonResponse(BaseModel):
    departments: List[DepartmentStat]
    top_performing_department: str
    most_collaborative_department: str
    summary: str

class ResearcherPerformanceItem(BaseModel):
    researcher_id: str
    name: str
    department: str
    h_index: int
    publication_count: int
    total_citations: int
    career_stage: str
    primary_area: str
    performance_tier: str

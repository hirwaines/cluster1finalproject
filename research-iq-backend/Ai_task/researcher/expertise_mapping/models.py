from pydantic import BaseModel
from typing import List, Optional, Dict

class ExpertiseKeyword(BaseModel):
    keyword: str
    score: float
    frequency: int

class ExpertiseProfile(BaseModel):
    researcher_id: str
    researcher_name: str
    institution: str
    department: str
    primary_area: str
    top_keywords: List[ExpertiseKeyword]
    research_areas: List[str]
    expertise_score: float
    total_publications: int
    h_index: int

class ExpertiseFromTextRequest(BaseModel):
    text: str
    top_n: Optional[int] = 12

class ExpertiseFromTextResponse(BaseModel):
    keywords: List[ExpertiseKeyword]
    detected_area: str

class ExpertiseSearchRequest(BaseModel):
    keyword: str
    limit: Optional[int] = 10

class ExpertiseSearchResult(BaseModel):
    researcher_id: str
    researcher_name: str
    institution: str
    department: str
    relevance_score: float
    matching_keywords: List[str]
    h_index: int

class HeatmapCell(BaseModel):
    department: str
    institution: str
    keyword: str
    intensity: float
    researcher_count: int

class HeatmapResponse(BaseModel):
    cells: List[HeatmapCell]
    top_keywords: List[str]
    departments: List[str]

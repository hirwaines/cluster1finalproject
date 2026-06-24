from pydantic import BaseModel
from typing import List, Dict, Optional

class PortfolioStrengthArea(BaseModel):
    area: str
    strength_score: float
    publication_count: int
    citation_impact: float
    active_researchers: int
    trend: str

class PortfolioGap(BaseModel):
    area: str
    reason: str
    recommended_action: str
    potential_funding: List[str]

class PortfolioAnalysisResponse(BaseModel):
    institution: str
    total_researchers: int
    total_publications: int
    strength_areas: List[PortfolioStrengthArea]
    gaps: List[PortfolioGap]
    diversity_score: float
    interdisciplinary_score: float
    strategic_recommendation: str

class BenchmarkItem(BaseModel):
    institution: str
    total_publications: int
    avg_citations: float
    h_index_avg: float
    top_area: str
    rank: int

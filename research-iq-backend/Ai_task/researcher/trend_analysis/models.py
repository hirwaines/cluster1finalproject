from pydantic import BaseModel
from typing import List, Optional, Dict

class TrendingTopic(BaseModel):
    topic: str
    keywords: List[str]
    publication_count: int
    avg_citations: float
    trend_direction: str  # "rising", "stable", "declining"
    trend_score: float
    years_active: List[int]

class YearlyVolume(BaseModel):
    year: int
    count: int
    avg_citations: float
    top_keywords: List[str]

class EmergingArea(BaseModel):
    area: str
    keywords: List[str]
    first_seen_year: int
    growth_rate: float
    confidence: float
    sample_titles: List[str]

class TrendForecast(BaseModel):
    topic: str
    current_volume: int
    forecast_next_year: float
    forecast_two_years: float
    confidence_interval: str
    basis: str

class TrendAnalysisResponse(BaseModel):
    trending_topics: List[TrendingTopic]
    yearly_volumes: List[YearlyVolume]
    emerging_areas: List[EmergingArea]
    top_research_areas: Dict[str, int]
    analysis_period: str

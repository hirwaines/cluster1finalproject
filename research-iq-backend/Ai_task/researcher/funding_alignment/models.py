from pydantic import BaseModel
from typing import List, Optional

class FundingMatch(BaseModel):
    fund_id: str
    title: str
    funder: str
    match_score: float
    matched_keywords: List[str]
    amount: str
    deadline: str
    areas: List[str]
    eligibility: str
    why_match: str

class FundingAlignmentResponse(BaseModel):
    researcher_id: str
    researcher_name: str
    primary_area: str
    matches: List[FundingMatch]

class FundingAnalysisRequest(BaseModel):
    researcher_id: Optional[str] = None
    keywords: Optional[List[str]] = None
    research_area: Optional[str] = None

class FundingLandscapeItem(BaseModel):
    area: str
    opportunity_count: int
    total_approximate_usd: str
    top_funders: List[str]
    key_themes: List[str]

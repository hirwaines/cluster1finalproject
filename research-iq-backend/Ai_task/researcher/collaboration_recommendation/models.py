from pydantic import BaseModel
from typing import List, Optional

class CollaboratorMatch(BaseModel):
    researcher_id: str
    researcher_name: str
    institution: str
    department: str
    career_stage: str
    similarity_score: float
    shared_keywords: List[str]
    complementary_areas: List[str]
    existing_collaboration: bool
    recommendation_reason: str
    h_index: int

class CollaborationRecommendationResponse(BaseModel):
    for_researcher_id: str
    for_researcher_name: str
    recommendations: List[CollaboratorMatch]
    recommendation_type: str

class CompatibilityRequest(BaseModel):
    researcher_id_1: str
    researcher_id_2: str

class CompatibilityResult(BaseModel):
    researcher_1: str
    researcher_2: str
    similarity_score: float
    shared_keywords: List[str]
    shared_areas: List[str]
    complementarity_score: float
    collaboration_potential: str
    explanation: str

class CrossDisciplinaryMatch(BaseModel):
    researcher_id: str
    researcher_name: str
    institution: str
    primary_area: str
    bridge_keywords: List[str]
    cross_score: float
    why_cross_disciplinary: str

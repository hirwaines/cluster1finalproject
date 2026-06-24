from pydantic import BaseModel
from typing import List, Optional, Dict

class ProcessPublicationRequest(BaseModel):
    title: str
    abstract: str
    raw_keywords: Optional[List[str]] = []
    authors_raw: Optional[str] = ""

class ProcessedPublication(BaseModel):
    title: str
    extracted_keywords: List[str]
    research_area: str
    entities: Dict[str, List[str]]
    topic_tokens: List[str]
    word_count: int
    readability_score: str
    sentiment_label: str

class ClassifyRequest(BaseModel):
    text: str

class ClassifyResponse(BaseModel):
    research_area: str
    confidence: float
    secondary_areas: List[str]

class EntityExtractionRequest(BaseModel):
    text: str

class EntityExtractionResponse(BaseModel):
    institutions: List[str]
    locations: List[str]
    funders: List[str]
    potential_authors: List[str]

class TopicModelResult(BaseModel):
    topic_id: int
    label: str
    keywords: List[str]
    document_count: int
    representative_title: str

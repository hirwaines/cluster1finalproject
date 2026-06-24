from pydantic import BaseModel
from typing import List, Optional, Dict

class BatchProcessRequest(BaseModel):
    publication_ids: Optional[List[str]] = None
    process_all: Optional[bool] = False

class PipelineResult(BaseModel):
    publication_id: str
    title: str
    extracted_keywords: List[str]
    research_area: str
    entities: Dict[str, List[str]]
    word_count: int
    status: str

class PipelineSummary(BaseModel):
    total_processed: int
    successful: int
    failed: int
    area_distribution: Dict[str, int]
    top_keywords_corpus: List[str]
    avg_word_count: float

class DataQualityReport(BaseModel):
    total_publications: int
    publications_with_abstracts: int
    publications_with_keywords: int
    avg_keyword_count: float
    area_coverage: Dict[str, int]
    duplicate_titles: List[str]
    quality_score: float
    recommendations: List[str]

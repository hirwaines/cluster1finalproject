"""
Research Knowledge Processing Service — FastAPI app.
Port: 8005
Endpoints:
  POST /knowledge/process
  POST /knowledge/classify
  POST /knowledge/entities
  GET  /knowledge/topics
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from researcher.knowledge_processing.models import (
    ProcessPublicationRequest, ProcessedPublication,
    ClassifyRequest, ClassifyResponse,
    EntityExtractionRequest, EntityExtractionResponse,
    TopicModelResult
)
from researcher.knowledge_processing.service import (
    process_publication, classify_text, extract_entities, get_topic_model
)

app = FastAPI(
    title="ResearchIQ — Knowledge Processing Service",
    description="NLP pipeline for research publication processing: keyword extraction, classification, NER.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "knowledge_processing"}


@app.post("/knowledge/process", response_model=ProcessedPublication)
def process(request: ProcessPublicationRequest):
    """Full NLP processing of a research publication."""
    if not request.abstract.strip():
        raise HTTPException(status_code=400, detail="Abstract is required.")
    return process_publication(request.title, request.abstract, request.raw_keywords or [])


@app.post("/knowledge/classify", response_model=ClassifyResponse)
def classify(request: ClassifyRequest):
    """Classify research text into a Rwanda research area."""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    return classify_text(request.text)


@app.post("/knowledge/entities", response_model=EntityExtractionResponse)
def entities(request: EntityExtractionRequest):
    """Extract named entities (institutions, locations, funders) from text."""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    return extract_entities(request.text)


@app.get("/knowledge/topics", response_model=list[TopicModelResult])
def topics():
    """Get topic model of the Rwanda research corpus."""
    return get_topic_model()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8005, reload=True)

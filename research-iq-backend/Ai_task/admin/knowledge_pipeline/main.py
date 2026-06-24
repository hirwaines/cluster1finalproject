"""
Admin Knowledge Pipeline Service — FastAPI app.
Port: 8010
Endpoints:
  POST /pipeline/run
  GET  /pipeline/quality
  GET  /pipeline/process/{publication_id}
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from admin.knowledge_pipeline.models import (
    BatchProcessRequest, PipelineResult, PipelineSummary, DataQualityReport
)
from admin.knowledge_pipeline.service import (
    run_pipeline, get_data_quality_report, get_single_result
)

app = FastAPI(
    title="ResearchIQ — Admin Knowledge Pipeline Service",
    description="Batch NLP processing pipeline for research corpus management and data quality monitoring.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "knowledge_pipeline"}


@app.post("/pipeline/run", response_model=PipelineSummary)
def run(request: BatchProcessRequest):
    """Run the NLP knowledge processing pipeline on publications."""
    return run_pipeline(
        publication_ids=request.publication_ids,
        process_all=request.process_all or False
    )


@app.get("/pipeline/quality", response_model=DataQualityReport)
def quality_report():
    """Get data quality report for the entire research corpus."""
    return get_data_quality_report()


@app.get("/pipeline/process/{publication_id}", response_model=PipelineResult)
def process_single(publication_id: str):
    """Process a single publication through the NLP pipeline."""
    result = get_single_result(publication_id)
    if not result:
        raise HTTPException(status_code=404, detail=f"Publication {publication_id} not found.")
    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8010, reload=True)

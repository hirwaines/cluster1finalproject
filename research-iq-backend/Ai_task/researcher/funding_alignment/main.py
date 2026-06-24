"""
Funding Opportunity Alignment Service — FastAPI app.
Port: 8004
Endpoints:
  GET  /funding/match/{researcher_id}
  POST /funding/analyze
  GET  /funding/landscape
  GET  /funding/opportunities
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from shared.data.rwanda_dataset import FUNDING_OPPORTUNITIES
from researcher.funding_alignment.models import (
    FundingAlignmentResponse, FundingAnalysisRequest,
    FundingMatch, FundingLandscapeItem
)
from researcher.funding_alignment.service import (
    match_funding_for_researcher, analyze_custom_funding, get_funding_landscape
)

app = FastAPI(
    title="ResearchIQ — Funding Opportunity Alignment Service",
    description="AI-powered matching of researcher expertise to Rwanda-relevant funding opportunities.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "funding_alignment", "opportunities_loaded": len(FUNDING_OPPORTUNITIES)}


@app.get("/funding/opportunities")
def list_opportunities():
    """List all available funding opportunities."""
    return FUNDING_OPPORTUNITIES


@app.get("/funding/match/{researcher_id}", response_model=FundingAlignmentResponse)
def match_funding(researcher_id: str):
    """Get AI-matched funding opportunities for a researcher."""
    result = match_funding_for_researcher(researcher_id)
    if result.researcher_name == "Unknown":
        raise HTTPException(status_code=404, detail=f"Researcher {researcher_id} not found.")
    return result


@app.post("/funding/analyze", response_model=list[FundingMatch])
def analyze_funding(request: FundingAnalysisRequest):
    """Find matching funding opportunities from keywords or research area (no researcher ID required)."""
    if request.researcher_id:
        result = match_funding_for_researcher(request.researcher_id)
        return result.matches
    if not request.keywords and not request.research_area:
        raise HTTPException(status_code=400, detail="Provide researcher_id, keywords, or research_area.")
    return analyze_custom_funding(
        keywords=request.keywords or [],
        research_area=request.research_area or ""
    )


@app.get("/funding/landscape", response_model=list[FundingLandscapeItem])
def funding_landscape():
    """Get overview of funding landscape by research area."""
    return get_funding_landscape()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8004, reload=True)

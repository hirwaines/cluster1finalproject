"""
Expertise Mapping Service — FastAPI app.
Port: 8001
Endpoints:
  GET  /expertise/profile/{researcher_id}
  POST /expertise/extract
  GET  /expertise/search
  GET  /expertise/heatmap
  GET  /expertise/researchers
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from shared.data.rwanda_dataset import RESEARCHERS
from researcher.expertise_mapping.models import (
    ExpertiseFromTextRequest, ExpertiseFromTextResponse,
    ExpertiseProfile, ExpertiseSearchResult, HeatmapResponse
)
from researcher.expertise_mapping.service import (
    get_expertise_profile, extract_expertise_from_text,
    search_by_expertise, get_expertise_heatmap
)

app = FastAPI(
    title="ResearchIQ — Expertise Mapping Service",
    description="AI-powered researcher expertise mapping for Rwanda academic institutions.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "expertise_mapping", "researchers_loaded": len(RESEARCHERS)}


@app.get("/expertise/researchers")
def list_researchers():
    """List all available researchers with their IDs."""
    return [{"id": r["id"], "name": r["name"], "institution": r["institution"],
             "department": r["department"]} for r in RESEARCHERS]


@app.get("/expertise/profile/{researcher_id}", response_model=ExpertiseProfile)
def expertise_profile(researcher_id: str):
    """Get full AI-generated expertise profile for a researcher."""
    profile = get_expertise_profile(researcher_id)
    if not profile:
        raise HTTPException(status_code=404, detail=f"Researcher {researcher_id} not found.")
    return profile


@app.post("/expertise/extract", response_model=ExpertiseFromTextResponse)
def extract_from_text(request: ExpertiseFromTextRequest):
    """Extract expertise keywords from raw text (abstract or publication)."""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    return extract_expertise_from_text(request.text, request.top_n or 12)


@app.get("/expertise/search", response_model=list[ExpertiseSearchResult])
def search_expertise(
    keyword: str = Query(..., description="Expertise keyword to search for"),
    limit: int = Query(10, ge=1, le=30)
):
    """Find researchers by expertise keyword."""
    results = search_by_expertise(keyword, limit)
    if not results:
        return []
    return results


@app.get("/expertise/heatmap", response_model=HeatmapResponse)
def expertise_heatmap():
    """Generate expertise density heatmap data across departments and institutions."""
    return get_expertise_heatmap()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)

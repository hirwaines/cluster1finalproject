"""
Collaboration Recommendation Service — FastAPI app.
Port: 8002
Endpoints:
  GET  /collaboration/recommend/{researcher_id}
  POST /collaboration/compatibility
  GET  /collaboration/cross-disciplinary/{researcher_id}
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from shared.data.rwanda_dataset import RESEARCHERS
from researcher.collaboration_recommendation.models import (
    CollaborationRecommendationResponse, CompatibilityRequest,
    CompatibilityResult, CrossDisciplinaryMatch
)
from researcher.collaboration_recommendation.service import (
    recommend_collaborators, check_compatibility, recommend_cross_disciplinary
)

app = FastAPI(
    title="ResearchIQ — Collaboration Recommendation Service",
    description="AI-powered academic collaboration recommendations for Rwanda researchers.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "collaboration_recommendation", "researchers_loaded": len(RESEARCHERS)}


@app.get("/collaboration/recommend/{researcher_id}", response_model=CollaborationRecommendationResponse)
def recommend(
    researcher_id: str,
    limit: int = Query(8, ge=1, le=20)
):
    """Get AI-powered collaboration recommendations for a researcher."""
    result = recommend_collaborators(researcher_id, limit)
    if not result.recommendations and result.for_researcher_name == "Unknown":
        raise HTTPException(status_code=404, detail=f"Researcher {researcher_id} not found.")
    return result


@app.post("/collaboration/compatibility", response_model=CompatibilityResult)
def compatibility(request: CompatibilityRequest):
    """Check collaboration compatibility between two researchers."""
    result = check_compatibility(request.researcher_id_1, request.researcher_id_2)
    return result


@app.get("/collaboration/cross-disciplinary/{researcher_id}", response_model=list[CrossDisciplinaryMatch])
def cross_disciplinary(
    researcher_id: str,
    limit: int = Query(5, ge=1, le=15)
):
    """Get cross-disciplinary collaboration suggestions for a researcher."""
    results = recommend_cross_disciplinary(researcher_id, limit)
    if not results:
        raise HTTPException(status_code=404, detail=f"Researcher {researcher_id} not found or no cross-disciplinary matches.")
    return results


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)

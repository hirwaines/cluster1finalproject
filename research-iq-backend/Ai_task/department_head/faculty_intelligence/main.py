"""
Faculty Intelligence Service — FastAPI app for Department Heads.
Port: 8009
Endpoints:
  GET  /faculty/profiles
  GET  /faculty/insight
  GET  /faculty/distribution
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from department_head.faculty_intelligence.models import (
    FacultyProfile, DepartmentInsight, FacultyDistributionResponse
)
from department_head.faculty_intelligence.service import (
    get_faculty_profiles, get_department_insight, get_faculty_distribution
)

app = FastAPI(
    title="ResearchIQ — Faculty Intelligence Service",
    description="AI-driven faculty expertise mapping and strategic intelligence for department heads.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "faculty_intelligence"}


@app.get("/faculty/profiles", response_model=list[FacultyProfile])
def profiles(
    department: str = Query(None, description="Filter by department name"),
    institution: str = Query(None, description="Filter by institution name")
):
    """Get AI-generated faculty research profiles with performance metrics."""
    return get_faculty_profiles(department=department, institution=institution)


@app.get("/faculty/insight", response_model=DepartmentInsight)
def insight(
    department: str = Query(..., description="Department name"),
    institution: str = Query(None, description="Institution name (optional)")
):
    """Get strategic intelligence report for a department: strengths, gaps, succession risk."""
    result = get_department_insight(department=department, institution=institution)
    if result.faculty_count == 0:
        raise HTTPException(status_code=404, detail=f"No faculty found for department: {department}")
    return result


@app.get("/faculty/distribution", response_model=FacultyDistributionResponse)
def distribution(
    department: str = Query(..., description="Department name")
):
    """Get faculty distribution by career stage and research area."""
    return get_faculty_distribution(department=department)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8009, reload=True)

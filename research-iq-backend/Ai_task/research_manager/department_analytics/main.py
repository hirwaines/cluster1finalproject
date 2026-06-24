"""
Department Analytics Service — FastAPI app.
Port: 8007
Endpoints:
  GET  /analytics/departments
  GET  /analytics/institutions
  GET  /analytics/comparison
  GET  /analytics/performance
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from research_manager.department_analytics.models import (
    DepartmentStat, InstitutionStat,
    DepartmentComparisonResponse, ResearcherPerformanceItem
)
from research_manager.department_analytics.service import (
    get_department_stats, get_institution_stats,
    get_department_comparison, get_researcher_performance
)

app = FastAPI(
    title="ResearchIQ — Department Analytics Service",
    description="Research intelligence for research managers: department performance, benchmarking, and researcher productivity.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "department_analytics"}


@app.get("/analytics/departments", response_model=list[DepartmentStat])
def departments():
    """Get AI-analyzed performance stats for all departments."""
    return get_department_stats()


@app.get("/analytics/institutions", response_model=list[InstitutionStat])
def institutions():
    """Get research performance metrics per institution."""
    return get_institution_stats()


@app.get("/analytics/comparison", response_model=DepartmentComparisonResponse)
def comparison():
    """Get comparative analysis across all departments."""
    return get_department_comparison()


@app.get("/analytics/performance", response_model=list[ResearcherPerformanceItem])
def performance(
    institution: str = Query(None, description="Filter by institution name (partial match)")
):
    """Get individual researcher performance rankings."""
    return get_researcher_performance(institution=institution)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8007, reload=True)

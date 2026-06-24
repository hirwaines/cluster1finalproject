"""
Research Portfolio Analysis Service — FastAPI app.
Port: 8008
Endpoints:
  GET  /portfolio/analyze
  GET  /portfolio/benchmarks
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from research_manager.research_portfolio.models import (
    PortfolioAnalysisResponse, BenchmarkItem
)
from research_manager.research_portfolio.service import (
    analyze_portfolio, get_benchmarks
)

app = FastAPI(
    title="ResearchIQ — Research Portfolio Analysis Service",
    description="Institutional research portfolio strength, gap analysis, and strategic benchmarking.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "research_portfolio"}


@app.get("/portfolio/analyze", response_model=PortfolioAnalysisResponse)
def analyze(
    institution: str = Query("University of Rwanda", description="Institution name to analyze")
):
    """Get full research portfolio analysis for an institution."""
    return analyze_portfolio(institution=institution)


@app.get("/portfolio/benchmarks", response_model=list[BenchmarkItem])
def benchmarks():
    """Benchmark all Rwandan institutions by research output and impact."""
    return get_benchmarks()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8008, reload=True)

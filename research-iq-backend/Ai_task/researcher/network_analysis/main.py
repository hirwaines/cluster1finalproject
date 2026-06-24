"""
Collaboration Network Analysis Service — FastAPI app.
Port: 8006
Endpoints:
  GET  /network/summary
  GET  /network/metrics/{researcher_id}
  GET  /network/communities
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from researcher.network_analysis.models import (
    NetworkSummary, NetworkMetrics, NetworkCommunity
)
from researcher.network_analysis.service import (
    get_network_summary, get_researcher_metrics, _detect_communities
)

app = FastAPI(
    title="ResearchIQ — Collaboration Network Analysis Service",
    description="Graph-based co-authorship network analysis for Rwanda research institutions.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "network_analysis"}


@app.get("/network/summary", response_model=NetworkSummary)
def network_summary():
    """Get full collaboration network with nodes, edges, and metrics."""
    return get_network_summary()


@app.get("/network/metrics/{researcher_id}", response_model=NetworkMetrics)
def researcher_metrics(researcher_id: str):
    """Get network centrality metrics and collaboration gaps for a researcher."""
    metrics = get_researcher_metrics(researcher_id)
    if not metrics:
        raise HTTPException(status_code=404, detail=f"Researcher {researcher_id} not found.")
    return metrics


@app.get("/network/communities", response_model=list[NetworkCommunity])
def communities():
    """Get research communities/clusters in the collaboration network."""
    return _detect_communities()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8006, reload=True)

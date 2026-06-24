"""
Research Trend Analysis Service — FastAPI app.
Port: 8003
Endpoints:
  GET  /trends/full
  GET  /trends/topics
  GET  /trends/yearly
  GET  /trends/emerging
  GET  /trends/forecast
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from researcher.trend_analysis.models import (
    TrendAnalysisResponse, TrendingTopic, YearlyVolume, EmergingArea, TrendForecast
)
from researcher.trend_analysis.service import (
    get_full_analysis, get_trending_topics, get_yearly_volumes,
    get_emerging_areas, get_trend_forecast
)

app = FastAPI(
    title="ResearchIQ — Research Trend Analysis Service",
    description="AI-powered research trend detection and forecasting for Rwanda academic institutions.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "trend_analysis"}


@app.get("/trends/full", response_model=TrendAnalysisResponse)
def full_analysis():
    """Get complete research trend analysis including topics, volumes, and emerging areas."""
    return get_full_analysis()


@app.get("/trends/topics", response_model=list[TrendingTopic])
def trending_topics(
    since_year: int = Query(2018, description="Only include publications from this year onwards")
):
    """Get ranked trending research topics."""
    return get_trending_topics(min_year=since_year)


@app.get("/trends/yearly", response_model=list[YearlyVolume])
def yearly_volumes():
    """Get publication volume and citation data by year."""
    return get_yearly_volumes()


@app.get("/trends/emerging", response_model=list[EmergingArea])
def emerging_areas(
    lookback_years: int = Query(3, ge=1, le=10, description="Years to define 'recent' trend window")
):
    """Identify emerging research areas with growth rate analysis."""
    return get_emerging_areas(lookback_years=lookback_years)


@app.get("/trends/forecast", response_model=TrendForecast)
def forecast(
    topic: str = Query(..., description="Research topic or area to forecast (e.g. 'ICT', 'malaria', 'agriculture')")
):
    """Forecast publication volume for a research topic."""
    return get_trend_forecast(topic)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8003, reload=True)

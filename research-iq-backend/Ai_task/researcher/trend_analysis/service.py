"""
Research Trend Analysis Service — core AI logic.
Analyzes publication trends, emerging topics, and temporal patterns in Rwanda research.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from collections import Counter, defaultdict
from typing import List, Dict
from shared.data.rwanda_dataset import PUBLICATIONS
from shared.utils.text_utils import (
    build_corpus_idf, build_tfidf_vector, tokenize, classify_research_area
)
from researcher.trend_analysis.models import (
    TrendingTopic, YearlyVolume, EmergingArea,
    TrendForecast, TrendAnalysisResponse
)

_IDF = build_corpus_idf([p["abstract"] for p in PUBLICATIONS])


def _linear_slope(values: List[float]) -> float:
    """Compute slope of linear regression through (0..n-1, values)."""
    n = len(values)
    if n < 2:
        return 0.0
    x_mean = (n - 1) / 2
    y_mean = sum(values) / n
    num = sum((i - x_mean) * (v - y_mean) for i, v in enumerate(values))
    den = sum((i - x_mean) ** 2 for i in range(n))
    return num / den if den != 0 else 0.0


def get_trending_topics(min_year: int = 2018) -> List[TrendingTopic]:
    recent_pubs = [p for p in PUBLICATIONS if p.get("year", 0) >= min_year]

    # Group keywords by their TF-IDF weight across all recent publications
    keyword_data: Dict[str, dict] = {}
    for pub in recent_pubs:
        text = pub.get("abstract", "") + " " + " ".join(pub.get("keywords", []))
        vec = build_tfidf_vector(text, _IDF)
        year = pub.get("year", 2020)
        cites = pub.get("citations", 0)

        for word, score in sorted(vec.items(), key=lambda x: x[1], reverse=True)[:10]:
            if word not in keyword_data:
                keyword_data[word] = {"score_sum": 0.0, "pubs": [], "years": [], "cites": []}
            keyword_data[word]["score_sum"] += score
            keyword_data[word]["pubs"].append(pub["id"])
            keyword_data[word]["years"].append(year)
            keyword_data[word]["cites"].append(cites)

    # Build topics by clustering related keywords (simple area-based grouping)
    area_topics: Dict[str, dict] = defaultdict(lambda: {"keywords": [], "pubs": set(), "years": [], "cites": []})
    for pub in recent_pubs:
        area = pub.get("research_area", classify_research_area(pub.get("abstract", "")))
        text = pub.get("abstract", "") + " " + " ".join(pub.get("keywords", []))
        vec = build_tfidf_vector(text, _IDF)
        top_kw = [k for k, _ in sorted(vec.items(), key=lambda x: x[1], reverse=True)[:6]]
        area_topics[area]["keywords"].extend(top_kw)
        area_topics[area]["pubs"].add(pub["id"])
        area_topics[area]["years"].append(pub.get("year", 2020))
        area_topics[area]["cites"].append(pub.get("citations", 0))

    topics = []
    for area, data in area_topics.items():
        kw_counter = Counter(data["keywords"])
        top_kw = [k for k, _ in kw_counter.most_common(6)]
        pub_count = len(data["pubs"])
        avg_cites = sum(data["cites"]) / max(len(data["cites"]), 1)
        years = sorted(set(data["years"]))

        # Trend direction based on year distribution
        year_counts = Counter(data["years"])
        sorted_years = sorted(year_counts.keys())
        if len(sorted_years) >= 2:
            counts = [year_counts[y] for y in sorted_years]
            slope = _linear_slope(counts)
            direction = "rising" if slope > 0.2 else "declining" if slope < -0.2 else "stable"
        else:
            slope, direction = 0.0, "stable"

        trend_score = round(pub_count * 0.4 + avg_cites * 0.3 + abs(slope) * 0.3, 3)

        topics.append(TrendingTopic(
            topic=area,
            keywords=top_kw,
            publication_count=pub_count,
            avg_citations=round(avg_cites, 1),
            trend_direction=direction,
            trend_score=round(trend_score, 3),
            years_active=years,
        ))

    topics.sort(key=lambda x: x.trend_score, reverse=True)
    return topics


def get_yearly_volumes() -> List[YearlyVolume]:
    year_pubs: Dict[int, list] = defaultdict(list)
    for pub in PUBLICATIONS:
        yr = pub.get("year")
        if yr:
            year_pubs[yr].append(pub)

    volumes = []
    for year in sorted(year_pubs.keys()):
        pubs = year_pubs[year]
        avg_cites = sum(p.get("citations", 0) for p in pubs) / len(pubs)
        all_text = " ".join(p.get("abstract", "") for p in pubs)
        vec = build_tfidf_vector(all_text, _IDF)
        top_kw = [k for k, _ in sorted(vec.items(), key=lambda x: x[1], reverse=True)[:5]]
        volumes.append(YearlyVolume(
            year=year, count=len(pubs),
            avg_citations=round(avg_cites, 1),
            top_keywords=top_kw,
        ))
    return volumes


def get_emerging_areas(lookback_years: int = 3) -> List[EmergingArea]:
    from datetime import datetime
    current_year = 2024
    recent_cutoff = current_year - lookback_years

    recent = [p for p in PUBLICATIONS if p.get("year", 0) >= recent_cutoff]
    older = [p for p in PUBLICATIONS if p.get("year", 0) < recent_cutoff]

    recent_areas = Counter(p.get("research_area", classify_research_area(p.get("abstract", ""))) for p in recent)
    older_areas = Counter(p.get("research_area", classify_research_area(p.get("abstract", ""))) for p in older)

    emerging = []
    for area, recent_count in recent_areas.items():
        old_count = older_areas.get(area, 0)
        if old_count == 0:
            growth_rate = float(recent_count)
            confidence = 0.7
        else:
            growth_rate = round((recent_count - old_count) / old_count, 2)
            confidence = round(min(recent_count / 5, 1.0), 2)

        if growth_rate > 0.1:
            area_pubs = [p for p in recent if p.get("research_area", "") == area]
            all_kw = []
            for p in area_pubs:
                all_kw.extend(tokenize(p.get("abstract", "")))
            top_kw = [k for k, _ in Counter(all_kw).most_common(6)]
            first_year = min((p.get("year", current_year) for p in PUBLICATIONS if p.get("research_area", "") == area), default=current_year)
            titles = [p["title"] for p in area_pubs[:3]]

            emerging.append(EmergingArea(
                area=area, keywords=top_kw,
                first_seen_year=first_year,
                growth_rate=growth_rate,
                confidence=confidence,
                sample_titles=titles,
            ))

    emerging.sort(key=lambda x: x.growth_rate, reverse=True)
    return emerging


def get_trend_forecast(topic: str) -> TrendForecast:
    topic_pubs = [
        p for p in PUBLICATIONS
        if topic.lower() in p.get("research_area", "").lower()
        or any(topic.lower() in kw.lower() for kw in p.get("keywords", []))
    ]

    year_counts: Dict[int, int] = Counter(p.get("year", 0) for p in topic_pubs if p.get("year"))
    sorted_years = sorted(year_counts.keys())

    if len(sorted_years) < 2:
        return TrendForecast(
            topic=topic, current_volume=len(topic_pubs),
            forecast_next_year=float(len(topic_pubs)),
            forecast_two_years=float(len(topic_pubs)),
            confidence_interval="±2", basis="Insufficient data for projection."
        )

    counts = [year_counts[y] for y in sorted_years]
    slope = _linear_slope(counts)
    current = counts[-1]
    next_year = round(max(current + slope, 0), 1)
    two_years = round(max(current + 2 * slope, 0), 1)

    return TrendForecast(
        topic=topic, current_volume=current,
        forecast_next_year=next_year,
        forecast_two_years=two_years,
        confidence_interval=f"±{max(1, round(abs(slope)))}",
        basis=f"Linear extrapolation from {sorted_years[0]}-{sorted_years[-1]} publication history."
    )


def get_full_analysis() -> TrendAnalysisResponse:
    trending = get_trending_topics()
    volumes = get_yearly_volumes()
    emerging = get_emerging_areas()
    area_counts = Counter(
        p.get("research_area", classify_research_area(p.get("abstract", "")))
        for p in PUBLICATIONS
    )
    years = [p.get("year") for p in PUBLICATIONS if p.get("year")]
    period = f"{min(years)}-{max(years)}" if years else "N/A"

    return TrendAnalysisResponse(
        trending_topics=trending,
        yearly_volumes=volumes,
        emerging_areas=emerging,
        top_research_areas=dict(area_counts.most_common()),
        analysis_period=period,
    )

@echo off
REM Start all 10 ResearchIQ AI services on ports 8001-8010
REM Each service runs in its own command window

cd /d "%~dp0"

echo Starting ResearchIQ AI Services...
echo.

echo [8001] Expertise Mapping Service...
start "Expertise Mapping" cmd /k python -m uvicorn researcher.expertise_mapping.main:app --port 8001

echo [8002] Collaboration Recommendation Service...
start "Collaboration" cmd /k python -m uvicorn researcher.collaboration_recommendation.main:app --port 8002

echo [8003] Research Trend Analysis Service...
start "Trend Analysis" cmd /k python -m uvicorn researcher.trend_analysis.main:app --port 8003

echo [8004] Funding Alignment Service...
start "Funding Alignment" cmd /k python -m uvicorn researcher.funding_alignment.main:app --port 8004

echo [8005] Knowledge Processing Service...
start "Knowledge Processing" cmd /k python -m uvicorn researcher.knowledge_processing.main:app --port 8005

echo [8006] Network Analysis Service...
start "Network Analysis" cmd /k python -m uvicorn researcher.network_analysis.main:app --port 8006

echo [8007] Department Analytics Service...
start "Department Analytics" cmd /k python -m uvicorn research_manager.department_analytics.main:app --port 8007

echo [8008] Research Portfolio Service...
start "Research Portfolio" cmd /k python -m uvicorn research_manager.research_portfolio.main:app --port 8008

echo [8009] Faculty Intelligence Service...
start "Faculty Intelligence" cmd /k python -m uvicorn department_head.faculty_intelligence.main:app --port 8009

echo [8010] Knowledge Pipeline Service...
start "Knowledge Pipeline" cmd /k python -m uvicorn admin.knowledge_pipeline.main:app --port 8010

echo.
echo All services starting..each will start on its own window
echo.
echo Services will be available at:
echo   - http://localhost:8001 (Expertise Mapping)
echo   - http://localhost:8002 (Collaboration)
echo   - http://localhost:8003 (Trends)
echo   - http://localhost:8004 (Funding)
echo   - http://localhost:8005 (Knowledge Processing)
echo   - http://localhost:8006 (Network Analysis)
echo   - http://localhost:8007 (Department Analytics)
echo   - http://localhost:8008 (Research Portfolio)
echo   - http://localhost:8009 (Faculty Intelligence)
echo   - http://localhost:8010 (Knowledge Pipeline)
echo.
echo Backend will connect to these services at http://localhost:PORT/
pause

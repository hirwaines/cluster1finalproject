#!/bin/bash
# Start all 10 ResearchIQ AI services on ports 8001-8010

cd "$(dirname "$0")"

echo "Starting ResearchIQ AI Services..."
echo ""

# Function to start a service
start_service() {
    local port=$1
    local name=$2
    local module=$3
    echo "[${port}] Starting ${name}..."
    python -m uvicorn "${module}:app" --port "${port}" &
    echo "  PID: $!"
}

echo "Starting Researcher Services..."
start_service 8001 "Expertise Mapping" "researcher.expertise_mapping.main"
start_service 8002 "Collaboration Recommendation" "researcher.collaboration_recommendation.main"
start_service 8003 "Research Trend Analysis" "researcher.trend_analysis.main"
start_service 8004 "Funding Alignment" "researcher.funding_alignment.main"
start_service 8005 "Knowledge Processing" "researcher.knowledge_processing.main"
start_service 8006 "Network Analysis" "researcher.network_analysis.main"

echo ""
echo "Starting Research Manager Services..."
start_service 8007 "Department Analytics" "research_manager.department_analytics.main"
start_service 8008 "Research Portfolio" "research_manager.research_portfolio.main"

echo ""
echo "Starting Department Head & Admin Services..."
start_service 8009 "Faculty Intelligence" "department_head.faculty_intelligence.main"
start_service 8010 "Knowledge Pipeline" "admin.knowledge_pipeline.main"

echo ""
echo "All services started in background!"
echo ""
echo "Services available at:"
echo "  - http://localhost:8001/docs (Expertise Mapping)"
echo "  - http://localhost:8002/docs (Collaboration)"
echo "  - http://localhost:8003/docs (Trends)"
echo "  - http://localhost:8004/docs (Funding)"
echo "  - http://localhost:8005/docs (Knowledge Processing)"
echo "  - http://localhost:8006/docs (Network Analysis)"
echo "  - http://localhost:8007/docs (Department Analytics)"
echo "  - http://localhost:8008/docs (Research Portfolio)"
echo "  - http://localhost:8009/docs (Faculty Intelligence)"
echo "  - http://localhost:8010/docs (Knowledge Pipeline)"
echo ""
echo "To stop all services, run: pkill -f 'python -m uvicorn'"

# ResearchIQ AI Services — Backend Team Summary

## What I Built
✅ **10 FastAPI microservices** (Ports 8001-8010)
- Pure Python algorithms (TF-IDF, cosine similarity, linear regression, graph theory)
- NOT LLM/ML models — no training required
- NO external API calls
- In-memory Rwanda research dataset (30 researchers, 86 publications, 20 funding opportunities)

## How to Run

### One-time setup:
```bash
# Install: Java 21, Python 3.8+, PostgreSQL 14+
pip install fastapi==0.111.0 uvicorn==0.29.0 pydantic==2.7.1
```

### Every time:
```bash
# Terminal 1: AI Services (30 seconds)
cd Ai_task && START_ALL_SERVICES.bat

# Terminal 2: Backend (15 seconds)
./gradlew bootRun
```

## How APIs Are Exposed

**Backend connects to AI services via HTTP:**
```
AiServiceClient.java (RestClient + Resilience4j)
    ↓
HTTP calls to localhost:8001-8010
    ↓
FastAPI services return JSON
    ↓
AiController.java wraps in 26 JWT-secured endpoints
    ↓
Frontend calls: GET /api/v1/ai/expertise/profile/RWR001
```

**Example flow:**
- Frontend: `GET /api/v1/ai/expertise/profile/RWR001`
- Backend (AiController): Calls `AiServiceClient.getExpertiseProfile("RWR001")`
- AiServiceClient: HTTP GET to `http://localhost:8001/expertise/profile/RWR001`
- Service 8001: Loads researcher's papers → applies TF-IDF → returns keywords + scores
- Backend: Returns JSON to frontend

## How Models Are "Trained"

**There's NO training.** Data flows like this:

```
1. STARTUP: Load dataset into memory
   ├─ 30 researchers
   ├─ 86 publications (title, abstract, keywords, citations, year)
   └─ 20 funding opportunities

2. ON EACH REQUEST:
   ├─ Service receives: Researcher ID
   ├─ Loads from memory: All researcher's publications
   ├─ Applies algorithm: TF-IDF formula
   ├─ Returns: Ranked keywords with scores
   └─ No database, no ML training, no API calls

3. EXAMPLE - Expertise Mapping (TF-IDF):
   INPUT: Researcher RWR001
   PROCESS:
     - Get RWR001's 4 publications
     - Count term frequencies (agriculture appears 12 times)
     - Calculate IDF (importance in 86-publication corpus)
     - Score = TF × IDF
   OUTPUT:
     {
       "keywords": [
         {"term": "agriculture", "score": 0.45},
         {"term": "food security", "score": 0.42},
         ...
       ]
     }
```

## Services Summary

| Port | Service | Algorithm | What It Does |
|------|---------|-----------|-------------|
| 8001 | Expertise Mapping | TF-IDF | Extract researcher keywords |
| 8002 | Collaboration | Cosine Similarity | Find collaborators |
| 8003 | Trend Analysis | Linear Regression | Research trends |
| 8004 | Funding Alignment | TF-IDF Match | Recommend funding |
| 8005 | Knowledge Processing | Tokenization | NLP pipeline |
| 8006 | Network Analysis | Graph Algorithms | Co-authorship networks |
| 8007 | Department Analytics | Aggregation | Department stats |
| 8008 | Portfolio Analysis | Composition | Research portfolio |
| 8009 | Faculty Intelligence | Aggregation | Faculty profiles |
| 8010 | Pipeline | Batch Processing | Batch NLP |

## Key Points

✅ **NOT ML models** — deterministic algorithms on fixed data  
✅ **No GPU/training** — pure Python math formulas  
✅ **No external APIs** — fully self-contained  
✅ **Fault-tolerant** — circuit breaker prevents crashes  
✅ **Fast** — all data in memory, <200ms response  
✅ **Stateless** — can scale horizontally  

## Dependencies

**Backend:** Spring Boot 4.0.5, JWT, Resilience4j, OpenAPI (auto via Gradle)

**AI Services:** `fastapi==0.111.0`, `uvicorn==0.29.0`, `pydantic==2.7.1` (3 packages, that's it)

## Verify Everything Works

```bash
curl http://localhost:8001/health          # AI service
curl http://localhost:8080/actuator/health # Backend
http://localhost:8080/swagger-ui.html      # API docs
```

---

**TL;DR:** 10 statistical algorithm services. Load Rwanda data in memory. Apply formulas. Return scores. No ML training. No external APIs. Simple, fast, reliable.

# ResearchIQ Backend & AI Services — Setup & Run Guide

---

## Prerequisites (Install First)

### 1. Java 21 LTS
Download and install from [oracle.com](https://www.oracle.com/java/technologies/downloads/#java21)

Verify installation:
```bash
java -version
javac -version
```

### 2. Python 3.8 or Higher
Download from [python.org](https://www.python.org/downloads/)

Verify installation:
```bash
python --version
pip --version
```

### 3. PostgreSQL 14+
Download from [postgresql.org](https://www.postgresql.org/download/)

Verify installation:
```bash
psql --version
```

### 4. Gradle (Optional - comes with project)
Already included in the project via Gradle wrapper.

---

## Step 1: Database Setup

### Create PostgreSQL Database

```bash
# Open PostgreSQL
psql -U postgres

## Step 2: Setup Backend Project

Navigate to project root:
```bash
cd c:\Users\user\Documents\Auca\Inoovation\ResearchIQ\research-iq-backend
```

### Check application.yml Configuration

Open `src/main/resources/application.yml` and verify:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/researchiq
    username: researchiq_user
    password: researchiq_password
  jpa:
    hibernate:
      ddl-auto: validate
```

---

## Step 3: Install Python Dependencies (for AI Services)

Navigate to AI services folder:
```bash
cd Ai_task
```

Install all required Python packages:
```bash
pip install -r shared/requirements.txt
pip install -r researcher/expertise_mapping/requirements.txt
pip install -r researcher/collaboration_recommendation/requirements.txt
pip install -r researcher/trend_analysis/requirements.txt
pip install -r researcher/funding_alignment/requirements.txt
pip install -r researcher/knowledge_processing/requirements.txt
pip install -r researcher/network_analysis/requirements.txt
pip install -r research_manager/department_analytics/requirements.txt
pip install -r research_manager/research_portfolio/requirements.txt
pip install -r department_head/faculty_intelligence/requirements.txt
pip install -r admin/knowledge_pipeline/requirements.txt
```

### Or Install All at Once
```bash
for /d %d in (researcher\*, research_manager\*, department_head\*, admin\*) do (
  for /f "tokens=*" %f in ('dir /s /b "%d\requirements.txt"') do pip install -r "%f"
)
```

### Verify Python Packages
```bash
pip list | findstr fastapi
pip list | findstr uvicorn
pip list | findstr pydantic
```

---

## Step 4: Run AI Services

### Option A: Run All Services at Once (Recommended)

**Windows:**
```bash
cd c:\Users\user\Documents\Auca\Inoovation\ResearchIQ\research-iq-backend\Ai_task
START_ALL_SERVICES.bat
```

**Linux/Mac:**
```bash
cd c:\Users\user\Documents\Auca\Inoovation\ResearchIQ\research-iq-backend\Ai_task
chmod +x start_all_services.sh
./start_all_services.sh
```

### Option B: Run Services Manually (One Per Terminal)

**Terminal 1 — Expertise Mapping (Port 8001):**
```bash
cd c:\Users\user\Documents\Auca\Inoovation\ResearchIQ\research-iq-backend\Ai_task
python -m uvicorn researcher.expertise_mapping.main:app --port 8001
```

**Terminal 2 — Collaboration Recommendation (Port 8002):**
```bash
cd c:\Users\user\Documents\Auca\Inoovation\ResearchIQ\research-iq-backend\Ai_task
python -m uvicorn researcher.collaboration_recommendation.main:app --port 8002
```

**Terminal 3 — Trend Analysis (Port 8003):**
```bash
cd c:\Users\user\Documents\Auca\Inoovation\ResearchIQ\research-iq-backend\Ai_task
python -m uvicorn researcher.trend_analysis.main:app --port 8003
```

**Terminal 4 — Funding Alignment (Port 8004):**
```bash
cd c:\Users\user\Documents\Auca\Inoovation\ResearchIQ\research-iq-backend\Ai_task
python -m uvicorn researcher.funding_alignment.main:app --port 8004
```

**Terminal 5 — Knowledge Processing (Port 8005):**
```bash
cd c:\Users\user\Documents\Auca\Inoovation\ResearchIQ\research-iq-backend\Ai_task
python -m uvicorn researcher.knowledge_processing.main:app --port 8005
```

**Terminal 6 — Network Analysis (Port 8006):**
```bash
cd c:\Users\user\Documents\Auca\Inoovation\ResearchIQ\research-iq-backend\Ai_task
python -m uvicorn researcher.network_analysis.main:app --port 8006
```

**Terminal 7 — Department Analytics (Port 8007):**
```bash
cd c:\Users\user\Documents\Auca\Inoovation\ResearchIQ\research-iq-backend\Ai_task
python -m uvicorn research_manager.department_analytics.main:app --port 8007
```

**Terminal 8 — Research Portfolio (Port 8008):**
```bash
cd c:\Users\user\Documents\Auca\Inoovation\ResearchIQ\research-iq-backend\Ai_task
python -m uvicorn research_manager.research_portfolio.main:app --port 8008
```

**Terminal 9 — Faculty Intelligence (Port 8009):**
```bash
cd c:\Users\user\Documents\Auca\Inoovation\ResearchIQ\research-iq-backend\Ai_task
python -m uvicorn department_head.faculty_intelligence.main:app --port 8009
```

**Terminal 10 — Knowledge Pipeline (Port 8010):**
```bash
cd c:\Users\user\Documents\Auca\Inoovation\ResearchIQ\research-iq-backend\Ai_task
python -m uvicorn admin.knowledge_pipeline.main:app --port 8010
```

### Verify AI Services are Running

Test each service:
```bash
curl http://localhost:8001/health
curl http://localhost:8002/health
curl http://localhost:8003/health
curl http://localhost:8004/health
curl http://localhost:8005/health
curl http://localhost:8006/health
curl http://localhost:8007/health
curl http://localhost:8008/health
curl http://localhost:8009/health
curl http://localhost:8010/health
```

All should return: `{"status":"ok","service":"..."}`

---

## Step 5: Build Backend

Navigate to backend root:
```bash
cd c:\Users\user\Documents\Auca\Inoovation\ResearchIQ\research-iq-backend
```

Clean and compile:
```bash
./gradlew clean build -x test
```

Wait for build to complete. You should see:
```
BUILD SUCCESSFUL
```

---

## Step 6: Run Backend

Start the Spring Boot application:

```bash
./gradlew bootRun
```

Or if already built:
```bash
java -jar build/libs/researchiq-0.0.1-SNAPSHOT.jar
```

Wait for startup message:
```
Started ResearchIQ in X seconds
```

Backend runs on: **http://localhost:8080**

---

## Step 7: Verify Full System

### Check All Services Health

```bash
# Backend health
curl http://localhost:8080/actuator/health

# All AI services health
for port in 8001 8002 8003 8004 8005 8006 8007 8008 8009 8010; do
  echo "Port $port:"
  curl http://localhost:$port/health
done
```

### Access Swagger Documentation

Open browser to: **http://localhost:8080/swagger-ui.html**

All 26 AI endpoints should be listed under "AI Services" tag.

---

## Required Packages Summary

### Backend Dependencies (Automatic via Gradle)
```
Spring Boot 4.0.5
Spring Security
Spring Data JPA
Spring Web
Spring Mail
PostgreSQL Driver
Flyway (Database Migration)
JWT (jjwt)
Resilience4j (Circuit Breaker)
OpenAPI/Swagger
Lombok
Micrometer (Metrics)
```

### AI Services Dependencies (Install via pip)
```
fastapi==0.111.0
uvicorn==0.29.0
pydantic==2.7.1
`
```

### Terminal 2(AI Services)
```bash
cd c:\Users\user\Documents\Auca\Inoovation\ResearchIQ\research-iq-backend\Ai_task
START_ALL_SERVICES.bat
```

Wait 30 seconds for all services to start. You'll see:
```
[Port 8001] Uvicorn running on http://0.0.0.0:8001
[Port 8002] Uvicorn running on http://0.0.0.0:8002
... (all 10 services)
```

### Terminal  (Backend)
```bash
cd c:\Users\user\Documents\Auca\Inoovation\ResearchIQ\research-iq-backend
./gradlew bootRun
```

Wait 10-15 seconds for backend to start. You'll see:
```
Started ResearchIQ in X seconds
```

---

## Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Backend API | http://localhost:8080 | Main application |
| Swagger UI | http://localhost:8080/swagger-ui.html | API documentation |
| Expertise Mapping | http://localhost:8001/docs | Expertise extraction |
| Collaboration | http://localhost:8002/docs | Collaborator matching |
| Trend Analysis | http://localhost:8003/docs | Research trends |
| Funding Alignment | http://localhost:8004/docs | Funding matching |
| Knowledge Processing | http://localhost:8005/docs | NLP pipeline |
| Network Analysis | http://localhost:8006/docs | Network metrics |
| Department Analytics | http://localhost:8007/docs | Department stats |
| Research Portfolio | http://localhost:8008/docs | Portfolio analysis |
| Faculty Intelligence | http://localhost:8009/docs | Faculty insights |
| Knowledge Pipeline | http://localhost:8010/docs | Batch processing |
| PostgreSQL | localhost:5432 | Database |

---

## Troubleshooting

### AI Service Won't Start
```bash
# Check if port is in use
netstat -ano | findstr :8001

# Kill process using port
taskkill /PID <PID> /F

# Retry service
python -m uvicorn researcher.expertise_mapping.main:app --port 8001
```

### Backend Won't Start
```bash
# Check database connection
psql -U researchiq_user -d researchiq -h localhost

# Check Java version
java -version  # Should be 21+

# Clean build and retry
./gradlew clean build -x test
./gradlew bootRun
```

### Python Module Not Found
```bash
# Ensure you're in Ai_task directory
cd c:\Users\user\Documents\Auca\Inoovation\ResearchIQ\research-iq-backend\Ai_task

# Reinstall dependencies
pip install fastapi uvicorn pydantic

# Test import
python -c "import researcher.expertise_mapping.main"
```

### Port Already in Use
```bash
# Find what's using the port (example for 8001)
netstat -ano | findstr :8001

# Kill the process
taskkill /PID <PID_NUMBER> /F

# Or change port in startup script
python -m uvicorn researcher.expertise_mapping.main:app --port 9001
```

---

## Environment Variables (Optional)

Create `.env` file in project root:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=
DB_USER=
DB_PASSWORD=

# JWT
JWT_SECRET=your_secret_key_here

# AI Services URLs (for backend to call)
AI_EXPERTISE_URL=http://localhost:8001
AI_COLLABORATION_URL=http://localhost:8002
AI_TRENDS_URL=http://localhost:8003
AI_FUNDING_URL=http://localhost:8004
AI_KNOWLEDGE_URL=http://localhost:8005
AI_NETWORK_URL=http://localhost:8006
AI_ANALYTICS_URL=http://localhost:8007
AI_PORTFOLIO_URL=http://localhost:8008
AI_FACULTY_URL=http://localhost:8009
AI_PIPELINE_URL=http://localhost:8010
```

---

## Quick Reference

### Start Everything (Windows)
```bash
# Terminal 1: AI Services
cd Ai_task && START_ALL_SERVICES.bat

# Terminal 2: Backend
./gradlew bootRun
```

### Start Everything (Linux/Mac)
```bash
# Terminal 1: AI Services
cd Ai_task && chmod +x start_all_services.sh && ./start_all_services.sh

# Terminal 2: Backend
./gradlew bootRun
```

### Stop Everything
```bash
# Kill all AI services
pkill -f "python -m uvicorn"


## Next Steps

Once everything is running:

1. Open http://localhost:8080/swagger-ui.html
2. Register a new user via `/api/v1/auth/register`
3. Login via `/api/v1/auth/login`
4. Test AI endpoints under "AI Services" tag
5. Connect frontend and start using the system



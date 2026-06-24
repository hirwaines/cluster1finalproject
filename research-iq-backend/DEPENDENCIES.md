# ResearchIQ — Complete Dependencies List

---

## System Requirements



## Required Software (Install First)

### 1. Java Development Kit (JDK) 21 LTS

**Download:**
- Windows: https://www.oracle.com/java/technologies/downloads/#java21-windows
- macOS: https://www.oracle.com/java/technologies/downloads/#java21-mac
- Linux: https://www.oracle.com/java/technologies/downloads/#java21-linux

**Verify Installation:**
```bash
java -version
javac -version
```

**Expected Output:**
```
java version "21.0.2" 2024-01-16 LTS
Java(TM) SE Runtime Environment (build 21.0.2+13-LTS-58)
```

---

### 1. Python 3.8 or Higher

**Download:**
https://www.python.org/downloads/

**Install Commands:**
```bash
# Windows: Use installer
# macOS: brew install python3
# Linux: apt-get install python3
```

**Verify Installation:**
```bash
python --version
pip --version
```

**Expected Output:**
```
Python 3.9.0
pip 21.0.1
```

---

### 3. PostgreSQL 14 or Higher

**Download:**
https://www.postgresql.org/download/

**Install:**
- Windows: Download installer from postgresql.org
- macOS: `brew install postgresql`
- Linux: `apt-get install postgresql-14`

**Verify Installation:**
```bash
psql --version
```

**Expected Output:**
```
psql (PostgreSQL) 14.0
```

---

### 4. Git (Optional but Recommended)

**Download:**
https://git-scm.com/downloads

**Verify:**
```bash
git --version
```

---

## Backend (Spring Boot) Dependencies

### Automatically Managed by Gradle

The project uses **Gradle 8.0+** (comes with the project).

**Key Dependencies** (defined in `build.gradle`):

```gradle
// Spring Boot & Framework
implementation 'org.springframework.boot:spring-boot-starter-web:4.0.5'
implementation 'org.springframework.boot:spring-boot-starter-security:4.0.5'
implementation 'org.springframework.boot:spring-boot-starter-data-jpa:4.0.5'
implementation 'org.springframework.boot:spring-boot-starter-mail:4.0.5'
implementation 'org.springframework.boot:spring-boot-starter-cache:4.0.5'
implementation 'org.springframework.boot:spring-boot-starter-actuator:4.0.5'

// Database
runtimeOnly 'org.postgresql:postgresql:42.6.0'
implementation 'org.flywaydb:flyway-core:9.22.0'
implementation 'org.flywaydb:flyway-database-postgresql:9.22.0'

// JWT Authentication
implementation 'io.jsonwebtoken:jjwt-api:0.11.5'
runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.11.5'
runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.11.5'

// Circuit Breaker & Resilience
implementation 'org.springframework.cloud:spring-cloud-starter-circuitbreaker-resilience4j:2025.1.1'
implementation 'org.springframework.cloud:spring-cloud-starter-openfeign:4.0.6'

// API Documentation
implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:3.0.3'

// Monitoring
runtimeOnly 'io.micrometer:micrometer-registry-prometheus'

// Utilities
compileOnly 'org.projectlombok:lombok'
annotationProcessor 'org.projectlombok:lombok'
```

### Installation

No manual installation needed. Gradle automatically downloads when you run:
```bash
./gradlew clean build
```

### Verify Dependencies

List all resolved dependencies:
```bash
./gradlew dependencies
```

---

## AI Services (Python FastAPI) Dependencies

### Core Packages

Install via pip:

```bash
pip install fastapi==0.111.0
pip install uvicorn==0.29.0
pip install pydantic==2.7.1
```

### Installation Script

**All at Once:**
```bash
pip install fastapi==0.111.0 uvicorn==0.29.0 pydantic==2.7.1
```

**From requirements.txt** 
```bash
cd Ai_task
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

### Verify Installation

```bash
python -c "import fastapi; print(fastapi.__version__)"
python -c "import uvicorn; print(uvicorn.__version__)"
python -c "import pydantic; print(pydantic.__version__)"
```

### No Additional ML Dependencies

**What's NOT needed:**
- ✗ scikit-learn
- ✗ tensorflow
- ✗ pytorch
- ✗ transformers
- ✗ openai SDK
- ✗ anthropic SDK
- ✗ numpy (optional for matrix math)
- ✗ pandas (optional for data manipulation)

All algorithms are pure Python with standard library only.

---

## Database Dependencies

### PostgreSQL Setup


## Frontend Dependencies (React)

**Not included in this backend documentation**, but for reference:

```bash
npm install
# Installs: React, TypeScript, Vite, Tailwind, Shadcn/UI, Recharts, etc.
```

---

## Optional Tools

### Build Tools

**Gradle** (already included):
```bash
./gradlew --version
```

**Maven** (alternative to Gradle - NOT needed):
```bash
# Skip if using Gradle
```

### Development Tools

**IDE/Editor** (optional):
- IntelliJ IDEA Community Edition
- VS Code with extensions
- Eclipse IDE

**API Testing Tools** (optional):
- Postman

### Monitoring Tools (Optional)

```bash
# Prometheus (metrics)
# Grafana (visualization)
# ELK Stack (logging)
# Jaeger (tracing)
```

---

## Port Requirements

Ensure these ports are available:

| Port | Service | Required? |
|------|---------|-----------|
| 5432 | PostgreSQL | ✓ Required |
| 8001 | Expertise Mapping | ✓ Required |
| 8002 | Collaboration | ✓ Required |
| 8003 | Trend Analysis | ✓ Required |
| 8004 | Funding Alignment | ✓ Required |
| 8005 | Knowledge Processing | ✓ Required |
| 8006 | Network Analysis | ✓ Required |
| 8007 | Department Analytics | ✓ Required |
| 8008 | Research Portfolio | ✓ Required |
| 8009 | Faculty Intelligence | ✓ Required |
| 8010 | Knowledge Pipeline | ✓ Required |
| 8080 | Spring Boot Backend | ✓ Required |

Check port availability:
```bash
# Windows
netstat -ano | findstr :8080

# Linux/Mac
lsof -i :8080
```

---

## Environment Variables (Optional)

Create `.env` file in project root:

```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/researchiq
SPRING_DATASOURCE_USERNAME=researchiq_user
SPRING_DATASOURCE_PASSWORD=researchiq_password

# JWT
JWT_SECRET=your_secret_key_min_32_chars_recommended

# AI Services (optional if not localhost)
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

## Installation Checklist

### One-Time Setup

- [ ] Java 21 LTS installed and verified
- [ ] Python 3.8+ installed and verified
- [ ] PostgreSQL 14+ installed and verified
- [ ] PostgreSQL database `researchiq` created
- [ ] PostgreSQL user `researchiq_user` created
- [ ] Python packages installed (`fastapi`, `uvicorn`, `pydantic`)
- [ ] Gradle dependencies ready (automatic on first build)

### Before Each Run

- [ ] PostgreSQL running
- [ ] Port 5432 accessible
- [ ] Ports 8001-8010, 8080 available
- [ ] Environment variables set (if using .env)

---

## Version Compatibility Matrix

| Component | Version | Status |
|-----------|---------|--------|
| Java | 21 LTS | ✓ Required |
| Spring Boot | 4.0.5 | ✓ Required |
| Python | 3.8+ | ✓ Required |
| FastAPI | 0.111.0 | ✓ Required |
| Uvicorn | 0.29.0 | ✓ Required |
| Pydantic | 2.7.1 | ✓ Required |
| PostgreSQL | 14+ | ✓ Required |
| Gradle | 8.0+ | ✓ Included |


### During Runtime

- **None required** (all services run locally)
- Optional: Internet if connecting to external ORCID API (future feature)

## Troubleshooting Installation

### Java Not Found
```bash
# Add to PATH or verify installation
java -version
```

### Python Module Not Found
```bash
pip list | grep fastapi
pip install --upgrade fastapi uvicorn pydantic
```

### PostgreSQL Connection Refused
```bash
psql -U postgres -h localhost
# Then verify researchiq_user and database exist
```

### Port Already in Use
```bash
# Find and kill process using port
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

---

## Summary

### To Run Everything You Need:

**System Level:**
- Java 21 LTS
- Python 3.8+
- PostgreSQL 14+
- ~4GB RAM
- ~2GB Disk

**Backend (Auto):**
- Gradle (auto-downloads all)
- Spring Boot 4.0.5
- PostgreSQL JDBC Driver
- JWT, Flyway, Resilience4j, OpenAPI

**AI Services:**
- fastapi==0.111.0
- uvicorn==0.29.0
- pydantic==2.7.1



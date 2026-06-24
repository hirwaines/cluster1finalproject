# ResearchIQ — Rwanda Research Intelligence Platform

A full-stack platform connecting researchers, funders, department heads, and administrators across Rwandan universities. It includes a React frontend, a Spring Boot REST API, and 10 Python AI microservices.

---

## Project Structure

```
cluste1finalproject/
├── Interactive UI Implementation/   # React + Vite frontend
├── research-iq-backend/             # Spring Boot Java backend
│   ├── src/                         # Java source code
│   ├── Ai_task/                     # Python AI microservices
│   │   ├── researcher/              # 6 researcher AI services
│   │   ├── research_manager/        # 2 manager AI services
│   │   ├── department_head/         # 1 dept head AI service
│   │   └── admin/                   # 1 admin AI service
│   └── build.gradle
└── README.md
```

---

## Prerequisites

Make sure you have the following installed before running anything:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ (comes with Node) | — |
| Java JDK | 21 | https://adoptium.net |
| PostgreSQL | 14+ | https://www.postgresql.org/download |
| Python | 3.10+ | https://www.python.org/downloads |
| pip | latest | comes with Python |

---

## 1. Frontend — React + Vite

### Install dependencies

```bash
cd "Interactive UI Implementation"
npm install
```

### Run in development mode

```bash
npm run dev
```

The app opens at **http://localhost:5173**

### Build for production

```bash
npm run build
```

Output goes to `Interactive UI Implementation/dist/`.

---

## 2. Backend — Spring Boot (Java 21 + Gradle)

### Set up the database

1. Open **pgAdmin** or your PostgreSQL client and create a database:

```sql
CREATE DATABASE researchiq;
```

2. Create a `.env` file inside `research-iq-backend/`:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/researchiq
SPRING_DATASOURCE_USERNAME=your_postgres_username
SPRING_DATASOURCE_PASSWORD=your_postgres_password

JWT_SECRET=MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=

BOOTSTRAP_ADMIN_EMAIL=admin@researchiq.rw
BOOTSTRAP_ADMIN_PASSWORD=Admin@1234
BOOTSTRAP_ADMIN_NAME=System Admin
```

> Replace `your_postgres_username` and `your_postgres_password` with your actual PostgreSQL credentials.

### Run the backend

**On Windows:**

```bat
cd research-iq-backend
gradlew.bat bootRun
```

**On Mac/Linux:**

```bash
cd research-iq-backend
./gradlew bootRun
```

The API starts at **http://localhost:8080**

API documentation (Swagger UI): **http://localhost:8080/swagger-ui.html**

### Run tests

```bat
gradlew.bat test
```

---

## 3. AI Microservices — Python FastAPI

The platform has **10 AI services**, each running on its own port.

### Install Python dependencies

Run this once from inside the `Ai_task` folder:

```bash
cd research-iq-backend/Ai_task
pip install fastapi uvicorn pydantic
```

### Start all 10 services at once

**On Windows** (opens each service in its own terminal window):

```bat
cd research-iq-backend/Ai_task
START_ALL_SERVICES.bat
```

**On Mac/Linux:**

```bash
cd research-iq-backend/Ai_task
chmod +x start_all_services.sh
./start_all_services.sh
```

### Or start services individually

```bash
cd research-iq-backend/Ai_task

# Researcher services
python -m uvicorn researcher.expertise_mapping.main:app --port 8001
python -m uvicorn researcher.collaboration_recommendation.main:app --port 8002
python -m uvicorn researcher.trend_analysis.main:app --port 8003
python -m uvicorn researcher.funding_alignment.main:app --port 8004
python -m uvicorn researcher.knowledge_processing.main:app --port 8005
python -m uvicorn researcher.network_analysis.main:app --port 8006

# Research Manager services
python -m uvicorn research_manager.department_analytics.main:app --port 8007
python -m uvicorn research_manager.research_portfolio.main:app --port 8008

# Department Head service
python -m uvicorn department_head.faculty_intelligence.main:app --port 8009

# Admin service
python -m uvicorn admin.knowledge_pipeline.main:app --port 8010
```

### AI Service Ports

| Port | Service |
|------|---------|
| 8001 | Expertise Mapping |
| 8002 | Collaboration Recommendation |
| 8003 | Research Trend Analysis |
| 8004 | Funding Alignment |
| 8005 | Knowledge Processing |
| 8006 | Network Analysis |
| 8007 | Department Analytics |
| 8008 | Research Portfolio |
| 8009 | Faculty Intelligence |
| 8010 | Knowledge Pipeline |

---

## Running Everything Together

Open **4 terminal windows** and run one command in each:

| Terminal | Command |
|----------|---------|
| 1 — Frontend | `cd "Interactive UI Implementation" && npm run dev` |
| 2 — Backend | `cd research-iq-backend && gradlew.bat bootRun` |
| 3 — AI Services | `cd research-iq-backend/Ai_task && START_ALL_SERVICES.bat` |
| 4 — (optional) DB | Start PostgreSQL if it's not running as a service |

Once all are running, open **http://localhost:5173** in your browser.

---

## Default Login Accounts

After the backend starts, use these credentials to log in:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@researchiq.rw | Admin@1234 |
| Researcher | sarah.chen@auca.edu | (set via sign-up) |
| Funder | (sign up as Funder) | — |

---

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite 6
- Tailwind CSS 4
- shadcn/ui + Radix UI
- Recharts (data visualizations)
- React Router 7

**Backend**
- Spring Boot 4 (Java 21)
- Spring Security + JWT
- Spring Data JPA + Flyway
- PostgreSQL
- Gradle

**AI Services**
- Python 3.10+
- FastAPI
- Uvicorn

---

## Contributors

- hirwaines
- Jess-xca
- ritha-25
- MILINDI7
- angebhd

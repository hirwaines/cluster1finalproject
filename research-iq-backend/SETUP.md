# ResearchIQ - Setup & Installation Guide

## Prerequisites

- Java 21 or higher
- PostgreSQL 14 or higher
- Python 3.9+
- Gradle 8.0+

## Database Setup

Create PostgreSQL database and user:

```sql
CREATE DATABASE researchiq;
CREATE USER researchiq_user WITH PASSWORD 'researchiq_password';
GRANT ALL PRIVILEGES ON DATABASE researchiq TO researchiq_user;
```

## Backend Installation

### Windows

1. Navigate to project directory:
```powershell
cd c:\Users\user\Documents\Auca\Inoovation\ResearchIQ\research-iq-backend
```

2. Start AI services (separate terminal):
```powershell
cd Ai_task
START_ALL_SERVICES.bat
```

3. Start backend (wait 30 seconds for AI services):
```powershell
.\gradlew.bat bootRun
```

4. Verify setup:
```powershell
curl http://localhost:8080/actuator/health
```

Expected response: `{"status":"UP"}`

### Linux/Mac

1. Navigate to project directory:
```bash
cd ~/path/to/research-iq-backend
```

2. Start AI services:
```bash
cd Ai_task
chmod +x start_all_services.sh
./start_all_services.sh
```

3. Start backend:
```bash
./gradlew bootRun
```

## Accessing the Application

Once backend is running:

**Swagger UI:** http://localhost:8080/swagger-ui.html

All endpoints listed with documentation.

## Default Login

Admin account (for testing):
- Email: admin@university.edu
- Password: AdminPass123!

## Project Structure

```
research-iq-backend/
├── src/main/java/com/umojatech/researchiq/     (Backend code)
├── src/main/resources/                          (Configuration)
├── db/migration/                                (Database migrations)
├── Ai_task/                                     (AI services)
├── build.gradle                                 (Dependencies)
└── SETUP.md                                     (This file)
```

## Troubleshooting

### Port 8080 already in use (Windows)
```powershell
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### PostgreSQL connection error
Verify PostgreSQL is running and database exists:
```powershell
psql -U researchiq_user -d researchiq -h localhost
```

### Flyway migration fails
Recreate database:
```powershell
psql -U postgres
DROP DATABASE researchiq;
CREATE DATABASE researchiq;
CREATE USER researchiq_user WITH PASSWORD 'researchiq_password';
GRANT ALL PRIVILEGES ON DATABASE researchiq TO researchiq_user;
\q
```

## Key Endpoints

- Authentication: POST /api/v1/auth/register, /api/v1/auth/login
- User Profile: GET /api/v1/users/me
- Research: POST /api/v1/research/submit, GET /api/v1/research/feed
- Collaborations: POST /api/v1/collaborations/request
- AI Services: GET /api/v1/ai/expertise/profile/{id}, etc.

See Swagger UI for complete endpoint documentation.

## Support

For issues or questions, check the configuration in application-dev.yml and ensure PostgreSQL database is accessible.

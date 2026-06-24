# ResearchIQ - Required Packages & Dependencies

## System Requirements

- Java 21 JDK
- PostgreSQL 14+
- Python 3.9+
- Gradle 8.0+
- Git

## Backend Dependencies (Spring Boot 4.0.5)

Located in: `build.gradle`

Key dependencies:
- spring-boot-starter-web (REST API)
- spring-boot-starter-data-jpa (Database ORM)
- spring-boot-starter-security (JWT authentication)
- spring-boot-starter-validation (Data validation)
- postgresql (PostgreSQL driver)
- flyway (Database migrations)
- lombok (Code generation)
- springdoc-openapi (Swagger/OpenAPI documentation)
- resilience4j (Circuit breaker)

### Run Backend

```powershell
# Windows
.\gradlew.bat bootRun

# Linux/Mac
./gradlew bootRun
```

## AI Services Dependencies (Python FastAPI)

Located in: `Ai_task/requirements.txt`

Core packages:
- fastapi (Web framework)
- uvicorn (ASGI server)
- numpy (Numerical computing)
- pandas (Data manipulation)
- scikit-learn (Machine learning algorithms)
- nltk (Natural language processing)
- networkx (Graph algorithms)
- requests (HTTP client)

### Run AI Services

**Windows:**
```powershell
cd Ai_task
START_ALL_SERVICES.bat
```

**Linux/Mac:**
```bash
cd Ai_task
chmod +x start_all_services.sh
./start_all_services.sh
```

## Database

PostgreSQL 14+

Tables created automatically via Flyway migrations on first backend startup.

## Installation Steps

1. Install Java 21
2. Install PostgreSQL 14+
3. Install Python 3.9+
4. Create PostgreSQL database and user
5. Clone/extract project
6. Start AI services from Ai_task folder
7. Start backend with gradlew

## Verification

Check backend is running:
```
http://localhost:8080/actuator/health
```

Check AI services running:
```
http://localhost:8001/health
http://localhost:8002/health
(... through 8010)
```

Check API documentation:
```
http://localhost:8080/swagger-ui.html
```

## Ports Used

- Backend: 8080
- AI Services: 8001-8010 (10 services)
- PostgreSQL: 5432

Ensure these ports are available before starting.

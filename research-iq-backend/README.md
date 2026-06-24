# ResearchIQ Backend

The core backend service for ResearchIQ, a multi-role research collaboration platform connecting
researchers, funders, and institutional staff. It exposes a versioned REST API consumed by the web
frontend and integrates with a separate AI service for enrichment and recommendations.

This service covers the non-AI domain: authentication and accounts, user profiles, collaboration and
messaging, research publications, funding workflows, administration, and security management.

## Technology stack

| Concern | Technology |
|---|---|
| Language / runtime | Java 21 |
| Framework | Spring Boot 4.0.5 (Web, Security, Data JPA, Validation, Mail, Actuator, Cache) |
| Build | Gradle (wrapper included) |
| Database | PostgreSQL |
| Migrations | Flyway |
| Authentication | Stateless JWT (jjwt) |
| API documentation | SpringDoc OpenAPI (Swagger UI) |
| Resilience / integration | Spring Cloud OpenFeign, Resilience4j (for the AI service client) |
| Observability | Micrometer + Prometheus registry |
| Code generation | Lombok |

## Architecture

- Layered structure: `controller` (REST) to `service` (business logic) to `repository` (Spring Data JPA)
  over JPA `entity` types with UUID primary keys.
- Stateless authentication: a `JwtAuthFilter` validates bearer tokens on each request; no server session.
- Role-based access control via `ROLE_`-prefixed authorities; admin endpoints are gated at the filter chain.
- Schema is owned by Flyway migrations; Hibernate runs with `ddl-auto: validate`, so the entity model is
  verified against the migrated schema at startup.
- The AI service is a separate deployable; the backend calls it through a Feign client wrapped in a
  Resilience4j circuit breaker, and falls back to non-AI logic when it is unavailable. See `../ai/ai-service-spec.md`.

## API modules

All endpoints are served under the base path `/api/v1`.

| Area | Base path | Summary |
|---|---|---|
| Authentication | `/auth` | Signup (researcher, funder, basic), login with admin MFA, email verification, password reset |
| Users | `/users` | Current-user profile read/update, public profile lookup |
| Collaboration | `/collaboration` | Collaborator discovery, requests (incoming/sent), status updates |
| Research | `/research` | Submit for review, feed/discover, analytics, trends, expertise map |
| Funding | `/funding` | Seeking-funding projects, funder interests, RFPs, researcher applications |
| Chat | `/chat` | One-to-one messaging, conversations, unread counts |
| Notifications | `/notifications` | List, unread count, mark read |
| Admin | `/admin` | User approvals, directory, publication approvals, staff provisioning |
| Security management | `/admin/security` | Audit logs, sessions, role permissions, security settings |

The authoritative contract is documented in `backend-spec.md`.

## Prerequisites

- Java Development Kit 21
- PostgreSQL 14 or newer
- Docker (optional, for containerized runs)

## Configuration

Configuration is environment-driven. Local values can be placed in a `.env` file at the project root
(`spring.config.import` loads it automatically); see `.env.example` for the full list.

| Variable | Description | Default (dev) |
|---|---|---|
| `DB_URL` | JDBC URL for PostgreSQL | `jdbc:postgresql://localhost:5432/researchiq_dev` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `password` |
| `JWT_SECRET` | Base64-encoded HS256 key (must decode to >= 32 bytes) | development key |
| `JWT_EXPIRATION_MS` | Access token lifetime in milliseconds | `3600000` (1 hour) |
| `JWT_REFRESH_EXPIRATION_MS` | Refresh token lifetime in milliseconds | `86400000` (24 hours) |
| `BOOTSTRAP_ADMIN_EMAIL` | Email for the bootstrap admin account (optional) | empty |
| `BOOTSTRAP_ADMIN_PASSWORD` | Password for the bootstrap admin account (optional) | empty |
| `BOOTSTRAP_ADMIN_NAME` | Display name for the bootstrap admin | `System Admin` |

### Profiles

| Profile | Purpose | Database | Schema management |
|---|---|---|---|
| `dev` (default) | Local development | PostgreSQL | Flyway migrate, Hibernate validate |
| `test` | Automated tests | H2 (in-memory) | Hibernate `create-drop`, Flyway disabled |
| `prod` | Production | PostgreSQL | Flyway migrate, Hibernate validate |

Select a profile with `SPRING_PROFILES_ACTIVE` or `--spring.profiles.active=<profile>`.

## Getting started

1. Create the database:

   ```bash
   createdb researchiq_dev
   ```

2. Provide configuration (copy and edit the example):

   ```bash
   cp .env.example .env
   ```

3. Run the application (Flyway applies migrations on startup):

   ```bash
   ./gradlew bootRun
   ```

The service starts on `http://localhost:8080`.

If `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` are set, an admin account is provisioned on
startup if it does not already exist.

## Running with Docker

A multi-stage `Dockerfile` is provided (build with Gradle, run on a JRE base image).

```bash
docker build -t researchiq-backend .
docker run --rm -p 8080:8080 --env-file .env researchiq-backend
```

The container expects a reachable PostgreSQL instance via `DB_URL`.

## Database and migrations

Schema changes are versioned SQL migrations under `src/main/resources/db/migration`:

| Version | Description |
|---|---|
| V1 | Users table |
| V2 | Collaboration support (requests) |
| V3 | Extended user profile fields |
| V4 | Collaboration request updates (funding type, nullable fields) |
| V5 | Research and pending publications |
| V6 | Chat messages and notifications |
| V7 | Funding entities (interests, RFPs) |
| V8 | Security management (audit logs, sessions, permissions, settings) |
| V9 | Additional profile and research fields |

Because Hibernate runs in `validate` mode, every entity must map to the migrated schema; add a new
migration rather than relying on automatic DDL.

## API documentation

With the application running:

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI document: `http://localhost:8080/v3/api-docs`

Authenticated endpoints use the `bearerAuth` scheme; paste a JWT obtained from `/api/v1/auth/login`
into the Authorize dialog.

## Authentication and authorization

- Login returns a JWT; clients send it as `Authorization: Bearer <token>`.
- Roles: `RESEARCHER`, `FUNDER`, `MANAGER`, `DEPARTMENT_HEAD`, `ADMIN`.
- Account status lifecycle: `PENDING` to `ACTIVE` to `DISABLED`. Login is blocked for `DISABLED`
  accounts and for non-admin `PENDING` accounts awaiting approval.
- Admin login requires a second-step MFA code.
- Public endpoints: `/api/v1/auth/**`, Swagger, and OpenAPI. Admin endpoints require the `ADMIN` role.
  All other endpoints require authentication.

## Project structure

```
src/main/java/com/umojatech/researchiq/
  config/        Application configuration and bootstrap
  controller/    REST controllers
  dto/           Request and response payloads
  entity/        JPA entities and enums
  exception/     Exception types and global handlers
  repository/    Spring Data JPA repositories
  security/      JWT, user details, security configuration
  service/       Business logic
  util/          Shared helpers
src/main/resources/
  application*.yml          Profile configuration
  db/migration/             Flyway migrations
src/test/                   Tests
```

## Testing

```bash
./gradlew test
```

Tests run against an in-memory H2 database (the `test` profile), so no external services are required.
The suite includes an application context load test that validates bean wiring and the entity model.

## Build

```bash
./gradlew bootJar
```

The runnable artifact is produced under `build/libs/`.

## Related

- `backend-spec.md` - API and domain contract for this service.
- `../ai/ai-service-spec.md` - specification for the standalone AI service.
- Frontend application - separate repository.

## License

Proprietary. See the OpenAPI metadata for contact and licensing details.

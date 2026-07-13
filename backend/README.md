# Waypoint Employer Portal Backend

Spring Boot backend for the employer portal.

## Stack

- Java 21
- Spring Boot 3
- Spring Web
- Spring Security
- JWT bearer auth
- MongoDB Atlas via Spring Data MongoDB
- Actuator health/metrics for monitoring
- Splunk-ready structured console logs

## Environment

Create runtime environment variables from `.env.example`:

```text
SERVER_PORT=8080
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/waypoint_portal?retryWrites=true&w=majority
JWT_SECRET=replace-with-at-least-32-random-characters
JWT_EXPIRATION_MINUTES=480
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## Run

This machine currently does not have `java` or `mvn` on PATH. After installing JDK 21 and Maven:

```bash
mvn spring-boot:run
```

## API

Public:

```text
GET  /api/health
POST /api/auth/employer/register
POST /api/auth/employer/login
```

Authenticated with `Authorization: Bearer <JWT>`:

```text
GET  /api/employer/jobs
POST /api/employer/jobs
GET  /api/employer/events
```

## Monitoring

Actuator endpoints:

```text
GET /actuator/health
GET /actuator/metrics
```

Console logs include `level`, `service`, `trace`, and `message` fields for Splunk ingestion.

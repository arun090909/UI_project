# Waypoint Employer Portal

Waypoint Employer Portal is a full-stack employer-facing hiring portal built for managing job postings and recruiting events. The application includes a Next.js/React frontend, a Java Spring Boot backend, MongoDB Atlas persistence, JWT authentication, Google weather integration for event planning, Postman API testing support, and Splunk-ready monitoring/logging.

## Project Scope

This project currently focuses on the employer workflow:

- Job Posting dashboard
- Event Scheduling dashboard
- In-page Home placeholder that displays a 404-style state because Home is owned by another team
- Employer profile menu dropdown UI
- Notification icon UI
- Local development workflow for frontend/backend integration

The frontend is designed to be production-ready and API-ready while still supporting local placeholder storage for development when the backend is unavailable.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js, React, TypeScript, CSS |
| Backend | Java 21, Spring Boot 3, Spring Web, Spring Security |
| Database | MongoDB Atlas with Spring Data MongoDB |
| Authentication | JWT bearer token authentication |
| Weather | Google Maps Geocoding, Google Weather, Google Air Quality APIs |
| API Testing | Postman collection |
| Monitoring | Spring Actuator, structured console logs for Splunk ingestion |
| Version Control | Git and GitHub |

## Repository Structure

```text
waypoint-employer-portal/
  backend/                  Java Spring Boot API
    src/main/java/           Controllers, services, security, domain models
    src/main/resources/      Spring configuration
    .env.example             Backend environment variable template
    pom.xml                  Maven dependencies and build configuration
    README.md                Backend-specific notes

  frontend/                 Next.js employer portal UI
    app/                     Next.js App Router pages, components, and API routes
      api/google-weather/    Server route for Google weather lookup
      components/            Shared UI components
      employer/jobs/         Employer Job Posting page
      employer/events/       Event Scheduling page
      employer/home/         In-page 404 placeholder
      lib/                   API helpers, local storage hook, weather scoring
    public/                  Static assets
    .env.example             Frontend environment variable template
    package.json             Frontend scripts and dependencies

  postman/                  API integration collection
  README.md                 Main project documentation
```

## Frontend Features

### Employer Navigation

The employer portal header includes:

- Waypoint brand
- Home menu item
- Job Posting menu item
- Event Scheduling menu item
- Notification icon
- Profile icon with dropdown items: Profile, Settings, Logout

The Home route intentionally renders an in-page not-found panel because the Home module is expected to be merged from another team.

### Job Posting Dashboard

The Job Posting page supports:

- Creating a new job posting
- Editing existing published job postings
- Displaying only jobs created by the user during local development
- Removing seeded/static job content from the dashboard
- Mandatory resume requirement for every job posting
- Required field validation through form controls
- Job ID field
- Work Type field with Hybrid, Onsite, and Fully Remote options
- Local persistence through browser localStorage for development
- Backend sync through `/api/employer/jobs` when a valid JWT/backend is available

Job posting fields include:

- Job ID
- Job title
- Work type
- Location
- Employment type
- Experience level
- Salary min
- Salary max
- Required skills
- Description
- Application deadline
- Resume required flag

### Time Posted Filter

The Job Posting dashboard includes a Time Posted filter with:

- Last 24 hours
- Last 3 days
- Last 7 days
- Last 14 days
- Last 30 days
- All Jobs

Behavior:

- The frontend updates the visible job list immediately without refreshing the page.
- New jobs save an exact ISO `createdAt` timestamp at publish time.
- Editing a job preserves the original posted timestamp.
- Existing localStorage jobs without timestamps are migrated once and saved with a stable timestamp.
- Job cards and details show compact relative time, for example `just now`, `10 min ago`, `1 hr ago`, or `3 days ago`.
- Exact timestamp is kept internally/database-side for filtering accuracy but is not displayed in the UI.

Backend support:

```text
GET /api/employer/jobs?timePostedDays=1
GET /api/employer/jobs?timePostedDays=3
GET /api/employer/jobs?timePostedDays=7
GET /api/employer/jobs?timePostedDays=14
GET /api/employer/jobs?timePostedDays=30
GET /api/employer/jobs
```

The backend filters by MongoDB `createdAt` and includes a compound index on `employerId + createdAt` for better query performance.

### Event Scheduling Dashboard

The Event Scheduling page supports:

- Scheduling new events
- Editing existing events
- Displaying only events created by the user during local development
- Removing seeded/static event content
- Event mode field with In person and Virtual options
- Events List showing upcoming events
- View All modal showing both upcoming and ended events
- Event attendee registration inside event details
- Registered attendee count calculated from actual registered attendees, not manual input
- Required field validation with visible form errors

Event fields include:

- Event title
- Event type
- Event mode
- Location
- Capacity
- Duration hours
- Start date
- End date
- Description

### Event Weather Recommendation System

The event scheduling system includes weather assessment logic for event hosting decisions.

Weather factors evaluated:

- Temperature
- Rain probability and expected rainfall
- Wind speed and gusts
- Thunderstorm/lightning risk
- Snow and ice conditions
- Humidity
- Air Quality Index
- UV Index
- Visibility
- Weather alerts/warnings

Recommendation outputs:

- Event suitability score from 0 to 100
- Event status:
  - Safe to Host
  - Host with Precautions
  - Move Indoors/Postpone
  - Cancel
- Reasoning behind the recommendation
- Precautions such as hydration, tents, umbrellas, indoor backup venue, heaters, cooling fans, and travel warnings

Google weather data is fetched through the frontend server route:

```text
POST /api/google-weather
```

This route uses the Google Maps API key from `GOOGLE_MAPS_API_KEY` and returns normalized weather inputs for the frontend scoring engine.

## Backend Features

The Spring Boot backend provides:

- Employer registration
- Employer login
- JWT token generation and validation
- Protected employer job APIs
- Protected employer event APIs
- MongoDB Atlas persistence
- Request validation
- Global API exception handling
- CORS configuration for local frontend development
- Spring Actuator health/metrics endpoints

### Authentication Flow

1. Employer registers or logs in.
2. Backend returns a JWT access token.
3. Frontend stores the token in browser localStorage.
4. Authenticated API requests send:

```text
Authorization: Bearer <JWT>
```

## Local Development Prerequisites

Install these tools before running the full stack locally:

- Node.js 20 or newer
- npm
- Java 21
- Maven
- MongoDB Atlas cluster
- Google Maps Platform API key if testing event weather integration
- Postman if testing APIs manually

## Environment Variables

### Frontend

Create `frontend/.env.local`:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
GOOGLE_MAPS_API_KEY=your-google-api-key
```

Notes:

- `NEXT_PUBLIC_API_BASE_URL` is used by frontend API helpers when calling the Spring Boot backend.
- `GOOGLE_MAPS_API_KEY` is used by the Next.js server route for Google weather lookup.
- Do not commit `.env.local`.

### Backend

Create backend runtime environment variables or use your IDE run configuration:

```text
SERVER_PORT=8080
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/waypoint_portal?retryWrites=true&w=majority
JWT_SECRET=replace-with-at-least-32-random-characters
JWT_EXPIRATION_MINUTES=480
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Security notes:

- Never commit real MongoDB credentials.
- Never commit real JWT secrets.
- Use a long random `JWT_SECRET` for non-local environments.

## Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Useful frontend routes:

```text
http://localhost:3000/employer/jobs
http://localhost:3000/employer/events
http://localhost:3000/employer/home
```

Frontend validation commands:

```bash
npm run lint
npm run build
```

## Running the Backend

```bash
cd backend
mvn spring-boot:run
```

Backend base URL:

```text
http://localhost:8080
```

Health check:

```text
GET http://localhost:8080/api/health
```

Actuator health:

```text
GET http://localhost:8080/actuator/health
```

Backend verification:

```bash
cd backend
mvn test
```

Note: Maven must be installed and available on PATH to run backend commands.

## API Overview

### Public APIs

```text
GET  /api/health
POST /api/auth/employer/register
POST /api/auth/employer/login
```

### Authenticated Employer APIs

```text
GET  /api/employer/jobs
GET  /api/employer/jobs?timePostedDays=7
POST /api/employer/jobs
GET  /api/employer/events
POST /api/employer/events
```

All authenticated routes require:

```text
Authorization: Bearer <JWT>
```

### Job Posting API Notes

Job posting persistence includes `createdAt` and `updatedAt` timestamps through Mongo auditing.

The `createdAt` field is used for:

- Accurate time-posted filtering
- Sorting jobs newest first
- Preserving the original publish time after edits

Mongo index:

```text
employer_created_at_idx: employerId ASC, createdAt DESC
```

## Postman Testing

Import this file into Postman:

```text
postman/waypoint-employer-portal.postman_collection.json
```

Suggested flow:

1. Register employer.
2. Copy returned JWT token.
3. Set token as a collection variable or Authorization bearer token.
4. Create job postings.
5. Fetch job postings with and without `timePostedDays`.
6. Create and fetch events.

## Monitoring and Splunk

The backend is prepared for monitoring through:

- Spring Boot Actuator health endpoint
- Spring Boot Actuator metrics endpoint
- Structured console logging suitable for Splunk ingestion

Useful endpoints:

```text
GET /actuator/health
GET /actuator/metrics
```

For production, connect application logs to Splunk through the deployment environment log forwarder.

## Data Storage Notes

Current development behavior:

- Frontend uses localStorage for immediate local UI behavior.
- Backend APIs are available for persistent MongoDB storage.
- When backend is unavailable during local frontend development, the UI still works locally for demo/testing.

Production expectation:

- Replace localStorage-only flows with backend read/write calls.
- Keep `createdAt` server-generated.
- Keep attendee registration persisted in MongoDB.
- Keep JWT authentication enforced on protected routes.

## Quality Checks Completed

Frontend checks used during development:

```bash
cd frontend
npm run lint
npm run build
```

Backend check expected when Maven is available:

```bash
cd backend
mvn test
```

## Git Workflow

Current pushed branch used during development:

```text
Repository: https://github.com/arun090909/UI_project
Branch: Employeer-Job-and-Events-page
```

Recommended workflow:

```bash
git status
git add .
git commit -m "Describe the change"
git push origin HEAD:Employeer-Job-and-Events-page
```

## Known Local Development Notes

- If the backend is not running, creating job postings may still work in the frontend through localStorage fallback behavior.
- If Google weather is not configured, event weather lookup will show a weather unavailable message.
- Existing browser localStorage job records created before the `createdAt` field was added are migrated once by the frontend.
- The Home page intentionally displays an in-page not-found state because that page is owned by another team.

## Future Integration Work

Recommended next backend integration tasks:

- Persist event attendees in MongoDB.
- Add update endpoints for editing job postings and events.
- Add delete/archive support if required by product design.
- Replace localStorage lists with authenticated backend fetches.
- Add browser tests for creating/filtering job postings and scheduling/registering events.
- Add CI pipeline for frontend lint/build and backend tests.

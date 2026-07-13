# Waypoint Employer Portal

Full-stack employer portal workspace.

## Structure

```text
frontend/   Next.js + React employer portal UI
backend/    Java Spring Boot API with MongoDB Atlas and JWT auth
postman/    Postman collection for API integration testing
```

## Local Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend environment:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Local Backend

Install JDK 21 and Maven, then configure:

```text
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/waypoint_portal?retryWrites=true&w=majority
JWT_SECRET=replace-with-at-least-32-random-characters
```

Run:

```bash
cd backend
mvn spring-boot:run
```

## API Testing

Import this collection into Postman:

```text
postman/waypoint-employer-portal.postman_collection.json
```

# Waypoint

Waypoint is a web-based employment and hiring event platform. It connects job seekers with employers in a single application, covering job discovery and applications, hiring-event registration, and end-to-end recruitment management.

> **Document status:** System Analysis & Solution Design — v0.1 (draft, pending mentor review). Several items below are flagged `Pending` where the source design doc leaves them open.

## Table of Contents

- [Overview](#overview)
  - [Product Objective](#product-objective)
  - [Business Problem](#business-problem)
- [User Roles](#user-roles)
  - [Employee](#employee-current-project-terminology)
  - [Employer](#employer)
  - [Administrator (Pending Confirmation)](#administrator-pending-confirmation)
  - [Role Permission Matrix](#role-permission-matrix)
- [Project Scope](#project-scope)
  - [Shared Authentication & Account Management](#shared-authentication--account-management)
  - [Employee Portal](#employee-portal)
  - [Employer Portal](#employer-portal)
  - [Notification Features](#notification-features)
  - [Scope Boundaries](#scope-boundaries)
- [System Architecture](#system-architecture)
  - [Architecture Style](#architecture-style)
  - [High-Level Architecture](#high-level-architecture)
  - [Component Responsibilities](#component-responsibilities)
  - [Component Interaction Flow](#component-interaction-flow)
- [Technology Stack](#technology-stack)
- [API Design](#api-design)
  - [API Conventions](#api-conventions)
  - [Authentication & Account APIs](#authentication--account-apis)
  - [Employee Profile APIs](#employee-profile-apis)
  - [Job APIs](#job-apis)
  - [Job Application APIs](#job-application-apis)
  - [Event APIs](#event-apis)
  - [Event Registration APIs](#event-registration-apis)
  - [Notification APIs](#notification-apis)
  - [Support APIs](#support-apis)
- [Database Design (ERD)](#database-design-erd)
  - [Design Principles](#design-principles)
  - [Database Collections](#database-collections)
  - [Entity Relationship Diagram](#entity-relationship-diagram)
  - [Relationship Summary](#relationship-summary)
  - [MongoDB Reference Strategy](#mongodb-reference-strategy)
  - [Assumptions](#assumptions)
- [Core Workflows](#core-workflows)
  - [Account Registration & OTP Verification](#account-registration--otp-verification)
  - [Login](#login)
  - [Forgot Password / Reset Password](#forgot-password--reset-password)
  - [Job Application Submission](#job-application-submission)
  - [Event Registration](#event-registration)
- [Open Questions for Mentor Review](#open-questions-for-mentor-review)

---

## Overview

For employees, the platform is a single place to build a profile, search and apply for jobs, register for hiring events, and track the status of every application and registration in one view.

For employers, the platform is a centralized dashboard for maintaining company information, publishing job opportunities, scheduling hiring events, reviewing applicants, and managing candidates through each stage of the hiring process.

### Product Objective

The primary objective of Waypoint is to provide a unified platform where:

- Employees can discover suitable employment opportunities.
- Employees can register for hiring events.
- Employees can manage their professional profiles.
- Employees can monitor their application progress.
- Employers can publish job opportunities.
- Employers can organize hiring events.
- Employers can review applicants and manage candidate progress.
- Both employees and employers can efficiently manage their activities through dedicated portals.

### Business Problem

Organizations often manage job postings, candidate information, hiring events, and application tracking through multiple disconnected systems or manual processes. Waypoint aims to solve this problem by providing:

- A centralized employment platform.
- Structured job application management.
- Hiring event management.
- Candidate application tracking.
- Employer dashboard for recruitment activities.
- Consistent workflows for both employees and employers.

---

## User Roles

The current version of Waypoint is designed around two primary user roles, with a third under consideration.

### Employee (Current Project Terminology)

The current project refers to job seekers as **Employees**. This terminology is retained throughout the design document to remain consistent with the existing project artifacts.

**Responsibilities** — an Employee shall be able to:

1. Register an account.
2. Log into the application.
3. View the employee dashboard.
4. Create and update profile information.
5. Upload or update resume information.
6. Maintain skills and preferred job roles.
7. Maintain salary and employment preferences.
8. Search available jobs.
9. Filter available jobs.
10. View job details.
11. Apply for available jobs.
12. Submit supporting notes during application.
13. Confirm work authorization.
14. View submitted applications.
15. Track application progress.
16. Search available events.
17. View event details.
18. Register for events.
19. View registered events.
20. Contact customer support.

**Restrictions** — Employees shall **not** be permitted to:

- Publish jobs.
- Schedule hiring events.
- View another employee's information.
- Review candidate applications.
- Modify application status.
- View employer-only reports.
- Modify employer information.

### Employer

An Employer represents a company, recruiter, hiring manager, or authorized organization representative responsible for recruitment activities.

**Responsibilities** — an Employer shall be able to:

1. Register an employer account.
2. Log into the application.
3. View employer dashboard.
4. Maintain company information.
5. Create job postings.
6. Edit job postings.
7. Publish job postings.
8. Close job postings.
9. View applicants.
10. Review candidate profiles.
11. Review resumes.
12. Schedule interviews.
13. Update candidate application status.
14. Create hiring events.
15. Edit hiring events.
16. Publish hiring events.
17. View event registrations.
18. View recruitment statistics.

**Restrictions** — Employers shall **not** be permitted to:

- Apply for jobs.
- Register for employee events.
- Modify employee profiles.
- View applicants belonging to another employer.
- Modify another employer's job postings.
- Modify another company's profile.

### Administrator (Pending Confirmation)

The current project artifacts do not include an Administrator portal or administrator workflows. However, a future administrator role may be responsible for:

- Managing platform users.
- Verifying employer accounts.
- Reviewing inappropriate content.
- Managing system reference data.
- Handling support requests.
- Viewing platform-wide reports.
- Monitoring system activities.

> **Pending mentor approval** — the Administrator role is currently considered outside the confirmed scope of Version 1.

### Role Permission Matrix

| Feature                   | Employee          | Employer        |
|---------------------------|-------------------|-----------------|
| Register Account          | ✓                 | ✓               |
| Login                     | ✓                 | ✓               |
| View Personal Profile     | ✓                 | ✓               |
| Edit Personal Profile     | ✓                 | ✓               |
| View Company Profile      | ✗                 | ✓ (Own Company) |
| Edit Company Profile      | ✗                 | ✓ (Own Company) |
| Search Jobs               | ✓                 | ✓ (View Only)   |
| View Job Details          | ✓                 | ✓               |
| Apply for Jobs            | ✓                 | ✗               |
| Create Job Posting        | ✗                 | ✓               |
| Edit Job Posting          | ✗                 | ✓ (Own Jobs)    |
| Close Job Posting         | ✗                 | ✓ (Own Jobs)    |
| View Applicants           | ✗                 | ✓ (Own Jobs)    |
| Update Application Status | ✗                 | ✓               |
| Search Events             | ✓                 | ✓               |
| Register for Events       | ✓                 | ✗               |
| Create Events             | ✗                 | ✓               |
| Edit Events               | ✗                 | ✓ (Own Events)  |
| View Event Registrations  | Own Registrations | Own Events      |
| View Reports              | ✗                 | ✓               |
| Contact Support           | ✓                 | ✓               |

\* Administrator functionality is pending confirmation.

---


### Shared Authentication & Account Management


- Employee registration
- Employer registration
- Role-based login

- Email OTP verification during account registration
- Login authentication

- Forgot Password
- Password Reset using Email OTP
- Change Password for authenticated users

- Logout functionality


### Employee Portal

1. Employee dashboard
2. Employee profile management
3. Resume upload and management
4. Skills and job preference management
5. Job search and filtering
6. View job details

7. Apply for jobs
8. Track job application status
9. Search and register for events

10. View registered events
11. Notification center
12. Contact support

### Employer Portal

- Employer dashboard

- Employer profile management
- Create, edit and close job postings
- View job postings
- Create and manage hiring events
- View applicants
- Review candidate profiles
- Update application status
- View event registrations
- Notification center
- Basic recruitment reports


### Notification Features

The system shall support **In-Application Notifications** and **Email Notifications** for both Employees and Employers. Notifications shall be generated for important system activities, including:

**Employee Notifications**

- Successful account registration
- Password reset request
- Successful password change
- Job application submission confirmation
- Job application status updates
- Event registration confirmation
- Event updates or cancellations

**Employer Notifications**

- New job application received
- New event registration received
- Updates related to employer-created jobs
- Updates related to employer-created events

### Scope Boundaries

**Employee Data Boundary** — Employees may access only:

- Their own profile
- Their own resume
- Their own job applications
- Their own event registrations
- Public job postings
- Public events

**Employer Data Boundary** — Employers may access only:

- Their own company profile
- Their own job postings
- Their own hiring events
- Applicants related to their own posted jobs
- Registrations related to their own posted events

---

## System Architecture

The Overall System Architecture defines the major software components of the Waypoint application, their responsibilities, and the interactions between them. It provides a high-level view of the application before database design and implementation begin.

### Architecture Style

| | |
|---|---|
| **Architecture Pattern** | Layered Client–Server Architecture |
| **Frontend** | React.js |
| **Backend** | Spring Boot |
| **Database** | MongoDB |
| **Communication Protocol** | REST APIs (JSON) |

### High-Level Architecture

| Layer | Component | Responsibilities |
|---|---|---|
| Client Layer | Employee Portal | Allows employees to search jobs, apply for jobs, register for events, manage profiles, and track applications. |
| Client Layer | Employer Portal | Allows employers to manage profiles, jobs, events, applicants, and recruitment activities. |
| Presentation Layer | React Frontend | Displays UI, performs client-side validation, and communicates with backend APIs. |
| API Layer | REST Controllers | Receives frontend requests, validates input, and forwards requests to the service layer. |
| Business Layer | Service Layer | Implements business rules, processes requests, and coordinates application workflows. |
| Data Access Layer | Repository Layer | Performs CRUD operations and communicates with MongoDB. |
| Database Layer | MongoDB | Stores application data and document references. |
| Supporting Service | Authentication Service | Authenticates users and authorizes access based on roles. |
| Supporting Service | OTP Service | Generates, validates, expires, and resends OTPs for registration and password reset. |
| Supporting Service | Email Service | Sends OTPs, password-reset emails, and application notifications. |
| Supporting Service | Notification Service | Creates in-app notifications and coordinates email notifications. |
| Supporting Service | Document Storage Service | Stores uploaded resumes and employer logos in local storage while maintaining references in MongoDB. |

### Component Responsibilities

**React Frontend**
- Display user interfaces.
- Capture user input.
- Perform client-side validations.
- Invoke backend REST APIs.
- Display API responses.
- Navigate users based on assigned roles.

**REST Controller Layer**
- Receive HTTP requests.
- Validate request payloads.
- Route requests to appropriate services.
- Return standardized HTTP responses.
- Handle request-level exceptions.

**Service Layer**
- Execute business rules.
- Process application logic.
- Validate business constraints.
- Coordinate multiple services.
- Trigger notifications and emails.
- Return processed data to controllers.

**Repository Layer**
- Perform Create, Read, Update, and Delete operations.
- Query MongoDB collections.
- Execute search and filtering.
- Persist application data.
- Retrieve related documents.

**MongoDB Database**
- Store application data.
- Maintain document references.
- Store notification records.
- Store OTP records.
- Maintain data consistency.

**Authentication Service**
- Authenticate users during login.
- Authorize users based on assigned roles.
- Manage authentication tokens.
- Protect secured APIs.

**OTP Service**
- Generate One-Time Passwords.
- Validate OTPs.
- Enforce OTP expiration.
- Handle OTP resend requests.

**Email Service**
- Send registration OTPs.
- Send password-reset emails.
- Send notification emails.
- Deliver application-related communications.

**Notification Service**
- Generate in-app notifications.
- Send email notifications.
- Maintain notification history.
- Retrieve user notifications.

**Document Storage Service**
- Store uploaded resumes.
- Store employer logos.
- Validate uploaded documents.
- Maintain document references.

### Component Interaction Flow

A typical request flows from the React Frontend to a REST Controller, into the Service Layer for business logic, then to the Repository Layer for MongoDB access, with the response returned back up the same chain. Supporting services (Authentication, OTP, Email, Notification, Document Storage) are invoked by the Service Layer as needed rather than being called directly by the frontend.

![High-level component interaction flow](docs/images/high-level-architecture.png)

---

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Backend | Spring Boot |
| Database | MongoDB |
| Authentication | Spring Security + JWT |
| Password Encryption | BCrypt |
| Email Service | Spring Boot JavaMailSender |
| OTP Service | Custom Spring Boot Service |
| Notification Service | Spring Boot Notification Module |
| Document Storage | Local Server Storage |
| Build Tool | Maven |
| Version Control | Git & GitHub |

---

## API Design

The API layer exposes REST endpoints consumed by the React frontend. All endpoints return JSON and, except where noted, require a valid JWT issued by the Authentication Service.

### API Conventions

| Convention | Detail |
|---|---|
| Base path | `/api/v1` |
| Auth header | `Authorization: Bearer <token>` |
| Success response | `{ "success": true, "data": ... }` |
| Error response | `{ "success": false, "error": { "code": ..., "message": ... } }` |
| Pagination | `?page=0&size=20` query parameters on list endpoints |

> Paths below are indicative of the Layered Architecture already described and are `Pending` confirmation against the source design doc.

### Authentication & Account APIs

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/auth/register/employee` | Register a new employee account. | No |
| POST | `/auth/register/employer` | Register a new employer account. | No |
| POST | `/auth/otp/verify` | Verify OTP sent during registration. | No |
| POST | `/auth/otp/resend` | Resend a registration or reset OTP. | No |
| POST | `/auth/login` | Authenticate a user and issue a JWT. | No |
| POST | `/auth/forgot-password` | Request a password-reset OTP. | No |
| POST | `/auth/reset-password` | Reset password using a verified OTP. | No |
| PUT | `/auth/change-password` | Change password for the logged-in user. | Yes |
| POST | `/auth/logout` | Invalidate the current session/token. | Yes |

### Employee Profile APIs

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/employees/me` | Get the logged-in employee's profile. | Yes |
| PUT | `/employees/me` | Update profile, skills, and preferences. | Yes |
| POST | `/employees/me/resume` | Upload or replace a resume file. | Yes |

### Job APIs

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/jobs` | Search/filter published jobs. | No |
| GET | `/jobs/{jobId}` | View a single job's details. | No |
| POST | `/jobs` | Create a new job posting. | Yes (Employer) |
| PUT | `/jobs/{jobId}` | Edit a job posting owned by the employer. | Yes (Employer) |
| PATCH | `/jobs/{jobId}/close` | Close a job posting owned by the employer. | Yes (Employer) |

### Job Application APIs

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/jobs/{jobId}/applications` | Apply for a job, with supporting notes. | Yes (Employee) |
| GET | `/employees/me/applications` | List the employee's own applications. | Yes (Employee) |
| GET | `/jobs/{jobId}/applications` | List applicants for the employer's own job. | Yes (Employer) |
| PATCH | `/applications/{applicationId}/status` | Update an application's status. | Yes (Employer) |

### Event APIs

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/events` | Search/filter published events. | No |
| GET | `/events/{eventId}` | View a single event's details. | No |
| POST | `/events` | Create a hiring event. | Yes (Employer) |
| PUT | `/events/{eventId}` | Edit a hiring event owned by the employer. | Yes (Employer) |

### Event Registration APIs

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/events/{eventId}/registrations` | Register the employee for an event. | Yes (Employee) |
| GET | `/employees/me/registrations` | List the employee's own registrations. | Yes (Employee) |
| GET | `/events/{eventId}/registrations` | List registrants for the employer's own event. | Yes (Employer) |

### Notification APIs

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/notifications` | List the logged-in user's notifications. | Yes |
| PATCH | `/notifications/{notificationId}/read` | Mark a notification as read. | Yes |

### Support APIs

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/support/tickets` | Submit a support request. | Yes |
| GET | `/support/tickets` | List the logged-in user's support tickets. | Yes |

---

## Database Design (ERD)

The Entity Relationship Diagram (ERD) represents the logical database structure of the Waypoint application. It identifies the major business entities, their attributes, and the relationships between them, and serves as the foundation for the MongoDB collection design.

### Design Principles

- MongoDB document-based architecture.
- Shared authentication through a common **User** collection.
- Separate profile collections for Employees and Employers.
- Normalized business entities to minimize data duplication.
- MongoDB document references (REF) used to establish relationships between collections.
- Audit fields (`createdAt`, `updatedAt`) maintained in all primary collections.
- One-to-many relationships modeled using separate collections such as **JobApplication** and **EventRegistration**.

### Database Collections

| Collection | Purpose | Key Fields |
|---|---|---|
| User | Stores authentication and account information for all users. | `_id`, `email`, `passwordHash`, `role` (`EMPLOYEE` \| `EMPLOYER`), `isVerified`, `isActive`, `createdAt`, `updatedAt` |
| EmployeeProfile | Stores employee personal and professional profile details. | `_id`, `userId` (REF → User), `fullName`, `phone`, `resumeUrl`, `skills[]`, `preferredJobRoles[]`, `expectedSalary`, `workAuthorizationStatus`, `createdAt`, `updatedAt` |
| EmployerProfile | Stores employer/company profile information. | `_id`, `userId` (REF → User), `companyName`, `companyLogoUrl`, `industry`, `companySize`, `website`, `createdAt`, `updatedAt` |
| Job | Stores job postings created by employers. | `_id`, `employerId` (REF → EmployerProfile), `title`, `description`, `requiredSkills[]`, `location`, `employmentType`, `salaryRange`, `status` (`DRAFT` \| `PUBLISHED` \| `CLOSED`), `postedAt`, `closesAt` |
| JobApplication | Stores applications submitted by employees for jobs. | `_id`, `jobId` (REF → Job), `employeeId` (REF → EmployeeProfile), `supportingNotes`, `workAuthorizationConfirmed`, `status` (`SUBMITTED` \| `UNDER_REVIEW` \| `INTERVIEW` \| `REJECTED` \| `HIRED`), `appliedAt`, `updatedAt` |
| Event | Stores hiring events created by employers. | `_id`, `employerId` (REF → EmployerProfile), `title`, `description`, `eventDate`, `location`, `status` (`DRAFT` \| `PUBLISHED` \| `CANCELLED`), `createdAt` |
| EventRegistration | Stores employee registrations for events. | `_id`, `eventId` (REF → Event), `employeeId` (REF → EmployeeProfile), `status` (`REGISTERED` \| `CANCELLED`), `registeredAt` |
| Notification | Stores in-app notifications for users. | `_id`, `userId` (REF → User), `type`, `message`, `isRead`, `createdAt` |
| OTPVerification | Stores temporary OTP verification details for registration and password reset. | `_id`, `email`, `otpCode`, `purpose` (`REGISTRATION` \| `PASSWORD_RESET`), `expiresAt`, `verifiedAt` |
| ContactSupport | Stores support tickets raised by users. | `_id`, `userId` (REF → User), `subject`, `message`, `status` (`OPEN` \| `IN_PROGRESS` \| `RESOLVED`), `createdAt` |

> Field names above are illustrative, based on the responsibilities and relationships already defined in this document. They are `Pending` confirmation against the source design doc's actual schema definitions, if any exist beyond entity/relationship level.

### Entity Relationship Diagram

![Entity Relationship Diagram](docs/images/entity-relationship-diagram.png)

### Relationship Summary

| Parent Entity | Relationship | Child Entity |
|---|---|---|
| User | Has Profile | EmployeeProfile |
| User | Has Profile | EmployerProfile |
| EmployerProfile | Creates | Job |
| EmployeeProfile | Submits | JobApplication |
| Job | Receives | JobApplication |
| EmployerProfile | Creates | Event |
| EmployeeProfile | Registers For | EventRegistration |
| Event | Has Registrations | EventRegistration |
| User | Receives | Notification |
| User | Raises | ContactSupport |

### MongoDB Reference Strategy

Since the application uses MongoDB, relationships are maintained using document references rather than relational foreign keys. Fields marked with **REF** represent references to the primary key (`_id`) of another collection. Referential integrity is validated within the Spring Boot Service Layer.

### Assumptions

- Every User can have only one profile based on their assigned role.
- A User can either be an Employee or an Employer in Version 1 of the application.
- One Employer can create multiple Jobs and Events.
- One Employee can apply for multiple Jobs and register for multiple Events.
- OTP Verification is maintained as an independent collection and linked using the registered email address during account verification and password reset.

---

## Core Workflows

The workflows below trace how the components, collections, and APIs described above work together for the platform's key processes.

### Account Registration & OTP Verification

1. User submits registration details (employee or employer) via `POST /auth/register/{role}`.
2. Service Layer validates input and creates a `User` record with `isVerified = false`.
3. OTP Service generates a one-time code and stores it in `OTPVerification` with a `REGISTRATION` purpose and expiry.
4. Email Service sends the OTP to the user's registered email address.
5. User submits the code via `POST /auth/otp/verify`.
6. On a valid, unexpired match, the `User` record is marked verified and the corresponding `EmployeeProfile` or `EmployerProfile` is created.
7. Notification Service records a "successful registration" notification.

### Login

1. User submits credentials via `POST /auth/login`.
2. Authentication Service verifies the email/password against the stored `passwordHash` (BCrypt).
3. On success, a JWT encoding the user's `id` and `role` is issued.
4. The frontend stores the token and routes the user to the Employee or Employer dashboard based on `role`.
5. Subsequent requests carry the JWT in the `Authorization` header; the Authentication Service authorizes each request against the required role.

### Forgot Password / Reset Password

1. User requests a reset via `POST /auth/forgot-password`.
2. OTP Service creates an `OTPVerification` record with a `PASSWORD_RESET` purpose.
3. Email Service sends the OTP to the registered email.
4. User submits the OTP and new password via `POST /auth/reset-password`.
5. On success, the `passwordHash` is updated and a confirmation notification/email is sent.

### Job Application Submission

1. Employee searches and filters jobs via `GET /jobs`, then views details via `GET /jobs/{jobId}`.
2. Employee submits an application (with supporting notes and work-authorization confirmation) via `POST /jobs/{jobId}/applications`.
3. Service Layer validates the employee is not re-applying to the same job, then creates a `JobApplication` with `status = SUBMITTED`.
4. Notification Service alerts the employer of a new application and confirms submission to the employee.
5. Employer reviews applicants via `GET /jobs/{jobId}/applications` and updates status via `PATCH /applications/{applicationId}/status`.
6. Each status change triggers a notification to the employee.

### Event Registration

1. Employee searches events via `GET /events` and views details via `GET /events/{eventId}`.
2. Employee registers via `POST /events/{eventId}/registrations`, creating an `EventRegistration` record.
3. Notification Service confirms registration to the employee and alerts the employer of the new registration.
4. Employer views registrants for their own event via `GET /events/{eventId}/registrations`.
5. If the employer edits or cancels the event, registered employees are notified of the update.

---

## Open Questions for Mentor Review

**Authentication**
1. Is employer approval required before publishing jobs?

**Employee Module**
1. Should the role be named **Employee**, **Candidate**, or **Job Seeker**?

**Employer Module**
1. Can multiple recruiters belong to one company?

---

*Derived from `Waypoint_System_Analysis_&_Solution_Design_Document_v0.1.docx`. Update this README as the design evolves past v0.1.*

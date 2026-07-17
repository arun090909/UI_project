# Employer Module - Recruitment & Job Portal Backend

## Overview

The Employer Module is a secure, multi-tenant backend system for a recruitment and job portal.

It allows employers to:

- Create and manage company profiles
- Manage office locations
- Create and manage job postings
- View applicants and candidate profiles
- Download resumes and view cover letters
- Manage application statuses
- Schedule and manage interviews
- Send messages, invitations, rejection emails, and offers
- Invite employer team members
- Assign roles and permissions
- View notifications
- View dashboard analytics
- Manage subscription plans, invoices, payments, and job limits
- Update account and security settings
- Track employer activity through audit logs

Every employer-owned record is connected to a `company_id`. This ensures that one employer cannot access another employer's company, jobs, applicants, interviews, messages, analytics, or billing records.

Platform administrators may access records across companies only when their assigned permissions allow it.

---

## Table of Contents

1. [Architecture](#architecture)
2. [Technology Stack](#technology-stack)
3. [Multi-Tenant Security](#multi-tenant-security)
4. [Database Tables](#database-tables)
5. [Table Definitions](#table-definitions)
6. [Entity Relationships](#entity-relationships)
7. [Role-Based Access Control](#role-based-access-control)
8. [API Endpoints](#api-endpoints)
9. [Example API Payloads](#example-api-payloads)
10. [Job Status Workflow](#job-status-workflow)
11. [Application Status Workflow](#application-status-workflow)
12. [Interview Workflow](#interview-workflow)
13. [Notification Workflow](#notification-workflow)
14. [Job Posting Limit Check](#job-posting-limit-check)
15. [Authorization and Ownership Checks](#authorization-and-ownership-checks)
16. [Soft Delete Strategy](#soft-delete-strategy)
17. [Audit Log Strategy](#audit-log-strategy)
18. [Pagination, Filtering, and Sorting](#pagination-filtering-and-sorting)
19. [Dashboard Analytics](#dashboard-analytics)
20. [MongoDB Design](#mongodb-design)
21. [PostgreSQL Design](#postgresql-design)
22. [Security Recommendations](#security-recommendations)
23. [Project Folder Structure](#project-folder-structure)
24. [Complete Backend Workflow](#complete-backend-workflow)

---

# Architecture

```text
Employer Web Application
        |
        v
API Gateway / Load Balancer
        |
        v
Authentication Middleware
        |
        v
Company Ownership Middleware
        |
        v
RBAC Permission Middleware
        |
        v
Controller Layer
        |
        v
Service / Business Layer
        |
        v
Repository / Data Access Layer
        |
        v
PostgreSQL Database
        |
        +--> Redis
        +--> Object Storage
        +--> Search Engine
        +--> Message Queue
```

### Main backend services

```text
Authentication Service
Company Service
Job Service
Candidate Service
Application Service
Interview Service
Messaging Service
Notification Service
Analytics Service
Billing Service
Audit Service
```

---

# Technology Stack

## Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- Bean Validation

## Database

- PostgreSQL as the primary transactional database
- MongoDB as an optional document-oriented alternative

## Cache

- Redis

## File Storage

- Amazon S3 or another private object-storage service

## Messaging

- Kafka
- RabbitMQ
- AWS SQS

## Candidate Search

- PostgreSQL full-text search
- OpenSearch or Elasticsearch for advanced search

## Authentication

- JWT
- OAuth 2.0 / OpenID Connect
- Multi-Factor Authentication

---

# Multi-Tenant Security

Every employer-owned resource must contain a `company_id`.

Examples:

```text
jobs.company_id
job_applications.company_id
interviews.company_id
message_threads.company_id
notifications.company_id
subscriptions.company_id
employer_activity_logs.company_id
```

The backend must never trust a `companyId` received from the frontend.

The backend resolves the employer's company using the authenticated user.

```text
Authenticated User
        |
        v
Employer Team Membership
        |
        v
Company ID
        |
        v
Role
        |
        v
Permissions
        |
        v
Company-Scoped Database Query
```

Safe query:

```sql
SELECT *
FROM jobs
WHERE id = :job_id
  AND company_id = :authorized_company_id
  AND deleted_at IS NULL;
```

Unsafe query:

```sql
SELECT *
FROM jobs
WHERE id = :job_id;
```

---

# Database Tables

## Identity

- `users`
- `employer_profiles`

## Company

- `companies`
- `company_locations`

## Team and Authorization

- `employer_team_members`
- `roles`
- `permissions`
- `role_permissions`

## Jobs

- `jobs`
- `job_skills`

## Candidates

- `candidate_profiles`
- `resumes`

## Applications

- `job_applications`
- `application_answers`
- `application_status_history`

## Interviews

- `interviews`
- `interview_participants`
- `interview_feedback`

## Messaging

- `message_threads`
- `messages`

## Notifications

- `notifications`

## Billing

- `plans`
- `subscriptions`
- `billing_profiles`
- `invoices`
- `payments`

## Offers

- `job_offers`

## Audit

- `employer_activity_logs`

## Asynchronous Processing

- `outbox_events`

---

# Standard Fields

Most tables contain:

| Field | PostgreSQL Type | MongoDB Type | Required |
|---|---|---|---|
| `id` | UUID | ObjectId | Yes |
| `created_at` | TIMESTAMPTZ | Date | Yes |
| `updated_at` | TIMESTAMPTZ | Date | Yes |
| `deleted_at` | TIMESTAMPTZ | Date or null | No |
| `created_by` | UUID | ObjectId | No |
| `updated_by` | UUID | ObjectId | No |

Recommended PostgreSQL primary key:

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

All timestamps should be stored in UTC.

---

# Table Definitions

## 1. users

### Purpose

Stores login identities for employers, candidates, and platform administrators.

### Fields

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Yes |
| `email` | VARCHAR(320) | Yes |
| `password_hash` | TEXT | Conditional |
| `first_name` | VARCHAR(100) | Yes |
| `last_name` | VARCHAR(100) | Yes |
| `phone` | VARCHAR(30) | No |
| `user_type` | ENUM | Yes |
| `status` | ENUM | Yes |
| `email_verified_at` | TIMESTAMPTZ | No |
| `last_login_at` | TIMESTAMPTZ | No |
| `mfa_enabled` | BOOLEAN | Yes |
| `password_changed_at` | TIMESTAMPTZ | No |
| `created_at` | TIMESTAMPTZ | Yes |
| `updated_at` | TIMESTAMPTZ | Yes |
| `deleted_at` | TIMESTAMPTZ | No |

### Primary Key

```text
id
```

### Enum Values

```text
user_type:
candidate
employer
platform_admin

status:
pending
active
suspended
deactivated
```

### Unique Constraints

```text
email
```

### Indexes

```sql
CREATE INDEX users_type_status_idx
ON users(user_type, status);
```

### Example

```json
{
  "id": "user-uuid",
  "email": "recruiter@acme.com",
  "firstName": "Sara",
  "lastName": "Johnson",
  "phone": "+13125550123",
  "userType": "employer",
  "status": "active",
  "mfaEnabled": true
}
```

### Validation

- Email must be normalized to lowercase.
- Email must be valid and unique.
- Password must satisfy the configured password policy.
- Phone must use E.164 format.
- Suspended or deactivated users cannot log in.

---

## 2. companies

### Purpose

Stores the employer's company profile.

### Fields

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Yes |
| `name` | VARCHAR(255) | Yes |
| `slug` | VARCHAR(255) | Yes |
| `logo_storage_key` | TEXT | No |
| `description` | TEXT | No |
| `industry` | VARCHAR(150) | No |
| `company_size` | ENUM | No |
| `website` | TEXT | No |
| `email` | VARCHAR(320) | No |
| `phone` | VARCHAR(30) | No |
| `status` | ENUM | Yes |
| `verified_at` | TIMESTAMPTZ | No |
| `created_at` | TIMESTAMPTZ | Yes |
| `updated_at` | TIMESTAMPTZ | Yes |
| `deleted_at` | TIMESTAMPTZ | No |

### Enum Values

```text
company_size:
1_10
11_50
51_200
201_500
501_1000
1001_5000
5001_10000
10000_plus

status:
draft
active
inactive
suspended
```

### Unique Constraints

```text
slug
```

### Indexes

```sql
CREATE INDEX companies_status_idx ON companies(status);
CREATE INDEX companies_industry_idx ON companies(industry);
```

### Example

```json
{
  "id": "company-uuid",
  "name": "Acme Technologies",
  "slug": "acme-technologies",
  "logoStorageKey": "companies/company-uuid/logo.png",
  "description": "Enterprise software company",
  "industry": "Software",
  "companySize": "201_500",
  "website": "https://acme.example",
  "email": "careers@acme.example",
  "phone": "+13125550123",
  "status": "active"
}
```

### Validation

- Name is required.
- Website must be a valid HTTP or HTTPS URL.
- Email must be valid.
- Phone must use E.164 format.
- Logo must pass file validation and malware scanning.
- Suspended companies cannot publish jobs.

---

## 3. employer_profiles

### Purpose

Stores employer-user profile and account preferences.

### Fields

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Yes |
| `user_id` | UUID FK | Yes |
| `job_title` | VARCHAR(150) | No |
| `department` | VARCHAR(150) | No |
| `profile_image_storage_key` | TEXT | No |
| `onboarding_status` | ENUM | Yes |
| `default_company_id` | UUID FK | No |
| `notification_preferences` | JSONB | Yes |
| `security_preferences` | JSONB | No |
| `created_at` | TIMESTAMPTZ | Yes |
| `updated_at` | TIMESTAMPTZ | Yes |
| `deleted_at` | TIMESTAMPTZ | No |

### Relationships

```text
user_id -> users.id
default_company_id -> companies.id
```

### Enum Values

```text
not_started
in_progress
completed
```

### Unique Constraints

```text
user_id
```

### Example

```json
{
  "id": "employer-profile-uuid",
  "userId": "user-uuid",
  "jobTitle": "Senior Recruiter",
  "department": "Talent Acquisition",
  "onboardingStatus": "completed",
  "defaultCompanyId": "company-uuid",
  "notificationPreferences": {
    "newApplications": true,
    "interviewUpdates": true,
    "candidateMessages": true,
    "jobExpiry": true
  }
}
```

### Validation

- User must have `user_type=employer`.
- Default company must be one where the user has active membership.
- Preference fields must use an approved schema.

---

## 4. company_locations

### Purpose

Stores company headquarters and office locations.

### Fields

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Yes |
| `company_id` | UUID FK | Yes |
| `name` | VARCHAR(150) | No |
| `location_type` | ENUM | Yes |
| `address_line1` | VARCHAR(255) | No |
| `address_line2` | VARCHAR(255) | No |
| `city` | VARCHAR(120) | Yes |
| `state_region` | VARCHAR(120) | No |
| `postal_code` | VARCHAR(30) | No |
| `country_code` | CHAR(2) | Yes |
| `latitude` | NUMERIC(9,6) | No |
| `longitude` | NUMERIC(9,6) | No |
| `is_primary` | BOOLEAN | Yes |
| `created_at` | TIMESTAMPTZ | Yes |
| `updated_at` | TIMESTAMPTZ | Yes |
| `deleted_at` | TIMESTAMPTZ | No |

### Relationships

```text
company_id -> companies.id
```

### Enum Values

```text
headquarters
office
remote_hub
```

### Indexes

```sql
CREATE INDEX company_locations_company_idx
ON company_locations(company_id);

CREATE INDEX company_locations_search_idx
ON company_locations(company_id, country_code, city);
```

### Unique Constraints

Only one active primary location per company.

```sql
CREATE UNIQUE INDEX company_primary_location_idx
ON company_locations(company_id)
WHERE is_primary = true
  AND deleted_at IS NULL;
```

### Example

```json
{
  "id": "location-uuid",
  "companyId": "company-uuid",
  "name": "Chicago Office",
  "locationType": "office",
  "city": "Chicago",
  "stateRegion": "Illinois",
  "postalCode": "60601",
  "countryCode": "US",
  "isPrimary": true
}
```

### Validation

- Country code must be an ISO two-letter code.
- Latitude must be between `-90` and `90`.
- Longitude must be between `-180` and `180`.
- Only one location may be marked as primary.

---

## 5. roles

### Purpose

Defines employer-team and platform-administrator roles.

### Fields

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Yes |
| `company_id` | UUID FK | No |
| `name` | VARCHAR(100) | Yes |
| `code` | VARCHAR(100) | Yes |
| `scope` | ENUM | Yes |
| `description` | TEXT | No |
| `is_system_role` | BOOLEAN | Yes |
| `created_at` | TIMESTAMPTZ | Yes |
| `updated_at` | TIMESTAMPTZ | Yes |
| `deleted_at` | TIMESTAMPTZ | No |

### Enum Values

```text
company
platform
```

### Unique Constraints

```text
company_id + code
```

### Example

```json
{
  "id": "role-uuid",
  "companyId": "company-uuid",
  "name": "Recruiter",
  "code": "recruiter",
  "scope": "company",
  "isSystemRole": true
}
```

### Validation

- Company-scoped roles require a company ID.
- Platform roles must not have a company ID.
- System roles cannot be deleted by regular employers.

---

## 6. permissions

### Purpose

Defines individual backend operations.

### Fields

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Yes |
| `code` | VARCHAR(150) | Yes |
| `resource` | VARCHAR(100) | Yes |
| `action` | VARCHAR(100) | Yes |
| `description` | TEXT | No |
| `created_at` | TIMESTAMPTZ | Yes |
| `updated_at` | TIMESTAMPTZ | Yes |
| `deleted_at` | TIMESTAMPTZ | No |

### Unique Constraints

```text
code
```

### Example

```json
{
  "id": "permission-uuid",
  "code": "applications.update_status",
  "resource": "applications",
  "action": "update_status",
  "description": "Change an application's recruitment status"
}
```

### Validation

Permission codes should follow:

```text
resource.action
```

---

## 7. role_permissions

### Purpose

Connects roles and permissions.

### Fields

| Field | Type | Required |
|---|---|---|
| `role_id` | UUID FK | Yes |
| `permission_id` | UUID FK | Yes |
| `created_at` | TIMESTAMPTZ | Yes |

### Primary Key

```text
role_id + permission_id
```

### Relationships

```text
role_id -> roles.id
permission_id -> permissions.id
```

### Example

```json
{
  "roleId": "recruiter-role-uuid",
  "permissionId": "applications-read-permission-uuid"
}
```

---

## 8. employer_team_members

### Purpose

Connects employer users to companies and assigned roles.

### Fields

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Yes |
| `company_id` | UUID FK | Yes |
| `user_id` | UUID FK | Conditional |
| `role_id` | UUID FK | Yes |
| `status` | ENUM | Yes |
| `invitation_email` | VARCHAR(320) | Conditional |
| `invitation_token_hash` | TEXT | No |
| `invitation_expires_at` | TIMESTAMPTZ | No |
| `invited_by` | UUID FK | No |
| `joined_at` | TIMESTAMPTZ | No |
| `created_at` | TIMESTAMPTZ | Yes |
| `updated_at` | TIMESTAMPTZ | Yes |
| `deleted_at` | TIMESTAMPTZ | No |

### Enum Values

```text
invited
active
suspended
removed
expired
```

### Relationships

```text
company_id -> companies.id
user_id -> users.id
role_id -> roles.id
invited_by -> users.id
```

### Unique Constraints

```text
company_id + user_id
```

### Indexes

```sql
CREATE INDEX team_members_company_status_idx
ON employer_team_members(company_id, status);

CREATE INDEX team_members_user_idx
ON employer_team_members(user_id);
```

### Example

```json
{
  "id": "team-member-uuid",
  "companyId": "company-uuid",
  "userId": "user-uuid",
  "roleId": "recruiter-role-uuid",
  "status": "active",
  "joinedAt": "2026-07-17T14:00:00Z"
}
```

### Validation

- User must be an employer.
- Role must belong to the same company or be an approved system role.
- Invitation token must be stored as a hash.
- Removed and suspended members cannot access company resources.

---

## 9. jobs

### Purpose

Stores employer job postings.

### Fields

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Yes |
| `company_id` | UUID FK | Yes |
| `created_by_member_id` | UUID FK | Yes |
| `title` | VARCHAR(255) | Yes |
| `employment_type` | ENUM | Yes |
| `workplace_type` | ENUM | Yes |
| `location_id` | UUID FK | No |
| `location_text` | VARCHAR(255) | No |
| `description` | TEXT | Yes |
| `responsibilities` | JSONB | No |
| `experience_level` | ENUM | No |
| `minimum_experience_years` | NUMERIC(4,1) | No |
| `maximum_experience_years` | NUMERIC(4,1) | No |
| `education_requirement` | TEXT | No |
| `salary_min` | NUMERIC(14,2) | No |
| `salary_max` | NUMERIC(14,2) | No |
| `salary_currency` | CHAR(3) | No |
| `salary_period` | ENUM | No |
| `show_salary` | BOOLEAN | Yes |
| `benefits` | JSONB | No |
| `application_deadline` | TIMESTAMPTZ | No |
| `status` | ENUM | Yes |
| `published_at` | TIMESTAMPTZ | No |
| `paused_at` | TIMESTAMPTZ | No |
| `closed_at` | TIMESTAMPTZ | No |
| `source_job_id` | UUID FK | No |
| `version` | INTEGER | Yes |
| `created_at` | TIMESTAMPTZ | Yes |
| `updated_at` | TIMESTAMPTZ | Yes |
| `deleted_at` | TIMESTAMPTZ | No |

### Enum Values

```text
employment_type:
full_time
part_time
contract
temporary
internship
volunteer

workplace_type:
remote
hybrid
onsite

experience_level:
entry
junior
mid
senior
lead
manager
director
executive

salary_period:
hour
day
week
month
year

status:
draft
published
paused
closed
expired
```

### Relationships

```text
company_id -> companies.id
created_by_member_id -> employer_team_members.id
location_id -> company_locations.id
source_job_id -> jobs.id
```

### Indexes

```sql
CREATE INDEX jobs_company_status_idx
ON jobs(company_id, status);

CREATE INDEX jobs_company_created_idx
ON jobs(company_id, created_at DESC);

CREATE INDEX jobs_deadline_idx
ON jobs(application_deadline);
```

### Example

```json
{
  "id": "job-uuid",
  "companyId": "company-uuid",
  "title": "Senior Java Developer",
  "employmentType": "full_time",
  "workplaceType": "hybrid",
  "locationId": "location-uuid",
  "description": "Develop scalable recruitment services.",
  "responsibilities": [
    "Design REST APIs",
    "Review code",
    "Support production"
  ],
  "experienceLevel": "senior",
  "minimumExperienceYears": 5,
  "educationRequirement": "Bachelor's degree or equivalent experience",
  "salaryMin": 120000,
  "salaryMax": 150000,
  "salaryCurrency": "USD",
  "salaryPeriod": "year",
  "showSalary": true,
  "benefits": [
    "Health insurance",
    "401(k)",
    "Paid leave"
  ],
  "applicationDeadline": "2026-08-31T23:59:59Z",
  "status": "published",
  "version": 2
}
```

### Validation

- Salary minimum cannot exceed salary maximum.
- Experience minimum cannot exceed experience maximum.
- Published jobs require all mandatory fields.
- Application deadline must be in the future when published.
- Hybrid and onsite jobs should have a valid location.
- Location must belong to the same company.
- Version must be incremented after every update.

---

## 10. job_skills

### Purpose

Stores required and preferred skills for each job.

### Fields

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Yes |
| `job_id` | UUID FK | Yes |
| `skill_name` | VARCHAR(150) | Yes |
| `skill_type` | ENUM | Yes |
| `minimum_years` | NUMERIC(4,1) | No |
| `proficiency_level` | ENUM | No |
| `created_at` | TIMESTAMPTZ | Yes |
| `updated_at` | TIMESTAMPTZ | Yes |
| `deleted_at` | TIMESTAMPTZ | No |

### Enum Values

```text
skill_type:
required
preferred

proficiency_level:
beginner
intermediate
advanced
expert
```

### Unique Constraints

```text
job_id + skill_name + skill_type
```

### Example

```json
{
  "id": "job-skill-uuid",
  "jobId": "job-uuid",
  "skillName": "Java",
  "skillType": "required",
  "minimumYears": 5,
  "proficiencyLevel": "advanced"
}
```

### Validation

- Skill name cannot be blank.
- Minimum experience cannot be negative.
- Duplicate job-skill entries are not allowed.

---

## 11. candidate_profiles

### Purpose

Stores candidate career, education, experience, and location details.

### Fields

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Yes |
| `user_id` | UUID FK | Yes |
| `headline` | VARCHAR(255) | No |
| `summary` | TEXT | No |
| `current_title` | VARCHAR(150) | No |
| `total_experience_years` | NUMERIC(4,1) | No |
| `city` | VARCHAR(120) | No |
| `state_region` | VARCHAR(120) | No |
| `country_code` | CHAR(2) | No |
| `skills` | JSONB | No |
| `education` | JSONB | No |
| `profile_visibility` | ENUM | Yes |
| `created_at` | TIMESTAMPTZ | Yes |
| `updated_at` | TIMESTAMPTZ | Yes |
| `deleted_at` | TIMESTAMPTZ | No |

### Enum Values

```text
private
applications_only
searchable
```

### Unique Constraints

```text
user_id
```

### Indexes

```sql
CREATE INDEX candidate_skills_idx
ON candidate_profiles USING GIN(skills);

CREATE INDEX candidate_location_idx
ON candidate_profiles(country_code, state_region, city);

CREATE INDEX candidate_experience_idx
ON candidate_profiles(total_experience_years);
```

### Example

```json
{
  "id": "candidate-uuid",
  "userId": "candidate-user-uuid",
  "headline": "Java Full Stack Developer",
  "currentTitle": "Senior Software Engineer",
  "totalExperienceYears": 7,
  "city": "Dallas",
  "stateRegion": "Texas",
  "countryCode": "US",
  "skills": [
    "Java",
    "Spring Boot",
    "React",
    "AWS"
  ],
  "education": [
    {
      "degree": "Master's",
      "field": "Computer Science"
    }
  ],
  "profileVisibility": "searchable"
}
```

### Validation

- Experience cannot be negative.
- Country code must be valid.
- Candidate visibility rules must be enforced.
- Employers may access non-searchable candidates only through applications to their company.

---

## 12. resumes

### Purpose

Stores resume metadata. Actual files are kept in private object storage.

### Fields

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Yes |
| `candidate_profile_id` | UUID FK | Yes |
| `storage_key` | TEXT | Yes |
| `original_filename` | VARCHAR(255) | Yes |
| `mime_type` | VARCHAR(100) | Yes |
| `file_size_bytes` | BIGINT | Yes |
| `checksum` | VARCHAR(128) | Yes |
| `parsed_content` | JSONB | No |
| `scan_status` | ENUM | Yes |
| `is_primary` | BOOLEAN | Yes |
| `created_at` | TIMESTAMPTZ | Yes |
| `updated_at` | TIMESTAMPTZ | Yes |
| `deleted_at` | TIMESTAMPTZ | No |

### Enum Values

```text
pending
clean
infected
failed
```

### Unique Constraints

Only one active primary resume per candidate.

### Example

```json
{
  "id": "resume-uuid",
  "candidateProfileId": "candidate-uuid",
  "storageKey": "resumes/candidate-uuid/resume-uuid.pdf",
  "originalFilename": "Candidate_Resume.pdf",
  "mimeType": "application/pdf",
  "fileSizeBytes": 245112,
  "checksum": "sha256-value",
  "scanStatus": "clean",
  "isPrimary": true
}
```

### Validation

- Only approved MIME types are allowed.
- File size must be limited.
- File must pass malware scanning.
- Raw storage paths must not be publicly exposed.
- Resume downloads require short-lived signed URLs.

---

## 13. job_applications

### Purpose

Stores the connection between a candidate and a job.

### Fields

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Yes |
| `company_id` | UUID FK | Yes |
| `job_id` | UUID FK | Yes |
| `candidate_profile_id` | UUID FK | Yes |
| `resume_id` | UUID FK | Yes |
| `cover_letter_text` | TEXT | No |
| `cover_letter_storage_key` | TEXT | No |
| `status` | ENUM | Yes |
| `source` | ENUM | Yes |
| `applied_at` | TIMESTAMPTZ | Yes |
| `last_status_changed_at` | TIMESTAMPTZ | Yes |
| `withdrawn_at` | TIMESTAMPTZ | No |
| `rejection_reason` | TEXT | No |
| `version` | INTEGER | Yes |
| `created_at` | TIMESTAMPTZ | Yes |
| `updated_at` | TIMESTAMPTZ | Yes |
| `deleted_at` | TIMESTAMPTZ | No |

### Enum Values

```text
status:
applied
under_review
interview_scheduled
interview_completed
offered
hired
rejected
withdrawn

source:
portal
career_site
recruiter
referral
import
```

### Relationships

```text
company_id -> companies.id
job_id -> jobs.id
candidate_profile_id -> candidate_profiles.id
resume_id -> resumes.id
```

### Unique Constraints

```text
job_id + candidate_profile_id
```

### Indexes

```sql
CREATE INDEX applications_company_status_idx
ON job_applications(company_id, status);

CREATE INDEX applications_job_status_idx
ON job_applications(job_id, status);

CREATE INDEX applications_candidate_idx
ON job_applications(candidate_profile_id, applied_at DESC);
```

### Example

```json
{
  "id": "application-uuid",
  "companyId": "company-uuid",
  "jobId": "job-uuid",
  "candidateProfileId": "candidate-uuid",
  "resumeId": "resume-uuid",
  "coverLetterText": "I am interested in this position.",
  "status": "under_review",
  "source": "portal",
  "appliedAt": "2026-07-17T15:00:00Z",
  "version": 2
}
```

### Validation

- Job must be published when the candidate applies.
- Application company must match the job company.
- Resume must belong to the candidate.
- Duplicate applications are not allowed.
- Employers cannot mark a candidate as withdrawn.
- Candidates cannot mark themselves as hired or rejected.

---

## 14. application_answers

### Purpose

Stores candidate answers to application or screening questions.

### Fields

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Yes |
| `application_id` | UUID FK | Yes |
| `question_code` | VARCHAR(100) | Yes |
| `question_text_snapshot` | TEXT | Yes |
| `answer_type` | ENUM | Yes |
| `answer_value` | JSONB | Yes |
| `created_at` | TIMESTAMPTZ | Yes |
| `updated_at` | TIMESTAMPTZ | Yes |
| `deleted_at` | TIMESTAMPTZ | No |

### Enum Values

```text
text
boolean
single_choice
multiple_choice
number
date
```

### Unique Constraints

```text
application_id + question_code
```

### Example

```json
{
  "id": "answer-uuid",
  "applicationId": "application-uuid",
  "questionCode": "work_authorization",
  "questionTextSnapshot": "Are you authorized to work in the United States?",
  "answerType": "boolean",
  "answerValue": true
}
```

### Validation

- Answer value must match its type.
- Required answers cannot be missing.
- Question text should be preserved as a snapshot.

---

## 15. application_status_history

### Purpose

Stores the immutable history of application status changes.

### Fields

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Yes |
| `company_id` | UUID FK | Yes |
| `application_id` | UUID FK | Yes |
| `from_status` | ENUM | No |
| `to_status` | ENUM | Yes |
| `changed_by_user_id` | UUID FK | No |
| `change_source` | ENUM | Yes |
| `reason` | TEXT | No |
| `metadata` | JSONB | No |
| `created_at` | TIMESTAMPTZ | Yes |

### Enum Values

```text
change_source:
candidate
employer
platform_admin
system
```

### Indexes

```sql
CREATE INDEX status_history_application_idx
ON application_status_history(application_id, created_at DESC);

CREATE INDEX status_history_company_idx
ON application_status_history(company_id, created_at DESC);
```

### Example

```json
{
  "id": "status-history-uuid",
  "companyId": "company-uuid",
  "applicationId": "application-uuid",
  "fromStatus": "under_review",
  "toStatus": "interview_scheduled",
  "changedByUserId": "recruiter-user-uuid",
  "changeSource": "employer",
  "reason": "Candidate selected for technical interview",
  "createdAt": "2026-07-18T16:00:00Z"
}
```

### Validation

- Transition must be allowed by the application workflow.
- History records cannot be updated or deleted.
- Company must match the application company.

---

## 16. interviews

### Purpose

Stores interview scheduling information.

### Fields

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Yes |
| `company_id` | UUID FK | Yes |
| `application_id` | UUID FK | Yes |
| `scheduled_by_member_id` | UUID FK | Yes |
| `title` | VARCHAR(255) | Yes |
| `interview_type` | ENUM | Yes |
| `start_at` | TIMESTAMPTZ | Yes |
| `end_at` | TIMESTAMPTZ | Yes |
| `timezone` | VARCHAR(100) | Yes |
| `meeting_link` | TEXT | No |
| `location` | TEXT | No |
| `notes` | TEXT | No |
| `status` | ENUM | Yes |
| `cancellation_reason` | TEXT | No |
| `calendar_provider` | ENUM | No |
| `external_calendar_event_id` | TEXT | No |
| `version` | INTEGER | Yes |
| `created_at` | TIMESTAMPTZ | Yes |
| `updated_at` | TIMESTAMPTZ | Yes |
| `deleted_at` | TIMESTAMPTZ | No |

### Enum Values

```text
interview_type:
phone
video
onsite
technical
behavioral
panel
final

status:
scheduled
confirmed
completed
cancelled
rescheduled
no_show

calendar_provider:
google
microsoft
internal
```

### Indexes

```sql
CREATE INDEX interviews_company_time_idx
ON interviews(company_id, start_at);

CREATE INDEX interviews_application_idx
ON interviews(application_id, start_at);

CREATE INDEX interviews_status_idx
ON interviews(company_id, status);
```

### Example

```json
{
  "id": "interview-uuid",
  "companyId": "company-uuid",
  "applicationId": "application-uuid",
  "scheduledByMemberId": "member-uuid",
  "title": "Technical Interview",
  "interviewType": "video",
  "startAt": "2026-07-24T15:00:00Z",
  "endAt": "2026-07-24T16:00:00Z",
  "timezone": "America/Chicago",
  "meetingLink": "https://meet.example/abc",
  "notes": "Java and system-design discussion",
  "status": "scheduled",
  "calendarProvider": "google",
  "version": 1
}
```

### Validation

- End time must be after start time.
- Time zone must be a valid IANA time zone.
- Video interview requires a meeting link.
- Onsite interview requires a location.
- Company must match the application company.
- Cancelled interview requires a cancellation reason.

---

## 17. interview_participants

### Purpose

Stores interviewers, candidates, and observers.

### Fields

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Yes |
| `interview_id` | UUID FK | Yes |
| `participant_type` | ENUM | Yes |
| `team_member_id` | UUID FK | Conditional |
| `candidate_profile_id` | UUID FK | Conditional |
| `external_name` | VARCHAR(200) | No |
| `external_email` | VARCHAR(320) | No |
| `response_status` | ENUM | Yes |
| `created_at` | TIMESTAMPTZ | Yes |
| `updated_at` | TIMESTAMPTZ | Yes |
| `deleted_at` | TIMESTAMPTZ | No |

### Enum Values

```text
participant_type:
interviewer
candidate
observer

response_status:
pending
accepted
declined
tentative
```

### Example

```json
{
  "id": "participant-uuid",
  "interviewId": "interview-uuid",
  "participantType": "interviewer",
  "teamMemberId": "member-uuid",
  "responseStatus": "accepted"
}
```

### Validation

- Team member must belong to the interview company.
- Candidate must match the application candidate.
- Duplicate participant entries are not allowed.
- Exactly one participant identity should be present.

---

## 18. interview_feedback

### Purpose

Stores interviewer ratings and feedback.

### Fields

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Yes |
| `company_id` | UUID FK | Yes |
| `interview_id` | UUID FK | Yes |
| `interviewer_member_id` | UUID FK | Yes |
| `recommendation` | ENUM | Yes |
| `overall_rating` | NUMERIC(2,1) | No |
| `strengths` | TEXT | No |
| `concerns` | TEXT | No |
| `feedback` | TEXT | No |
| `scorecard` | JSONB | No |
| `submitted_at` | TIMESTAMPTZ | No |
| `created_at` | TIMESTAMPTZ | Yes |
| `updated_at` | TIMESTAMPTZ | Yes |
| `deleted_at` | TIMESTAMPTZ | No |

### Enum Values

```text
strong_no
no
neutral
yes
strong_yes
```

### Unique Constraints

```text
interview_id + interviewer_member_id
```

### Example

```json
{
  "id": "feedback-uuid",
  "companyId": "company-uuid",
  "interviewId": "interview-uuid",
  "interviewerMemberId": "member-uuid",
  "recommendation": "yes",
  "overallRating": 4.2,
  "strengths": "Strong Java and API design knowledge",
  "concerns": "Limited Kubernetes experience"
}
```

### Validation

- Rating must be between 1 and 5.
- Only assigned interviewers can submit feedback.
- Feedback must not be visible to the candidate.
- One feedback record is allowed per interviewer per interview.

---

## 19. message_threads

### Purpose

Groups messages between employers and candidates.

### Fields

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Yes |
| `company_id` | UUID FK | Yes |
| `application_id` | UUID FK | No |
| `candidate_profile_id` | UUID FK | Yes |
| `subject` | VARCHAR(255) | No |
| `thread_type` | ENUM | Yes |
| `status` | ENUM | Yes |
| `last_message_at` | TIMESTAMPTZ | No |
| `created_at` | TIMESTAMPTZ | Yes |
| `updated_at` | TIMESTAMPTZ | Yes |
| `deleted_at` | TIMESTAMPTZ | No |

### Enum Values

```text
thread_type:
general
application
interview
rejection
offer

status:
open
archived
closed
```

### Example

```json
{
  "id": "thread-uuid",
  "companyId": "company-uuid",
  "applicationId": "application-uuid",
  "candidateProfileId": "candidate-uuid",
  "subject": "Technical Interview",
  "threadType": "interview",
  "status": "open"
}
```

### Validation

- Application must belong to the same company.
- Candidate must match the application.
- Closed threads cannot receive messages without being reopened.

---

## 20. messages

### Purpose

Stores individual portal messages, invitations, rejection emails, and offers.

### Fields

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Yes |
| `thread_id` | UUID FK | Yes |
| `sender_user_id` | UUID FK | No |
| `sender_type` | ENUM | Yes |
| `message_type` | ENUM | Yes |
| `subject` | VARCHAR(255) | No |
| `body` | TEXT | Yes |
| `attachments` | JSONB | No |
| `delivery_status` | ENUM | Yes |
| `provider_message_id` | TEXT | No |
| `sent_at` | TIMESTAMPTZ | No |
| `delivered_at` | TIMESTAMPTZ | No |
| `read_at` | TIMESTAMPTZ | No |
| `created_at` | TIMESTAMPTZ | Yes |
| `updated_at` | TIMESTAMPTZ | Yes |
| `deleted_at` | TIMESTAMPTZ | No |

### Enum Values

```text
sender_type:
candidate
employer
system
platform_admin

message_type:
portal
email
interview_invitation
rejection
offer

delivery_status:
queued
sent
delivered
failed
read
```

### Example

```json
{
  "id": "message-uuid",
  "threadId": "thread-uuid",
  "senderUserId": "recruiter-user-uuid",
  "senderType": "employer",
  "messageType": "interview_invitation",
  "subject": "Technical Interview Invitation",
  "body": "You are invited to attend a technical interview.",
  "deliveryStatus": "queued"
}
```

### Validation

- Sender must be authorized to access the thread.
- Message content must be sanitized.
- Attachments must pass malware scanning.
- Message size must be limited.

---

## 21. notifications

### Purpose

Stores in-app, email, SMS, and push notifications.

### Fields

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Yes |
| `user_id` | UUID FK | Yes |
| `company_id` | UUID FK | No |
| `notification_type` | ENUM | Yes |
| `title` | VARCHAR(255) | Yes |
| `body` | TEXT | Yes |
| `entity_type` | VARCHAR(100) | No |
| `entity_id` | UUID | No |
| `channel` | ENUM | Yes |
| `status` | ENUM | Yes |
| `sent_at` | TIMESTAMPTZ | No |
| `read_at` | TIMESTAMPTZ | No |
| `metadata` | JSONB | No |
| `created_at` | TIMESTAMPTZ | Yes |
| `updated_at` | TIMESTAMPTZ | Yes |
| `deleted_at` | TIMESTAMPTZ | No |

### Enum Values

```text
notification_type:
new_application
interview_update
candidate_message
job_expiry
offer_update
team_invitation
billing_update

channel:
in_app
email
sms
push

status:
pending
sent
failed
read
```

### Example

```json
{
  "id": "notification-uuid",
  "userId": "recruiter-user-uuid",
  "companyId": "company-uuid",
  "notificationType": "new_application",
  "title": "New application received",
  "body": "A candidate applied for Senior Java Developer.",
  "entityType": "job_application",
  "entityId": "application-uuid",
  "channel": "in_app",
  "status": "sent"
}
```

### Validation

- User must belong to the company.
- Entity must belong to the same company.
- External delivery must respect notification preferences.

---

## 22. employer_activity_logs

### Purpose

Stores immutable audit records.

### Fields

| Field | Type | Required |
|---|---|---|
| `id` | UUID | Yes |
| `company_id` | UUID FK | No |
| `actor_user_id` | UUID FK | No |
| `actor_type` | ENUM | Yes |
| `action` | VARCHAR(150) | Yes |
| `entity_type` | VARCHAR(100) | Yes |
| `entity_id` | UUID | No |
| `request_id` | VARCHAR(100) | No |
| `ip_address` | INET | No |
| `user_agent` | TEXT | No |
| `before_data` | JSONB | No |
| `after_data` | JSONB | No |
| `metadata` | JSONB | No |
| `created_at` | TIMESTAMPTZ | Yes |

### Enum Values

```text
employer
candidate
platform_admin
system
```

### Indexes

```sql
CREATE INDEX audit_company_time_idx
ON employer_activity_logs(company_id, created_at DESC);

CREATE INDEX audit_entity_idx
ON employer_activity_logs(entity_type, entity_id, created_at DESC);

CREATE INDEX audit_actor_idx
ON employer_activity_logs(actor_user_id, created_at DESC);
```

### Example

```json
{
  "id": "audit-uuid",
  "companyId": "company-uuid",
  "actorUserId": "recruiter-user-uuid",
  "actorType": "employer",
  "action": "application.status_changed",
  "entityType": "job_application",
  "entityId": "application-uuid",
  "beforeData": {
    "status": "under_review"
  },
  "afterData": {
    "status": "interview_scheduled"
  },
  "requestId": "req-91245",
  "createdAt": "2026-07-18T16:00:00Z"
}
```

### Validation

- Records must be append-only.
- Secrets and passwords must be redacted.
- Platform-admin cross-company access must always be logged.
- Audit records must not be updated or deleted through normal APIs.

---

# Billing Tables

## plans

```text
id
name
code
description
price
currency
billing_interval
active_job_limit
team_member_limit
features JSONB
is_active
created_at
updated_at
deleted_at
```

## subscriptions

```text
id
company_id
plan_id
status
current_period_start
current_period_end
trial_ends_at
cancel_at_period_end
cancelled_at
external_customer_id
external_subscription_id
created_at
updated_at
deleted_at
```

## billing_profiles

```text
id
company_id
billing_name
billing_email
address_line1
address_line2
city
state_region
postal_code
country_code
tax_id_encrypted
payment_provider_customer_id
created_at
updated_at
deleted_at
```

## invoices

```text
id
company_id
subscription_id
invoice_number
status
subtotal
tax_amount
total_amount
currency
due_at
paid_at
invoice_storage_key
line_items JSONB
created_at
updated_at
deleted_at
```

## payments

```text
id
company_id
subscription_id
invoice_id
amount
currency
status
payment_method_type
external_payment_id
failure_code
failure_message
paid_at
created_at
updated_at
deleted_at
```

## job_offers

```text
id
company_id
application_id
created_by_member_id
status
job_title
salary_amount
salary_currency
salary_period
start_date
expiration_at
offer_letter_storage_key
terms JSONB
sent_at
viewed_at
responded_at
response_notes
created_at
updated_at
deleted_at
```

---

# Entity Relationships

```text
users
 |
 +-- 1:0..1 employer_profiles
 |
 +-- 1:0..1 candidate_profiles
 |
 +-- 1:* employer_team_members

companies
 |
 +-- 1:* company_locations
 +-- 1:* employer_team_members
 +-- 1:* roles
 +-- 1:* jobs
 +-- 1:* job_applications
 +-- 1:* interviews
 +-- 1:* message_threads
 +-- 1:* notifications
 +-- 1:* subscriptions
 +-- 1:* invoices
 +-- 1:* payments
 +-- 1:* employer_activity_logs

roles
 |
 +-- *:* permissions through role_permissions

jobs
 |
 +-- 1:* job_skills
 +-- 1:* job_applications

candidate_profiles
 |
 +-- 1:* resumes
 +-- 1:* job_applications

job_applications
 |
 +-- 1:* application_answers
 +-- 1:* application_status_history
 +-- 1:* interviews
 +-- 1:* message_threads
 +-- 1:* job_offers

interviews
 |
 +-- 1:* interview_participants
 +-- 1:* interview_feedback

message_threads
 |
 +-- 1:* messages

plans
 |
 +-- 1:* subscriptions
```

---

# Role-Based Access Control

## Company Owner

Can:

- Manage company profile
- Manage all jobs
- Manage all candidates and applications
- Manage interviews
- Manage team members
- Manage billing
- View analytics
- View audit logs
- Manage security settings

## Company Admin

Can:

- Update company profile
- Manage jobs
- Manage applicants
- Manage interviews
- Manage team members
- View analytics

Billing access can be separately enabled.

## Recruiter

Can:

- Create and manage jobs
- View candidates
- Review applications
- Change application status
- Schedule interviews
- Send messages
- Send rejection emails
- Create job offers

## Hiring Manager

Can:

- View assigned jobs
- View assigned applicants
- Participate in recruitment decisions
- Schedule or review interviews when permitted
- Submit feedback

## Interviewer

Can:

- View assigned interviews
- View limited candidate details
- Access resume when permitted
- Submit interview feedback

Cannot:

- View all company applicants
- Manage billing
- Invite team members
- Publish jobs unless separately permitted

## Billing Manager

Can:

- View and change subscription
- Manage billing profile
- View invoices
- View payment history

## Platform Administrator

Can access multiple companies only when the administrator has the required platform permission.

Every cross-company access must be audited.

---

# Permission Examples

```text
company.read
company.update
company.deactivate

team.read
team.invite
team.change_role
team.remove

jobs.create
jobs.read
jobs.update
jobs.publish
jobs.pause
jobs.close
jobs.duplicate
jobs.delete

applications.read
applications.update_status
applications.download_resume

interviews.read
interviews.schedule
interviews.update
interviews.cancel
interviews.submit_feedback

messages.read
messages.send

offers.create
offers.approve
offers.send
offers.withdraw

analytics.read

billing.read
billing.manage

audit.read
```

---

# API Endpoints

Base URL:

```text
/api/v1/employer
```

## Company

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/companies` | Create company |
| GET | `/company` | Get current company |
| PATCH | `/company` | Update company |
| POST | `/company/deactivate` | Deactivate company |
| POST | `/company/logo/upload-url` | Generate secure upload URL |
| GET | `/company/locations` | List locations |
| POST | `/company/locations` | Add location |
| PATCH | `/company/locations/{locationId}` | Update location |
| DELETE | `/company/locations/{locationId}` | Soft-delete location |

## Jobs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/jobs` | Create draft |
| GET | `/jobs` | List jobs |
| GET | `/jobs/{jobId}` | Get job |
| PATCH | `/jobs/{jobId}` | Update job |
| POST | `/jobs/{jobId}/publish` | Publish |
| POST | `/jobs/{jobId}/pause` | Pause |
| POST | `/jobs/{jobId}/resume` | Resume |
| POST | `/jobs/{jobId}/close` | Close |
| POST | `/jobs/{jobId}/duplicate` | Duplicate |
| DELETE | `/jobs/{jobId}` | Soft-delete |

## Applications

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/jobs/{jobId}/applications` | View applicants |
| GET | `/applications` | Search company applications |
| GET | `/applications/{applicationId}` | View application |
| GET | `/applications/{applicationId}/resume` | Download resume |
| PATCH | `/applications/{applicationId}/status` | Change status |
| GET | `/applications/{applicationId}/history` | View history |

## Candidates

```http
GET /api/v1/employer/candidates
```

Supported filters:

```text
skills
minimumExperience
maximumExperience
city
state
country
education
jobId
```

## Interviews

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/applications/{applicationId}/interviews` | Schedule |
| GET | `/interviews` | List interviews |
| GET | `/interviews/{interviewId}` | View interview |
| PATCH | `/interviews/{interviewId}` | Update or reschedule |
| POST | `/interviews/{interviewId}/cancel` | Cancel |
| POST | `/interviews/{interviewId}/complete` | Complete |
| POST | `/interviews/{interviewId}/feedback` | Submit feedback |

## Messages and Offers

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/message-threads` | List threads |
| POST | `/message-threads` | Create thread |
| GET | `/message-threads/{threadId}/messages` | List messages |
| POST | `/message-threads/{threadId}/messages` | Send message |
| POST | `/applications/{applicationId}/rejection` | Send rejection |
| POST | `/applications/{applicationId}/offers` | Create offer |
| POST | `/offers/{offerId}/send` | Send offer |

## Team Members

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/team-members` | List team members |
| POST | `/team-members/invitations` | Invite member |
| PATCH | `/team-members/{memberId}/role` | Change role |
| POST | `/team-members/{memberId}/suspend` | Suspend |
| DELETE | `/team-members/{memberId}` | Remove |

## Notifications and Analytics

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/notifications` | List notifications |
| PATCH | `/notifications/{notificationId}/read` | Mark read |
| POST | `/notifications/read-all` | Mark all read |
| GET | `/analytics/dashboard` | View dashboard |
| GET | `/analytics/jobs/{jobId}` | View job analytics |

## Billing

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/billing/plans` | List plans |
| GET | `/billing/subscription` | View subscription |
| POST | `/billing/subscription` | Subscribe |
| PATCH | `/billing/subscription` | Change plan |
| POST | `/billing/subscription/cancel` | Cancel plan |
| GET | `/billing/invoices` | List invoices |
| GET | `/billing/payments` | View payments |
| GET | `/billing/profile` | View billing profile |
| PATCH | `/billing/profile` | Update billing profile |

## Account Settings

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/account/settings` | View settings |
| PATCH | `/account/settings` | Update settings |
| POST | `/account/password/change` | Change password |
| POST | `/account/mfa/enable` | Enable MFA |
| POST | `/account/mfa/disable` | Disable MFA |
| GET | `/activity-logs` | View permitted audit records |

---

# Example API Payloads

## Create Job

```http
POST /api/v1/employer/jobs
```

```json
{
  "title": "Senior Java Developer",
  "employmentType": "full_time",
  "workplaceType": "hybrid",
  "locationId": "location-uuid",
  "description": "Build scalable recruitment services.",
  "responsibilities": [
    "Design REST APIs",
    "Review application code",
    "Support production deployments"
  ],
  "skills": [
    {
      "name": "Java",
      "type": "required",
      "minimumYears": 5,
      "proficiencyLevel": "advanced"
    },
    {
      "name": "Kafka",
      "type": "preferred",
      "minimumYears": 2,
      "proficiencyLevel": "intermediate"
    }
  ],
  "experienceLevel": "senior",
  "minimumExperienceYears": 5,
  "educationRequirement": "Bachelor's degree or equivalent experience",
  "salary": {
    "minimum": 120000,
    "maximum": 150000,
    "currency": "USD",
    "period": "year",
    "visible": true
  },
  "benefits": [
    "Medical insurance",
    "401(k)",
    "Paid leave"
  ],
  "applicationDeadline": "2026-08-31T23:59:59Z"
}
```

Response:

```json
{
  "data": {
    "id": "job-uuid",
    "title": "Senior Java Developer",
    "status": "draft",
    "version": 1,
    "createdAt": "2026-07-17T16:20:00Z"
  },
  "requestId": "req-918261"
}
```

## Publish Job

```http
POST /api/v1/employer/jobs/job-uuid/publish
Idempotency-Key: 91b9ad66-7775-4a10-abaa-a077a375933b
```

Request:

```json
{
  "expectedVersion": 1
}
```

Response:

```json
{
  "data": {
    "id": "job-uuid",
    "status": "published",
    "publishedAt": "2026-07-17T16:30:00Z",
    "remainingJobSlots": 8,
    "version": 2
  }
}
```

## Change Application Status

```http
PATCH /api/v1/employer/applications/application-uuid/status
```

Request:

```json
{
  "status": "interview_scheduled",
  "reason": "Candidate selected for technical interview",
  "sendNotification": true,
  "expectedVersion": 2
}
```

Response:

```json
{
  "data": {
    "id": "application-uuid",
    "previousStatus": "under_review",
    "status": "interview_scheduled",
    "changedAt": "2026-07-18T14:00:00Z",
    "version": 3
  }
}
```

## Schedule Interview

```http
POST /api/v1/employer/applications/application-uuid/interviews
```

Request:

```json
{
  "title": "Technical Interview",
  "interviewType": "video",
  "startAt": "2026-07-24T10:00:00-05:00",
  "endAt": "2026-07-24T11:00:00-05:00",
  "timezone": "America/Chicago",
  "meetingProvider": "google",
  "interviewerMemberIds": [
    "member-uuid-1",
    "member-uuid-2"
  ],
  "notes": "Focus on Java, REST APIs, and system design.",
  "sendInvitation": true
}
```

Response:

```json
{
  "data": {
    "id": "interview-uuid",
    "status": "scheduled",
    "startAt": "2026-07-24T15:00:00Z",
    "endAt": "2026-07-24T16:00:00Z",
    "timezone": "America/Chicago",
    "meetingLink": "https://meet.example/abc"
  }
}
```

---

# Job Status Workflow

```text
Draft
  |
  +--> Published
          |
          +--> Paused
          |      |
          |      +--> Published
          |
          +--> Closed
          |
          +--> Expired
```

Rules:

- New jobs start as `draft`.
- Only complete jobs can be published.
- Published jobs can be paused or closed.
- Paused jobs can be resumed.
- Jobs automatically become expired after the application deadline.
- Jobs with applications should normally be closed, not physically deleted.
- Duplicating a job creates a new draft.

---

# Application Status Workflow

```text
Applied
   |
   v
Under Review
   |
   v
Interview Scheduled
   |
   v
Interview Completed
   |
   v
Offered
   |
   v
Hired
```

Alternative terminal states:

```text
Rejected
Withdrawn
```

Allowed transitions:

| Current Status | Allowed Next Status |
|---|---|
| Applied | Under review, Rejected, Withdrawn |
| Under review | Interview scheduled, Rejected, Withdrawn |
| Interview scheduled | Interview completed, Under review, Rejected, Withdrawn |
| Interview completed | Interview scheduled, Offered, Rejected, Withdrawn |
| Offered | Hired, Rejected, Withdrawn |
| Hired | Normally terminal |
| Rejected | Reopen only with elevated permission |
| Withdrawn | Reopen only with candidate consent |

Transaction flow:

```text
Receive Status Change
        |
        v
Authorize Employer
        |
        v
Lock Application Row
        |
        v
Validate Transition
        |
        v
Update Current Status
        |
        v
Insert Status History
        |
        v
Insert Audit Log
        |
        v
Insert Notification Event
        |
        v
Commit Transaction
```

---

# Interview Workflow

```text
Employer Selects Application
        |
        v
Verify Company Ownership
        |
        v
Check Interview Permission
        |
        v
Validate Interviewers
        |
        v
Check Scheduling Conflicts
        |
        v
Create Interview
        |
        v
Create Participants
        |
        v
Create Calendar Event
        |
        v
Update Application Status
        |
        v
Create Audit and History
        |
        v
Send Invitations
```

Cancellation rules:

- Require a cancellation reason.
- Update status to `cancelled`.
- Cancel the external calendar event.
- Notify all participants.
- Do not physically delete the interview.

---

# Notification Workflow

Use the transactional outbox pattern.

```text
Business Action
        |
        v
Update Business Record
        |
        v
Insert Outbox Event
        |
        v
Commit Database Transaction
        |
        v
Notification Worker
        |
        v
Check User Preferences
        |
        +--> In-App Notification
        +--> Email
        +--> SMS
        +--> Push Notification
```

Recommended `outbox_events` fields:

```text
id
company_id
event_type
entity_type
entity_id
payload JSONB
status
retry_count
available_at
processed_at
created_at
```

Important event types:

```text
ApplicationSubmitted
ApplicationStatusChanged
InterviewScheduled
InterviewUpdated
InterviewCancelled
CandidateMessageReceived
JobExpiringSoon
JobExpired
OfferSent
TeamMemberInvited
SubscriptionPaymentFailed
```

---

# Job Posting Limit Check

```text
Employer Requests Publish
        |
        v
Load Subscription with Lock
        |
        v
Subscription Active?
        |
        v
Load Plan Limit
        |
        v
Count Published Jobs
        |
        v
Limit Available?
        |
        +--> No: Return JOB_LIMIT_REACHED
        |
        +--> Yes: Publish Job
```

Pseudo code:

```text
BEGIN TRANSACTION

Load active subscription FOR UPDATE

If no subscription:
    Return SUBSCRIPTION_REQUIRED

If subscription is not active or trialing:
    Return SUBSCRIPTION_INACTIVE

Load plan

Count active published jobs

If active job count >= plan limit:
    Return JOB_LIMIT_REACHED

Validate job completeness

Publish job
Write audit log
Create outbox event

COMMIT
```

---

# Authorization and Ownership Checks

Every employer endpoint should perform:

```text
Authentication
        |
        v
Active Company Membership
        |
        v
Required Permission
        |
        v
Company Ownership
        |
        v
Resource Assignment
        |
        v
Business Operation
```

Pseudo code:

```text
membership = findActiveCompanyMembership(userId)

if membership does not exist:
    return 403

if permission is missing:
    return 403

resource = find resource by:
    resource_id
    membership.company_id
    deleted_at is null

if resource does not exist:
    return 404

continue
```

Use `404 Not Found` instead of confirming that another company's resource exists.

---

# Soft Delete Strategy

Most business tables include:

```text
deleted_at
```

Example:

```sql
UPDATE jobs
SET deleted_at = NOW(),
    updated_at = NOW(),
    updated_by = :current_user_id
WHERE id = :job_id
  AND company_id = :company_id
  AND deleted_at IS NULL;
```

Normal queries:

```sql
WHERE deleted_at IS NULL
```

Recommended behavior:

| Record | Strategy |
|---|---|
| Company | Deactivate |
| Team member | Mark removed and revoke sessions |
| Draft job | Soft-delete |
| Published job | Close before archive |
| Application | Retain and use status |
| Interview | Cancel |
| Resume | Revoke access, purge after retention |
| Payment | Never delete through employer API |
| Invoice | Never delete through employer API |
| Audit log | Append-only |

---

# Audit Log Strategy

Audit:

- Login and failed login
- Password changes
- MFA changes
- Company updates
- Team invitations
- Team role changes
- Team removals
- Job creation
- Job publishing
- Job pause
- Job close
- Job duplication
- Resume access
- Application status changes
- Interview scheduling
- Interview cancellation
- Messages
- Rejection emails
- Offers
- Candidate exports
- Billing updates
- Platform-admin cross-company access

Never store:

- Plain passwords
- Access tokens
- Refresh tokens
- Full card numbers
- CVV
- Encryption keys
- Unredacted secrets

---

# Pagination, Filtering, and Sorting

## Cursor Pagination

```http
GET /api/v1/employer/applications?limit=25&after=encoded-cursor
```

Response:

```json
{
  "data": [],
  "page": {
    "limit": 25,
    "nextCursor": "encoded-next-cursor",
    "hasNext": true
  }
}
```

Example SQL:

```sql
SELECT *
FROM job_applications
WHERE company_id = :company_id
  AND deleted_at IS NULL
  AND (applied_at, id) < (:cursor_time, :cursor_id)
ORDER BY applied_at DESC, id DESC
LIMIT 26;
```

## Candidate Filters

```http
GET /api/v1/employer/candidates
    ?skills=Java,AWS
    &minimumExperience=5
    &location=Chicago
    &education=Masters
    &jobId=job-uuid
    &sort=-experience
    &limit=25
```

## Job Filters

```http
GET /api/v1/employer/jobs
    ?status=published,paused
    &employmentType=full_time
    &workplaceType=hybrid
    &sort=-createdAt
```

Only allow approved sort fields.

---

# Dashboard Analytics

Endpoint:

```http
GET /api/v1/employer/analytics/dashboard
```

Example response:

```json
{
  "data": {
    "activeJobs": 12,
    "totalApplications": 840,
    "shortlistedCandidates": 93,
    "interviewsScheduled": 24,
    "offersSent": 14,
    "hiresCompleted": 8,
    "conversionRates": {
      "applicationToInterview": 10.8,
      "interviewToOffer": 17.5,
      "offerToHire": 57.1
    },
    "applicationsPerJob": [
      {
        "jobId": "job-uuid",
        "jobTitle": "Senior Java Developer",
        "applications": 124
      }
    ]
  }
}
```

For larger systems use:

- Materialized views
- Daily analytics summary tables
- Event-driven counters
- Reporting database
- Data warehouse

All analytics queries must be filtered by the authorized company ID.

---

# MongoDB Design

Recommended collections:

```text
users
companies
employerProfiles
companyLocations
employerTeamMembers
roles
permissions
jobs
candidateProfiles
resumes
jobApplications
applicationStatusHistory
interviews
interviewFeedback
messageThreads
notifications
jobOffers
plans
subscriptions
billingProfiles
payments
invoices
employerActivityLogs
```

Recommended embedded data:

Inside jobs:

- Skills
- Responsibilities
- Benefits

Inside applications:

- Screening answers
- Cover letter metadata
- Current status

Inside interviews:

- Small participant lists

Keep separate:

- Messages
- Full application status history
- Audit logs
- Payments
- Invoices
- Large resume parsing output

Example MongoDB job:

```json
{
  "_id": "ObjectId(...)",
  "companyId": "ObjectId(...)",
  "createdByMemberId": "ObjectId(...)",
  "title": "Senior Java Developer",
  "employmentType": "full_time",
  "workplaceType": "hybrid",
  "location": {
    "locationId": "ObjectId(...)",
    "displayText": "Chicago, IL"
  },
  "description": "Build scalable recruitment applications.",
  "responsibilities": [
    "Design REST APIs",
    "Review code",
    "Support production"
  ],
  "skills": [
    {
      "name": "Java",
      "type": "required",
      "minimumYears": 5,
      "proficiencyLevel": "advanced"
    }
  ],
  "experienceLevel": "senior",
  "salary": {
    "minimum": "120000.00",
    "maximum": "150000.00",
    "currency": "USD",
    "period": "year",
    "visible": true
  },
  "benefits": [
    "Medical insurance",
    "401(k)",
    "Paid leave"
  ],
  "applicationDeadline": "2026-08-31T23:59:59Z",
  "status": "published",
  "version": 2,
  "createdAt": "2026-07-17T16:20:00Z",
  "updatedAt": "2026-07-17T16:30:00Z",
  "deletedAt": null
}
```

MongoDB indexes:

```javascript
db.jobs.createIndex({
  companyId: 1,
  status: 1,
  createdAt: -1
});

db.jobApplications.createIndex({
  companyId: 1,
  jobId: 1,
  status: 1,
  appliedAt: -1
});

db.jobApplications.createIndex(
  {
    jobId: 1,
    candidateProfileId: 1
  },
  {
    unique: true
  }
);

db.employerTeamMembers.createIndex(
  {
    companyId: 1,
    userId: 1
  },
  {
    unique: true
  }
);
```

Use MongoDB transactions for:

- Job publishing with plan limits
- Application status changes
- Interview scheduling
- Offer creation
- Subscription usage updates

---

# PostgreSQL Design

PostgreSQL is recommended as the system of record.

Advantages:

- Strong foreign keys
- ACID transactions
- Unique constraints
- Check constraints
- Advanced SQL reporting
- JSONB flexibility
- Row-Level Security
- Reliable billing consistency
- Strong RBAC relationships

Recommended supporting systems:

```text
PostgreSQL: Primary database
Redis: Cache and sessions
Object Storage: Logos, resumes, cover letters, offers
Message Queue: Notifications and asynchronous jobs
Search Engine: Candidate and job search
```

---

# Security Recommendations

## Authentication

- Use OAuth 2.0/OIDC or secure server-side sessions.
- Hash passwords using Argon2id or bcrypt.
- Require MFA for company owners and platform administrators.
- Rotate refresh tokens.
- Revoke sessions when a team member is removed.

## Authorization

- Enforce RBAC in the backend.
- Filter employer-owned queries by company ID.
- Use resource assignments for interviewers and hiring managers.
- Consider PostgreSQL Row-Level Security.
- Audit all cross-company platform-admin access.

## Candidate Data

- Encrypt data in transit and at rest.
- Store files in private object storage.
- Generate short-lived signed resume URLs.
- Scan uploads for malware.
- Restrict resume downloads.
- Mask contact information when permission is missing.
- Log candidate-data exports.
- Apply retention and deletion policies.
- Do not expose internal interview feedback to candidates.

## API Protection

- Use HTTPS.
- Apply rate limiting.
- Validate request bodies.
- Use parameterized SQL.
- Sanitize text and HTML.
- Use CSRF protection for cookie-based authentication.
- Restrict CORS.
- Use idempotency keys.
- Use optimistic locking with version fields.
- Do not expose sequential database IDs.

## Billing

- Never store full card numbers or CVV values.
- Use a PCI-compliant payment provider.
- Validate payment webhooks.
- Use idempotency keys for payment operations.
- Store provider references instead of sensitive payment data.

---

# Project Folder Structure

```text
src
|
+-- main
|   |
|   +-- java
|   |   |
|   |   +-- com.example.recruitment
|   |       |
|   |       +-- auth
|   |       +-- company
|   |       +-- team
|   |       +-- jobs
|   |       +-- candidates
|   |       +-- applications
|   |       +-- interviews
|   |       +-- messaging
|   |       +-- notifications
|   |       +-- analytics
|   |       +-- billing
|   |       +-- audit
|   |       +-- security
|   |       +-- config
|   |       +-- common
|   |
|   +-- resources
|       |
|       +-- application.yml
|       +-- db
|           |
|           +-- migration
|
+-- test
    |
    +-- java
```

Recommended module structure:

```text
company
|
+-- controller
+-- service
+-- repository
+-- entity
+-- dto
+-- mapper
+-- validation
+-- exception
```

---

# Complete Backend Workflow

```text
1. Employer logs in
        |
        v
2. Authentication service verifies credentials and MFA
        |
        v
3. Backend creates access token or session
        |
        v
4. Membership middleware finds employer company membership
        |
        v
5. Backend resolves company ID, role, and permissions
        |
        v
6. Employer sends an API request
        |
        v
7. Controller validates the request
        |
        v
8. Authorization service checks permission
        |
        v
9. Ownership service checks resource company
        |
        v
10. Business service validates workflow rules
        |
        v
11. Subscription service checks limits when necessary
        |
        v
12. Repository updates company-scoped records
        |
        v
13. Status history and audit records are inserted
        |
        v
14. Notification outbox event is inserted
        |
        v
15. Database transaction commits
        |
        v
16. API returns a sanitized response
        |
        v
17. Background workers send notifications
        |
        v
18. Search indexes and analytics are updated
```

---

# Final Recommendation

Use:

```text
PostgreSQL as the primary database
Redis for caching and sessions
Private object storage for documents
Message queue for asynchronous events
Search engine for candidate filtering
Spring Security for authentication and RBAC
```

This design ensures:

- Company-level data isolation
- Secure candidate-data handling
- Reliable job and application workflows
- Role-based employer access
- Subscription-limit enforcement
- Auditable employer actions
- Scalable notifications and analytics

---

# License

Internal Recruitment Portal Project

Confidential

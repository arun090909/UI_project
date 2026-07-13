# Waypoint — Employee Careers (Job Search & Apply)

The job-search side of Waypoint: browse and filter open roles, see how
your skills stack up against a posting, and apply — with the address
step of the application form prefilled from your saved profile.

This branch holds the standalone Next.js frontend for the careers
pages. Account creation and the post-signup dashboard live on the
`employee-home` branch; the employer/recruiter side lives on `main`.

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm

### 1. Clone and Setup

```bash
git clone git@github.com:arun090909/UI_project.git
cd UI_project
git checkout employee-careers
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the app

```bash
npm run dev
# open http://localhost:3000
```

### 4. Verify Setup

- **Job search:** [http://localhost:3000/careers](http://localhost:3000/careers)
- **Apply flow:** click any job → "Apply now", or go directly to
  `http://localhost:3000/careers/apply/senior-frontend-engineer`

The job search page will prompt for browser location permission on
load (used to compute real distances to each job) — you can deny it
and use the location text field instead.

## 📁 Project Structure

```
UI_project/
├── app/
│   ├── careers/
│   │   ├── page.tsx              # Job search, filters, results list + detail panel
│   │   └── apply/
│   │       └── [jobId]/
│   │           └── page.tsx      # Apply form for a single job posting
│   ├── layout.tsx                # Root layout, fonts
│   └── globals.css               # Tailwind theme tokens, dual-range slider CSS
├── components/
│   └── Navbar.tsx                # Shared top nav (shows signed-in user)
├── lib/
│   ├── mockData.ts               # Sample job postings (10) — id, location,
│   │                              #   lat/lng, postedDaysAgo, salary, skills, etc.
│   ├── profile.ts                # localStorage-backed profile store + hooks
│   └── address.ts                # US states list + ZIP↔state validation
└── public/                       # Static icons
```

## 🎯 Features

### Job Search (`/careers`)

- **Job title / role search** — free text with live autocomplete
  across ~50 common titles spanning software, healthcare, retail,
  warehouse, admin, trades, hospitality, marketing, finance, and
  support roles.
- **Location search** — type a city or ZIP, or click the pin icon to
  auto-detect your current location (Geolocation API + reverse
  geocoding via OpenStreetMap Nominatim). Detected automatically on
  page load, with the text field as a manual fallback. Once distances
  are computed from your real location, results and the job detail
  panel reflect actual miles (Haversine distance), not static mock
  values.
- **Filters, all functional against the result list:**
  - **Employment type** — single-select radio (Full-time / Contract /
    Part-time).
  - **Distance** — single-select radio (5 / 10 / 25 / 50 / 100 mi /
    Anywhere in USA), computed from your location when available.
  - **Date posted** — single-select radio (Within 24 hours / Recently
    posted / This week / No preference).
  - **Work type** — multi-select checkboxes (Onsite / Hybrid / Remote)
    — more than one can be checked at once.
  - **Salary** — dual-handle range slider ($20k–$200k+).
  - The currently selected value(s) show directly on each filter's
    button, so you can see what's active without reopening the
    dropdown. **Clear all** resets everything.
- **Results list + detail panel** — click a job on the left to see
  full details (about, requirements, your skill match against the
  posting, company info) on the right. Shows "No jobs match your
  filters" when the combination is too narrow.

### Apply (`/careers/apply/[jobId]`)

- Full job detail (facts, about, requirements, skill match, company
  info) alongside a sticky apply panel.
- **Address fields** — street, state, ZIP, prefilled from your saved
  profile (from the `employee-home` register flow) and freely
  editable; ZIP is cross-checked against the selected state.
- Phone, resume upload/replace, note to the hiring team, work
  authorization checkbox — all validated on submit with inline errors.
- Submission confirmation screen with links back to job tracking /
  Careers.

## 🔧 Development

This branch has **no backend** — job data is static (`lib/mockData.ts`)
and profile/address data comes from `localStorage` via
`lib/profile.ts`. Submitting an application doesn't persist anywhere;
it just shows the confirmation state.

```bash
# Lint
npm run lint

# Type-check
npx tsc --noEmit

# Production build
npm run build
```

### Adding mock jobs

Add an entry to the `jobs` array in `lib/mockData.ts` following the
`Job` type. Include real-ish `lat`/`lng` for the location so distance
filtering/sorting works, and `postedDaysAgo` so the Date posted filter
has something to match against.

### Shared files note

`app/layout.tsx`, `app/globals.css`, `components/Navbar.tsx`,
`lib/profile.ts`, and `lib/address.ts` are intentionally duplicated
(identical content) on `employee-home` so each branch builds and runs
independently. Keep them in sync if you change one — a merge into
`main` should not conflict on these files as long as both copies
match.

## Known limitations

- No backend/API — job listings are static mock data, applications
  aren't persisted anywhere.
- Location auto-detection depends on the browser's Geolocation API and
  a public reverse-geocoding service (Nominatim); both can fail or be
  denied, in which case the location text field still works manually.
- Only 10 sample jobs exist, all around the DFW, TX area plus a couple
  of remote postings.

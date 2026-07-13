# Waypoint — Employee Home (Create Account & Dashboard)

The employee-facing entry point for Waypoint: account creation and the
post-signup home/dashboard screen. A job seeker fills out one profile —
skills, preferred locations, salary expectations — and lands on a
dashboard that greets them and surfaces next steps.

This branch holds the standalone Next.js frontend for these two pages.
The careers/job-search side of the product lives on the
`employee-careers` branch; the employer/recruiter side lives on `main`.

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm

### 1. Clone and Setup

```bash
git clone git@github.com:arun090909/UI_project.git
cd UI_project
git checkout employee-home
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

`/` redirects straight to `/register` — there's no separate landing page
on this branch yet.

### 4. Verify Setup

- **Create account:** [http://localhost:3000/register](http://localhost:3000/register)
- **Dashboard:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## 📁 Project Structure

```
UI_project/
├── app/
│   ├── register/
│   │   └── page.tsx        # Create-account form (4 sections + validation)
│   ├── dashboard/
│   │   └── page.tsx        # Post-signup home screen
│   ├── layout.tsx          # Root layout, fonts
│   ├── page.tsx            # "/" → redirects to /register
│   └── globals.css         # Tailwind theme tokens, dual-range slider CSS
├── components/
│   └── Navbar.tsx          # Shared top nav (shows signed-in user)
├── lib/
│   ├── profile.ts          # localStorage-backed profile store + hooks
│   └── address.ts          # US states list + ZIP↔state validation
└── public/                 # Static icons
```

## 🎯 Features

### Create Account (`/register`)

- **Profile picture** — optional photo upload with initials fallback.
- **Personal info** — name, email (duplicate-account check), phone,
  password with a live strength meter (weak/medium/strong).
- **Address** — street, city, state, ZIP; ZIP is cross-checked against
  the selected state (rejects a ZIP that doesn't belong to that state).
- **Preferred locations** — type-ahead search across cities in **every
  US state** (not just one region), pick up to 3.
- **Skills** — type-ahead suggestions spanning many domains (software,
  healthcare, retail, warehouse, admin, trades, hospitality, marketing,
  finance, education). Only recognized skills from the suggestion list
  can be added — free-form junk entries are rejected with an inline
  message.
- **Interested roles** — multi-select role tags.
- **Salary range** — expected min/max annual salary; input is
  restricted to digits (no letters).
- **Employment type** — preferred work arrangement tags.

All fields are validated on submit, with inline error messages and
auto-scroll to the first error.

### Dashboard (`/dashboard`)

- **First-run banner** — shows a one-time "Congratulations, your
  account is set up" message immediately after registration, then
  reverts to the normal "Welcome back" greeting on every later visit.
- **Hero stats, about section, "Get started" shortcuts, and a recent
  activity feed** — currently static/illustrative content.

## 🔧 Development

This branch has **no backend** — profile data is stored entirely in
the browser via `localStorage` (see `lib/profile.ts`). There's nothing
to configure or seed; creating an account through the UI is the only
way to populate data, and it's local to your browser.

```bash
# Lint
npm run lint

# Type-check
npx tsc --noEmit

# Production build
npm run build
```

### Shared files note

`app/layout.tsx`, `app/globals.css`, `components/Navbar.tsx`, and
`lib/profile.ts` are intentionally duplicated (identical content) on
`employee-careers` so each branch builds and runs independently. Keep
them in sync if you change one — a merge into `main` should not
conflict on these files as long as both copies match.

## Known limitations

- No backend/API — everything is client-side and local to one browser.
- No real authentication; "sign in" isn't implemented on this branch.
- Data doesn't sync across devices or browsers.

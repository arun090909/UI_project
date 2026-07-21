# Waypoint Employer Portal Prototype

Interactive employer-facing prototype for the Waypoint employment and hiring-event platform.

## Included modules

- Employer dashboard with sample statistics and hiring guidance
- Employer profile management
- Job posting creation, search, filtering, details, editing, closing, and reopening
- Applicant lists and application-status updates within job details
- Event creation, search, status/location filtering, details, registrants, cancellation, and reopening
- Notifications with read-state handling
- Password-change prototype
- Contact Support submission and request history

## Run locally

From this directory, run:

```bash
npm start
```

Then open `http://localhost:8000`.

No package installation is required. The prototype uses browser `localStorage` for interactive sample state.

## Project files

- `index.html` — semantic page and modal markup
- `styles.css` — responsive employer portal styling
- `app.js` — sample data, validation, rendering, filtering, and interactions
- `Employer prototype.docx` — supplied prototype reference document

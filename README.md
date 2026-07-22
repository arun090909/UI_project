# Waypoint Employer Portal Prototype

This branch contains the interactive employer-facing prototype for the Waypoint employment platform.

## Features

- Employer dashboard with sample hiring statistics
- Employer profile management
- Job posting creation, search, filtering, details, editing, closing, and reopening
- Applicant lists with application-status updates
- Event creation, search, status and location filtering, event details, and registrant information
- Notifications and mark-all-read behavior
- Change-password prototype
- Contact Support requests and support history

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Browser localStorage
- Inline SVG
- Google Fonts

## Run locally

The prototype is self-contained in `index.html`.

1. Download or clone this branch.
2. Open `index.html` directly in a browser.

You can also run a local server from the project directory:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Note

This is a frontend prototype with sample data. The Spring Boot and MongoDB services described in the Waypoint system design are not connected in this branch.

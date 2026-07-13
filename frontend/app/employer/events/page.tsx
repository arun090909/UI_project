"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { DetailDialog } from "../../components/DetailDialog";
import { Field, SelectField, TextAreaField } from "../../components/FormControls";
import { PortalShell } from "../../components/PortalShell";
import { useLocalStorageState } from "../../lib/useLocalStorageState";
import { assessEventWeather } from "../../lib/weatherAssessment";
import type { WeatherInputs } from "../../lib/weatherAssessment";

const STORAGE_KEY = "waypoint.employer.scheduledEvents";

type ScheduledEvent = {
  id: string;
  title: string;
  eventType: string;
  eventMode: string;
  location: string;
  startsOn: string;
  endsOn: string;
  description: string;
  capacity?: number;
  durationHours?: number;
  weather: WeatherInputs;
  weatherSource?: string;
  attendees: Attendee[];
};

type Attendee = {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
};

export default function EventsPage() {
  const [events, setEvents] = useLocalStorageState<ScheduledEvent[]>(STORAGE_KEY, []);
  const [editingEvent, setEditingEvent] = useState<ScheduledEvent | null>(null);
  const [detailEvent, setDetailEvent] = useState<ScheduledEvent | null>(null);
  const [detail, setDetail] = useState<{
    title: string;
    subtitle?: string;
    items: { label: string; value: string | number }[];
  } | null>(null);
  const [isAllEventsOpen, setIsAllEventsOpen] = useState(false);
  const upcomingEvents = events.filter((event) => !isEndedEvent(event));

  function handleSave(event: ScheduledEvent) {
    setEvents((current) => {
      const existingIndex = current.findIndex((item) => item.id === event.id);
      if (existingIndex === -1) {
        return [normalizeEvent(event), ...current];
      }

      const next = [...current];
      next[existingIndex] = normalizeEvent(event);
      return next;
    });
    setEditingEvent(null);
  }

  function handleRegisterAttendee(eventId: string, attendee: Attendee) {
    setEvents((current) =>
      current.map((event) =>
        event.id === eventId
          ? { ...normalizeEvent(event), attendees: [...getAttendees(event), attendee] }
          : normalizeEvent(event),
      ),
    );
    setDetailEvent((current) =>
      current?.id === eventId
        ? { ...normalizeEvent(current), attendees: [...getAttendees(current), attendee] }
        : current,
    );
  }

  return (
    <PortalShell active="Events Scheduling">
      <main className="events-page">
        <section className="events-title">
          <div>
            <h1>Events</h1>
            <p>Manage and organize your scheduled hiring events.</p>
          </div>
          <button className="primary-action compact" onClick={() => setEditingEvent(createEmptyEvent())} type="button">
            Schedule Event
          </button>
        </section>

        <section className="event-panel" aria-labelledby="upcoming-events-title">
          <header>
            <h2 id="upcoming-events-title">Events List</h2>
            <button
              className="text-button"
              onClick={() => setIsAllEventsOpen(true)}
              type="button"
            >
              View All
            </button>
          </header>

          {upcomingEvents.length === 0 ? (
            <div className="empty-state">
              <strong>No upcoming events</strong>
              <small>Click Schedule Event to create one, or View All to see ended events.</small>
            </div>
          ) : (
            <div className="event-list">
              {upcomingEvents.map((event) => (
                <button
                  className="event-row clickable-row"
                  key={event.id}
                  onClick={() => setDetailEvent(event)}
                  type="button"
                >
                  <span className="mini-icon">E</span>
                  <div className="event-main">
                    <strong>{event.title}</strong>
                    <small>{event.eventType} - {event.eventMode} - {event.location}</small>
                  </div>
                <div className="event-date">
                  <strong>{formatEventDate(event)}</strong>
                    <small>{getEventStatus(event)} - {getWeatherAssessment(event).score}/100 - {getAttendees(event).length} registered</small>
                </div>
                  <span className="chevron">&gt;</span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="event-panel" aria-labelledby="management-title">
          <header>
            <h2 id="management-title">Event Management</h2>
          </header>
          <div className="management-grid">
            <button
              className="management-card"
              onClick={() => setIsAllEventsOpen(true)}
              type="button"
            >
              <span className="mini-icon">A</span>
              <strong>All Events</strong>
              <small>View scheduled events</small>
            </button>
            <button
              className="management-card"
              onClick={() =>
                setDetail({
                  title: "Event Insights",
                  subtitle: "Signals from scheduled events",
                  items: [
                    { label: "Scheduled events", value: events.length },
                    { label: "Average registration", value: events.length ? Math.round(events.reduce((sum, event) => sum + getAttendees(event).length, 0) / events.length) : 0 },
                    { label: "Largest capacity", value: Math.max(0, ...events.map((event) => event.capacity ?? 0)) },
                    { label: "Average weather score", value: events.length ? Math.round(events.reduce((sum, event) => sum + getWeatherAssessment(event).score, 0) / events.length) : 0 },
                  ],
                })
              }
              type="button"
            >
              <span className="mini-icon">I</span>
              <strong>Event Insights</strong>
              <small>Event analytics</small>
            </button>
            <button
              className="management-card"
              onClick={() =>
                setDetail({
                  title: "Manage Attendees",
                  subtitle: "Candidate registration workflow",
                  items: [
                    { label: "Registered candidates", value: events.reduce((sum, event) => sum + getAttendees(event).length, 0) },
                    { label: "Total capacity", value: events.reduce((sum, event) => sum + (event.capacity ?? 0), 0) },
                    { label: "Needs outreach", value: events.length ? "Review attendee lists" : "No events scheduled" },
                  ],
                })
              }
              type="button"
            >
              <span className="mini-icon">M</span>
              <strong>Manage Attendees</strong>
              <small>Track registration</small>
            </button>
          </div>
        </section>

        <button
          className="help-strip clickable-row"
          onClick={() =>
            setDetail({
              title: "Need Help?",
              subtitle: "Employer support",
              items: [
                { label: "Help center", value: "Employer event scheduling guide" },
                { label: "Support channel", value: "support@waypoint.local" },
                { label: "Common request", value: "Import attendee lists from events" },
              ],
            })
          }
          type="button"
        >
          <span className="mini-icon">?</span>
          <div>
            <strong>Need Help?</strong>
            <small>Visit our Help Center</small>
          </div>
        </button>
      </main>

      {editingEvent ? (
        <EventModal
          initialEvent={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleSave}
        />
      ) : null}
      {detailEvent ? (
        <EventDetailDialog
          event={detailEvent}
          onClose={() => setDetailEvent(null)}
          onRegister={handleRegisterAttendee}
          onEdit={() => {
            setEditingEvent(detailEvent);
            setDetailEvent(null);
          }}
        />
      ) : null}
      {isAllEventsOpen ? (
        <AllEventsDialog
          events={events}
          onClose={() => setIsAllEventsOpen(false)}
          onSelect={(event) => {
            setDetailEvent(event);
            setIsAllEventsOpen(false);
          }}
        />
      ) : null}
      {detail ? <DetailDialog {...detail} onClose={() => setDetail(null)} /> : null}
    </PortalShell>
  );
}

function AllEventsDialog({
  events,
  onClose,
  onSelect,
}: {
  events: ScheduledEvent[];
  onClose: () => void;
  onSelect: (event: ScheduledEvent) => void;
}) {
  return (
    <div className="modal-backdrop detail-backdrop" role="presentation">
      <section className="modal-card all-events-card" role="dialog" aria-modal="true" aria-labelledby="all-events-title">
        <header>
          <div>
            <h2 id="all-events-title">All Events</h2>
            <p>Upcoming and ended events</p>
          </div>
          <button className="ghost-button" onClick={onClose} type="button" aria-label="Close all events">x</button>
        </header>
        {events.length === 0 ? (
          <div className="empty-state all-events-empty">
            <strong>No events scheduled</strong>
            <small>Schedule an event to see it in this list.</small>
          </div>
        ) : (
          <div className="all-events-list">
            {events.map((event) => (
              <button className="all-event-row" key={event.id} onClick={() => onSelect(event)} type="button">
                <span className={`status-chip ${isEndedEvent(event) ? "reviewed" : "interviewing"}`}>
                  {getEventStatus(event)}
                </span>
                <div>
                  <strong>{event.title}</strong>
                  <small>{event.eventType} - {event.eventMode} - {event.location}</small>
                </div>
                <span>{getWeatherAssessment(event).score}/100 - {getAttendees(event).length} registered</span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EventDetailDialog({
  event,
  onClose,
  onEdit,
  onRegister,
}: {
  event: ScheduledEvent;
  onClose: () => void;
  onEdit: () => void;
  onRegister: (eventId: string, attendee: Attendee) => void;
}) {
  const assessment = getWeatherAssessment(event);
  const attendees = getAttendees(event);

  function handleRegisterSubmit(registerEvent: FormEvent<HTMLFormElement>) {
    registerEvent.preventDefault();

    const form = new FormData(registerEvent.currentTarget);
    const name = String(form.get("attendeeName") ?? "").trim();
    const email = String(form.get("attendeeEmail") ?? "").trim();

    if (!name || !email) {
      return;
    }

    onRegister(event.id, {
      id: crypto.randomUUID(),
      name,
      email,
      registeredAt: new Date().toLocaleDateString("en-US"),
    });
    registerEvent.currentTarget.reset();
  }

  return (
    <div className="modal-backdrop detail-backdrop" role="presentation">
      <section className="modal-card detail-card" role="dialog" aria-modal="true" aria-labelledby="event-detail-title">
        <header>
          <div>
            <h2 id="event-detail-title">{event.title}</h2>
            <p>{event.eventType} - {event.eventMode} - {event.location}</p>
          </div>
          <button className="ghost-button" onClick={onClose} type="button" aria-label="Close details">x</button>
        </header>
        <dl className="detail-list">
          {[
            { label: "Starts", value: event.startsOn },
            { label: "Ends", value: event.endsOn || event.startsOn },
            { label: "Status", value: getEventStatus(event) },
            { label: "Event Mode", value: event.eventMode },
            { label: "Suitability", value: `${assessment.score}/100 - ${assessment.status}` },
            { label: "Capacity", value: event.capacity ?? "Not provided" },
              { label: "Duration", value: event.durationHours ? `${event.durationHours} hours` : "Not provided" },
            { label: "Weather Source", value: event.weatherSource ?? "Google weather not fetched" },
            { label: "Registered", value: attendees.length },
            { label: "Description", value: event.description || "Not provided" },
          ].map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
        <section className="weather-panel" aria-label="Weather recommendation">
          <header>
            <h3>Weather Recommendation</h3>
            <span className={`weather-badge ${getWeatherBadgeClass(assessment.status)}`}>{assessment.status}</span>
          </header>
          <div className="weather-score">
            <strong>{assessment.score}</strong>
            <span>Event suitability score</span>
          </div>
          <div className="weather-columns">
            <div>
              <h4>Reasoning</h4>
              <ul>
                {assessment.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Precautions</h4>
              <ul>
                {assessment.precautions.map((precaution) => (
                  <li key={precaution}>{precaution}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section className="attendee-panel" aria-label="Registered attendees">
          <header>
            <h3>Registered attendees</h3>
            <span className="attendee-count">{attendees.length}</span>
          </header>
          <form className="attendee-form" onSubmit={handleRegisterSubmit}>
            <input name="attendeeName" placeholder="Attendee name" required />
            <input name="attendeeEmail" placeholder="Email address" required type="email" />
            <button className="secondary-action" type="submit">Register</button>
          </form>
          {attendees.length === 0 ? (
            <p className="attendee-empty">No attendees registered yet.</p>
          ) : (
            <div className="attendee-list">
              {attendees.map((attendee) => (
                <div className="attendee-row" key={attendee.id}>
                  <div>
                    <strong>{attendee.name}</strong>
                    <small>{attendee.email}</small>
                  </div>
                  <span>{attendee.registeredAt}</span>
                </div>
              ))}
            </div>
          )}
        </section>
        <footer className="detail-actions">
          <button className="secondary-action" onClick={onEdit} type="button">Edit event</button>
        </footer>
      </section>
    </div>
  );
}

function EventModal({
  initialEvent,
  onClose,
  onSave,
}: {
  initialEvent: ScheduledEvent;
  onClose: () => void;
  onSave: (event: ScheduledEvent) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isEditingExisting = Boolean(initialEvent.startsOn);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const location = String(form.get("location") ?? "").trim();
    const requiredFields = [
      ["Event title", String(form.get("title") ?? "")],
      ["Event type", String(form.get("eventType") ?? "")],
      ["Event mode", String(form.get("eventMode") ?? "")],
      ["Location", location],
      ["Start date", String(form.get("startsOn") ?? "")],
    ];
    const missingField = requiredFields.find(([, value]) => !value.trim());

    if (missingField) {
      setError(`${missingField[0]} is required.`);
      setIsSubmitting(false);
      return;
    }

    const weatherLookup = await fetchGoogleWeatherForEvent(location);

    onSave({
      ...initialEvent,
      title: String(form.get("title") ?? "").trim(),
      eventType: String(form.get("eventType") ?? "").trim(),
      eventMode: String(form.get("eventMode") ?? "").trim(),
      location,
      startsOn: String(form.get("startsOn") ?? ""),
      endsOn: String(form.get("endsOn") ?? ""),
      capacity: parseOptionalNumber(form.get("capacity")),
      durationHours: parseOptionalNumber(form.get("durationHours")),
      description: String(form.get("description") ?? ""),
      weather: weatherLookup.weather,
      weatherSource: weatherLookup.source,
      attendees: getAttendees(initialEvent),
    });

    if (weatherLookup.error) {
      setError(weatherLookup.error);
    }

    setIsSubmitting(false);
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="event-modal-title">
        <header>
          <h2 id="event-modal-title">{isEditingExisting ? "Edit Event" : "Schedule Event"}</h2>
          <button className="ghost-button" onClick={onClose} type="button" aria-label="Close modal">x</button>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <Field label="Event title *" name="title" placeholder="e.g. Tech Career Fair" required defaultValue={initialEvent.title} />
            <SelectField label="Event type *" name="eventType" required defaultValue={initialEvent.eventType}>
              <option value="">Select event type</option>
              <option>Career Fair</option>
              <option>Info Session</option>
              <option>Recruitment Drive</option>
              <option>Networking Event</option>
            </SelectField>
            <SelectField label="Event Mode *" name="eventMode" required defaultValue={initialEvent.eventMode}>
              <option value="">Select event mode</option>
              <option>In person</option>
              <option>Virtual</option>
            </SelectField>
            <Field label="Location *" name="location" placeholder="e.g. Irving Campus" required defaultValue={initialEvent.location} />
            <Field label="Capacity" name="capacity" placeholder="e.g. 100" defaultValue={initialEvent.capacity ?? ""} />
            <Field label="Duration hours" name="durationHours" placeholder="e.g. 4" defaultValue={initialEvent.durationHours ?? ""} />
            <Field label="Start date *" name="startsOn" type="date" required defaultValue={initialEvent.startsOn} />
            <Field label="End date" name="endsOn" type="date" defaultValue={initialEvent.endsOn} />
          </div>
          <TextAreaField
            label="Description"
            name="description"
            placeholder="Describe the event purpose, audience, and agenda."
            defaultValue={initialEvent.description}
          />
          <div className="weather-autofetch-note">
            <strong>Google weather will be fetched automatically</strong>
            <span>Weather and AQI are pulled from Google using the event location when you save.</span>
          </div>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <footer className="modal-actions">
            <button className="ghost-button" onClick={onClose} type="button">Cancel</button>
            <button className="primary-action compact" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Saving..." : isEditingExisting ? "Save changes" : "Schedule event"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function createEmptyEvent(): ScheduledEvent {
  return {
    id: crypto.randomUUID(),
    title: "",
    eventType: "",
    eventMode: "",
    location: "",
    startsOn: "",
    endsOn: "",
    description: "",
    durationHours: undefined,
    weather: {},
    weatherSource: undefined,
    attendees: [],
  };
}

function formatEventDate(event: ScheduledEvent) {
  if (!event.endsOn || event.endsOn === event.startsOn) {
    return event.startsOn;
  }

  return `${event.startsOn} - ${event.endsOn}`;
}

function getEventStatus(event: ScheduledEvent) {
  return isEndedEvent(event) ? "Ended" : "Upcoming";
}

function isEndedEvent(event: ScheduledEvent) {
  const eventEndDate = event.endsOn || event.startsOn;
  if (!eventEndDate) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${eventEndDate}T00:00:00`) < today;
}

function parseOptionalNumber(value: FormDataEntryValue | null) {
  const cleaned = String(value ?? "").replace(/[$,]/g, "").trim();
  return cleaned ? Number(cleaned) : undefined;
}

function getWeatherAssessment(event: ScheduledEvent) {
  return assessEventWeather(event.weather ?? {}, {
    eventType: event.eventType,
    eventMode: event.eventMode,
    capacity: event.capacity,
    durationHours: event.durationHours,
  });
}

async function fetchGoogleWeatherForEvent(location: string): Promise<{
  weather: WeatherInputs;
  source?: string;
  error?: string;
}> {
  try {
    const response = await fetch("/api/google-weather", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ location }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      return {
        weather: {},
        source: "Google weather unavailable",
        error: error?.message ?? "Unable to fetch Google weather. Configure GOOGLE_MAPS_API_KEY and try again.",
      };
    }

    const data = (await response.json()) as { weather: WeatherInputs; source: string };
    return {
      weather: data.weather,
      source: data.source,
    };
  } catch {
    return {
      weather: {},
      source: "Google weather unavailable",
      error: "Unable to reach Google weather service from the local app.",
    };
  }
}

function getWeatherBadgeClass(status: ReturnType<typeof getWeatherAssessment>["status"]) {
  if (status === "Cancel") return "cancel";
  if (status === "Move Indoors/Postpone") return "move";
  if (status === "Host with Precautions") return "caution";
  return "safe";
}

function normalizeEvent(event: ScheduledEvent): ScheduledEvent {
  return {
    ...event,
    weather: event.weather ?? {},
    attendees: getAttendees(event),
  };
}

function getAttendees(event: Partial<ScheduledEvent>): Attendee[] {
  return Array.isArray(event.attendees) ? event.attendees : [];
}

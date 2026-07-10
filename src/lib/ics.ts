import { Event } from '@/types';

function parseEventDateTime(dateStr: string, timePart: string, year = 2026): Date {
  const monthDay = dateStr.split(', ')[1] ?? dateStr;
  return new Date(`${monthDay} ${year} ${timePart}`);
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function toICSDate(d: Date) {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function escapeICSText(text: string) {
  return text.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
}

export function downloadEventICS(event: Event) {
  const [startTime, endTime] = event.time.split('–').map((s) => s.trim());
  const start = parseEventDateTime(event.date, startTime);
  const end = endTime ? parseEventDateTime(event.date, endTime) : new Date(start.getTime() + 60 * 60 * 1000);
  const now = new Date();

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Waypoint//Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@waypoint.app`,
    `DTSTAMP:${toICSDate(now)}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${escapeICSText(event.title)}`,
    `DESCRIPTION:${escapeICSText(`Hosted by ${event.host}. ${event.about}`)}`,
    `LOCATION:${escapeICSText(event.venue ?? 'Virtual')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import { mockEvents } from '@/data/mock';
import { Event } from '@/types';
import { useEvents } from '@/context/EventsContext';
import { downloadEventICS } from '@/lib/ics';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/Toast';

type DateFilter = 'any' | 'week' | 'month';
type FormatFilter = 'any' | 'in-person' | 'virtual';
type DistanceFilter = '5' | '10' | '25' | '50' | 'any';

// Mock "today" anchor — the event dataset is written relative to this date.
const TODAY = new Date('2026-07-10');

function daysUntil(dateStr: string): number {
  const monthDay = dateStr.split(', ')[1] ?? dateStr;
  const eventDate = new Date(`${monthDay} 2026`);
  return Math.round((eventDate.getTime() - TODAY.getTime()) / 86400000);
}

export default function EventsPage() {
  const [selectedId, setSelectedId] = useState(mockEvents[0].id);
  const [searchText, setSearchText] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('any');
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>('10');
  const [formatFilter, setFormatFilter] = useState<FormatFilter>('any');
  const [typeFilters, setTypeFilters] = useState<string[]>([]);

  const EVENT_TYPES = ['Career fair', 'Info session', 'Meetup', 'Webinar'];

  function toggleType(t: string) {
    setTypeFilters((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  }

  const filtered = mockEvents.filter((ev) => {
    if (searchText && !ev.title.toLowerCase().includes(searchText.toLowerCase())) return false;
    if (formatFilter !== 'any' && ev.format !== formatFilter) return false;
    if (typeFilters.length > 0 && !typeFilters.includes(ev.type)) return false;

    if (cityQuery.trim()) {
      const locationText = ev.venue ?? 'Virtual';
      if (!locationText.toLowerCase().includes(cityQuery.trim().toLowerCase())) return false;
    }

    if (distanceFilter !== 'any' && ev.distance) {
      const miles = parseFloat(ev.distance);
      if (miles > Number(distanceFilter)) return false;
    }

    if (dateFilter !== 'any') {
      const diff = daysUntil(ev.date);
      if (dateFilter === 'week' && (diff < 0 || diff > 7)) return false;
      if (dateFilter === 'month' && (diff < 0 || diff > 31)) return false;
    }

    return true;
  });

  const selected = mockEvents.find((e) => e.id === selectedId) ?? mockEvents[0];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      <TopNav />

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '36px 44px 64px' }}>
        <div style={{ marginBottom: 22 }}>
          <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 500, fontSize: 26, margin: '0 0 4px', letterSpacing: '-0.01em' }}>Events near you</h1>
          <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: 0 }}>Career fairs, info sessions, and meetups matched to your skills</p>
        </div>

        {/* Search bar */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, padding: '22px 24px', marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 260px auto', alignItems: 'center', border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden', background: 'var(--surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
              <input type="text" placeholder="Event name or keyword" value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-inter), sans-serif', fontSize: 14, color: 'var(--ink)', width: '100%' }} />
            </div>
            <div style={{ background: 'var(--line)', height: 32 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.8"><path d="M12 21s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
              <input type="text" placeholder="City or zip code" value={cityQuery} onChange={(e) => setCityQuery(e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-inter), sans-serif', fontSize: 14, color: 'var(--ink)', width: '100%' }} />
            </div>
            <button style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '0 26px', height: '100%', minHeight: 48, fontFamily: 'var(--font-inter), sans-serif', fontSize: 13.5, fontWeight: 500, cursor: 'pointer' }}>Search</button>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
            <Dropdown label="Date" active={dateFilter !== 'any'}>
              {(['any', 'week', 'month'] as DateFilter[]).map((v) => (
                <DropItem key={v} label={v === 'any' ? 'No preference' : v === 'week' ? 'This week' : 'This month'} radio selected={dateFilter === v} onSelect={() => setDateFilter(v)} />
              ))}
            </Dropdown>

            <Dropdown label="Distance" active={distanceFilter !== 'any'}>
              {([['5', 'Within 5 mi'], ['10', 'Within 10 mi'], ['25', 'Within 25 mi'], ['50', 'Within 50 mi'], ['any', 'Anywhere in USA']] as [DistanceFilter, string][]).map(([v, lbl]) => (
                <DropItem key={v} label={lbl} radio selected={distanceFilter === v} onSelect={() => setDistanceFilter(v)} />
              ))}
            </Dropdown>

            <div style={{ width: 1, height: 18, background: 'var(--line)', margin: '0 2px' }} />

            <Dropdown label="Event type" active={typeFilters.length > 0}>
              {EVENT_TYPES.map((t) => (
                <DropItem key={t} label={t} selected={typeFilters.includes(t)} onSelect={() => toggleType(t)} />
              ))}
            </Dropdown>

            <Dropdown label="Format" active={formatFilter !== 'any'}>
              {([['any', 'Any format'], ['in-person', 'In-person'], ['virtual', 'Virtual']] as [FormatFilter, string][]).map(([v, lbl]) => (
                <DropItem key={v} label={lbl} radio selected={formatFilter === v} onSelect={() => setFormatFilter(v)} />
              ))}
            </Dropdown>

            <button
              onClick={() => { setSearchText(''); setCityQuery(''); setDateFilter('any'); setDistanceFilter('10'); setFormatFilter('any'); setTypeFilters([]); }}
              style={{ fontSize: 12.5, color: 'var(--muted)', cursor: 'pointer', marginLeft: 'auto', background: 'none', border: 'none', textDecoration: 'underline', textUnderlineOffset: 2 }}
            >
              Clear all
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '22px 0 14px' }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--muted)', margin: 0 }}>Upcoming events</p>
          <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>{filtered.length} results</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '290px 1fr', border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden', background: 'var(--surface)' }}>
          {/* Tab list */}
          <div style={{ background: 'var(--paper)', borderRight: '1px solid var(--line)', padding: 10, maxHeight: 640, overflowY: 'auto' }}>
            {filtered.map((ev) => {
              const active = ev.id === selectedId;
              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedId(ev.id)}
                  style={{ padding: '12px 14px', borderRadius: 6, cursor: 'pointer', marginBottom: 2, borderLeft: `3px solid ${active ? 'var(--accent)' : 'transparent'}`, background: active ? 'var(--accent-soft)' : 'transparent' }}
                >
                  <p style={{ fontSize: 13.5, fontWeight: 600, margin: '0 0 3px', color: active ? 'var(--accent)' : 'var(--ink)' }}>{ev.title}</p>
                  <p style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                    <span style={{ fontSize: 9.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '2px 6px', borderRadius: 4, background: ev.format === 'virtual' ? 'var(--amber-soft)' : 'var(--accent-soft)', color: ev.format === 'virtual' ? 'var(--amber)' : 'var(--accent)' }}>
                      {ev.format === 'virtual' ? 'Virtual' : 'In-person'}
                    </span>
                    {ev.host} · {ev.date}{ev.distance ? ` · ${ev.distance}` : ''}
                  </p>
                </div>
              );
            })}
            {filtered.length === 0 && <p style={{ fontSize: 13, color: 'var(--muted)', padding: '16px 14px' }}>No events match your filters.</p>}
          </div>

          {/* Detail pane */}
          <EventDetail event={selected} />
        </div>
      </div>
    </div>
  );
}

function EventDetail({ event }: { event: Event }) {
  const pct = Math.round((event.capacity.filled / event.capacity.total) * 100);
  const { isRegistered, cancelRegistration } = useEvents();
  const registered = isRegistered(event.id);
  const [toast, setToast] = useToast();

  function handleCancel() {
    cancelRegistration(event.id);
    setToast(`You've cancelled your registration for "${event.title}".`);
  }

  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: 22, fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.01em' }}>{event.title}</h2>
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>Hosted by {event.host}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {registered && (
              <button style={btnStyle} onClick={() => downloadEventICS(event)}>Add to calendar</button>
            )}
            {registered ? (
              <span style={{ padding: '9px 16px', fontSize: 13, fontWeight: 500, borderRadius: 6, border: '1px solid var(--line)', color: 'var(--muted)' }}>Registered</span>
            ) : (
              <Link href={`/events/${event.id}`} style={{ padding: '9px 16px', fontFamily: 'var(--font-inter), sans-serif', fontSize: 13, fontWeight: 500, borderRadius: 6, border: '1px solid var(--accent)', background: 'var(--accent)', color: '#fff', textDecoration: 'none' }}>
                Register
              </Link>
            )}
          </div>
          <p style={{ fontSize: 11.5, color: 'var(--amber)', margin: 0, fontWeight: 500 }}>Register by {event.registerBy}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 0, margin: '20px 0 26px', flexWrap: 'wrap' }}>
        {[
          { k: 'Date & time', v: `${event.date}, ${event.time}` },
          { k: 'Register by', v: event.registerBy },
          { k: 'Format', v: event.format === 'virtual' ? 'Virtual' : 'In-person' },
          ...(event.distance ? [{ k: 'Distance', v: event.distance }] : []),
        ].map(({ k, v }, i, arr) => (
          <div key={k} style={{ paddingRight: 28, marginRight: 28, borderRight: i < arr.length - 1 ? '1px solid var(--line)' : 'none' }}>
            <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 5px' }}>{k}</p>
            <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 14, fontWeight: 500, margin: 0 }}>{v}</p>
          </div>
        ))}
        <div>
          <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 5px' }}>Capacity</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 70, height: 5, background: 'var(--line)', borderRadius: 3, overflow: 'hidden', flexShrink: 0 }}>
              <div style={{ height: '100%', background: 'var(--accent)', width: `${pct}%` }} />
            </div>
            <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 12, color: 'var(--ink-soft)' }}>{event.capacity.filled} / {event.capacity.total}</span>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>About this event</p>
      <p style={{ fontSize: 14.5, lineHeight: 1.75, color: 'var(--ink-soft)', maxWidth: 620 }}>{event.about}</p>

      {registered && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: 'var(--accent-soft)', color: 'var(--accent)', borderRadius: 8, padding: '12px 16px', fontSize: 13, fontWeight: 500, marginTop: 22 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
            <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" />
          </svg>
          You're registered for this event
          <button onClick={handleCancel} style={{ marginLeft: 10, fontSize: 12, fontWeight: 500, color: 'var(--ink-soft)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Cancel registration</button>
        </div>
      )}
      <Toast message={toast} />
    </div>
  );
}

function Dropdown({ label, active, children }: { label: string; active: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: `1px solid ${active ? 'var(--accent)' : 'var(--line)'}`, borderRadius: 20, fontSize: 12.5, fontWeight: 500, color: active ? 'var(--accent)' : 'var(--ink-soft)', background: active ? 'var(--accent-soft)' : 'var(--surface)', cursor: 'pointer' }}
      >
        {label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, boxShadow: '0 12px 28px rgba(23,27,30,0.1)', padding: 8, minWidth: 180, zIndex: 10 }}>
          {children}
        </div>
      )}
    </div>
  );
}

function DropItem({ label, selected, onSelect, radio }: { label: string; selected: boolean; onSelect: () => void; radio?: boolean }) {
  return (
    <div onClick={onSelect} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 6, fontSize: 13, color: selected ? 'var(--ink)' : 'var(--ink-soft)', cursor: 'pointer', background: 'transparent' }}>
      <div style={{ width: 15, height: 15, border: `1.5px solid ${selected ? 'var(--accent)' : 'var(--line)'}`, borderRadius: radio ? '50%' : 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: selected ? 'var(--accent)' : 'transparent' }}>
        {selected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>}
      </div>
      {label}
    </div>
  );
}

const btnStyle: React.CSSProperties = { fontFamily: 'var(--font-inter), sans-serif', fontSize: 13, fontWeight: 500, padding: '9px 16px', borderRadius: 6, border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink)', cursor: 'pointer' };

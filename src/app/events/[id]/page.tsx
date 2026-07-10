'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TopNav from '@/components/TopNav';
import { mockEvents, mockUser } from '@/data/mock';
import { useEvents } from '@/context/EventsContext';
import { downloadEventICS } from '@/lib/ics';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/Toast';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const event = mockEvents.find((e) => e.id === id);
  if (!event) notFound();

  const { isRegistered, register, cancelRegistration } = useEvents();
  const registered = isRegistered(event!.id);
  const [toast, setToast] = useToast();

  const [phone, setPhone] = useState('');
  const [shareResume, setShareResume] = useState(true);
  const [confirmElig, setConfirmElig] = useState(false);
  const [phoneErr, setPhoneErr] = useState(false);
  const [eligErr, setEligErr] = useState(false);

  function handleRegister() {
    const pOk = phone.trim().length >= 7;
    setPhoneErr(!pOk);
    setEligErr(!confirmElig);
    if (pOk && confirmElig) register(event!.id);
  }

  function handleCancel() {
    cancelRegistration(event!.id);
    setToast(`You've cancelled your registration for "${event!.title}".`);
  }

  const pct = Math.round((event.capacity.filled / event.capacity.total) * 100);
  const spotsLeft = event.capacity.total - event.capacity.filled;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      <TopNav />

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '28px 44px 64px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--muted)', marginBottom: 20 }}>
          <Link href="/events" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Events</Link>
          <span>/</span>
          <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{event.title}</span>
        </div>

        {/* Page head */}
        <div style={{ marginBottom: 24 }}>
          <span style={{ display: 'inline-block', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--accent)', background: 'var(--accent-soft)', borderRadius: 10, padding: '3px 9px', marginBottom: 10 }}>
            {event.format === 'virtual' ? 'Virtual' : 'In-person'} · {event.type}
          </span>
          <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 500, fontSize: 28, margin: 0, letterSpacing: '-0.01em' }}>{event.title}</h1>
          <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '6px 0 0' }}>Hosted by {event.host}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, alignItems: 'start' }}>

          {/* Main column */}
          <div>
            {/* Facts card */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', gap: 36, flexWrap: 'wrap' }}>
                {[
                  { k: 'Date', v: event.date },
                  { k: 'Time', v: event.time },
                  { k: 'Register by', v: event.registerBy },
                  ...(event.distance ? [{ k: 'Distance', v: event.distance }] : []),
                ].map(({ k, v }) => (
                  <div key={k}>
                    <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 4px' }}>{k}</p>
                    <p style={{ fontSize: 13.5, fontWeight: 500, margin: 0 }}>{v}</p>
                  </div>
                ))}
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 4px' }}>Capacity</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{ width: 80, height: 5, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 3, overflow: 'hidden', flexShrink: 0 }}>
                      <div style={{ height: '100%', background: 'var(--accent)', width: `${pct}%` }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 12, color: 'var(--ink-soft)' }}>{event.capacity.filled} / {event.capacity.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div style={cardStyle}>
              <p style={eyebrowStyle}>About this event</p>
              <p style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--ink-soft)', margin: 0 }}>{event.about}</p>
            </div>

            {/* Agenda */}
            <div style={cardStyle}>
              <p style={eyebrowStyle}>Agenda</p>
              <div>
                {event.agenda.map(({ time, title, detail }, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '86px 14px 1fr', gap: '0 14px', paddingBottom: i < event.agenda.length - 1 ? 20 : 0 }}>
                    <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 12, color: 'var(--ink-soft)', paddingTop: 1, textAlign: 'right', margin: 0 }}>{time}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 9, height: 9, borderRadius: '50%', border: '2px solid var(--accent)', background: 'var(--surface)', flexShrink: 0, marginTop: 3 }} />
                      {i < event.agenda.length - 1 && <div style={{ width: 1.5, flex: 1, background: 'var(--line)', marginTop: 4 }} />}
                    </div>
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 500, margin: '0 0 2px' }}>{title}</p>
                      <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: 0 }}>{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligibility */}
            <div style={cardStyle}>
              <p style={eyebrowStyle}>Eligibility</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {event.eligibility.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: 'var(--ink-soft)' }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
                    </span>
                    {item}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: '12px 0 0' }}>Checks are based on your Waypoint profile. Update your profile if something looks off.</p>
            </div>

            {/* Venue */}
            {event.venue && (
              <div style={cardStyle}>
                <p style={eyebrowStyle}>Venue</p>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: 'var(--ink-soft)', marginBottom: 14 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.8" style={{ flexShrink: 0, marginTop: 1 }}>
                    <path d="M12 21s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" />
                  </svg>
                  {event.venue}
                </div>
                {event.weatherNote && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--amber-soft)', borderRadius: 8, padding: '12px 16px' }}>
                    <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 16, color: 'var(--amber)' }}>{event.weatherTemp}</span>
                    <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', margin: 0, lineHeight: 1.5 }}>{event.weatherNote}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Registration panel */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, padding: '26px 28px', position: 'sticky', top: 84 }}>
            <h3 style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: 17, fontWeight: 500, margin: '0 0 4px' }}>Register for this event</h3>

            {registered ? (
              <>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'var(--accent-soft)', color: 'var(--accent)', borderRadius: 8, padding: '14px 16px', fontSize: 13, fontWeight: 500, lineHeight: 1.55 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                    <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" />
                  </svg>
                  <span>
                    You're registered for this event
                    <span style={{ display: 'block', fontWeight: 400, color: 'var(--ink-soft)', marginTop: 4 }}>
                      A confirmation was sent to {mockUser.email}. We'll remind you the day before.
                    </span>
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button style={btnStyle} onClick={() => downloadEventICS(event)}>Add to calendar</button>
                  <button onClick={handleCancel} style={btnStyle}>Cancel registration</button>
                </div>
              </>
            ) : (
              <>
                <p style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 500, margin: '0 0 20px' }}>Registration closes {event.registerBy}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
                  <FormField label="First name"><input style={roInputStyle} value={mockUser.firstName} readOnly /></FormField>
                  <FormField label="Last name"><input style={roInputStyle} value={mockUser.lastName} readOnly /></FormField>
                </div>
                <FormField label="Email"><input type="email" style={roInputStyle} value={mockUser.email} readOnly /></FormField>
                <FormField label="Phone" required error={phoneErr ? 'Enter a phone number for event updates.' : undefined}>
                  <input
                    type="tel"
                    placeholder={mockUser.phone}
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setPhoneErr(false); }}
                    style={{ ...inputStyle, borderColor: phoneErr ? 'var(--error)' : 'var(--line)' }}
                  />
                </FormField>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 0 2px', fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                  <input type="checkbox" id="shareResume" checked={shareResume} onChange={(e) => setShareResume(e.target.checked)} style={{ marginTop: 2, accentColor: 'var(--accent)' }} />
                  <label htmlFor="shareResume">Share my resume with the host so reviewers can prepare</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 0 2px', fontSize: 13, color: eligErr ? 'var(--error)' : 'var(--ink-soft)', lineHeight: 1.5 }}>
                  <input type="checkbox" id="confirmElig" checked={confirmElig} onChange={(e) => { setConfirmElig(e.target.checked); setEligErr(false); }} style={{ marginTop: 2, accentColor: 'var(--accent)' }} />
                  <label htmlFor="confirmElig">I confirm I meet the eligibility criteria above <span style={{ color: 'var(--error)' }}>*</span></label>
                </div>

                <button
                  onClick={handleRegister}
                  style={{ width: '100%', padding: 13, fontFamily: 'var(--font-inter), sans-serif', fontSize: 13.5, fontWeight: 500, borderRadius: 6, border: '1px solid var(--accent)', background: 'var(--accent)', color: '#fff', cursor: 'pointer', marginTop: 14 }}
                >
                  Register
                </button>
                <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', margin: '12px 0 0' }}>{spotsLeft} spots left · You can cancel anytime before {event.registerBy.split(',')[0]}</p>
              </>
            )}
          </div>
        </div>
      </div>
      <Toast message={toast} />
    </div>
  );
}

function FormField({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>
        {label} {required && <span style={{ color: 'var(--error)' }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: 11.5, color: 'var(--error)', marginTop: 5, margin: '5px 0 0' }}>{error}</p>}
    </div>
  );
}

const cardStyle: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, padding: '26px 28px', marginBottom: 18 };
const eyebrowStyle: React.CSSProperties = { fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 12px' };
const btnStyle: React.CSSProperties = { fontFamily: 'var(--font-inter), sans-serif', fontSize: 13, fontWeight: 500, padding: '9px 16px', borderRadius: 6, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', cursor: 'pointer', flex: 1 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '11px 13px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 14, fontFamily: 'var(--font-inter), sans-serif', color: 'var(--ink)', background: 'var(--surface)', outline: 'none' };
const roInputStyle: React.CSSProperties = { ...inputStyle, background: 'var(--paper)', color: 'var(--ink-soft)' };

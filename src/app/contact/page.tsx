'use client';

import { useState } from 'react';
import TopNav from '@/components/TopNav';
import { mockUser } from '@/data/mock';
import { ContactForm } from '@/types';

const TOPICS = [
  'My account or profile',
  'A job application',
  'An event or registration',
  "I'm an employer",
  'Report a problem',
  'Something else',
];

const FAQ_ITEMS = [
  {
    q: 'Why am I not seeing job matches?',
    a: 'Matches come from the skills on your resume. Upload or update your resume from your Profile page, and make sure at least three skills are listed.',
  },
  {
    q: 'How do I cancel an event registration?',
    a: "Open the event from your Profile's registered events and choose Cancel registration. You can cancel until the day before the event.",
  },
  {
    q: "Can employers see my address?",
    a: 'No. Your address is only used to calculate distance for matches and events. Employers see your name, skills, and resume only after you apply.',
  },
];

type FieldErrors = Partial<Record<keyof ContactForm, string>>;

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: mockUser.email,
    phone: '',
    topic: '',
    message: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  function set(field: keyof ContactForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const e: FieldErrors = {};
    if (!form.firstName.trim()) e.firstName = 'Enter your first name.';
    if (!form.lastName.trim()) e.lastName = 'Enter your last name.';
    if (!/@/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.topic) e.topic = 'Select a topic so we can route your message.';
    if (form.message.trim().length < 10) e.message = 'Write a short message — a sentence or two is enough.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSend() {
    if (validate()) setSent(true);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      <TopNav />

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '36px 44px 64px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 500, fontSize: 26, margin: '0 0 4px', letterSpacing: '-0.01em' }}>Contact us</h1>
          <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: 0 }}>Questions about your account, applications, or events — we usually reply within one business day.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 18, alignItems: 'start' }}>

          {/* Left column */}
          <div>
            {/* Channels card */}
            <div style={cardStyle}>
              <p style={eyebrowStyle}>Reach us directly</p>
              {[
                {
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>,
                  title: 'Email support', desc: 'Best for account and application questions.', val: 'support@waypoint.jobs', href: 'mailto:support@waypoint.jobs',
                },
                {
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" /></svg>,
                  title: 'Phone', desc: 'Mon–Fri during support hours.', val: '(469) 555-0100', href: 'tel:+14695550100',
                },
              ].map(({ icon, title, desc, val, href }) => (
                <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 500, margin: '0 0 3px' }}>{title}</p>
                    <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '0 0 4px', lineHeight: 1.5 }}>{desc}</p>
                    <a href={href} style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500, margin: 0, textDecoration: 'none' }}>{val}</a>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, paddingTop: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
                </div>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 500, margin: '0 0 3px' }}>Office</p>
                  <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>Waypoint HQ<br />5215 N O'Connor Blvd, Suite 200<br />Irving, TX 75039</p>
                </div>
              </div>
            </div>

            {/* Hours card */}
            <div style={cardStyle}>
              <p style={eyebrowStyle}>Support hours</p>
              {[
                { k: 'Monday – Friday', v: '9:00 AM – 6:00 PM' },
                { k: 'Saturday', v: '10:00 AM – 2:00 PM' },
                { k: 'Sunday', v: 'Closed' },
              ].map(({ k, v }) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
                  <span style={{ color: 'var(--muted)' }}>{k}</span>
                  <span style={{ fontWeight: 500, fontFamily: 'var(--font-mono), monospace', fontSize: 12.5 }}>{v}</span>
                </div>
              ))}
            </div>

            {/* FAQ card */}
            <div style={cardStyle}>
              <p style={eyebrowStyle}>Common questions</p>
              {FAQ_ITEMS.map(({ q, a }, i) => (
                <div key={i} style={{ borderBottom: i < FAQ_ITEMS.length - 1 ? '1px solid var(--line)' : 'none', padding: '13px 0' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'none', border: 'none', cursor: 'pointer', gap: 12, textAlign: 'left', fontSize: 13.5, fontWeight: 500, color: 'var(--ink)', padding: 0 }}
                  >
                    {q}
                    <svg style={{ flexShrink: 0, color: 'var(--muted)', transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '8px 0 0' }}>{a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div style={cardStyle}>
            <p style={eyebrowStyle}>Send us a message</p>

            {sent ? (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'var(--accent-soft)', color: 'var(--accent)', borderRadius: 8, padding: '14px 16px', fontSize: 13, fontWeight: 500, lineHeight: 1.55 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                  <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" />
                </svg>
                <span>
                  Message sent
                  <span style={{ display: 'block', fontWeight: 400, color: 'var(--ink-soft)', marginTop: 4 }}>
                    Thanks, {form.firstName} — your message is with our support team. A reply will land at {form.email} within one business day. Ticket #WP-2417.
                  </span>
                </span>
              </div>
            ) : (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                  <Field label="First name" required error={errors.firstName}>
                    <input style={inputStyle(!!errors.firstName)} value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
                  </Field>
                  <Field label="Last name" required error={errors.lastName}>
                    <input style={inputStyle(!!errors.lastName)} value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
                  </Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                  <Field label="Email" required error={errors.email}>
                    <input type="email" style={inputStyle(!!errors.email)} value={form.email} onChange={(e) => set('email', e.target.value)} />
                  </Field>
                  <Field label="Phone">
                    <input type="tel" style={inputStyle(false)} placeholder="(469) 555-0134" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                  </Field>
                </div>
                <Field label="Topic" required error={errors.topic}>
                  <select style={inputStyle(!!errors.topic)} value={form.topic} onChange={(e) => set('topic', e.target.value)}>
                    <option value="">Select a topic</option>
                    {TOPICS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Message" required error={errors.message}>
                  <textarea
                    style={{ ...inputStyle(!!errors.message), resize: 'vertical', minHeight: 130, lineHeight: 1.55 }}
                    placeholder="Tell us what's going on. If it's about a specific job or event, include its name."
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                  />
                  <p style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 5 }}>Please don't include passwords or sensitive documents here.</p>
                </Field>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
                  <button
                    onClick={handleSend}
                    style={{ padding: '12px 26px', fontFamily: 'var(--font-inter), sans-serif', fontSize: 13.5, fontWeight: 500, borderRadius: 6, border: '1px solid var(--accent)', background: 'var(--accent)', color: '#fff', cursor: 'pointer' }}
                  >
                    Send message
                  </button>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>Replies go to your email within 1 business day.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>
        {label} {required && <span style={{ color: 'var(--error)' }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: 11.5, color: 'var(--error)', marginTop: 5 }}>{error}</p>}
    </div>
  );
}

function inputStyle(invalid: boolean): React.CSSProperties {
  return {
    width: '100%', padding: '11px 13px',
    border: `1px solid ${invalid ? 'var(--error)' : 'var(--line)'}`,
    borderRadius: 6, fontSize: 14, fontFamily: 'var(--font-inter), sans-serif',
    color: 'var(--ink)', background: 'var(--surface)', outline: 'none',
  };
}

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, padding: '26px 28px', marginBottom: 16,
};
const eyebrowStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 14px',
};

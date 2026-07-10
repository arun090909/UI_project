'use client';

import { useState } from 'react';
import TopNav from '@/components/TopNav';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

export default function SettingsPage() {
  const [toast, setToast] = useToast();

  const [notifications, setNotifications] = useState({
    email: true,
    jobMatches: true,
    eventReminders: false,
  });

  function toggleNotification(key: keyof typeof notifications) {
    setNotifications((n) => ({ ...n, [key]: !n[key] }));
  }

  function saveNotifications() {
    setToast('Notification preferences saved.');
  }

  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');

  function savePassword() {
    if (!passwordForm.current || !passwordForm.next) {
      setPasswordError('Enter your current and new password.');
      return;
    }
    if (passwordForm.next.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }
    setPasswordError('');
    setPasswordForm({ current: '', next: '', confirm: '' });
    setToast('Password updated.');
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      <TopNav />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 44px 64px' }}>
        <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 500, fontSize: 24, margin: '0 0 24px', letterSpacing: '-0.01em' }}>
          Settings
        </h1>

        {/* Notifications */}
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Notifications</p>
          {[
            { key: 'email' as const, label: 'Email notifications', detail: 'Account activity, security alerts, and receipts.' },
            { key: 'jobMatches' as const, label: 'New job matches', detail: 'Get notified when a new role fits your profile.' },
            { key: 'eventReminders' as const, label: 'Event reminders', detail: 'A reminder the day before events you’ve registered for.' },
          ].map(({ key, label, detail }, i, arr) => (
            <label
              key={key}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer',
                padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none',
              }}
            >
              <input
                type="checkbox"
                checked={notifications[key]}
                onChange={() => toggleNotification(key)}
                style={{ marginTop: 2, accentColor: 'var(--accent)', width: 16, height: 16, flexShrink: 0 }}
              />
              <div>
                <p style={{ fontSize: 13.5, fontWeight: 500, margin: '0 0 2px' }}>{label}</p>
                <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>{detail}</p>
              </div>
            </label>
          ))}
          <button style={{ ...btnPrimaryStyle, marginTop: 16 }} onClick={saveNotifications}>Save preferences</button>
        </div>

        {/* Security */}
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Security</p>
          {passwordError && (
            <div style={{ background: 'var(--error-soft)', color: 'var(--error)', fontSize: 13, padding: '10px 13px', borderRadius: 6, marginBottom: 14 }}>
              {passwordError}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={fieldLabelStyle}>
              Current password
              <input
                type="password"
                style={inputStyle}
                value={passwordForm.current}
                onChange={(e) => setPasswordForm((f) => ({ ...f, current: e.target.value }))}
              />
            </label>
            <label style={fieldLabelStyle}>
              New password
              <input
                type="password"
                style={inputStyle}
                value={passwordForm.next}
                onChange={(e) => setPasswordForm((f) => ({ ...f, next: e.target.value }))}
              />
            </label>
            <label style={fieldLabelStyle}>
              Confirm new password
              <input
                type="password"
                style={inputStyle}
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm((f) => ({ ...f, confirm: e.target.value }))}
              />
            </label>
          </div>
          <button style={{ ...btnPrimaryStyle, marginTop: 16 }} onClick={savePassword}>Update password</button>
        </div>
      </div>

      <Toast message={toast} />
    </div>
  );
}

const cardStyle: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, padding: '24px 26px', marginBottom: 16 };
const eyebrowStyle: React.CSSProperties = { fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 6px' };
const btnPrimaryStyle: React.CSSProperties = { fontFamily: 'var(--font-inter), sans-serif', fontSize: 12.5, fontWeight: 500, padding: '9px 16px', borderRadius: 6, border: '1px solid var(--accent)', background: 'var(--accent)', color: '#fff', cursor: 'pointer' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 13.5, fontFamily: 'var(--font-inter), sans-serif', color: 'var(--ink)', background: 'var(--surface)', outline: 'none' };
const fieldLabelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, color: 'var(--muted)', fontWeight: 500 };

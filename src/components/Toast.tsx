'use client';

export default function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 50,
      background: 'var(--ink)', color: '#fff', padding: '12px 18px',
      borderRadius: 8, fontSize: 13.5, fontWeight: 500,
      boxShadow: '0 12px 32px rgba(23,27,30,0.25)',
      maxWidth: 320, lineHeight: 1.45,
    }}>
      {message}
    </div>
  );
}

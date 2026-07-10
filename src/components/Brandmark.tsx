import Link from 'next/link';

export default function Brandmark() {
  return (
    <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
      <svg width="20" height="20" viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
        <circle cx="10" cy="10" r="8.5" fill="none" stroke="#171B1E" strokeWidth="1.3" />
        <circle cx="10" cy="10" r="3" fill="#1D4B3D" />
      </svg>
      <span style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 500, fontSize: 19, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
        Waypoint
      </span>
    </Link>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Brandmark from './Brandmark';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { label: 'Home', href: '/home' },
  { label: 'Careers', href: '/careers' },
  { label: 'Events', href: '/events' },
  { label: 'Contact Us', href: '/contact' },
];

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    setMenuOpen(false);
    logout();
    router.push('/login');
  }

  const initials = user?.initials ?? '';

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 20,
      background: 'var(--surface)', borderBottom: '1px solid var(--line)',
      padding: '0 44px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', height: 64,
    }}>
      <Brandmark />

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {NAV_LINKS.map(({ label, href }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 14px', borderRadius: 6,
                fontSize: 13.5, fontWeight: 500,
                color: active ? 'var(--accent)' : 'var(--ink-soft)',
                background: active ? 'var(--accent-soft)' : 'transparent',
                textDecoration: 'none',
                transition: 'background .15s',
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ color: 'var(--ink-soft)', cursor: 'pointer', position: 'relative' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
            <path d="M10 21h4" />
          </svg>
          <span style={{
            position: 'absolute', top: -2, right: -2,
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--amber)', border: '1.5px solid var(--surface)',
          }} />
        </div>

        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: user?.avatarUrl ? `center/cover url(${user.avatarUrl})` : 'var(--ink)',
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 600, cursor: 'pointer',
              border: 'none', padding: 0, fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {!user?.avatarUrl && initials}
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute', top: 42, right: 0, minWidth: 200,
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: 8, boxShadow: '0 12px 32px rgba(23,27,30,0.12)',
              overflow: 'hidden', zIndex: 30,
            }}>
              {user && (
                <div style={{ padding: '12px 15px', borderBottom: '1px solid var(--line)' }}>
                  <p style={{ fontSize: 13, fontWeight: 500, margin: '0 0 2px' }}>{user.firstName} {user.lastName}</p>
                  <p style={{ fontSize: 11.5, color: 'var(--muted)', margin: 0, wordBreak: 'break-all' }}>{user.email}</p>
                </div>
              )}
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block', padding: '10px 15px', fontSize: 13,
                  color: 'var(--ink-soft)', textDecoration: 'none',
                }}
              >
                View profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block', padding: '10px 15px', fontSize: 13,
                  color: 'var(--ink-soft)', textDecoration: 'none',
                  borderTop: '1px solid var(--line)',
                }}
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '10px 15px', fontSize: 13, fontWeight: 500,
                  color: 'var(--error)', background: 'none', border: 'none',
                  borderTop: '1px solid var(--line)', cursor: 'pointer',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type Role = 'employee' | 'employer';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState<Role>('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password, role);
      router.push('/home');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--paper)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        width: '100%', maxWidth: 920, background: 'var(--surface)',
        border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(23,27,30,0.08)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 560 }}>

          {/* Left visual panel */}
          <div style={{
            background: 'var(--ink)', color: '#fff', padding: '48px 44px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: -60, bottom: -60, width: 220, height: 220, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)' }} />
            <div style={{ position: 'absolute', right: -10, bottom: -10, width: 120, height: 120, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8.5" fill="none" stroke="#fff" strokeWidth="1.3" />
                <circle cx="10" cy="10" r="3" fill="#fff" />
              </svg>
              <span style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 500, fontSize: 20, letterSpacing: '-0.01em' }}>Waypoint</span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-fraunces), serif', fontWeight: 500, fontSize: 32,
              lineHeight: 1.32, maxWidth: 340, margin: 0, letterSpacing: '-0.01em', position: 'relative', zIndex: 1,
            }}>
              The jobs and events actually worth your commute.
            </h2>

            <div style={{ display: 'flex', gap: 28, position: 'relative', zIndex: 1 }}>
              {[
                { val: '2.3 mi', lbl: 'avg. match distance' },
                { val: '92%', lbl: 'top skill fit' },
                { val: '41', lbl: 'registered this week' },
              ].map(({ val, lbl }) => (
                <div key={lbl}>
                  <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 18, color: '#fff', margin: '0 0 2px' }}>{val}</p>
                  <p style={{ fontSize: 11, color: '#8B9089', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{lbl}</p>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 12.5, color: '#B7BDB8', lineHeight: 1.6, maxWidth: 300, position: 'relative', zIndex: 1, margin: 0 }}>
              One account, two portals. Employers post once; employees see only what's relevant to their skills and their zip code.
            </p>
          </div>

          {/* Right form panel */}
          <div style={{ background: 'var(--surface)', padding: '48px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: 22, fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
              Welcome back
            </h1>
            <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: '0 0 22px' }}>Sign in to continue to your dashboard.</p>

            {/* Role tabs */}
            <div style={{
              display: 'flex', gap: 2, background: 'var(--paper)', border: '1px solid var(--line)',
              borderRadius: 7, padding: 3, width: 'fit-content', marginBottom: 24,
            }}>
              {(['employee', 'employer'] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  style={{
                    padding: '7px 18px', fontSize: 13, fontWeight: 500, borderRadius: 5,
                    cursor: 'pointer', border: 'none',
                    background: role === r ? 'var(--surface)' : 'transparent',
                    color: role === r ? 'var(--ink)' : 'var(--muted)',
                    boxShadow: role === r ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    transition: 'background .15s, color .15s',
                    textTransform: 'capitalize',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{ background: 'var(--error-soft)', color: 'var(--error)', fontSize: 13, padding: '10px 13px', borderRadius: 6, marginBottom: 14 }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--ink-soft)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={{ margin: 0 }} />
                  Remember me
                </label>
                <a href="#" style={{ fontSize: 12.5, color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: 12, fontFamily: 'var(--font-inter), sans-serif',
                  fontSize: 13.5, fontWeight: 500, borderRadius: 6,
                  border: '1px solid var(--accent)', background: 'var(--accent)',
                  color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.75 : 1, transition: 'opacity .15s',
                }}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <p style={{ fontSize: 12.5, color: 'var(--muted)', textAlign: 'center', marginTop: 18 }}>
              New here?{' '}
              <span style={{ color: 'var(--ink)', fontWeight: 500, cursor: 'pointer' }}>Create an account</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 13px', border: '1px solid var(--line)',
  borderRadius: 6, fontSize: 14, fontFamily: 'var(--font-inter), sans-serif',
  color: 'var(--ink)', background: 'var(--surface)', outline: 'none',
};

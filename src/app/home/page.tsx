import TopNav from '@/components/TopNav';
import { mockUser, mockActivity, mockStats } from '@/data/mock';

const ICON_APP = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M7 3h8l4 4v14H7z" /><path d="M7 10h10M7 14h10M7 18h6" />
  </svg>
);
const ICON_EVENT = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18" />
  </svg>
);
const ICON_PROFILE = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="3.5" /><path d="M5 20c1.5-4 4.5-6 7-6s5.5 2 7 6" />
  </svg>
);

const typeIcon: Record<string, React.ReactNode> = {
  application: ICON_APP,
  event: ICON_EVENT,
  profile: ICON_PROFILE,
};

export default function HomePage() {
  const { firstName } = mockUser;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      <TopNav />

      {/* Hero */}
      <div style={{ background: 'var(--ink)', color: '#fff', padding: '64px 48px 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -100, top: -100, width: 320, height: 320, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', right: 60, top: 60, width: 170, height: 170, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.07)' }} />
        <div style={{ maxWidth: 1180, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8FD9B8', margin: '0 0 16px' }}>
            Welcome back, {firstName}
          </p>
          <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 500, fontSize: 40, lineHeight: 1.24, maxWidth: 620, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
            The jobs and events actually worth your commute.
          </h1>
          <p style={{ fontSize: 15, color: '#C7CBC5', maxWidth: 500, lineHeight: 1.75, margin: '0 0 44px' }}>
            Waypoint matches you to roles and career events based on your skills, not just your keywords. New matches land here every week.
          </p>
          <div style={{ display: 'flex', gap: 40, borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 24, flexWrap: 'wrap' }}>
            {[
              { val: '1,200+', lbl: 'employers on Waypoint' },
              { val: '18,400', lbl: 'roles posted this year' },
              { val: '92%', lbl: 'top match accuracy' },
            ].map(({ val, lbl }) => (
              <div key={lbl}>
                <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 20, color: '#fff', margin: '0 0 3px' }}>{val}</p>
                <p style={{ fontSize: 11.5, color: '#8B9089', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 44px' }}>

        {/* About */}
        <section style={{ padding: '52px 0', borderBottom: '1px solid var(--line)' }}>
          <p style={eyebrowStyle}>About Waypoint</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56, alignItems: 'start' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: 26, fontWeight: 500, margin: '0 0 16px', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                Built to shorten the distance between good people and good jobs.
              </h2>
              <p style={bodyStyle}>Waypoint started with a simple observation: most job boards optimize for volume, not fit. So we built a platform that ranks opportunities by real skill match and real distance — not just keyword overlap — and pairs it with local hiring events so a first conversation doesn't have to wait on a resume.</p>
              <p style={bodyStyle}>Employers post once and reach candidates who are actually qualified and actually nearby. Job seekers see fewer, better matches instead of an endless scroll.</p>
              <p style={bodyStyle}>Founded in 2024, Waypoint now works with companies ranging from early-stage startups to established manufacturers, connecting them with talent through both online matching and in-person hiring events.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { title: 'Local-first matching', desc: 'Ranked by real commute distance, not just city name.' },
                { title: 'Verified employers', desc: 'Every company on Waypoint is reviewed before posting.' },
                { title: 'In-person events', desc: 'Career fairs and info sessions, not just online listings.' },
                { title: 'Skill-based ranking', desc: 'Matches improve as your profile and applications grow.' },
              ].map(({ title, desc }) => (
                <div key={title} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, padding: '18px 20px' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 7, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>
                  </div>
                  <h4 style={{ fontSize: 13.5, fontWeight: 600, margin: '0 0 5px' }}>{title}</h4>
                  <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section style={{ padding: '52px 0', borderBottom: '1px solid var(--line)' }}>
          <p style={eyebrowStyle}>Get started</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              { title: 'Browse careers', desc: "Search open roles and events by title, distance, and job type.", go: 'Explore', href: '/careers' },
              { title: 'Track applications', desc: "See status updates on every role you've applied to, in one place.", go: 'View applications', href: '/profile' },
              { title: 'Complete your profile', desc: 'Add skills and a resume so matches get sharper over time.', go: 'Edit profile', href: '/profile' },
            ].map(({ title, desc, go }) => (
              <div key={title} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, padding: 24, cursor: 'pointer' }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 3h8l4 4v14H7z" /><path d="M7 10h10M7 14h10M7 18h6" /></svg>
                </div>
                <h3 style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: 17, fontWeight: 500, margin: '0 0 7px', letterSpacing: '-0.01em' }}>{title}</h3>
                <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 14px' }}>{desc}</p>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--accent)' }}>{go} →</span>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section style={{ padding: '52px 0', borderBottom: '1px solid var(--line)' }}>
          <p style={eyebrowStyle}>How Waypoint works</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
            {[
              { n: '1', title: 'Tell us your skills', body: 'Add your skills and resume once — no separate application for every role.' },
              { n: '2', title: 'Get ranked matches', body: 'We surface roles and events by fit and by distance from your zip code.' },
              { n: '3', title: 'Apply or show up', body: 'Apply in a click, or register for a nearby event to meet employers directly.' },
            ].map(({ n, title, body }) => (
              <div key={n} style={{ paddingRight: 24 }}>
                <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 12, color: 'var(--accent)', background: 'var(--accent-soft)', width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  {n}
                </div>
                <h4 style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: 15.5, fontWeight: 500, margin: '0 0 6px' }}>{title}</h4>
                <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.65, margin: 0, maxWidth: 280 }}>{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Activity */}
        <section style={{ padding: '52px 0' }}>
          <p style={eyebrowStyle}>Your activity</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { val: mockStats.newMatchesThisWeek, lbl: 'new matches this week' },
              { val: mockStats.applicationsInReview, lbl: 'applications in review' },
              { val: mockStats.upcomingEventsNearby, lbl: 'upcoming events nearby' },
            ].map(({ val, lbl }) => (
              <div key={lbl} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, padding: '18px 20px' }}>
                <p style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: 24, fontWeight: 500, margin: '0 0 3px' }}>{val}</p>
                <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{lbl}</p>
              </div>
            ))}
          </div>
          <div style={{ border: '1px solid var(--line)', borderRadius: 10, background: 'var(--surface)', overflow: 'hidden' }}>
            {mockActivity.map((item, i) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: i < mockActivity.length - 1 ? '1px solid var(--line)' : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--paper)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--ink-soft)' }}>
                  {typeIcon[item.type]}
                </div>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 600, margin: 0 }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0' }}>{item.meta}</p>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono), monospace' }}>{item.date}</span>
              </div>
            ))}
          </div>
        </section>

        <div style={{ padding: '28px 0', textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
          © 2026 Waypoint. Built for job seekers and employers in DFW.
        </div>
      </div>
    </div>
  );
}

const eyebrowStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 14px',
};
const bodyStyle: React.CSSProperties = {
  fontSize: 14.5, lineHeight: 1.8, color: 'var(--ink-soft)', margin: '0 0 16px',
};

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopNav from '@/components/TopNav';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventsContext';
import { useJobs } from '@/context/JobsContext';
import { mockEvents, mockSkills, mockInterestedRoles, mockPreferences } from '@/data/mock';
import { Job } from '@/types';

const TRACK_LABELS = ['Applied', 'In review', 'Shortlisted', 'Decision'];

const STATUS_BADGE: Record<Job['status'], { label: string; bg: string; color: string }> = {
  applied: { label: 'Applied', bg: 'var(--paper)', color: 'var(--ink-soft)' },
  review: { label: 'In review', bg: 'var(--amber-soft)', color: 'var(--amber)' },
  shortlisted: { label: 'Shortlisted', bg: 'var(--accent-soft)', color: 'var(--accent)' },
  rejected: { label: 'Not selected', bg: 'var(--error-soft)', color: 'var(--error)' },
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const { isRegistered } = useEvents();
  const { appliedJobs } = useJobs();

  // Resume
  const [resumeName, setResumeName] = useState('jordan_torres_resume.pdf');
  const [resumeDate, setResumeDate] = useState('Uploaded Jul 6, 2026 · 182 KB');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setResumeFile(f);
    setResumeName(f.name);
    setResumeDate(`Uploaded just now · ${Math.max(1, Math.round(f.size / 1024))} KB`);
  }

  function handleDownload() {
    if (!resumeFile) {
      alert('This is a sample file. Upload your own resume to enable downloading it.');
      return;
    }
    const url = URL.createObjectURL(resumeFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = resumeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Edit profile (hero)
  const [heroEditing, setHeroEditing] = useState(false);
  const [heroForm, setHeroForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    location: user?.location ?? '',
    avatarUrl: user?.avatarUrl,
  });

  function startHeroEdit() {
    setHeroForm({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      location: user?.location ?? '',
      avatarUrl: user?.avatarUrl,
    });
    setHeroEditing(true);
  }

  function saveHeroEdit() {
    updateUser(heroForm);
    setHeroEditing(false);
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setHeroForm((h) => ({ ...h, avatarUrl: reader.result as string }));
    reader.readAsDataURL(f);
  }

  // Skills
  const [skills, setSkills] = useState<string[]>(mockSkills);
  const [skillsEditing, setSkillsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  function addSkill() {
    const v = newSkill.trim();
    if (v && !skills.includes(v)) setSkills((s) => [...s, v]);
    setNewSkill('');
  }

  function removeSkill(s: string) {
    setSkills((prev) => prev.filter((x) => x !== s));
  }

  // Interested roles
  const [roles, setRoles] = useState<string[]>(mockInterestedRoles);
  const [rolesEditing, setRolesEditing] = useState(false);
  const [newRole, setNewRole] = useState('');

  function addRole() {
    const v = newRole.trim();
    if (v && !roles.includes(v)) setRoles((r) => [...r, v]);
    setNewRole('');
  }

  function removeRole(r: string) {
    setRoles((prev) => prev.filter((x) => x !== r));
  }

  // Preferences
  const [preferences, setPreferences] = useState(mockPreferences);
  const [prefsEditing, setPrefsEditing] = useState(false);
  const [prefsForm, setPrefsForm] = useState(mockPreferences);

  function startPrefsEdit() {
    setPrefsForm(preferences);
    setPrefsEditing(true);
  }

  function savePrefsEdit() {
    setPreferences(prefsForm);
    setPrefsEditing(false);
  }

  const registeredEvents = mockEvents.filter((ev) => isRegistered(ev.id));
  const inReviewCount = appliedJobs.filter((j) => j.status === 'review').length;
  const shortlistedCount = appliedJobs.filter((j) => j.status === 'shortlisted').length;

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      <TopNav />

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '32px 44px 64px' }}>

        {/* Profile hero */}
        <div style={{ ...cardStyle, display: 'flex', alignItems: heroEditing ? 'flex-start' : 'center', gap: 22, flexWrap: 'wrap', marginBottom: 16 }}>
          {heroEditing ? (
            <label
              htmlFor="avatar-upload"
              style={{
                position: 'relative', width: 64, height: 64, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
                background: heroForm.avatarUrl ? `center/cover url(${heroForm.avatarUrl})` : 'var(--ink)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-fraunces), serif', fontSize: 22,
              }}
            >
              {!heroForm.avatarUrl && user.initials}
              <span style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: 'rgba(23,27,30,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><path d="M4 7h3l2-2h6l2 2h3v13H4z" /><circle cx="12" cy="13" r="4" /></svg>
              </span>
              <input id="avatar-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            </label>
          ) : (
            <div style={{
              width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
              background: user.avatarUrl ? `center/cover url(${user.avatarUrl})` : 'var(--ink)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-fraunces), serif', fontSize: 22,
            }}>
              {!user.avatarUrl && user.initials}
            </div>
          )}

          {heroEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minWidth: 260 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <input style={inputStyle} value={heroForm.firstName} onChange={(e) => setHeroForm((f) => ({ ...f, firstName: e.target.value }))} placeholder="First name" />
                <input style={inputStyle} value={heroForm.lastName} onChange={(e) => setHeroForm((f) => ({ ...f, lastName: e.target.value }))} placeholder="Last name" />
              </div>
              <input style={inputStyle} value={heroForm.email} onChange={(e) => setHeroForm((f) => ({ ...f, email: e.target.value }))} placeholder="Email" />
              <div style={{ display: 'flex', gap: 10 }}>
                <input style={inputStyle} value={heroForm.phone} onChange={(e) => setHeroForm((f) => ({ ...f, phone: e.target.value }))} placeholder="Phone" />
                <input style={inputStyle} value={heroForm.location} onChange={(e) => setHeroForm((f) => ({ ...f, location: e.target.value }))} placeholder="Location" />
              </div>
            </div>
          ) : (
            <div>
              <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 500, fontSize: 24, margin: '0 0 3px', letterSpacing: '-0.01em' }}>
                {user.firstName} {user.lastName}
              </h1>
              <div style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 6 }}>
                {[user.location, user.email, user.phone].map((v) => (
                  <span key={v} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{v}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
            {heroEditing ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={btnSmStyle} onClick={() => setHeroEditing(false)}>Cancel</button>
                <button style={btnPrimaryStyle} onClick={saveHeroEdit}>Save</button>
              </div>
            ) : (
              <button style={btnSmStyle} onClick={startHeroEdit}>Edit profile</button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 110, height: 6, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--accent)', width: '85%' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 12, color: 'var(--ink-soft)' }}>85% complete</span>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { val: appliedJobs.length, lbl: 'Jobs applied' },
            { val: inReviewCount, lbl: 'In review' },
            { val: shortlistedCount, lbl: 'Shortlisted' },
            { val: registeredEvents.length, lbl: 'Events registered' },
          ].map(({ val, lbl }) => (
            <div key={lbl} style={{ ...cardStyle, marginBottom: 0 }}>
              <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 20, margin: '0 0 3px' }}>{val}</p>
              <p style={{ fontSize: 11.5, color: 'var(--muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>{lbl}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 18, alignItems: 'start' }}>

          {/* Left column */}
          <div>
            {/* Resume */}
            <div style={cardStyle}>
              <div style={cardHeadStyle}>
                <p style={eyebrowStyle}>Resume</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--line)', borderRadius: 8, padding: '13px 15px', marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 7, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
                </div>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 500, margin: '0 0 2px', wordBreak: 'break-all' }}>{resumeName}</p>
                  <p style={{ fontSize: 11.5, color: 'var(--muted)', margin: 0 }}>{resumeDate}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={btnSmStyle} onClick={handleDownload}>Download</button>
                <label style={{ ...btnSmStyle, display: 'inline-flex', alignItems: 'center' }} htmlFor="resume-upload">
                  Upload new
                  <input id="resume-upload" type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleFileChange} />
                </label>
              </div>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12, lineHeight: 1.55 }}>
                PDF or Word, up to 5 MB. Skills below are auto-detected from this resume and power your job matches.
              </p>
            </div>

            {/* Skills */}
            <div style={cardStyle}>
              <div style={cardHeadStyle}>
                <p style={eyebrowStyle}>Skills</p>
                <button style={editLinkStyle} onClick={() => setSkillsEditing((v) => !v)}>{skillsEditing ? 'Done' : 'Edit'}</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: skillsEditing ? 12 : 0 }}>
                {skills.map((s) => (
                  <span key={s} style={chipStyle}>
                    {s}
                    {skillsEditing && (
                      <button onClick={() => removeSkill(s)} style={chipRemoveStyle} aria-label={`Remove ${s}`}>×</button>
                    )}
                  </span>
                ))}
              </div>
              {skillsEditing && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    style={inputStyle}
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                    placeholder="Add a skill"
                  />
                  <button style={btnSmStyle} onClick={addSkill}>Add</button>
                </div>
              )}
            </div>

            {/* Interested roles */}
            <div style={cardStyle}>
              <div style={cardHeadStyle}>
                <p style={eyebrowStyle}>Interested roles</p>
                <button style={editLinkStyle} onClick={() => setRolesEditing((v) => !v)}>{rolesEditing ? 'Done' : 'Edit'}</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: rolesEditing ? 12 : 0 }}>
                {roles.map((r) => (
                  <span key={r} style={chipPlainStyle}>
                    {r}
                    {rolesEditing && (
                      <button onClick={() => removeRole(r)} style={chipRemoveStyle} aria-label={`Remove ${r}`}>×</button>
                    )}
                  </span>
                ))}
              </div>
              {rolesEditing && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    style={inputStyle}
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addRole(); } }}
                    placeholder="Add a role"
                  />
                  <button style={btnSmStyle} onClick={addRole}>Add</button>
                </div>
              )}
            </div>

            {/* Preferences */}
            <div style={cardStyle}>
              <div style={cardHeadStyle}>
                <p style={eyebrowStyle}>Preferences</p>
                {prefsEditing ? (
                  <button style={editLinkStyle} onClick={savePrefsEdit}>Save</button>
                ) : (
                  <button style={editLinkStyle} onClick={startPrefsEdit}>Edit</button>
                )}
              </div>
              {prefsEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <label style={fieldLabelStyle}>
                    Salary range
                    <input style={inputStyle} value={prefsForm.salaryRange} onChange={(e) => setPrefsForm((f) => ({ ...f, salaryRange: e.target.value }))} />
                  </label>
                  <label style={fieldLabelStyle}>
                    Employment type
                    <input style={inputStyle} value={prefsForm.employmentType} onChange={(e) => setPrefsForm((f) => ({ ...f, employmentType: e.target.value }))} />
                  </label>
                  <label style={fieldLabelStyle}>
                    Search radius
                    <input style={inputStyle} value={prefsForm.searchRadius} onChange={(e) => setPrefsForm((f) => ({ ...f, searchRadius: e.target.value }))} />
                  </label>
                  <button style={btnSmStyle} onClick={() => { setPrefsEditing(false); }}>Cancel</button>
                </div>
              ) : (
                [
                  { k: 'Salary range', v: preferences.salaryRange },
                  { k: 'Employment type', v: preferences.employmentType },
                  { k: 'Search radius', v: preferences.searchRadius },
                ].map(({ k, v }, i, arr) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, fontSize: 13, padding: '9px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none' }}>
                    <span style={{ color: 'var(--muted)' }}>{k}</span>
                    <span style={{ fontWeight: 500, textAlign: 'right' }}>{v}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* Job tracking */}
            <div style={cardStyle}>
              <div style={cardHeadStyle}>
                <p style={eyebrowStyle}>Job tracking</p>
              </div>

              {appliedJobs.length === 0 && (
                <p style={{ fontSize: 13, color: 'var(--muted)' }}>You haven&rsquo;t applied to any jobs yet.</p>
              )}

              {appliedJobs.map((job) => {
                const badge = STATUS_BADGE[job.status];
                const isRejected = job.status === 'rejected';
                return (
                  <div key={job.id} style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '18px 20px', marginBottom: 12, background: 'var(--surface)', opacity: isRejected ? 0.75 : 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: 15.5, fontWeight: 500, margin: '0 0 3px' }}>{job.title}</h4>
                        <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: 0 }}>{job.company} · {job.location} · Applied {job.appliedDate}</p>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '4px 11px', borderRadius: 12, flexShrink: 0, background: badge.bg, color: badge.color, border: job.status === 'applied' ? '1px solid var(--line)' : 'none' }}>
                        {badge.label}
                      </span>
                    </div>

                    {/* Progress tracker */}
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      {TRACK_LABELS.map((lbl, i) => {
                        const done = i <= job.trackStep;
                        return (
                          <div key={lbl} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                            {i > 0 && (
                              <div style={{ position: 'absolute', top: 5, right: '50%', width: '100%', height: 1.5, background: done ? 'var(--accent)' : 'var(--line)' }} />
                            )}
                            <div style={{ width: 11, height: 11, borderRadius: '50%', background: done ? 'var(--accent)' : 'var(--surface)', border: `2px solid ${done ? 'var(--accent)' : 'var(--line)'}`, zIndex: 1 }} />
                            <span style={{ fontSize: 10.5, color: done ? 'var(--ink-soft)' : 'var(--muted)', marginTop: 7, textAlign: 'center', fontWeight: 500 }}>{lbl}</span>
                          </div>
                        );
                      })}
                    </div>

                    {job.note && (
                      <p style={{ fontSize: 12, color: job.noteType === 'warn' ? 'var(--error)' : 'var(--ink-soft)', background: job.noteType === 'warn' ? 'var(--error-soft)' : 'var(--paper)', borderRadius: 6, padding: '9px 12px', marginTop: 14 }}>
                        {job.note}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Registered events */}
            <div style={cardStyle}>
              <div style={cardHeadStyle}>
                <p style={eyebrowStyle}>Registered events</p>
                <button style={editLinkStyle} onClick={() => router.push('/events')}>Browse events</button>
              </div>
              {registeredEvents.length === 0 && (
                <p style={{ fontSize: 13, color: 'var(--muted)' }}>You haven&rsquo;t registered for any events yet.</p>
              )}
              {registeredEvents.map((ev, i) => (
                <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < registeredEvents.length - 1 ? '1px solid var(--line)' : 'none', fontSize: 13.5 }}>
                  <div>
                    <p style={{ fontWeight: 500, margin: '0 0 2px' }}>{ev.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>{ev.host} · {ev.date}{ev.distance ? ` · ${ev.distance}` : ' · Virtual'}</p>
                  </div>
                  <button style={btnSmStyle} onClick={() => router.push(`/events/${ev.id}`)}>View details</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, padding: '24px 26px', marginBottom: 16 };
const eyebrowStyle: React.CSSProperties = { fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--muted)', margin: 0 };
const cardHeadStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 };
const editLinkStyle: React.CSSProperties = { fontSize: 12.5, color: 'var(--accent)', fontWeight: 500, cursor: 'pointer', background: 'none', border: 'none', padding: 0 };
const btnSmStyle: React.CSSProperties = { fontFamily: 'var(--font-inter), sans-serif', fontSize: 12.5, fontWeight: 500, padding: '7px 13px', borderRadius: 6, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', cursor: 'pointer' };
const btnPrimaryStyle: React.CSSProperties = { fontFamily: 'var(--font-inter), sans-serif', fontSize: 12.5, fontWeight: 500, padding: '7px 13px', borderRadius: 6, border: '1px solid var(--accent)', background: 'var(--accent)', color: '#fff', cursor: 'pointer' };
const chipStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--accent-soft)', color: 'var(--accent)', fontSize: 12.5, fontWeight: 500, padding: '5px 12px', borderRadius: 14 };
const chipPlainStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--paper)', color: 'var(--ink-soft)', fontSize: 12.5, fontWeight: 500, padding: '5px 12px', borderRadius: 14, border: '1px solid var(--line)' };
const chipRemoveStyle: React.CSSProperties = { border: 'none', background: 'none', color: 'inherit', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0, opacity: 0.7 };
const inputStyle: React.CSSProperties = { flex: 1, width: '100%', padding: '9px 12px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 13.5, fontFamily: 'var(--font-inter), sans-serif', color: 'var(--ink)', background: 'var(--surface)', outline: 'none' };
const fieldLabelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, color: 'var(--muted)', fontWeight: 500 };

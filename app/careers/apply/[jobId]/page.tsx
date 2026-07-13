"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { jobs } from "@/lib/mockData";
import { US_STATES, zipMatchesState } from "@/lib/address";
import { getProfile } from "@/lib/profile";

export default function ApplyPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  const job = jobs.find((j) => j.id === jobId);

  const [phone, setPhone] = useState("(469) 555-0134");
  const [street, setStreet] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [note, setNote] = useState("");
  const [workAuth, setWorkAuth] = useState(false);
  const [resumeName, setResumeName] = useState("jordan_torres_resume.pdf");
  const [submitted, setSubmitted] = useState(false);

  const [errors, setErrors] = useState({
    phone: false, resume: false, auth: false,
    street: false, state: false, zip: false, zipMismatch: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prefill address from the saved profile once on mount — after that it's
  // freely editable and won't get overwritten.
  const hasPrefilledRef = useRef(false);
  useEffect(() => {
    if (hasPrefilledRef.current) return;
    hasPrefilledRef.current = true;
    const profile = getProfile();
    setStreet((prev) => profile?.street || prev);
    setState((prev) => profile?.state || prev);
    setZip((prev) => profile?.zip || prev);
  }, []);

  if (!job) {
    return (
      <div className="min-h-screen bg-paper">
        <Navbar />
        <div className="max-w-[1180px] mx-auto px-11 py-16 text-center">
          <h1 className="font-serif text-2xl font-medium mb-3">Job not found</h1>
          <Link href="/careers" className="text-accent font-medium hover:underline">← Back to Careers</Link>
        </div>
      </div>
    );
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setResumeName(file.name);
  }

  function handleSubmit() {
    const zipValid = /^\d{5}$/.test(zip);
    const zipMismatch = zipValid && !!state && !zipMatchesState(zip, state);
    const newErrors = {
      phone: phone.trim().length < 7,
      resume: resumeName.trim().length === 0,
      auth: !workAuth,
      street: !street.trim(),
      state: !state,
      zip: !zipValid || zipMismatch,
      zipMismatch,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <div className="max-w-[1180px] mx-auto px-11 py-7 pb-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12.5px] text-muted mb-5">
          <Link href="/careers" className="text-muted no-underline hover:text-accent transition-colors">Careers</Link>
          <span>/</span>
          <span className="text-ink font-medium">{job.title}</span>
        </div>

        {/* Page header */}
        <div className="mb-6">
          <span className="inline-block text-[10.5px] font-semibold tracking-[0.05em] uppercase text-accent bg-accent-soft rounded-full px-2.5 py-1 mb-2.5">
            {job.setting} · {job.type}
          </span>
          <h1 className="font-serif font-medium text-[28px] m-0 tracking-[-0.01em]">{job.title}</h1>
          <p className="text-[12.5px] text-muted mt-1.5">{job.company} · {job.location} · {job.distance} from you</p>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-5 items-start" style={{ gridTemplateColumns: "1fr 380px" }}>

          {/* ── Left: job details ── */}
          <div>

            {/* Facts card */}
            <div className="bg-surface border border-line rounded-[10px] p-6.5 mb-4.5">
              <div className="flex gap-9 flex-wrap">
                {[
                  { k: "Distance", v: job.distance },
                  { k: "Work type", v: job.setting },
                  { k: "Employment type", v: job.type },
                  { k: "Salary", v: job.salary },
                  { k: "Apply by", v: job.applyBy },
                ].map(({ k, v }) => (
                  <div key={k}>
                    <p className="text-[11px] font-semibold tracking-[0.06em] uppercase text-muted m-0 mb-1">{k}</p>
                    <p className="text-[13.5px] font-medium text-ink m-0">{v}</p>
                  </div>
                ))}
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.06em] uppercase text-muted m-0 mb-1">Match</p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-[80px] h-[5px] bg-paper border border-line rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: `${job.match}%` }} />
                    </div>
                    <span className="font-mono text-[12px] text-ink-soft">{job.match}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* About role */}
            <div className="bg-surface border border-line rounded-[10px] p-6.5 mb-4.5">
              <p className="text-[11px] font-semibold tracking-[0.07em] uppercase text-muted mb-2.5">About the role</p>
              <p className="text-[13.5px] leading-[1.65] text-ink-soft m-0">{job.about}</p>
            </div>

            {/* Requirements */}
            <div className="bg-surface border border-line rounded-[10px] p-6.5 mb-4.5">
              <p className="text-[11px] font-semibold tracking-[0.07em] uppercase text-muted mb-2.5">Required qualifications</p>
              <ul className="m-0 pl-4.5 text-[13.5px] leading-[1.9] text-ink-soft">
                {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>

            {/* Skill match */}
            <div className="bg-surface border border-line rounded-[10px] p-6.5 mb-4.5">
              <p className="text-[11px] font-semibold tracking-[0.07em] uppercase text-muted mb-3">Your skill match</p>
              <div className="flex flex-col gap-2.5">
                {job.userSkillMatch.map(({ skill, matched, source }) => (
                  <div key={skill} className="flex items-center gap-2.5 text-[13.5px] text-ink-soft">
                    <span className={`w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 ${matched ? "bg-accent-soft text-accent" : "bg-amber-soft text-amber"}`}>
                      {matched
                        ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                        : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                      }
                    </span>
                    <span className="font-medium text-ink">{skill}</span>
                    <span className="text-[12px] text-muted ml-auto">{source}</span>
                  </div>
                ))}
              </div>
              <p className="text-[12px] text-muted mt-3 mb-0">Match score compares this job&apos;s required skills with the skills detected on your resume.</p>
            </div>

            {/* About company */}
            <div className="bg-surface border border-line rounded-[10px] p-6.5">
              <p className="text-[11px] font-semibold tracking-[0.07em] uppercase text-muted mb-2.5">About {job.company}</p>
              <p className="text-[13.5px] leading-[1.65] text-ink-soft mb-4">{job.companyAbout}</p>
              <div className="flex gap-9 flex-wrap mb-4">
                {[
                  { k: "Industry", v: job.industry },
                  { k: "Company size", v: job.companySize },
                  { k: "Founded", v: job.founded },
                  { k: "Headquarters", v: job.headquarters },
                ].map(({ k, v }) => (
                  <div key={k}>
                    <p className="text-[11px] font-semibold tracking-[0.06em] uppercase text-muted m-0 mb-1">{k}</p>
                    <p className="text-[13.5px] font-medium text-ink m-0">{v}</p>
                  </div>
                ))}
              </div>
              <p className="text-[13.5px] leading-[1.65] text-ink-soft m-0">
                <strong className="text-ink">Benefits:</strong> {job.benefits}
              </p>
            </div>
          </div>

          {/* ── Right: apply panel ── */}
          <div className={`bg-surface border border-line rounded-[10px] p-6.5 sticky top-[84px] ${submitted ? "done" : ""}`}>
            {!submitted ? (
              <>
                <h3 className="font-serif text-[17px] font-medium mb-1">Apply for this role</h3>
                <p className="text-[12.5px] text-muted mb-5">Your profile fills most of this — review and send.</p>

                <form onSubmit={(e) => e.preventDefault()} className="space-y-3.5">
                  {/* Name row (read-only) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[12.5px] font-medium text-ink-soft block mb-1.5">First name</label>
                      <input type="text" value="Jordan" readOnly className="w-full px-3.5 py-[11px] border border-line rounded-md text-[14px] text-ink-soft bg-paper outline-none" />
                    </div>
                    <div>
                      <label className="text-[12.5px] font-medium text-ink-soft block mb-1.5">Last name</label>
                      <input type="text" value="Torres" readOnly className="w-full px-3.5 py-[11px] border border-line rounded-md text-[14px] text-ink-soft bg-paper outline-none" />
                    </div>
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label className="text-[12.5px] font-medium text-ink-soft block mb-1.5">Email</label>
                    <input type="email" value="jordan.torres@mail.com" readOnly className="w-full px-3.5 py-[11px] border border-line rounded-md text-[14px] text-ink-soft bg-paper outline-none" />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-[12.5px] font-medium text-ink-soft block mb-1.5">
                      Phone <span className="text-error">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-3.5 py-[11px] border rounded-md text-[14px] text-ink bg-surface outline-none transition-colors focus:border-accent ${errors.phone ? "border-error" : "border-line"}`}
                    />
                    {errors.phone && <p className="text-[11.5px] text-error mt-1.5">Enter a phone number.</p>}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="text-[12.5px] font-medium text-ink-soft block mb-1.5">
                      Street address <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="2201 N MacArthur Blvd"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className={`w-full px-3.5 py-[11px] border rounded-md text-[14px] text-ink bg-surface outline-none transition-colors focus:border-accent ${errors.street ? "border-error" : "border-line"}`}
                    />
                    {errors.street && <p className="text-[11.5px] text-error mt-1.5">Enter your street address.</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[12.5px] font-medium text-ink-soft block mb-1.5">
                        State <span className="text-error">*</span>
                      </label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className={`w-full px-3.5 py-[11px] border rounded-md text-[14px] font-sans text-ink bg-surface outline-none transition-colors focus:border-accent ${errors.state ? "border-error" : "border-line"}`}
                      >
                        {US_STATES.map((s, i) => (
                          <option key={i} value={s}>{s === "" ? "Select state" : s}</option>
                        ))}
                      </select>
                      {errors.state && <p className="text-[11.5px] text-error mt-1.5">Select your state.</p>}
                    </div>
                    <div>
                      <label className="text-[12.5px] font-medium text-ink-soft block mb-1.5">
                        ZIP code <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="75062"
                        maxLength={5}
                        value={zip}
                        onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                        className={`w-full px-3.5 py-[11px] border rounded-md text-[14px] text-ink bg-surface outline-none transition-colors focus:border-accent ${errors.zip ? "border-error" : "border-line"}`}
                      />
                      {errors.zip && (
                        <p className="text-[11.5px] text-error mt-1.5">
                          {errors.zipMismatch ? "This ZIP code doesn't match the selected state." : "Enter a 5-digit ZIP."}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Resume */}
                  <div>
                    <label className="text-[12.5px] font-medium text-ink-soft block mb-1.5">
                      Resume <span className="text-error">*</span>
                    </label>
                    <div className={`flex items-center gap-3 border rounded-[8px] p-3 ${errors.resume ? "border-error" : "border-line"}`}>
                      <div className="w-[34px] h-[34px] rounded-[7px] bg-accent-soft text-accent flex items-center justify-center shrink-0">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <path d="M14 2v6h6"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium m-0 truncate">{resumeName}</p>
                        <p className="text-[11.5px] text-muted m-0">From your profile · Jul 6</p>
                      </div>
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="text-[12px] text-accent font-medium hover:underline shrink-0">
                        Replace
                      </button>
                      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
                    </div>
                    {errors.resume && <p className="text-[11.5px] text-error mt-1.5">Attach a resume — the employer requires one.</p>}
                  </div>

                  {/* Note */}
                  <div>
                    <label className="text-[12.5px] font-medium text-ink-soft block mb-1.5">Note to the hiring team</label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Optional — 2 or 3 sentences on why you fit. Good place to mention CSS experience."
                      className="w-full px-3.5 py-[11px] border border-line rounded-md text-[14px] text-ink bg-surface outline-none focus:border-accent transition-colors resize-y min-h-[88px] leading-[1.55] font-sans"
                    />
                    <p className="text-[11.5px] text-muted mt-1.5">Sent along with your resume. Keep it short.</p>
                  </div>

                  {/* Work auth */}
                  <div className={`flex items-start gap-2.5 pt-3 pb-0.5 text-[13px] leading-[1.5] ${errors.auth ? "text-error" : "text-ink-soft"}`}>
                    <input
                      type="checkbox"
                      id="workAuth"
                      checked={workAuth}
                      onChange={(e) => setWorkAuth(e.target.checked)}
                      className="mt-0.5 accent-accent"
                    />
                    <label htmlFor="workAuth">
                      I&apos;m authorized to work in the United States{" "}
                      <span className="text-error">*</span>
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full py-[13px] text-[13.5px] font-medium rounded-md border border-accent bg-accent text-white hover:opacity-90 transition-opacity mt-3.5"
                  >
                    Submit application
                  </button>
                  <p className="text-[12px] text-muted text-center mt-3">
                    Applications close {job.applyBy} · You can withdraw anytime from Profile
                  </p>
                </form>
              </>
            ) : (
              <>
                <div className="flex items-start gap-2.5 bg-accent-soft text-accent rounded-[8px] p-4 text-[13px] font-medium leading-[1.55]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
                    <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/>
                  </svg>
                  <span>
                    Application submitted
                    <span className="block font-normal text-ink-soft mt-1">
                      {job.company} has your application. A confirmation was sent to jordan.torres@mail.com — track its status under Profile → Job tracking.
                    </span>
                  </span>
                </div>
                <div className="flex gap-2 mt-3.5">
                  <Link href="#"
                    className="flex-1 text-center text-[13px] font-medium py-2.5 rounded-md border border-line bg-surface text-ink hover:border-ink-soft transition-colors no-underline">
                    View job tracking
                  </Link>
                  <Link href="/careers"
                    className="flex-1 text-center text-[13px] font-medium py-2.5 rounded-md border border-line bg-surface text-ink hover:border-ink-soft transition-colors no-underline">
                    Back to Careers
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
